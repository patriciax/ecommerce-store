<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps({
  cart: {
    type: Array,
    required: true
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
  }
})
const interval = ref(null)

interval.value = setInterval(() => {

  const elementExists = !document.getElementById('paypal-button');

  if (elementExists) {
    
    (window as any).paypal
    .Buttons({
      fundingSource: (window as any).paypal.FUNDING.PAYPAL,
      async createOrder() {
        try {
          const response = await fetch(`${(import.meta as any).env.VITE_API_URL}/v1/checkout`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            // use the "body" param to optionally pass additional order information
            // like product ids and quantities
            body: JSON.stringify({
              paymentMethod: "paypal-create-order",
              carts:props.cart
            }),
          });
          
          const orderData = await response.json();
          
          if (orderData?.order?.id) {
            return orderData.order.id;
          } else {
            const errorDetail = orderData?.details?.[0];
            const errorMessage = errorDetail
              ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
              : JSON.stringify(orderData);
            
            throw new Error(errorMessage);
          }
        } catch (error) {
          console.error(error);
        }
      },
      async onApprove(data, actions) {
        try {
          const token = localStorage.getItem((import.meta as any).env.VITE_BEARER_TOKEN_KEY)
          const response = await fetch(`${(import.meta as any).env.VITE_API_URL}/v1/checkout`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              paymentMethod: "paypal-approve-order",
              orderId: data.orderID,
              carts:props.cart,
              name: props.name,
              email: props.email,
              phone: props.phone,
              carrier: props.carrier
            })
          });
          
          const orderData = await response.json();
          // Three cases to handle:
          //   (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
          //   (2) Other non-recoverable errors -> Show a failure message
          //   (3) Successful transaction -> Show confirmation or thank you message
          
          const errorDetail = orderData?.details?.[0];
          
          if (errorDetail?.issue === "INSTRUMENT_DECLINED") {
            // (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
            // recoverable state, per https://developer.paypal.com/docs/checkout/standard/customize/handle-funding-failures/
            return actions.restart();
          } else if (errorDetail) {
            // (2) Other non-recoverable errors -> Show a failure message
            throw new Error(`${errorDetail.description} (${orderData.debug_id})`);
          } else if (!orderData.purchase_units) {
            throw new Error(JSON.stringify(orderData));
          } else {
            // (3) Successful transaction -> Show confirmation or thank you message
            // Or go to another URL:  actions.redirect('thank_you.html');
            const transaction =
              orderData?.purchase_units?.[0]?.payments?.captures?.[0] ||
              orderData?.purchase_units?.[0]?.payments?.authorizations?.[0];
          }
        } catch (error) {
          console.error(error);
        }
      },
    })
    .render("#paypal-button-container");

    clearInterval(interval.value)
  }

  

}, 1000)

</script>

<template>
    <div id="paypal-button-container"></div>
</template>