<script setup>
import TextFields from '@/components/common/TextFields.vue'
import useNotifications from '@/composables/useNotifications'
import router from '@/router'
import RestorePassword from '@/stores/resetPassword.js'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  email: {
    type: String,
  },
  passwordOtp:String
})

const { pushNotification } = useNotifications()
const { t } = useI18n()
const restorePassStore = RestorePassword()
const emailHasError = ref(null)
const showVerification = ref(false)
const passwordHasError = ref(null)
const login = ref(false)
const dataForm = ref({
  email: props.email,
  password: '',
  passwordOtp: props.passwordOtp,
  passwordConfirm: '',
})

const handlerValidate = useVuelidate(
  {
    password: {
      required,
    },
    passwordConfirm: {
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
  const validator = handlerValidate.value?.['passwordConfirm']?.$errors?.[0]?.$validator
  if (validator == 'required') return t('VALIDATIONS.REQUIRED')
  else if (passwordHasError.value) return t('RESET_PASSWORD.PASSWORD_NOT_MATCH')

  return undefined
})

const sendForm = async () => {
  const _validate = await handlerValidate.value.$validate()
  if (!_validate) return

  if (dataForm.value.password !== dataForm.value.passwordConfirm) {
    passwordHasError.value = true
    pushNotification({
      id: '',
      title: t('COMMON.PASSWORD_NOT_SAME'),
      type: 'error',
    })
    return
  }

  await restorePassStore.updatePass(dataForm.value)

  if (restorePassStore.isError) {
    pushNotification({
      id: '',
      title: t('COMMON.ERROR'),
      type: 'error',
    })
    return
  }
  if (restorePassStore.isReady) {
    restorePassStore.setData(true)
    pushNotification({
      id: '',
      title: t('RESET_PASSWORD.SUCCESS'),
      type: 'success',
    })
    router.push({ name: 'home' })
  }
}
</script>
<template>
  <section class="bg-gray-50 dark:bg-gray-900">
    <div class="mx-auto flex flex-col items-center justify-center px-6 py-8 lg:py-0">
      <div class="mb-4">
        <form class="mt-4 space-y-4 md:space-y-5 lg:mt-5" @submit.prevent="sendForm">
          <h2 class="mb-1 text-center text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl">
           {{ t('RESET_PASSWORD.TITLE') }}
          </h2>
          <div>
            <TextFields
              id="email"
              isDisabled
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
              class="col-span-2 mb-2 md:col-span-1"
              v-model="dataForm.password"
              isRequired
              :errorMessage="
                handlerValidate?.['password']?.$errors?.length > 0
                  ? $t('VALIDATIONS.' + handlerValidate?.['password']?.$errors?.[0]?.$validator?.toUpperCase())
                  : undefined
              "
              name="name"
              type="password"
              placeholder="********"
              :label="t('FORM.PASSWORD')"
            />
            <TextFields
              class="col-span-2 md:col-span-1"
              id="pass"
              type="password"
              v-model="dataForm.passwordConfirm"
              isRequired
              :errorMessage="setPasswordErrors || passwordHasError"
              name="name"
              placeholder="********"
              :label="t('FORM.PASSWORD_CONFIRM')"
            />
          </div>

          <button
            type="submit"
            class="mx-auto flex w-5/6 justify-center rounded-xl bg-gray-900 p-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {{ t('RESET_PASSWORD.TITLE') }}
          </button>
        </form>
      </div>
    </div>
  </section>

</template>
