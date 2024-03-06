<script setup>
import InputsOpt from '@/components/common/InputsOpt.vue'
import useNotifications from '@/composables/useNotifications'
import _storeAuth from '@/stores/auth'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const emit = defineEmits(['close'])
const { t } = useI18n()
const { pushNotification } = useNotifications()
const storeAuth = _storeAuth()

const currentCode = ref('')

const verifyCode = async() => {
  await storeAuth.verifyCode({ email: storeAuth.data.user?.email, emailOtp: currentCode.value })
  if (storeAuth.isReady) {
      pushNotification({
        id: '',
        title: t('COMMON.SUCCEFULLY_REGISTER'),
        type: 'success',
      })
    }
    emit('close')
}

const resendCode = async() => {
  await storeAuth.resendCode({ email: storeAuth.data.user?.email })
  pushNotification({
        id: '',
        title: 'Codigo reenviado',
        type: 'success',
      })
  
}
</script>
<template>
  <div class="flex min-h-full md:w-[500px] flex-col justify-center rounded-2xl bg-white px-6 py-6 md:py-12 lg:px-16">
    <div class="mx-auto flex w-full flex-col">
      <div class="mb-8 flex flex-col items-center justify-center space-y-2 text-center">
        <div class="text-3xl font-semibold">
          <p>Verificacion de Email</p>
        </div>
        <div class="flex flex-row text-sm font-medium text-gray-400">
          <p>Hemos enviado un código a su correo electrónico <b>{{ storeAuth.data.user?.email }}</b> </p>
        </div>
      </div>

      <div>
        <section class="mb-8 flex justify-center">
          <InputsOpt v-model="currentCode" :isDisabled="false" :codeLength="6" />
        </section>

        <div class="flex flex-col space-y-5">
          <div>
            <button
            :disabled="storeAuth.isLoading"
            @click="verifyCode"
              class="mx-auto flex w-5/6 justify-center rounded-xl bg-indigo-600 p-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Verificar cuenta
            </button>
          </div>

          <div class="flex flex-row items-center justify-center space-x-1 text-center text-sm font-medium text-gray-500">
            <p v-text="'No ha recibido el código?'" />
            <!-- <p>Didn't recieve code?</p> -->
            <p @click="resendCode" class="flex cursor-pointer flex-row items-center text-blue-600"  rel="noopener noreferrer">Reenviar</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
