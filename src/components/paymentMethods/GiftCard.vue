<script lang="ts" setup>

import TextFields from '@/components/common/TextFields.vue';
import Document from '@/components/common/Document.vue';
import Btn from '@/components/common/Btn.vue'
import { required } from '@vuelidate/validators'
import PaymentMethods from '@/stores/paymentMethods'
import useNotifications from '@/composables/useNotifications'

import { computed, ref } from 'vue'
import { showNotification } from '@/composables/useNotification';
import { _submitPay } from '@/api/repositories/banesco.repository';
import useVuelidate from '@vuelidate/core';
import { watch } from 'vue';


const paymentMethods = PaymentMethods()
const isLoading = ref(false)
const emit = defineEmits(['validate', 'nextStep'])
const props = defineProps({
    cart: {
        type: Array
    },
    userIdentification:{
        type: String
    },
    card:{
        type: Object
    },
    isCard: {
        type: Boolean,
        default: false
    },
    name: {
        type: String
    },
    email: {
        type: String
    },
    phone: {
        type: String
    },
    carrier:{
        type: Object
    },
    endpoint:{
        type: String,
        default: 'checkout'
    },
    validateForm: {
        type: Boolean,
    },
    carrierRate:{
        type: Object
    },
})

const { pushNotification } = useNotifications()
const validate = ref(false)
const cardNumber = ref('')
const cvc = ref('')
const emailCard = ref('')

const completePay = async() => {
    
    if(props.validateForm && validate.value){
        try{
            isLoading.value = true
            let data = {}
            if(props.isCard){
                data = {
                    paymentMethod: 'giftCard',
                    carts:props.cart,
                    name: props.name,
                    email: props.email,
                    emailCard: emailCard.value,
                    phone: props.phone,
                    card: props.card,
                    cardNumber: cardNumber.value,
                    cardPin: cvc.value
                }
            }else{
                data = {
                    paymentMethod: 'giftCard',
                    carts:props.cart,
                    name: props.name,
                    email: props.email,
                    emailCard: emailCard.value,
                    phone: props.phone,
                    carrier: props.carrier,
                    cardNumber: cardNumber.value,
                    cardPin: cvc.value,
                    carrierRate: props.carrierRate,
                    identification: props.userIdentification,
                }
            }

            const response = await _submitPay(data, props.endpoint)
            isLoading.value = false

            if(response.data.status != 'success'){
                showNotification('Algo ha ido mal', 'error')
                return
            }
            paymentMethods.setPaymentData(response.data.data)
            pushNotification({
                id: '',
                title: 'Pago exitoso',
                type: 'success',
            })

            emit('nextStep')

        }catch(err){
            isLoading.value = false
            showNotification("Algo ha ido mal", 'error')
        }
    }
    
}

const submitPay = async () => {

    handlerValidateGiftCard.value.$reset()
    validate.value = await handlerValidateGiftCard.value.$validate()
    emit('validate')
}

const rulesGiftCard = computed(() => {
  return {
    emailCard: {
      required,
    },
    cardNumber: {
      required,
    },
    cvc: {
      required,
    }
  }
})

const handlerValidateGiftCard = useVuelidate(
    rulesGiftCard,
    {
        "cardNumber": cardNumber,
        "cvc": cvc,
        "emailCard": emailCard
    },
    { $scope: false }
  )

watch(() => props.validateForm, () => {
  completePay()
});

</script>

<template>
    <div>

        <form class="flex flex-col" @submit.prevent="submitPay">

            <TextFields
            :errorMessage="
            handlerValidateGiftCard?.['email']?.$errors?.length > 0
              ? $t('VALIDATIONS.' + handlerValidateGiftCard?.['email']?.$errors?.[0]?.$validator?.toUpperCase())
              : undefined
            "
            v-model="emailCard" :label="$t('FORM.EMAIL')" />

            <div>
                <Document v-model="cardNumber" :label="$t('PAYMENTS.CARD_NUMBER')" :minLength="15" :maxLength="16" :errorMessage="
                handlerValidateGiftCard?.['cardNumber']?.$errors?.length > 0
                ? $t('VALIDATIONS.' + handlerValidateGiftCard?.['cardNumber']?.$errors?.[0]?.$validator?.toUpperCase())
                : undefined
            "/>
            </div>
            <div>
                <Document :errorMessage="
                handlerValidateGiftCard?.['cvc']?.$errors?.length > 0
                ? $t('VALIDATIONS.' + handlerValidateGiftCard?.['cvc']?.$errors?.[0]?.$validator?.toUpperCase())
                : undefined
                " v-model="cvc" :label="$t('PAYMENTS.CVC')" :maxLength="4"/>
            </div>

            <div class="col-span-2 mt-3">
                <Btn type="submit" :is-loading="isLoading" :text="$t('PAYMENTS.PAY')" isFull/>
            </div>

        </form>

    </div>
</template>