<script setup>
import InputsOpt from '@/components/common/InputsOpt.vue'
import useNotifications from '@/composables/useNotifications'
import RestorePassword from '@/stores/resetPassword.js'

import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  email: {
    type: String,
  },
})

const emit = defineEmits(['close'])
const { t } = useI18n()
const { pushNotification } = useNotifications()
const storeResetPass = RestorePassword()

const currentCode = ref('')

const verifyCode = async () => {
  await storeResetPass.verifyCode({ email: props.email, passwordOtp: currentCode.value })
  if (storeResetPass.isReady) {
    pushNotification({
      id: '',
      title: t('VERIFICATION.VERIFICATION_SUCCESS'),
      type: 'success',
    })
    emit('close')
    emit('currentCode', currentCode.value)
  } else {
    pushNotification({
      id: '',
      title: t('VERIFICATION.VERIFICATION_ERROR'),
      type: 'error',
    })
  }
}

const resendCode = async () => {
  await storeResetPass.restorePass({ email: props.email })

  pushNotification({
    id: '',
    title: t('VERIFICATION.RESEND'),
    type: 'success',
  })
}


</script>
<template>
  <div class="flex min-h-full flex-col justify-center rounded-2xl bg-white px-4 py-6 md:w-[410px] md:py-12 lg:px-4">
    <div class="mx-auto flex w-full flex-col">
      <div class="mb-8 flex flex-col items-center justify-center space-y-2 text-center">
        <div class="text-2xl font-bold">
          <h2>{{ t('VERIFICATION.VERIFICATION_EMAIL') }}</h2>
        </div>
        <div class="flex flex-row text-sm font-medium text-gray-400">
          <p v-if="storeResetPass?.data">
            {{ t('VERIFICATION.SEND_CODE') }} <b>{{ props.email }}</b>
          </p>
        </div>
      </div>

      <div>
        <section class="mb-8 flex justify-center">
          <InputsOpt v-model="currentCode" :isDisabled="false" :codeLength="6" />
        </section>

        <div class="flex flex-col space-y-5">
          <div>
            <button
              :class="storeResetPass.isLoading || !currentCode ? 'bg-gray-300' : 'bg-gray-900'"
              :disabled="storeResetPass.isLoading || !currentCode"
              @click="verifyCode"
              class="mx-auto flex w-5/6 justify-center rounded-xl p-3 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
            {{ t('VERIFICATION.VERIFY_ACCOUNT') }}
            </button>
          </div>

          <div class="flex flex-row items-center justify-center space-x-1 text-center text-sm font-medium text-gray-500">
            <p v-text="'No ha recibido el código?'" />
            <!-- <p>Didn't recieve code?</p> -->
            <p @click="resendCode" class="flex cursor-pointer flex-row items-center text-blue-600" rel="noopener noreferrer">{{ t('VERIFICATION.RESEND_CODE') }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
