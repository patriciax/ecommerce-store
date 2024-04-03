<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { CheckIcon } from '@heroicons/vue/24/outline'
import CartStore from '@/stores/cart/cart'
import _storeUser from '@/stores/user'
import useNotifications from '@/composables/useNotifications'
import TextFields from '@/components/common/TextFields.vue'
import InputPhoneNumber from '@/components/common/InputPhoneNumber.vue'
import Btn from '@/components/common/Btn.vue'
import useVuelidate from '@vuelidate/core'
import { email, required } from '@vuelidate/validators'
import { useI18n } from 'vue-i18n'
import Cart from '@/components/views/checkout/Cart.vue'
import SelectField from '@/components/common/SelectField.vue'
import _ZoomStore from '@/stores/zoom'
import Paypal from '@/components/paymentMethods/Paypal.vue'
import Banesco from '@/components/paymentMethods/Banesco.vue'
import Card from '@/components/paymentMethods/Card.vue'
import GiftCard from '@/components/paymentMethods/GiftCard.vue'

import Accordion from '@/components/common/Accordion.vue'
const { t } = useI18n()

const page = ref(1)
const cartStore = CartStore()
const storeUser = _storeUser()
const zoomStore = _ZoomStore()
const { pushNotification } = useNotifications()
const isDisabledStock = ref(false)
const emailHasError = ref(null)

const total = computed(() => {
  let total = 0
  cartStore.cart.forEach((item) => {
    total += item.priceDiscount * item.quantity || item.price * item.quantity  
  })
  return total.toFixed(2)
})

const dataForm = ref({
  name: '',
  lastname: '',
  email: '',
  phone: '',
  address: '',
  zoomState: '',
  zoomOffice: '',
})

const handlerValidate = useVuelidate(
  {
    email: {
      required,
      email,
    },
    name: {
      required,
    },
    lastname: {
      required,
    },
    phone: {
      required,
    },
    address: {
      required,
    },
    zoomState: {
      required,
    },
    zoomOffice: {
      required,
    },
  },
  dataForm
)

const handleInputStates = async (_value) => {
  await zoomStore.getOffices(_value)
  dataForm.value.zoomState = _value
}

const statesFormated = computed(() =>
  zoomStore.states?.map((state) => ({
    value: state.codestado,
    text: state.nombre,
  }))
)

const offiecesFormated = computed(() =>
  zoomStore.offices?.map((office) => ({
    value: office.codoficina,
    text: office.direccion,
  }))
)

const setEmailErrors = computed(() => {
  const validator = handlerValidate.value?.['email']?.$errors?.[0]?.$validator
  if (validator == 'required') return t('VALIDATIONS.REQUIRED')
  if (validator == 'email') return t('VALIDATIONS.EMAIL')
  else if (emailHasError.value) return t('VALIDATIONS.EMAIL_IN_USE')

  return undefined
})

const fetchDataForm = () => {
  dataForm.value.name = storeUser.currentUser?.name
  dataForm.value.lastname = storeUser.currentUser?.lastname
  dataForm.value.address = storeUser.currentUser?.address
  dataForm.value.email = storeUser.currentUser?.email
  dataForm.value.phone = storeUser.currentUser?.phone
}

onMounted(async () => {
  await zoomStore.getState()
  if (storeUser.currentUser){
    fetchDataForm()
    cartStore.productInfo()
    return
  }

  cartStore.productInfoGuest({ cartProducts: cartStore.cart })
 
})
</script>
<template>
  <section class="grid px-10 lg:px-0 md:grid-cols-2 gap-12">
    <div>
      <p class="mt-6 text-xl font-bold" v-text="'Datos de facturación'" />
      <p class="mb-6 font-light" v-text="`Tienes ${cartStore.cart.length} productos en el carrito`" />

      <form class="flex flex-col gap-2">
        <TextFields
          id="name"
          v-model="dataForm.name"
          isRequired
          :errorMessage="
            handlerValidate?.['name']?.$errors?.length > 0
              ? $t('VALIDATIONS.' + handlerValidate?.['name']?.$errors?.[0]?.$validator?.toUpperCase())
              : undefined
          "
          name="name"
          placeholder="jhon"
          :label="t('FORM.NAME')"
        />
        <TextFields
          id="lastname"
          v-model="dataForm.lastname"
          isRequired
          :errorMessage="
            handlerValidate?.['lastname']?.$errors?.length > 0
              ? $t('VALIDATIONS.' + handlerValidate?.['lastname']?.$errors?.[0]?.$validator?.toUpperCase())
              : undefined
          "
          name="name"
          placeholder="Doe"
          :label="t('FORM.LASTNAME')"
        />
        <TextFields
          id="email"
          v-model="dataForm.email"
          isRequired
          :is-disabled="storeUser.currentUser?.email"
          :errorMessage="setEmailErrors || emailHasError"
          name="name"
          placeholder="example@gmail.com"
          :label="t('FORM.EMAIL')"
        />

        <section>
          <label for="" class="text-sm font-bold">{{ $t('FORM.PHONE') }}<span class="text-red-600" v-text="'*'" /></label>
          <InputPhoneNumber
            :errorMessage="
              handlerValidate?.['phone']?.$errors?.length > 0
                ? $t('VALIDATIONS.' + handlerValidate?.['phone']?.$errors?.[0]?.$validator?.toUpperCase())
                : undefined
            "
            id="phone"
            v-model="dataForm.phone"
          />
        </section>
        <TextFields
          class="col-span-2"
          id="address"
          v-model="dataForm.address"
          name="name"
          placeholder="Lorem ipsum"
          :label="t('FORM.ADDRESS')"
        />

        <section class="mt-4 border-t py-4">
          <p class="mb-3 text-lg font-bold" v-text="'Dirección de envío'" />

          <div class="mb-4">
            <img class="w-32" src="@/assets/images/zoom.png" />
          </div>
          <SelectField
            v-model="dataForm.zoomState"
            :errorMessage="
              handlerValidate?.['state']?.$errors?.length > 0
                ? $t('VALIDATIONS.' + handlerValidate?.['state']?.$errors?.[0]?.$validator?.toUpperCase())
                : undefined
            "
            isRequired
            class="mb-2 w-full"
            :label="'Estado'"
            :options="statesFormated"
            @update:modelValue="handleInputStates"
          />
          <SelectField
            v-model="dataForm.zoomOffice"
            :errorMessage="
              handlerValidate?.['office']?.$errors?.length > 0
                ? $t('VALIDATIONS.' + handlerValidate?.['office']?.$errors?.[0]?.$validator?.toUpperCase())
                : undefined
            "
            isRequired
            :is-disabled="!dataForm.zoomState"
            :label="'Oficina'"
            :options="offiecesFormated"
            @update:modelValue="(_value) => (dataForm.zoomOffice = _value)"
          />
        </section>
      </form>
    </div>

    <div class="rounded-lg bg-gray-100 p-6">
      <p class="text-xl font-bold" v-text="'Tu pedido'" />
      <p class="mb-6 font-light" v-text="'Detalles'" />

      <ul class="order-details-form mb-6">
        <li class="mb-4 flex justify-between border-b pb-2"><span class="font-bold">Product</span> <span class="font-bold">Total</span></li>
        <li v-for="(item, index) in cartStore.cart" :key="index" class="mb-4 flex justify-between border-b pb-2">
          <span class="" v-text="`${item.name} x ${item.quantity}`"></span>
          <p class="font-bold" v-text="`$${item.priceDiscount || item.price}`"></p>
        </li>
        <li class="mb-4 flex justify-between border-b pb-2">
          <span class="font-bold">Envío </span> <span class="font-bold text-blue-900">ZOOM</span>
        </li>
        <li class="mb-4 flex justify-between border-b pb-2">
          <span class="text-lg font-bold">Total</span>
          <p class="text-lg font-bold" v-text="`$${cartStore.total}`"></p>
        </li>
      </ul>

      <section>
        <p class="text-lg font-bold mb-6" v-text="'Método de pago'" />
        <div>
          <accordion :title="''">
            <template #img>
              <img
                class="w-32"
                src="@/assets/images/banesco.png"
            /></template>
            <Banesco :cart="cartStore.cart" :carrier="{
              carrierName: 'ZOOM',
              state: statesFormated?.find((state) => state?.value == dataForm?.zoomState)?.text,
              office: dataForm?.zoomOffice,
              address: offiecesFormated?.find((office) => office?.value == dataForm?.zoomOffice)?.text,
            }"/>
          </accordion>

          <accordion :title="''">
            <template #img>
              <img
                class="w-32"
                src="@/assets/images/paypal.png"
            /></template>
            <Paypal :cart="cartStore.cart" :carrier="{
              carrierName: 'ZOOM',
              state: statesFormated?.find((state) => state?.value == dataForm?.zoomState)?.text,
              office: dataForm?.zoomOffice,
              address: offiecesFormated?.find((office) => office?.value == dataForm?.zoomOffice)?.text,
            }"/>
          </accordion>
          <accordion :title="'Tarjeta Eroca'">
            <Card />
          </accordion>
          <accordion :title="'Tarjeta Eroca'">
            <GiftCard />
          </accordion>
        </div>
      </section>
    </div>
  </section>
</template>
