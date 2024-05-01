<script setup>
import { getPrice } from '@/api/repositories/giftCard.repository'
import Accordion from '@/components/common/Accordion.vue'
import ConsultBalance from '@/components/common/ConsultBalance.vue'
import TextFields from '@/components/common/TextFields.vue'
import Banesco from '@/components/paymentMethods/Banesco.vue'
import Card from '@/components/paymentMethods/Card.vue'
import Paypal from '@/components/paymentMethods/Paypal.vue'
import MobilePayment from '@/components/paymentMethods/mobilePayment.vue'
import Login from '@/components/views/home/auth/Login.vue'
import Register from '@/components/views/home/auth/Register.vue'
import CountryStore from '@/stores/country'
import GiftCardStore from '@/stores/giftCard'
import { CheckCircleIcon, ChevronRightIcon, GiftIcon } from '@heroicons/vue/24/outline'
import useVuelidate from '@vuelidate/core'
import { email, required } from '@vuelidate/validators'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const countryStore = CountryStore()
const giftCardStore = GiftCardStore()
const { t } = useI18n()
const login = ref(false)
const register = ref(false)
const emailHasError = ref(null)
const validateFormData = ref(false)
const prices = ref([])
const successPayment = ref(false)
const isOpenModal = ref(false)
const dataForm = ref({
  date: null,
  emailTo: '',
  name: '',
  message: '',
  priceGift: null,
})

const updateDate = (value) => {
  dataForm.value.date = value
}

const handlerValidate = useVuelidate(
  {
    emailTo: {
      required,
      email,
    },
    name: {
      required,
    },
    message: {
      required,
    },
    priceGift: {
      required,
    },
  },
  dataForm,
  { $scope: false }
)

const setEmailErrors = computed(() => {
  const validator = handlerValidate.value?.['emailTo']?.$errors?.[0]?.$validator
  if (validator == 'required') return t('VALIDATIONS.REQUIRED')
  if (validator == 'email') return t('VALIDATIONS.EMAIL')
  else if (emailHasError.value) return t('VALIDATIONS.EMAIL_IN_USE')

  return undefined
})

const validateForm = async (paymentMethod) => {
  validateFormData.value = null
  handlerValidate.value.$reset()
  const result = await handlerValidate.value.$validate()

  validateFormData.value = result
}

const send = async () => {
  handlerValidate.value.$reset()
  const _validate = await handlerValidate.value.$validate()
  if (!_validate) return

  validateForm.value = _validate
}

const handleBack = () => {
  successPayment.value = false
}
onMounted(async () => {
  const response = await getPrice()
  if (response?.status === 'success') prices.value = response.data.giftCards
  dataForm.value.priceGift = prices.value[0].amount
})
</script>
<template>
  <section class="-mt-12 text-center lg:h-[130vh]">
    <div class="relative mb-6">
      <div class="absolute left-0 top-0 flex h-full w-full flex-col items-start justify-end p-20">
        <p class="text-4xl font-bold uppercase text-white" v-text="'El regalo perfecto'" />
        <p class="text-lg font-light text-white" v-text="'una tarjeta de regalo de eroca es la opción perfecta.'"></p>
        <button @click="isOpenModal = true" class="mt-4 flex items-center rounded-lg bg-white px-4 py-2 text-gray-800">
          Consultar saldo  

          <ChevronRightIcon class="w-5" />
        </button>
      </div>
      <img class="h-[450px] w-full bg-bottom object-cover" src="@/assets/images/bannergiftcard.webp" alt="" />
    </div>
    <p class="mb-2 text-2xl font-bold text-gray-900" v-text="'Comprar tarjeta de regalo electronica'" />
    <p class="mx-auto mb-10 max-w-xl" v-text="'Escribe los detalles de la tarjeta de regalo'" />

    <section class="m-auto grid max-w-6xl gap-2 lg:grid-cols-2 xl:gap-10">
      <section class="col-span-2 mb-10 rounded-lg bg-gray-100 p-6 text-center" v-if="successPayment">
        <CheckCircleIcon class="mx-auto w-16 text-green-500" />
        <p class="mb-1 text-xl font-bold text-gray-900" v-text="'Gracias por su compra'" />
        <p v-text="'Se ha enviado un correo electronico a al remitente de su tarjeta de regalo.'" />
   
        <section class="text-center">
          <button @click="handleBack" class="mt-4 text-center w-fit m-auto flex items-center rounded-lg bg-gray-800 px-4 py-2 text-white">
          Volver
          </button>
        </section>

      </section>
      <template v-else>
        <section class="mx-auto w-full px-6 text-start">
          <span
            :class="{ 'text-red-500': handlerValidate?.['priceGift']?.$errors?.length > 0 }"
            class="mb-1 text-sm font-bold text-gray-900 dark:text-white"
            >Importe:</span
          >
          <ul class="mb-4 flex w-full flex-wrap gap-4">
            <li v-for="(item, index) in prices" :key="item">
              <input
                type="radio"
                :id="'hosting-' + index"
                name="hosting"
                :value="item.amount"
                v-model="dataForm.priceGift"
                class="peer hidden"
                required
              />

              <label
                :for="'hosting-' + index"
                class="inline-flex w-[102%] cursor-pointer items-center justify-between gap-2 rounded-lg border border-gray-200 bg-white p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-600 peer-checked:border-gray-800 peer-checked:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:peer-checked:text-gray-800"
              >
                <div class="block">
                  <div class="w-full text-sm font-semibold">US $ {{ item.amount }}</div>
                </div>

                <GiftIcon class="h-5 w-5" />
              </label>
            </li>
          </ul>
          <p class="mb-2 text-sm font-bold text-red-500" v-if="handlerValidate?.['priceGift']?.$errors?.length > 0">
            {{ $t('VALIDATIONS.' + handlerValidate?.['priceGift']?.$errors?.[0]?.$validator?.toUpperCase()) }}
          </p>

          <TextFields
            id="email-gift"
            v-model="dataForm.emailTo"
            isRequired
            :errorMessage="setEmailErrors || emailHasError"
            name="name"
            class="mb-4"
            placeholder="example@gmail.com"
            :label="'Para:'"
          />
          <TextFields
            v-model="dataForm.name"
            isRequired
            :errorMessage="
              handlerValidate?.['name']?.$errors?.length > 0
                ? $t('VALIDATIONS.' + handlerValidate?.['name']?.$errors?.[0]?.$validator?.toUpperCase())
                : undefined
            "
            name="name"
            class="mb-4"
            placeholder="Jane Doe"
            :label="'De:'"
            :msg="'Ingresa tu nombre para enviar la tarjeta de regalo'"
          />

          <section class="relative mb-4">
            <label
              :class="{
                'text-red-500':
                  handlerValidate?.['message']?.$errors?.length > 0
                    ? $t('VALIDATIONS.' + handlerValidate?.['message']?.$errors?.[0]?.$validator?.toUpperCase())
                    : undefined,
              }"
              for="message"
              class="block text-sm font-bold text-gray-900 dark:text-white"
              >Tu mensaje</label
            >
            <textarea
              :class="{
                'border border-red-500  dark:border-red-500 ':
                  handlerValidate?.['message']?.$errors?.length > 0
                    ? $t('VALIDATIONS.' + handlerValidate?.['message']?.$errors?.[0]?.$validator?.toUpperCase())
                    : undefined,
              }"
              v-model="dataForm.message"
              id="message"
              rows="4"
              class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              placeholder="Espero que disfrutes tu compra...."
            ></textarea>
            <p
              v-if="
                handlerValidate?.['message']?.$errors?.length > 0
                  ? $t('VALIDATIONS.' + handlerValidate?.['message']?.$errors?.[0]?.$validator?.toUpperCase())
                  : undefined
              "
              class="absolute right-0 mt-0.5 text-xs font-medium text-red-500"
              v-text="
                handlerValidate?.['message']?.$errors?.length > 0
                  ? $t('VALIDATIONS.' + handlerValidate?.['message']?.$errors?.[0]?.$validator?.toUpperCase())
                  : undefined
              "
            />
          </section>

          <!-- <DateCard
          :errorMessage="
            handlerValidate?.['date']?.$errors?.length > 0
              ? $t('VALIDATIONS.' + handlerValidate?.['date']?.$errors?.[0]?.$validator?.toUpperCase())
              : undefined
          "
          v-model="dataForm.date"
          class="mb-6"
          label="Fecha de entrega"
        /> -->
        </section>

        <section class="mb-10 rounded-lg bg-gray-100 p-6 text-start">
          <section>
            <p class="mb-6 text-lg font-bold" v-text="'Método de pago'" />
            <div>
              <Accordion :title="''" v-if="countryStore.country == 'Venezuela'">
                <template #img> <img class="w-32" src="@/assets/images/banesco.png" /></template>
                <Banesco
                  :validate-form="validateFormData"
                  @validate="validateForm"
                  :isCard="true"
                  :card="{
                    total: dataForm.priceGift,
                    emailTo: dataForm.emailTo,
                    name: dataForm.name,
                    message: dataForm.message,
                    date: dataForm.date,
                  }"
                  @nextStep="successPayment = true"
                  endpoint="gift-cards/purchase"
                />
              </Accordion>
              <Accordion :title="''">
                <template #img> <img class="w-32" src="@/assets/images/paypal.png" /></template>
                <Paypal
                  @validate="validateForm"
                  :validate-form="validateFormData"
                  @nextStep="successPayment = true"
                  endpoint="gift-cards/purchase"
                  :isCard="true"
                  :card="{
                    total: dataForm.priceGift,
                    emailTo: dataForm.emailTo,
                    name: dataForm.name,
                    message: dataForm.message,
                    date: dataForm.date,
                  }"
                />
              </Accordion>
              <Accordion :title="'Tarjeta de crédito'">
                <Card
                  @validate="validateForm"
                  :validate-form="validateFormData"
                  @nextStep="successPayment = true"
                  endpoint="gift-cards/purchase"
                  :isCard="true"
                  :card="{
                    total: dataForm.priceGift,
                    emailTo: dataForm.emailTo,
                    name: dataForm.name,
                    message: dataForm.message,
                    date: dataForm.date,
                  }"
                />
              </Accordion>
              <accordion hidden :title="''" v-if="countryStore.country == 'Venezuela'">
                <template #img> Pago móvil</template>
                <MobilePayment
                  :validate-form="validateFormData"
                  @validate="validateForm"
                  endpoint="gift-cards/purchase"
                  @nextStep="successPayment = true"
                  isCard
                  :card="{
                    total: dataForm.priceGift,
                    emailTo: dataForm.emailTo,
                    name: dataForm.name,
                    message: dataForm.message,
                    date: dataForm.date,
                  }"
                />
              </accordion>
              <accordion hidden :title="''">
                <template #img> Zelle</template>
                <MobilePayment
                  :validate-form="validateFormData"
                  @validate="validateForm"
                  endpoint="gift-cards/purchase"
                  @nextStep="successPayment = true"
                  :paymentMethod="'zelle'"
                  isCard
                  :card="{
                    total: dataForm.priceGift,
                    emailTo: dataForm.emailTo,
                    name: dataForm.name,
                    message: dataForm.message,
                    date: dataForm.date,
                  }"
                />
              </accordion>
            </div>
          </section>
        </section>
      </template>
    </section>
  </section>
  <Login v-if="login" @close="login = false" @register="(login = false), (register = true)" />
  <Register v-if="register" @close="register = false" @closeRegister="login = true" @login="(login = true), (register = false)" />

  <ConsultBalance v-if="isOpenModal" @close="isOpenModal = false" />
</template>
