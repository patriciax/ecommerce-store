<script setup>
import Btn from '@/components/common/Btn.vue'
import Document from '@/components/common/Document.vue'
import Modal from '@/components/common/Modal.vue'
import TextFields from '@/components/common/TextFields.vue'
import useNotifications from '@/composables/useNotifications'
import BalanceStore from '@/stores/giftCard'
import useVuelidate from '@vuelidate/core'
import { email, required } from '@vuelidate/validators'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const emit = defineEmits(['close'])
const { t } = useI18n()
const { pushNotification } = useNotifications()
const emailHasError = ref(null)
const showVerification = ref(true)
const balanceStore = BalanceStore()
const dataForm = ref({
  cardNumber: '',
  cardPin: '',
  email: '',
})

const handlerValidate = useVuelidate(
  {
    cardNumber: {
      required,
    },

    cardPin: {
      required,
    },
    email: {
      required,
      email,
    },
  },
  dataForm
)

const setEmailErrors = computed(() => {
  const validator = handlerValidate.value?.['email']?.$errors?.[0]?.$validator
  if (validator == 'required') return t('VALIDATIONS.REQUIRED')
  if (validator == 'email') return t('VALIDATIONS.EMAIL')
  else if (emailHasError.value) return ' '

  return undefined
})
const handleConsult = () => {
  showVerification.value = true
  dataForm.value.cardNumber = ''
  dataForm.value.cardPin = ''
  dataForm.value.email = ''
}

const sendForm = async () => {
  console.log(dataForm.value)
  const _validate = await handlerValidate.value.$validate()
  if (!_validate) return

  await balanceStore.getBalance(dataForm.value)
  showVerification.value = false
}
</script>
<template>
  <Modal size="w-[500px]" @close="$emit('close')">
    <div class="flex h-[599px] min-h-full flex-col justify-center rounded-xl bg-white px-6 py-6 md:py-12 lg:px-16">
      <div class="text-center sm:mx-auto sm:w-full sm:max-w-sm">
        <img class="mx-auto h-10 w-auto mb-5" src="@/assets/images/logo.png" alt="Logo roca" />
        <h2 class="mb-4 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900" v-text="'Consultar saldo'"></h2>
      </div>

      <form v-if="showVerification" class="px-6" @submit.prevent="sendForm">
        <TextFields
          id="email"
          class="mb-4"
          v-model="dataForm.email"
          isRequired
          :errorMessage="setEmailErrors || emailHasError"
          name="name"
          placeholder="example@gmail.com"
          :label="t('FORM.EMAIL')"
        />

        <div>
          <Document
            v-model="dataForm.cardNumber"
            :label="$t('PAYMENTS.CARD_NUMBER')"
            :minLength="15"
            :maxLength="16"
            class="mb-2"
            :errorMessage="
              handlerValidate?.['cardNumber']?.$errors?.length > 0
                ? $t('VALIDATIONS.' + handlerValidate?.['cardNumber']?.$errors?.[0]?.$validator?.toUpperCase())
                : undefined
            "
          />
        </div>
        <div>
          <Document
            :errorMessage="
              handlerValidate?.['cardPin']?.$errors?.length > 0
                ? $t('VALIDATIONS.' + handlerValidate?.['cardPin']?.$errors?.[0]?.$validator?.toUpperCase())
                : undefined
            "
            v-model="dataForm.cardPin"
            :label="$t('PAYMENTS.CARDPIN')"
            :maxLength="4"
          />
        </div>

        <div class="col-span-2 mt-6">
          <Btn text="Consultar" isFull />
        </div>
      </form>

      <section v-else class="text-center">
        <div v-if="balanceStore.isError">
          <svg
            clas
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="mx-auto h-10 w-10 text-red-500"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>

          <p class="text-xl font-bold text-red-500 mb-4">{{ $t('COMMON.CARD_NOT_FOUND') }}</p>
          <div class="col-span-2 mt-6">
          <Btn :text="$t('COMMON.BACK_TO_QUERY')" isFull @click="handleConsult"/>
        </div>
        </div>
        <div v-if="balanceStore.isReady">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="mx-auto h-10 w-10 text-green-500"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          <p class="text-xl font-bold text-green-500">{{ $t('COMMON.CONSULT_SUCCESS') }}</p>
        </div>
      </section>
    </div>
  </Modal>
</template>
