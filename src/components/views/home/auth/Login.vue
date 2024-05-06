<script setup>
import Btn from '@/components/common/Btn.vue'
import Modal from '@/components/common/Modal.vue'
import TextFields from '@/components/common/TextFields.vue'
import VerificationCode from '@/components/views/home/auth/Verification.vue'
import useNotifications from '@/composables/useNotifications'
import _storeAuth from '@/stores/auth'
import _storeUser from '@/stores/user'
import useVuelidate from '@vuelidate/core'
import { email, required } from '@vuelidate/validators'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const emit = defineEmits(['close'])

const { t } = useI18n()
const { pushNotification } = useNotifications()
const storeAuth = _storeAuth()
const storeUser = _storeUser()
const emailHasError = ref(null)
const passwordHasError = ref(null)
const showVerification = ref(false)
const dataForm = ref({
  email: '',
  password: '',
})

const handlerValidate = useVuelidate(
  {
    email: {
      required,
      email,
    },

    password: {
      required,
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

const setPasswordErrors = computed(() => {
  const validator = handlerValidate.value?.['password']?.$errors?.[0]?.$validator
  if (validator == 'required') return t('VALIDATIONS.REQUIRED')
  else if (passwordHasError.value) return ' '

  return undefined
})

const sendForm = async () => {
  const _validate = await handlerValidate.value.$validate()
  if (!_validate) return

  await storeAuth.login(dataForm.value)

  if (storeAuth.isError) {
    emailHasError.value = true
    passwordHasError.value = true
    pushNotification({
      id: '',
      title: 'El email o la contrasena son incorrectos',
      type: 'error',
    })
  }

  if (storeAuth.isReady) {
    pushNotification({
      id: '',
      title: 'Iniciaste Sesion correctamente',
      type: 'success',
    })
    await storeUser.getUser()
    emit('close')
    window.location.reload()
  }

  if (storeAuth.isEmailVerifyNeeded) {
    storeAuth.setEmailLoginVerification(dataForm.value.email)
    showVerification.value = true
    pushNotification({
      id: '',
      title: 'Debes verificar tu email',
      type: 'error',
    })
  
  }
}
watch(
  () => dataForm.value.email,
  (newValue, oldValue) => {
    if (newValue != oldValue) {
      emailHasError.value = null
      passwordHasError.value = null
    }
  }
)
watch(
  () => dataForm.value.password,
  (newValue, oldValue) => {
    if (newValue != oldValue) {
      passwordHasError.value = null
      emailHasError.value = null
    }
  }
)

</script>
<template>
  <Modal size="w-[675px]" @close="$emit('close')">

    <VerificationCode v-if="showVerification" :isLogin="true" @close="showVerification = false"/>

    <div v-else class="flex h-[599px] min-h-full flex-col justify-center rounded-xl bg-white px-6 py-6 md:py-12 lg:px-16">
      <div class="text-center sm:mx-auto sm:w-full sm:max-w-sm">
        <img class="mx-auto h-10 w-auto mb-6" src="@/assets/images/logo.png" alt="Logo roca" />
        <h2 class="mb-4 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900" v-text="'Inicia Sesion'"></h2>
      </div>

      <form class="px-6" @submit.prevent="sendForm">
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

        <TextFields
          id="pass"
          class="col-span-2 md:col-span-1"
          v-model="dataForm.password"
          isRequired
          :errorMessage="setPasswordErrors"
          name="name"
          type="password"
          placeholder="********"
          :label="t('FORM.PASSWORD')"
        />
        <router-link to="/reset-password" @click="$emit('close')"  class="block text-end text-sm font-semibold leading-6 text-indigo-600 hover:text-indigo-500  " >
        ¿Has olvidado tu contraseña?
      </router-link>

        <div class="col-span-2 mt-6">
          <Btn :isLoading="storeAuth.isLoading" :isDisabled="storeAuth.isLoading" text="Iniciar Sesion" isFull />
        </div>
      </form>

  
      <p class="mt-6 text-center text-sm text-gray-500 md:mt-10" @click="$emit('register')">
        Aun no tienes cuenta?<a href="#" class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"> Registrate</a>
      </p>
    </div>
  </Modal>
</template>
