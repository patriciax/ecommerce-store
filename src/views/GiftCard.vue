<script setup>
import TextFields from '@/components/common/TextFields.vue'
import { ref, computed } from 'vue'
import Btn from '@/components/common/Btn.vue'
import Login from '@/components/views/home/auth/Login.vue'
import Register from '@/components/views/home/auth/Register.vue'
import useVuelidate from '@vuelidate/core'
import { email, required } from '@vuelidate/validators'
import { useI18n } from 'vue-i18n'
import { GiftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'
import DateCard from '@/components/common/Calendar.vue'

const { t } = useI18n()
const login = ref(false)
const register = ref(false)
const emailHasError = ref(null)
const price = ref([50, 70, 90, 120, 500])
const dataForm = ref({
  emailTo: '',
  name: '',
  message: '',
  priceGift: price.value[0],
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
    message: {
      required,
    },
    priceGift: {
      required,
    },
    date: {
      required,
    },
  },
  dataForm
)

const setEmailErrors = computed(() => {
  const validator = handlerValidate.value?.['email']?.$errors?.[0]?.$validator
  if (validator == 'required') return t('VALIDATIONS.REQUIRED')
  if (validator == 'email') return t('VALIDATIONS.EMAIL')
  else if (emailHasError.value) return t('VALIDATIONS.EMAIL_IN_USE')

  return undefined
})

const send = async () => {
  const _validate = await handlerValidate.value.$validate()
  if (!_validate) return
}
</script>
<template>
  <section class="-mt-12 min-h-[80vh] text-center">
    <div class="relative mb-6">
      <div class="absolute left-0 top-0 flex h-full w-full flex-col items-start justify-end p-20">
        <p class="text-4xl font-bold uppercase text-white" v-text="'El regalo perfecto'" />
        <p class="text-lg font-light text-white" v-text="'una tarjeta de regalo de eroca es la opción perfecta.'"></p>
        <button class="mt-4 flex items-center rounded-lg bg-white px-4 py-2 text-gray-800">
          Consultar saldo
          <ChevronRightIcon class="w-5" />
        </button>
      </div>
      <img class="h-[450px] w-full bg-bottom object-cover" src="@/assets/images/bannergiftcard.webp" alt="" />
    </div>
    <p class="mb-2 text-2xl font-bold text-gray-900" v-text="'Comprar tarjeta de regalo electronica'" />
    <p class="mx-auto mb-10 max-w-xl" v-text="'Escribe los detalles de la tarjeta de regalo'" />

    <section class="mx-auto max-w-xl px-6 text-start">
      <span class="mb-1 text-sm font-bold text-gray-900 dark:text-white">Importe:</span>
      <ul class="mb-4 flex w-full flex-wrap gap-4">
        <li v-for="(item, index) in price" :key="item">
          <input
            type="radio"
            :id="'hosting-' + index"
            name="hosting"
            :value="item"
            v-model="dataForm.priceGift"
            class="peer hidden"
            required
          />

          <label
            :for="'hosting-' + index"
            class="inline-flex w-[102%] cursor-pointer items-center justify-between gap-2 rounded-lg border border-gray-200 bg-white p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-600 peer-checked:border-gray-800 peer-checked:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:peer-checked:text-gray-800"
          >
            <div class="block">
              <div class="w-full text-sm font-semibold">US $ {{ item }}</div>
            </div>

            <GiftIcon class="h-5 w-5" />
          </label>
        </li>
      </ul>

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

      <section class="mb-4">
        <label for="message" class="block text-sm font-bold text-gray-900 dark:text-white">Tu mensaje</label>
        <textarea
          v-model="dataForm.message"
          id="message"
          rows="4"
          class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          placeholder="Espero que disfrutes tu compra...."
        ></textarea>
      </section>

      <DateCard
        :errorMessage="
          handlerValidate?.['date']?.$errors?.length > 0
            ? $t('VALIDATIONS.' + handlerValidate?.['date']?.$errors?.[0]?.$validator?.toUpperCase())
            : undefined
        "
        v-model="dataForm.date"
        class="mb-6"
        label="Fecha de entrega"
      />

      <section class="mb-10">
        <Btn text="Enviar" isFull @click="send" />
      </section>
    </section>
  </section>
  <Login v-if="login" @close="login = false" @register="(login = false), (register = true)" />
  <Register v-if="register" @close="register = false" @closeRegister="login = true" @login="(login = true), (register = false)" />
</template>
