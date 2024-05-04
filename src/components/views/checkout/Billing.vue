<script setup lang="ts">
import { getAllCountries } from '@/api/repositories/country.repository'
import { _getRates } from '@/api/repositories/shipment.repository'
import Accordion from '@/components/common/Accordion.vue'
import InputPhoneNumber from '@/components/common/InputPhoneNumber.vue'
import SelectField from '@/components/common/SelectField.vue'
import TextFields from '@/components/common/TextFields.vue'
import Banesco from '@/components/paymentMethods/Banesco.vue'
import Card from '@/components/paymentMethods/Card.vue'
import GiftCard from '@/components/paymentMethods/GiftCard.vue'
import Paypal from '@/components/paymentMethods/Paypal.vue'
import MobilePayment from '@/components/paymentMethods/mobilePayment.vue'
import useNotifications from '@/composables/useNotifications'
import CartStore from '@/stores/cart/cart'
import CountryStore from '@/stores/country'
import StorePaymentMethods from '@/stores/paymentMethods'
import _storeProduct from '@/stores/product'
import _storeUser from '@/stores/user'
import _ZoomStore from '@/stores/zoom'
import { decimalNumberFormat } from '@/utils/numberFormat'
import { taxCalculations } from '@/utils/taxCalculations'
import useVuelidate from '@vuelidate/core'
import { email, required, requiredIf } from '@vuelidate/validators'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Btn from '@/components/common/Btn.vue'
const emit = defineEmits(['nextStep', 'prevStep'])

const { t } = useI18n()
const productStore = _storeProduct()
const countryStore = CountryStore()
const storePaymentMethods = StorePaymentMethods()

const countries = ref([])
const page = ref(1)
const cartStore = CartStore()
const storeUser = _storeUser()
const zoomStore = _ZoomStore()
const { pushNotification } = useNotifications()
const isDisabledStock = ref(false)
const emailHasError = ref(null)
const selectPaymentMethod = ref(null)
const validateFormData = ref(false)

const rates = ref([])
const choosenRate = ref(null)
const total = computed(() => {
  let total = 0
  cartStore.cart.forEach((item) => {
    total += item.priceDiscount * item.quantity || item.price * item.quantity
  })
  return total.toFixed(2)
})

const getCountries = async () => {
  const response = await getAllCountries()
  countries.value = response.data?.countries
}

const getRates = async() => {

  handlerValidate.value.$reset()
  const result = await handlerValidate.value.$validate()

  if(!result) return

  const country = countries.value.find((country) => country._id == dataForm.value.foreignCountry)
  const state = country.statesValues[dataForm.value.foreignState * 1 - 1]

  const data = {
    "name": `${dataForm.value.name} ${dataForm.value.lastname}`, 
    "street1": dataForm.value.foreignAddress,
    "city": dataForm.value.foreignCity,
    "state": state,
    "zip": dataForm.value.foreignZipCode,
    "country": country.value,
    "parcel": cartStore.cart
  }

  const response = await _getRates(data)

  if(response.data.status == 'success'){
    rates.value = response.data.data
  }

}

const dataForm: any = ref({
  name: '',
  lastname: '',
  email: '',
  phone: '',
  address: '',
  zoomState: '',
  zoomOffice: '',
  foreignCountry: '',
  foreignState: '',
  foreignAddress: '',
  foreignCity: '',
  foreignZipCode:''
})

const rules = computed(() => {
  return {
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
    zoomState: {
      required: requiredIf(() => countryStore.country == 'Venezuela'),
    },
    zoomOffice: {
      required: requiredIf(() => countryStore.country == 'Venezuela'),
    },
    foreignCountry: {
      required: requiredIf(() => countryStore.country != 'Venezuela'),
    },
    foreignState: {
      required: requiredIf(() => countryStore.country != 'Venezuela'),
    },
    foreignAddress: {
      required: requiredIf(() => countryStore.country != 'Venezuela'),
    },
    foreignCity: {
      required: requiredIf(() => countryStore.country != 'Venezuela'),
    },
    foreignZipCode: {
      required: requiredIf(() => countryStore.country != 'Venezuela'),
    },
  }
})

const handlerValidate = useVuelidate(rules, dataForm, { $scope: false })

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

const carrierObject = computed(() => {
  const zoomObject = {
    carrierName: 'ZOOM',
    state: statesFormated.value?.find((state) => state?.value == dataForm.value?.zoomState)?.text,
    office: dataForm.value?.zoomOffice,
    address: offiecesFormated.value?.find((office) => office?.value == dataForm.value?.zoomOffice)?.text,
  }

  const upsObject = {
    carrierName: 'UPS',
    country: countries.value.find((country) => country?._id == dataForm.value?.foreignCountry)?.name,
    state: countries.value
      .find((country) => country?._id == dataForm.value?.foreignCountry)
      ?.states?.find((state, index) => index + 1 == dataForm.value?.foreignState),
    address: dataForm.value?.foreignAddress,
  }

  return countryStore.country == 'Venezuela' ? zoomObject : upsObject
})

onMounted(async () => {
  if (countryStore.country == 'Venezuela') {
    await zoomStore.getState()
  } else {
    await getCountries()
  }

  if (storeUser.currentUser) {
    fetchDataForm()
    cartStore.productInfo()
    return
  }

  cartStore.productInfoGuest({ cartProducts: cartStore.cart })
})

const setChoosenRate = (rate) => {
  choosenRate.value = rate
}

const validateForm = async (paymentMethod) => {
  validateFormData.value = false
  handlerValidate.value.$reset()
  const result = await handlerValidate.value.$validate()

  validateFormData.value = result
}

const handlePay = (paymentMethod) => {
  storePaymentMethods.setPaymentMethod(paymentMethod)
  emit('nextStep')
}

const formatTotal=computed(()=> cartStore.total ? decimalNumberFormat(cartStore.total + (choosenRate.value?.amount ?? 0 ) * 1):0)
</script>
<template>
  <section class="grid gap-12 px-10 md:grid-cols-2 lg:px-0">
    <div>
      <p class="mt-6 text-xl font-bold" v-text="'Datos de facturación'" />
      <p class="mb-4 font-light" v-text="`Tienes ${cartStore.cart.length} productos en el carrito`" />

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

        <section class="mt-4 border-t py-4" v-if="countryStore.country == 'Venezuela'">
          <p class="mb-3 text-lg font-bold" v-text="'Dirección de envío'" />

          <div class="mb-4">
            <img class="w-32" src="@/assets/images/zoom.png" />
          </div>
          <SelectField
            v-model="dataForm.zoomState"
            :errorMessage="
              handlerValidate?.['zoomState']?.$errors?.length > 0
                ? $t('VALIDATIONS.' + handlerValidate?.['zoomState']?.$errors?.[0]?.$validator?.toUpperCase())
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
              handlerValidate?.['zoomOffice']?.$errors?.length > 0
                ? $t('VALIDATIONS.' + handlerValidate?.['zoomOffice']?.$errors?.[0]?.$validator?.toUpperCase())
                : undefined
            "
            isRequired
            :is-disabled="!dataForm.zoomState"
            :label="'Oficina'"
            :options="offiecesFormated"
            @update:modelValue="(_value) => (dataForm.zoomOffice = _value)"
          />
        </section>

        <section class="mt-4 border-t py-4" v-else>
          <p class="mb-3 text-lg font-bold" v-text="'Dirección de envío'" />

          <div class="mb-4">
            <img class="w-32" src="@/assets/images/zoom.png" />
          </div>
          <SelectField
            v-model="dataForm.foreignCountry"
            :errorMessage="
              handlerValidate?.['foreignCountry']?.$errors?.length > 0
                ? $t('VALIDATIONS.' + handlerValidate?.['foreignCountry']?.$errors?.[0]?.$validator?.toUpperCase())
                : undefined
            "
            isRequired
            class="mb-2 w-full"
            :label="$t('PAYMENTS.COUNTRY')"
            :options="countries?.map((country) => ({ value: country._id, text: country.name }))"
            @update:modelValue="(_value) => (dataForm.foreignCountry = _value)"
          />
          <SelectField
            v-model="dataForm.foreignState"
            :errorMessage="
              handlerValidate?.['foreignState']?.$errors?.length > 0
                ? $t('VALIDATIONS.' + handlerValidate?.['foreignState']?.$errors?.[0]?.$validator?.toUpperCase())
                : undefined
            "
            isRequired
            :is-disabled="!dataForm.foreignCountry"
            :label="$t('PAYMENTS.STATE')"
            :options="
              countries
                ?.find((country) => country._id == dataForm.foreignCountry)
                ?.states?.map((state, index) => ({ value: index + 1, text: state }))
            "
            @update:modelValue="(_value) => (dataForm.foreignState = _value)"
          />
          <TextFields
            v-model="dataForm.foreignCity"
            :is-disabled="!dataForm.foreignCountry || !dataForm.foreignState"
            :errorMessage="
              handlerValidate?.['foreignCity']?.$errors?.length > 0
                ? $t('VALIDATIONS.' + handlerValidate?.['foreignCity']?.$errors?.[0]?.$validator?.toUpperCase())
                : undefined
            "
            name="foreignCity"
            placeholder="San Francisco"
            :label="t('PAYMENTS.CITY')"
          />
          <TextFields
            id="foreignAddress"
            v-model="dataForm.foreignAddress"
            :is-disabled="!dataForm.foreignCountry || !dataForm.foreignState"
            :errorMessage="
              handlerValidate?.['foreignAddress']?.$errors?.length > 0
                ? $t('VALIDATIONS.' + handlerValidate?.['foreignAddress']?.$errors?.[0]?.$validator?.toUpperCase())
                : undefined
            "
            name="foreignAddress"
            placeholder="212 New york"
            :label="t('PAYMENTS.ADDRESS')"
          />
          <TextFields
            v-model="dataForm.foreignZipCode"
            :is-disabled="!dataForm.foreignCountry || !dataForm.foreignState"
            :errorMessage="
              handlerValidate?.['foreignZipCode']?.$errors?.length > 0
                ? $t('VALIDATIONS.' + handlerValidate?.['foreignZipCode']?.$errors?.[0]?.$validator?.toUpperCase())
                : undefined
            "
            name="foreignZipCode"
            placeholder="1000000"
            :label="t('PAYMENTS.ZIP_CODE')"
          />
          <button type="button" @click="getRates()" class="mt-2">{{ t('PAYMENTS.GET_RATES') }}</button>

          <div class="mt-2 w-full">

            <div class="p-4 border" v-for="rate in rates" :key="rate.objectId" @click="setChoosenRate(rate)">
              <p>$ {{ rate.amount }}</p>
              <p>Días estimados: {{ rate.estimatedDays }}</p>
            </div>

          </div>

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
          <p class="font-bold">${{ item.priceDiscount || item.price }}</p>
        </li>
        <li class="mb-4 flex justify-between border-b pb-2" v-if="countryStore.country == 'Venezuela'">
          <span class="font-bold">Envío </span> <span class="font-bold text-blue-900">ZOOM</span>
        </li>
        <li class="mb-4 flex justify-between border-b pb-2" v-else>
          <span class="font-bold">Envío </span> <span class="font-bold text-blue-900">$ {{ choosenRate?.amount ?? 0 }}</span>
        </li>
        <li class="mb-4 flex justify-between border-b pb-2">
          <span class="text-lg font-bold">Total</span>
        <div>
          <p class="text-lg font-bold mb-2 text-right">${{ formatTotal}}</p>
          <div class="text-md text-right flex items-center justify-center"><p class=" font-bold mr-2">+IVA </p> ${{  decimalNumberFormat(taxCalculations(cartStore.total  + (choosenRate?.amount ?? 0 ) * 1, countryStore.country === 'Venezuela' ? 'national' : 'international')) }}</div>
        </div>
        </li>
   
        <li class="mb-4 flex justify-between border-b pb-2" v-if="countryStore.country == 'Venezuela'">
          <span class="text-lg font-bold">Total en Bolivares</span>
          <div>
            <p v-if="productStore.price" class="text-lg font-bold text-right mb-2">Bs.{{  decimalNumberFormat((productStore.price * cartStore.total)) }}</p>
            <div class="text-md text-right flex items-center justify-center"><p class=" font-bold mr-2">+IVA </p> Bs.{{  decimalNumberFormat(taxCalculations(productStore.price * cartStore.total +   (choosenRate?.amount ?? 0 ) * 1, countryStore.country === 'Venezuela' ? 'national' : 'international')) }}</div>
          </div>
        </li>
      </ul>

      <section v-if="countryStore.country != 'Venezuela' && choosenRate">
        <p class="mb-6 text-lg font-bold" v-text="'Método de pago'" />
        <div>
          <accordion hidden :title="''" v-if="countryStore.country == 'Venezuela'">
            <template #img> <img class="w-32" src="@/assets/images/banesco.png" /></template>
            <Banesco
              :validate-form="validateFormData"
              @validate="validateForm"
              @nextStep="handlePay('Banesco')"
              :cart="cartStore.cart"
              :name="dataForm.name"
              :email="dataForm.email"
              :phone="dataForm.phone"
              :carrier="carrierObject"
            />
          </accordion>

          <accordion :title="''">
            <template #img> <img class="w-32" src="@/assets/images/paypal.png" /></template>
            <Paypal
              @validate="validateForm"
              :validate-form="validateFormData"
              :cart="cartStore.cart"
              :name="dataForm.name"
              :email="dataForm.email"
              :phone="dataForm.phone"
              @nextStep="handlePay('paypal')"
              :carrier="carrierObject"
            />
          </accordion>

          <accordion hidden :title="''">
            <template #img> <img class="w-16" src="@/assets/images/zelle.png" /></template>

            <MobilePayment
              paymentMethod="zelle"
              :validate-form="validateFormData"
              @validate="validateForm"
              @nextStep="handlePay('zelle')"
              :cart="cartStore.cart"
              :name="dataForm.name"
              :email="dataForm.email"
              :phone="dataForm.phone"
              :carrier="carrierObject"
            />
          </accordion>
          <accordion hidden v-if="countryStore.country == 'Venezuela'" :title="'Pago móvil'">
            <MobilePayment
              :validate-form="validateFormData"
              @validate="validateForm"
              @nextStep="handlePay('Pago movil')"
              :cart="cartStore.cart"
              :name="dataForm.name"
              :email="dataForm.email"
              :phone="dataForm.phone"
              :carrier="carrierObject"
            />
          </accordion>
          <accordion :title="'Tarjeta de crédito'">
            <Card
              @validate="validateForm"
              :validate-form="validateFormData"
              :cart="cartStore.cart"
              :name="dataForm.name"
              :email="dataForm.email"
              :phone="dataForm.phone"
              @nextStep="handlePay('Tarjeta de crédito')"
              :carrier="carrierObject"
            />
          </accordion>
          <accordion :title="''">
            <template #img> <p class="text-lg font-semibold" v-text="'Tarjeta '"/><img class="w-14 ml-2 object-contain" src="@/assets/images/logo.png" /></template>
            <GiftCard
              @validate="validateForm"
              :validate-form="validateFormData"
              :cart="cartStore.cart"
              :name="dataForm.name"
              :email="dataForm.email"
              :phone="dataForm.phone"
              @nextStep="handlePay('Tarjeta Eroca')"
              :carrier="carrierObject"
            />
          </accordion>
        </div>
      </section>
      <section v-else>
        <p class="mb-6 text-lg font-bold" v-text="'Método de pago'" />
        <div>
          Debe completar sus datos de envío y seleccionar una tarifa
        </div>
      </section>
    </div>

    <button
      class="group flex col-span-2 mx-auto items-center justify-center gap-1 rounded-xl bg-gray-800 p-8 py-3 text-sm font-bold leading-6 text-white shadow-sm hover:bg-opacity-90"
      type="submit"
      @click="$emit('prevStep')"
    >
      Volver
    </button>
  </section>
</template>
