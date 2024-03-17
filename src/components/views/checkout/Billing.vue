<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { CheckIcon } from '@heroicons/vue/24/outline'
import CartStore from '@/stores/cart/cart'
import _storeUser from '@/stores/user'
import useNotifications from '@/composables/useNotifications'
import TextFields from '@/components/common/TextFields.vue'
import InputPhoneNumber from '@/components/common/InputPhoneNumber.vue'
import Btn from '@/components/common/Btn.vue'
import useVuelidate from '@vuelidate/core'
import { email, required } from '@vuelidate/validators'
import { useI18n } from 'vue-i18n'
import Cart from '@/components/views/checkout/Cart.vue'

const { t } = useI18n()

const page = ref(1)
const cartStore = CartStore()
const storeUser = _storeUser()
const { pushNotification } = useNotifications()
const isDisabledStock = ref(false)
const emailHasError = ref(null)


const total = computed(() => {
  let total = 0
  cartStore.cart.forEach((item) => {
    total += item.price * item.quantity
  })
  return total.toFixed(2)
})

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



onMounted(async () => {

})
</script>
<template>
  <p class="text-xl font-bold" v-text="'Datos de facturación'" />
  <p class="mb-6 font-light" v-text="`Tienes ${cartStore.cart.length} productos en el carrito`" />

  <section>
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
        <label for="" class="text-sm font-bold">{{ $t('FORM.PHONE') }}<span class="text-red-600" v-text="'*'" /></label>
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

      <div class="col-span-2 mt-6">
        <!-- <Btn :text="t('COMMON.CREATE_ACCOUNT')" isFull /> -->
      </div>
    </form>
  </section>
</template>
