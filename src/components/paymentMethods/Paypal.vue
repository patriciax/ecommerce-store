<script lang="ts">

(window as any).paypal
  .Buttons({
    fundingSource: (window as any).paypal.FUNDING.PAYPAL,
    async createOrder() {
      try {
        const response = await fetch(`${import.meta.env.BASE_URL}/checkout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          // use the "body" param to optionally pass additional order information
          // like product ids and quantities
          body: JSON.stringify({
            paymentMethod: "paypal-create-order"
            // cart: [
            //   {
            //     id: "YOUR_PRODUCT_ID",
            //     quantity: "YOUR_PRODUCT_QUANTITY",
            //   },
            // ],
          }),
        });
        
        const orderData = await response.json();
        
        if (orderData.id) {
          return orderData.id;
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
        const response = await fetch(`${import.meta.env.BASE_URL}/checkout/${data.orderID}/capture`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paymentMethod: "paypal-approve-order"
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
          console.log(
            "Capture result",
            orderData,
            JSON.stringify(orderData, null, 2),
          );
        }
      } catch (error) {
        console.error(error);
      }
    },
  })
  .render("#paypal-button-container");
</script>

<template>
    <div id="paypal-button-container"></div>
</template>