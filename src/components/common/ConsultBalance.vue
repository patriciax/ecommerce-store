<script setup>
import Btn from '@/components/common/Btn.vue'
import Document from '@/components/common/Document.vue'
import Modal from '@/components/common/Modal.vue'
import useNotifications from '@/composables/useNotifications'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const emit = defineEmits(['close'])

const { t } = useI18n()
const { pushNotification } = useNotifications()

const dataForm = ref({
 cardNumber: '',
  cvc: '',
})

const handlerValidate = useVuelidate(
  {
    cardNumber: {
      required,
    },

    cvc: {
      required,
    },
  },
  dataForm
)


const sendForm = async () => {
    
  const _validate = await handlerValidate.value.$validate()
  if (!_validate) return


  if (isError) {
    pushNotification({
      id: '',
      title: 'La tarjeta no se encuentra',
      type: 'error',
    })
  }

  if (isReady) {
    pushNotification({
      id: '',
      title: 'Consulta enviada al correo',
      type: 'success',
    })
    emit('close')
  }

}

</script>
<template>
  <Modal size="w-[500px]" @close="$emit('close')">
    <div class="flex h-[599px] min-h-full flex-col justify-center rounded-xl bg-white px-6 py-6 md:py-12 lg:px-16">
      <div class="text-center sm:mx-auto sm:w-full sm:max-w-sm">
        <p v-text="' LOGO'" class="hidden md:block" />
        <h2 class="mb-4 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900" v-text="'Consultar saldo'"></h2>
      </div>

      <form class="px-6" @submit.prevent="sendForm">
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
              handlerValidate?.['cvc']?.$errors?.length > 0
                ? $t('VALIDATIONS.' + handlerValidate?.['cvc']?.$errors?.[0]?.$validator?.toUpperCase())
                : undefined
            "
            v-model="dataForm.cvc"
            :label="$t('PAYMENTS.CVC')"
            :maxLength="4"
          />
        </div>

        <div class="col-span-2 mt-6">
          <Btn text="Consultar" isFull />
        </div>
      </form>
    </div>
  </Modal>
</template>
