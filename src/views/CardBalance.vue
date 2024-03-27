<script setup>
import TextFields from '@/components/common/TextFields.vue'
import { ref, computed } from 'vue'
import Btn from '@/components/common/Btn.vue'
import Login from '@/components/views/home/auth/Login.vue'
import Register from '@/components/views/home/auth/Register.vue'
import _storeUser from '@/stores/user'
import useVuelidate from '@vuelidate/core'
import { email, required } from '@vuelidate/validators'
import { useI18n } from 'vue-i18n'
import { sendGiftCardBalance } from '@/api/repositories/giftCard.repository'

const storeUser = _storeUser()
const { t } = useI18n()
const login = ref(false)
const register = ref(false)
const emailHasError = ref(null)

const dataForm = ref({
  email: '',
  order: '',
})

const handlerValidate = useVuelidate(
  {
    email: {
      required,
      email,
    },
    order: {
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

  //await sendGiftCardBalance()

}
</script>
<template>
  <section class="min-h-[80vh] px-6 text-center">
    <p class="mb-2 text-2xl font-bold text-gray-900" v-text="'Ver o gestionar tu pedido'" />
    <p
      class="mx-auto mb-10 max-w-xl"
      v-text="
        'Para verificar el estado de tu pedido o iniciar una devolución, ingresa tu número de pedido y dirección de correo electrónico.'
      "
    />

    <section class="mx-auto max-w-xl text-start">
      <TextFields
        v-model="dataForm.order"
        isRequired
        :errorMessage="
          handlerValidate?.['order']?.$errors?.length > 0
            ? $t('VALIDATIONS.' + handlerValidate?.['order']?.$errors?.[0]?.$validator?.toUpperCase())
            : undefined
        "
        name="order"
        class="mb-4"
        placeholder="1234566"
        :label="'Número de tarjeta'"
      />
      <TextFields
        id="email-order"
        v-model="dataForm.email"
        isRequired
        :errorMessage="setEmailErrors || emailHasError"
        name="name"
        class="mb-6"
        placeholder="example@gmail.com"
        :label="$t('FORM.EMAIL')"
      />

      <section class="mb-10">
        <Btn text="Enviar" isFull @click="send" />
      </section>

      <p class="text-center">
        Las devoluciones son gratuitas para los miembros de eRoca
        <span @click="login = true" class="cursor-pointer font-bold text-gray-700 underline hover:text-gray-600">Iniciar sesión</span>
        para comenzar una devolución gratuita.
      </p>
    </section>
  </section>
  <Login v-if="login" @close="login = false" @register="(login = false), (register = true)" />
  <Register v-if="register" @close="register = false" @closeRegister="login = true" @login="(login = true), (register = false)" />
</template>
