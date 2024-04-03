<script lang="ts" setup>
import TextFields from '../common/TextFields.vue'
import Document from '../common/Document.vue'
import DateCard from '../common/DateCard.vue'
import Btn from '../common/Btn.vue'
import { _submitPay } from '@/api/repositories/banesco.repository'
import { ref } from 'vue'
import { showNotification } from '@/composables/useNotification'
import useNotifications from '@/composables/useNotifications'
import PaymentMethods from '@/stores/paymentMethods'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'

const emit = defineEmits(['nextStep', 'validate'])

const props = defineProps({
  cart: {
    type: Array,
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
  document: '',
  cardHolder: '',
  cardNumber: '',
  cvc: '',
})
const paymentMethods = PaymentMethods()
const date: any = ref('')
const isLoading = ref(false)
const updateDate = (value: string) => {
  date.value = value
}

const submitPay = async () => {
  emit('validate')
  if (props.validateForm) {
    isLoading.value = true
    try {
      const banescoData = {
        description: 'ERoca',
        cardHolder: dataPayment.value.cardHolder,
        cardHolderId: dataPayment.value.document,
        cardNumber: dataPayment.value.cardNumber,
        cvc: dataPayment.value.cvc,
        expirationDate: `${date.value.month < 10 ? `0${date.value.month}` : date.value.month}/${date.value.year}`,
      }

      let data = {}
      if (props.isCard) {
        data = {
          paymentMethod: 'banesco',
          banescoData,
          carts: props.cart,
          name: props.name,
          email: props.email,
          phone: props.phone,
          card: props.card,
        }
      } else {
        data = {
          paymentMethod: 'banesco',
          banescoData,
          carts: props.cart,
          name: props.name,
          email: props.email,
          phone: props.phone,
          carrier: props.carrier,
        }
      }

      const response = await _submitPay(data, props.endpoint)
      paymentMethods.setPaymentData(response.data.data)
      pushNotification({
        id: '',
        title: 'Pago exitoso',
        type: 'success',
      })
      emit('nextStep')
    } catch (err) {
      showNotification('Algo ha ido mal', 'error')
    }

    isLoading.value = false
  }
}

const handlerValidate = useVuelidate(
  {
    document: {
      required,
    },
    cardHolder: {
      required,
    },
    cardNumber: {
      required,
    },
    cvc: {
      required,
    },
  },
  dataPayment
)
</script>

<template>
  <form @submit.prevent="submitPay">
    <div class="grid grid-cols-2 gap-4">
      <div>
        <TextFields
          v-model="dataPayment.cardHolder"
          :errorMessage="
            handlerValidate?.['cardHolder']?.$errors?.length > 0
              ? $t('VALIDATIONS.' + handlerValidate?.['cardHolder']?.$errors?.[0]?.$validator?.toUpperCase())
              : undefined
          "
          noSpecialCharacters
          :label="$t('PAYMENTS.CARD_HOLDER')"
        />
      </div>
      <div>
        <Document
          :errorMessage="
            handlerValidate?.['document']?.$errors?.length > 0
              ? $t('VALIDATIONS.' + handlerValidate?.['document']?.$errors?.[0]?.$validator?.toUpperCase())
              : undefined
          "
          v-model="dataPayment.document"
          :label="$t('PAYMENTS.CARD_HOLDER_ID')"
          :minLength="6"
          :maxLength="8"
        />
      </div>
      <div>
        <Document
          :errorMessage="
            handlerValidate?.['cardNumber']?.$errors?.length > 0
              ? $t('VALIDATIONS.' + handlerValidate?.['cardNumber']?.$errors?.[0]?.$validator?.toUpperCase())
              : undefined
          "
          v-model="dataPayment.cardNumber"
          :label="$t('PAYMENTS.CARD_NUMBER')"
          :minLength="15"
          :maxLength="16"
        />
      </div>
      <div>
        <Document
          :errorMessage="
            handlerValidate?.['cvc']?.$errors?.length > 0
              ? $t('VALIDATIONS.' + handlerValidate?.['cvc']?.$errors?.[0]?.$validator?.toUpperCase())
              : undefined
          "
          v-model="dataPayment.cvc"
          :label="$t('PAYMENTS.CVC')"
          :maxLength="3"
        />
      </div>
      <div class="col-span-2">
        <DateCard
          :errorMessage="
            handlerValidate?.['date']?.$errors?.length > 0
              ? $t('VALIDATIONS.' + handlerValidate?.['date']?.$errors?.[0]?.$validator?.toUpperCase())
              : undefined
          "
          @changedDate="updateDate"
          :label="$t('PAYMENTS.EXPIRATION_DATE')"
        />
      </div>
      <div class="col-span-2">
        <Btn text="Pagar" :is-loading="isLoading" :is-disabled="isLoading" isFull />
      </div>
    </div>
  </form>
</template>
