<script setup>
import Modal from '@/components/common/Modal.vue'
import VerificationCode from '@/components/views/home/auth/Verification.vue'
import useNotifications from '@/composables/useNotifications'
import _storeAuth from '@/stores/auth'
import useVuelidate from '@vuelidate/core'
import { email, required } from '@vuelidate/validators'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import TextFields from '@/components/common/TextFields.vue'
import InputPhoneNumber from '@/components/common/InputPhoneNumber.vue'
import Btn from '@/components/common/Btn.vue'

const emit = defineEmits(['close'])

const { t } = useI18n()
const { pushNotification } = useNotifications()
const storeAuth = _storeAuth()
const emailHasError = ref(null)
const passwordHasError = ref(null)
const showVerification = ref(false)

const dataForm = ref({
  name: '',
  lastname: '',
  email: '',
  phone: '',
  address: '',
  password: '',
  passwordConfirm: '',
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
    lastname: {
      required,
    },
    phone: {
      required,
    },
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
  else if (emailHasError.value) return t('VALIDATIONS.EMAIL_IN_USE')

  return undefined
})

const setPasswordErrors = computed(() => {
  const validator = handlerValidate.value?.['passwordConfirm']?.$errors?.[0]?.$validator
  if (validator == 'required') return t('VALIDATIONS.REQUIRED')
  else if (passwordHasError.value) return 'Las contraseñas no coinciden'

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

  await storeAuth.verifyEmail({ email: dataForm.value.email })

  if (storeAuth.isError) {
    emailHasError.value = true
    return
  }

  if (storeAuth.isReady) {
    await storeAuth.register(dataForm.value)

    if (storeAuth.isError) {
      pushNotification({
        id: '',
        title: t('COMMON.ERROR_REGISTER'),
        type: 'error',
      })
    }
    if (storeAuth.isReady) {
      showVerification.value = true
    }
  }
}
</script>
<template>
  <Modal size="max-w-2xl" @close="$emit('close')">
    <VerificationCode v-if="showVerification" @close="$emit('closeRegister'); showVerification = false"/>
    <div v-else class="flex min-h-full flex-col justify-center rounded-2xl bg-white px-6 py-6 md:py-12 lg:px-16">
      <div class="text-center sm:mx-auto sm:w-full sm:max-w-sm">
        <p v-text="' LOGO'" class="hidden md:block" />
        <h2 class="mb-4 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900" v-text="t('COMMON.CREATE_AN_ACCOUNT')"></h2>
      </div>

      <form class="grid gap-x-6 gap-y-3 md:grid-cols-2" @submit.prevent="sendForm">
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
          class="col-span-2 md:col-span-1"
        />
        <TextFields
          class="col-span-2 md:col-span-1"
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
          class="col-span-2 md:col-span-1"
          v-model="dataForm.email"
          isRequired
          :errorMessage="setEmailErrors || emailHasError"
          name="name"
          placeholder="example@gmail.com"
          :label="t('FORM.EMAIL')"
        />

        <section class="col-span-2 md:col-span-1">
          <label for="" class="text-sm font-bold">{{ $t('FORM.PHONE') }}<span class="text-red-600" v-text="'*'"/></label>
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

        <TextFields
          id="pass"
          class="col-span-2 md:col-span-1"
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
        <div class="col-span-2 mt-6">
          <Btn :isLoading="storeAuth.isLoading" :isDisabled="storeAuth.isLoading" :text="t('COMMON.CREATE_ACCOUNT')" isFull />

        </div>
      </form>

      <p class="mt-6 text-center text-sm text-gray-500 md:mt-10" @click="$emit('login')">
        Tienes una cuenta?<a href="#" class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"> Inicia sesion</a>
      </p>
    </div>
  </Modal>
</template>
