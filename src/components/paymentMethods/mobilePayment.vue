<script lang="ts" setup>
import TextFields from '../common/TextFields.vue'
import Btn from '../common/Btn.vue'
import { _submitPay } from '@/api/repositories/banesco.repository'
import { ref } from 'vue'
import { showNotification } from '@/composables/useNotification'
import useNotifications from '@/composables/useNotifications'
import PaymentMethods from '@/stores/paymentMethods'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { watch } from 'vue'
import { computed } from 'vue'
import DatePickerDay from '../common/DatePickerDay.vue'
import _storePagoMovil from '@/stores/pagoMovil'
import _storeZelle from '@/stores/zelle'

// let handlerValidateBanesco = null
const emit = defineEmits(['nextStep', 'validate'])
const result = ref(false)

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
  paymentMethod: {
    type: String,
    default: "pagoMovil"
  },
  validateForm: {
    type: Boolean,
  },
})

const { pushNotification } = useNotifications()
const dataPayment = ref({
  reference: '',
  date: null
})
const pagoMovilStore = _storePagoMovil()
const zelleStore = _storeZelle()
const paymentMethods = PaymentMethods()
const isLoading = ref(false)
const updateDate = (value: string) => {
  dataPayment.value.date = value
}

const completePay = async() => {

  if (props.validateForm && result.value) {
    isLoading.value = true
    try {
      const pagoMovilData = {
        reference: dataPayment.value.reference,
        date: dataPayment.value.date,
      }

      let data = {}
      if (props.isCard) {
        data = {
          paymentMethod: props.paymentMethod,
          pagoMovilData,
          name: props.name,
          email: props.email,
          phone: props.phone,
          card: props.card,
        }
      } else {
        data = {
          paymentMethod: props.paymentMethod,
          pagoMovilData,
          carts: props.cart,
          name: props.name,
          email: props.email,
          phone: props.phone,
          carrier: props.carrier,
        }
      }

      const response = await _submitPay(data, props.endpoint)
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
    } catch (err) {
      showNotification('Algo ha ido mal', 'error')
    }

    isLoading.value = false
  }
}

const submitPay = async () => {
  handlerValidatePagoMovil.value.$reset()
  result.value = await handlerValidatePagoMovil.value.$validate()
  emit('validate')
}

const rulesPagoMovil = computed(() => {
  return {
    reference: {
      required,
    },
    date: {
      required,
    },
  }
})

const handlerValidatePagoMovil = useVuelidate(
    rulesPagoMovil,
    dataPayment,
    { $scope: false }
  )

watch(() => props.validateForm, () => {
  completePay()
});

</script>

<template>
  <form @submit.prevent="submitPay">
    <div class="flex flex-col gap-4">

      <template v-if="props.paymentMethod == 'pagoMovil'">
        <div>
        <span class="font-bold">Banco: </span><span>{{ pagoMovilStore?.pagoMovil?.bank }}</span>
      </div>
      <div>
        <span class="font-bold">Tel: </span><span>{{ pagoMovilStore?.pagoMovil?.phone }}</span>
      </div>
      <div>
        <span class="font-bold">Ced: </span><span>{{ pagoMovilStore?.pagoMovil?.identification }}</span>
      </div>
      </template>

      <template v-if="props.paymentMethod == 'zelle'">
        <div>
          <span class="font-bold">{{ $t('FORM.EMAIL') }}: </span><span>{{ zelleStore?.zelle?.email }}</span>
        </div>
      </template>
    
      <div>
        <TextFields
          v-model="dataPayment.reference"
          :errorMessage="
            handlerValidatePagoMovil?.['reference']?.$errors?.length > 0
              ? $t('VALIDATIONS.' + handlerValidatePagoMovil?.['reference']?.$errors?.[0]?.$validator?.toUpperCase())
              : undefined
          "
          :label="$t('PAYMENTS.REFERENCE')"
        />
      </div>
      <div class="col-span-2">
        <DatePickerDay
          :errorMessage="
            handlerValidatePagoMovil?.['date']?.$errors?.length > 0
              ? $t('VALIDATIONS.' + handlerValidatePagoMovil?.['date']?.$errors?.[0]?.$validator?.toUpperCase())
              : undefined
          "
          @changedDate="updateDate"
          :label="$t('FORM.DATE2')"
        />
      </div>
      <div class="col-span-2">
        <Btn text="Pagar" :is-loading="isLoading" :is-disabled="isLoading" isFull />
      </div>
    </div>
  </form>
</template>
