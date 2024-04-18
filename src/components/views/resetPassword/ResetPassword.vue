<script setup>
import TextFields from '@/components/common/TextFields.vue'
import useNotifications from '@/composables/useNotifications'
import RestorePassword from '@/stores/resetPassword.js'
import useVuelidate from '@vuelidate/core'
import { email, required } from '@vuelidate/validators'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import ChangePass from './ChangePass.vue'
import Verification from './Verification.vue'

const { pushNotification } = useNotifications()
const { t } = useI18n()
const restorePassStore = RestorePassword()
const emailHasError = ref(null)
const showVerification = ref(false)
const changePassword = ref(false)
const dataForm = ref({
  email: '',
})
const handlerValidate = useVuelidate(
  {
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

const sendForm = async () => {
  const _validate = await handlerValidate.value.$validate()
  if (!_validate) return
  await restorePassStore.restorePass({ email: dataForm.value.email })

  if (restorePassStore.isError) {
    pushNotification({
      id: '',
      title: 'El email no existe',
      type: 'error',
    })
    return
  }
  if (restorePassStore.isReady) {
    pushNotification({
      id: '',
      title: 'Verificacion enviada a tu correo electronico',
      type: 'success',
    })
    showVerification.value = true
  }
}
</script>
<template>
  <section class="bg-gray-50 dark:bg-gray-900">
    <div class="mx-auto mt-32 flex flex-col items-center justify-center px-6 py-8 md:h-[60vh] lg:py-0">
      <div class="w-full rounded-lg bg-white p-6 shadow dark:border dark:border-gray-700 dark:bg-gray-800 sm:max-w-md sm:p-8 md:mt-0">
        <form v-if="!showVerification && !changePassword" class="mt-4 space-y-4 md:space-y-5 lg:mt-5" @submit.prevent="sendForm">
          <h2 class="mb-1 text-center text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl">
            Cambiar contraseña
          </h2>
          <div>
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
          </div>

          <button
            type="submit"
            class="mx-auto flex w-5/6 justify-center rounded-xl bg-gray-900 p-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Reset passwod
          </button>
        </form>
        <Verification v-if="showVerification" :email="dataForm.email" @close="(changePassword = true), (showVerification = false)" />
        <ChangePass v-if="changePassword" :email="dataForm.email" />
      </div>
    </div>
  </section>
</template>
