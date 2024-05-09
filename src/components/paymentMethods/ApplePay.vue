<script setup lang="ts">
import PaymentMethods from '@/stores/paymentMethods'
import useNotificationsStore from '@/composables/useNotifications';
import { onMounted, ref } from 'vue'
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
})

let current_customer_id;
let order_id;
let global_apple_pay_config;
let current_ap_session;
let applepay;
let apple_pay_email;
let pp_order_id;
let applepay_payment_event;

const paypal_sdk_url = "https://www.paypal.com/sdk/js";
const client_id = "REPLACE_WITH_YOUR_CLIENT_ID";
const currency = "USD";
const intent = "capture";

const interval = ref(null)

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const check_applepay = async () => {
  return new Promise((resolve, reject) => {
      let error_message = "";
      if (!window.ApplePaySession) {
        error_message = "This device does not support Apple Pay";
      } else
      if (!ApplePaySession.canMakePayments()) {
        error_message = "This device, although an Apple device, is not capable of making Apple Pay payments";
      }
      if (error_message !== "") {
        reject(error_message);
      } else {
        resolve();
      }
    });
};

// let ap_payment_authed = (event) => {
//   applepay_payment_event = event.payment;
//   fetch("/create_order", {
//       method: "post", headers: { "Content-Type": "application/json; charset=utf-8" },
//       body: JSON.stringify({ "intent": intent })
//   })
//   .then((response) => response.json())
//   .then((pp_data) => {
//     pp_order_id = pp_data.id;
//     apple_pay_email = applepay_payment_event.shippingContact.emailAddress;
//     applepay.confirmOrder({
//     orderId: pp_order_id,
//     token: applepay_payment_event.token,
//     billingContact: applepay_payment_event.billingContact
//   })
//   .then(confirmResult => {
//     fetch("/complete_order", {
//       method: "post", headers: { "Content-Type": "application/json; charset=utf-8" },
//       body: JSON.stringify({
//           "intent": intent,
//           "order_id": pp_order_id,
//           "email": apple_pay_email
//       })
//   })
//   .then((response) => response.json())
//   .then((order_details) => {
//     let intent_object = "captures";
//     if (order_details.purchase_units[0].payments[intent_object][0].status === "COMPLETED") {
//       current_ap_session.completePayment(ApplePaySession.STATUS_SUCCESS);
//       display_success_message({"order_details": order_details, "paypal_buttons": paypal_buttons});
//     } else {
//       current_ap_session.completePayment(ApplePaySession.STATUS_FAILURE);
//       console.log(order_details);
//       throw error("payment was not completed, please view console for more information");
//     }
//     })
//     .catch((error) => {
//       console.log(error);
//       display_error_alert();
//     });
//   })
//   .catch(confirmError => {
//     if (confirmError) {
//       console.error('Error confirming order with applepay token');
//       console.error(confirmError);
//       current_ap_session.completePayment(ApplePaySession.STATUS_FAILURE);
//       display_error_alert();
//     }
//   });
// });
// };
// let ap_validate = (event) => {
// applepay.validateMerchant({
//   validationUrl: event.validationURL,
//   displayName: "My Demo Company"
// })
// .then(validateResult => {
//   current_ap_session.completeMerchantValidation(validateResult.merchantSession);
// })
// .catch(validateError => {
//   console.error(validateError);
//   current_ap_session.abort();
// });
// };
// let handle_applepay_clicked = (event) => {
// const payment_request = {
//   countryCode: global_apple_pay_config.countryCode,
//   merchantCapabilities: global_apple_pay_config.merchantCapabilities,
//   supportedNetworks: global_apple_pay_config.supportedNetworks,
//   currencyCode: "USD",
//   requiredShippingContactFields: ["name", "phone", "email", "postalAddress"],
//   requiredBillingContactFields: ["postalAddress"],
//   total: {
//     label: "My Demo Company",
//     type: "final",
//     amount: "100.0",
//   }
// };
// current_ap_session = new ApplePaySession(4, payment_request);
// current_ap_session.onvalidatemerchant = ap_validate;
// current_ap_session.onpaymentauthorized = ap_payment_authed;
// current_ap_session.begin()
// };

onMounted(async () => {
  try {
    await check_applepay().then(() => {
        applepay = paypal.Applepay();
        applepay.config()
        .then(applepay_config => {
          if (applepay_config.isEligible) {
            document.getElementById("applepay-container").innerHTML = '<apple-pay-button id="applepay_button" buttonstyle="black" type="plain" locale="en">';
            global_apple_pay_config = applepay_config;
            document.getElementById("applepay_button").addEventListener("click", handle_applepay_clicked);
          }
        })
        .catch(applepay_config_error => {
          console.error('Error while fetching Apple Pay configuration:');
          console.error(applepay_config_error);
        });
      })
      .catch((error) => {
        console.error(error);
      });;
  } catch (error) {
    showNotification({
      message: error,
      type: 'error',
    })
  }
})

</script>

<template>
  <div id="paypal-button-card"></div>
</template>