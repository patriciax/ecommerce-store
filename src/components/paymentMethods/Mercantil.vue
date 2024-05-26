<script lang="ts" setup>
    import { _submitPay } from '@/api/repositories/banesco.repository'
    import { showNotification } from '@/composables/useNotification'
    import useNotifications from '@/composables/useNotifications'
    import PaymentMethods from '@/stores/paymentMethods'
    import useVuelidate from '@vuelidate/core'
    import { required } from '@vuelidate/validators'
    import { computed, ref, watch } from 'vue'
    import Btn from '../common/Btn.vue'
    import DateCard from '../common/DateCard.vue'
    import Document from '../common/Document.vue'
    import SelectField from '../common/SelectField.vue'
    import {_getOTPCode } from '@/api/repositories/mercantil.repository'
    import { useI18n } from 'vue-i18n'
    import InputsOpt from '../common/InputsOpt.vue'

    const {t} = useI18n()
    const emit = defineEmits(['nextStep', 'validate'])
    const result = ref(false)

    const showOTPField = ref(false)
    const OTPLength = ref(0)
    const OTPLabel = ref("")

    const props = defineProps({
    cart: {
        type: Array,
    },
    userIdentification: {
        type: String,
    },
    card: {
        type: Object,
    },
    isCard: {
        type: Boolean,
        default: false,
    },
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    phone: {
        type: String,
    },
    carrier: {
        type: Object,
    },
    endpoint: {
        type: String,
        default: 'checkout',
    },
    validateForm: {
        type: Boolean,
    },
    })

    const { pushNotification } = useNotifications()
    const dataPayment = ref({
        nationality: 'V',
        document: '',
        cardNumber: '',
        cvc: '',
        date: null,
        accountType: 'CC',
        otpCode: ''
    })
    const paymentMethods = PaymentMethods()
    const isLoading = ref(false)
    const updateDate = (value: string) => {
    dataPayment.value.date = value
    }

    const completePay = async() => {

      if (props.validateForm && result.value) {
          isLoading.value = true
          try {
          const mercantilData = {
              cardHolderId: `${dataPayment.value.nationality}${dataPayment.value.document}`,
              cardNumber: dataPayment.value.cardNumber,
              cvc: dataPayment.value.cvc,
              expirationDate: `${dataPayment.value.date.month < 10 ? `0${dataPayment.value.date.month + 1}` : dataPayment.value.date.month}/${dataPayment.value.date.year}`,
              twofactorAuth: dataPayment.value.otpCode,
              accountType: dataPayment.value.accountType,
          }

          let data = {}
          if (props.isCard) {
              data = {
              paymentMethod: 'mercantil',
              mercantilData,
              carts: props.cart,
              name: props.name,
              email: props.email,
              phone: props.phone,
              card: props.card,
              }
          } else {
              data = {
              paymentMethod: 'mercantil',
              mercantilData,
              carts: props.cart,
              name: props.name,
              email: props.email,
              phone: props.phone,
              identification: props.userIdentification,
              carrier: props.carrier,
              }
          }

          const response = await _submitPay(data, props.endpoint)
          if(response.data.status != 'success'){
              showNotification(t('COMMON.SOMETHING_WENT_WRONG'), 'error')
              return
          }
          paymentMethods.setPaymentData(response.data.data)
          pushNotification({
              id: '',
              title: 'Pago exitoso',
              type: 'success',
          })
          emit('nextStep')
          } catch (err) {
          showNotification(t('COMMON.SOMETHING_WENT_WRONG'), 'error')
          }

          isLoading.value = false
      }
    }

    const submitPay = async () => {

      handlerValidateMercantil.value.$reset()
      result.value = await handlerValidateMercantil.value.$validate()
      emit('validate')
    }

    const rulesMercantil = computed(() => {
    return {
        document: {
          required,
        },
        cardNumber: {
          required,
        },
        cvc: {
          required,
        },
        date: {
          required,
        },
        otpCode:{
          requiredIf: showOTPField.value
        }
    }
    })

    const handlerValidateMercantil = useVuelidate(
        rulesMercantil,
        dataPayment,
        { $scope: false }
    )

    watch(() => props.validateForm, () => {
    completePay()
    });

    const documentTypes = ref([
        {value  : 'V', text: 'V'},
        {value  : 'E', text: 'E'},
        {value  : 'J', text: 'J'},
        {value  : 'P', text: 'P'},
        {value  : 'G', text: 'G'},
    ])

    const accountTypes = ref([
        {value  : 'CC', text: 'Cuenta Corriente'},
        {value  : 'CA', text: 'Cuenta Ahorro'}
    ])

    const getOTPCode = async () => {
        try {
          
          handlerValidateMercantil.value.$reset()
          const canContinue = await handlerValidateMercantil.value.$validate()
          emit('validate')

          if(!canContinue){
            return
          }

          const data = {
            identification: `${dataPayment.value.nationality}${dataPayment.value.document}`,
            cardNumber: dataPayment.value.cardNumber
          }
          isLoading.value = true
          const response = await _getOTPCode(data)
          isLoading.value = false

          if(response.data.status != 'success'){
              showNotification(t('COMMON.SOMETHING_WENT_WRONG'), 'error')
              return
          }

          showOTPField.value = true
          OTPLength.value = response.data.length
          OTPLabel.value = response.data.label
          showNotification(t('PAYMENTS.CODE_SENT'), 'success')
        } catch (err) {
          isLoading.value = false
            showNotification(t('COMMON.SOMETHING_WENT_WRONG'), 'error')
        }
    }


</script>

<template>
    <form @submit.prevent="submitPay">
    <div class="grid lg:grid-cols-2 gap-4">
        <div  class="col-span-2 lg:col-span-2"> 
        <Document
          :errorMessage="
            handlerValidateMercantil?.['cardNumber']?.$errors?.length > 0
              ? $t('VALIDATIONS.' + handlerValidateMercantil?.['cardNumber']?.$errors?.[0]?.$validator?.toUpperCase())
              : undefined
          "
          v-model="dataPayment.cardNumber"
          :label="$t('PAYMENTS.CARD_NUMBER')"
          :minLength="15"
          :maxLength="18"
        />
      </div>
      <div class="col-span-4 lg:col-span-2 flex">
        <div class="w-1/4">
            <SelectField 
            v-model="dataPayment.nationality"
            hiddenLabel
            :options="documentTypes"
            />
        </div>
        <Document
            class="w-3/4"
          :errorMessage="
            handlerValidateMercantil?.['document']?.$errors?.length > 0
              ? $t('VALIDATIONS.' + handlerValidateMercantil?.['document']?.$errors?.[0]?.$validator?.toUpperCase())
              : undefined
          "
          v-model="dataPayment.document"
          :label="$t('PAYMENTS.CARD_HOLDER_ID')"
          :minLength="6"
          :maxLength="8"
        />
      </div>
      
      <div  class="col-span-2 lg:col-span-1">
        <Document
          :errorMessage="
            handlerValidateMercantil?.['cvc']?.$errors?.length > 0
              ? $t('VALIDATIONS.' + handlerValidateMercantil?.['cvc']?.$errors?.[0]?.$validator?.toUpperCase())
              : undefined
          "
          v-model="dataPayment.cvc"
          :label="$t('PAYMENTS.CVC')"
          :maxLength="3"
        />
      </div>

      <div class="col-span-1">
        <DateCard
          :use-min-date="false"
          :errorMessage="
            handlerValidateMercantil?.['date']?.$errors?.length > 0
              ? $t('VALIDATIONS.' + handlerValidateMercantil?.['date']?.$errors?.[0]?.$validator?.toUpperCase())
              : undefined
          "
          @changedDate="updateDate"
          :label="$t('PAYMENTS.EXPIRATION_DATE')"
        />
      </div>

      <div class="col-span-2">
        <SelectField 
            v-model="dataPayment.accountType"
            isRequired
            
            :label="$t('PAYMENTS.ACCOUNT_TYPE')"
            :options="accountTypes"
            />
      </div>

      <div class="col-span-2" v-if="!showOTPField">
        <Btn type="button" :text="$t('PAYMENTS.GET_SMS_CODE')" :is-loading="isLoading" :is-disabled="isLoading" isFull @click="getOTPCode"/>
      </div>

      <div class="col-span-2" v-else>

        <p class="text-cente">{{ OTPLabel }}</p>

        <InputsOpt
          v-model="dataPayment.otpCode"
          :codeLength="OTPLength * 1"
          :isDisabled="isLoading"
          class="mt-2 mb-2"
        />

        <Btn type="submit" :text="$t('PAYMENTS.PAY')" :is-loading="isLoading" :is-disabled="isLoading" isFull/>
        <p @click="getOTPCode" class="text-center text-blue-500 cursor-pointer">{{ $t('PAYMENTS.RESEND_SMS_CODE') }}</p>
      </div>
    </div>
  </form>
</template>