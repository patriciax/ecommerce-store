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
  emit('close')
  // await storeResetPass.verifyCode({ email: props.email, passwordOtp: currentCode.value })
  // if (storeResetPass.isReady) {
  //   pushNotification({
  //     id: '',
  //     title:'Verificacion exitosa',
  //     type: 'success',
  //   })
  //   emit('close')
  // } else {
  //   pushNotification({
  //     id: '',
  //     title: t('COMMON.ERROR'),
  //     type: 'error',
  //   })
  // }
}

// const resendCode = async() => {
//   await storeResetPass.resendCode({ email: storeResetPass.data.user?.email })
//   pushNotification({
//         id: '',
//         title: 'Codigo reenviado',
//         type: 'success',
//       })

// }

// onMounted(() => {
//   if(props.isLogin){
//     resendCode()
//   }
// })
</script>
<template>
  <div class="flex min-h-full flex-col justify-center rounded-2xl bg-white px-4 py-6 md:w-[410px] md:py-12 lg:px-4">
    <div class="mx-auto flex w-full flex-col">
      <div class="mb-8 flex flex-col items-center justify-center space-y-2 text-center">
        <div class="text-2xl font-bold">
          <h2>Verificacion de Email</h2>
        </div>
        <div class="flex flex-row text-sm font-medium text-gray-400">
          <p v-if="storeResetPass?.data">
            Hemos enviado un código a su correo electrónico <b>{{ props.email }}</b>
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
            :class=" storeResetPass.isLoading || !currentCode ? 'bg-gray-300' : 'bg-gray-900'"
              :disabled="storeResetPass.isLoading || !currentCode"
              @click="verifyCode"
              class="mx-auto flex w-5/6 justify-center rounded-xl p-3 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Verificar cuenta
            </button>
          </div>

          <div class="flex flex-row items-center justify-center space-x-1 text-center text-sm font-medium text-gray-500">
            <p v-text="'No ha recibido el código?'" />
            <!-- <p>Didn't recieve code?</p> -->
            <p @click="resendCode" class="flex cursor-pointer flex-row items-center text-blue-600" rel="noopener noreferrer">Reenviar</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
