<script setup lang="ts">
import PaymentMethods from '@/stores/paymentMethods'
import useNotificationsStore from '@/composables/useNotifications';
import { ref } from 'vue'
import { showNotification } from '@/composables/useNotification';
import CountryStore from '@/stores/country'

const countryStore = CountryStore()
const paymentMethods = PaymentMethods()
const emit = defineEmits(['nextStep', 'validate'])
const { pushNotification } = useNotificationsStore()

const props = defineProps({
  cart: {
    type: Array,
    required: true,
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
  validateForm: {
    type: Boolean,
  },
  endpoint: {
    type: String,
    default: 'checkout',
  },
  card: {
    type: Object,
  },
  isCard: {
    type: Boolean,
    default: false,
  },
  carrierRate:{
    type: Object
  },
})

const interval = ref(null)

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

interval.value = setInterval(() => {
  const elementExists = !document.getElementById('paypal-button')

  if (elementExists) {
    (window as any).paypal
      .Buttons({
        fundingSource: (window as any).paypal.FUNDING.CARD,
        onClick: async (data, actions) => {
          // Return a promise from onClick for async validation

          emit('validate')
          await timeout(1000);

          if (props.validateForm) {
            return actions.resolve()
          } else {
            return actions.reject()
          }
        },
        async createOrder() {
          try {
            const object = props.isCard ? {
              paymentMethod: 'paypal-create-order',
              card: props.card,
              ivaType: countryStore.country == 'Venezuela' ? 'national' : 'international',
            } : {
              paymentMethod: 'paypal-create-order',
              carts: props.cart,
              ivaType: countryStore.country == 'Venezuela' ? 'national' : 'international',
              carrierRate: props.carrierRate
            } 
            
            const token = localStorage.getItem((import.meta as any).env.VITE_BEARER_TOKEN_KEY)
            const response = await fetch(`${(import.meta as any).env.VITE_API_URL}/v1/${props.endpoint}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: token ? `Bearer ${token}` : null,
              },
              // use the "body" param to optionally pass additional order information
              // like product ids and quantities
              body: JSON.stringify(object),
            })

            const orderData = await response.json()

            if (orderData?.order?.id) {
              return orderData.order.id
            } else {
              const errorDetail = orderData?.details?.[0]
              const errorMessage = errorDetail
                ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
                : JSON.stringify(orderData)

              throw new Error(errorMessage)
            }
          } catch (error) {
            console.error(error)
          }
        },
        async onApprove(data, actions) {
          try {

            const object = props.isCard ? {
              paymentMethod: 'paypal-approve-order',
              orderId: data.orderID,
              card: props.card,
              name: props.name,
              email: props.email,
              phone: props.phone,
              carrier: props.carrier,
            } : {
              paymentMethod: 'paypal-approve-order',
              orderId: data.orderID,
              carts: props.cart,
              name: props.name,
              email: props.email,
              phone: props.phone,
              carrier: props.carrier,
              carrierRate: props.carrierRate
            }

            const token = localStorage.getItem((import.meta as any).env.VITE_BEARER_TOKEN_KEY)
            const response = await fetch(`${(import.meta as any).env.VITE_API_URL}/v1/${props.endpoint}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: token ? `Bearer ${token}` : null,
              },
              body: JSON.stringify(object),
            })

            const orderData = await response.json()
            // Three cases to handle:
            //   (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
            //   (2) Other non-recoverable errors -> Show a failure message
            //   (3) Successful transaction -> Show confirmation or thank you message

            const errorDetail = orderData?.details?.[0]

            if (errorDetail?.issue === 'INSTRUMENT_DECLINED') {
              // (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
              // recoverable state, per https://developer.paypal.com/docs/checkout/standard/customize/handle-funding-failures/
              return actions.restart()
            } else if (errorDetail) {
              // (2) Other non-recoverable errors -> Show a failure message
              throw new Error(`${errorDetail.description} (${orderData.debug_id})`)
            } else if (orderData.status != 'success') {
              throw new Error(JSON.stringify(orderData))
            } else {
              // (3) Successful transaction -> Show confirmation or thank you message
              // Or go to another URL:  actions.redirect('thank_you.html');
              paymentMethods.setPaymentData(orderData.data)
              pushNotification({
                id: '',
                title: 'Pago exitoso',
                type: 'success',
              })
              emit('nextStep')
            }
          } catch (error) {
            showNotification('Algo ha ido mal', 'error')
          }
        },
      })
      
      .render('#paypal-button-card')

      clearInterval(interval.value)

  }
}, 1000)
</script>

<template>
  <div id="paypal-button-card"></div>
</template>