<script lang="ts" setup>
import TextFields from '../common/TextFields.vue'
import Document from '../common/Document.vue'
import DateCard from '../common/DateCard.vue'
import Btn from '../common/Btn.vue'
import { _submitPay } from '@/api/repositories/banesco.repository'
import { ref } from 'vue'
import { showNotification } from '@/composables/useNotification'

const props = defineProps({
    cart: {
        type: Array,
        required: true
    },
    name: {
        type: String
    },
    email: {
        type: String
    },
    phone: {
        type: String
    },
    carrier:{
        type: Object
    }
})

const document = ref('')
const cardHolder = ref('')
const cardNumber = ref('')
const cvc = ref('')
const date: any = ref('')

const updateDate = (value: string) => {
  date.value = value
}

const submitPay = async () => {
    
    try{

        const banescoData = {
            "description": "ERoca",
            "cardHolder": cardHolder.value,
            "cardHolderId": document.value,
            "cardNumber": cardNumber.value,
            "cvc": cvc.value,
            "expirationDate": `${date.value.month < 10 ? `0${date.value.month}` : date.value.month}/${date.value.year}`
        }

        const data = {
            paymentMethod: 'banesco',
            banescoData,
            carts:props.cart,
            name: props.name,
            email: props.email,
            phone: props.phone,
            carrier: props.carrier
        }

        await _submitPay(data)
    }catch(err){
        showNotification("Algo ha ido mal", 'error')
    }
}
</script>

<template>

    <form @submit.prevent="submitPay">
        <div class="grid grid-cols-2 gap-4">
            <div>
                <TextFields v-model="cardHolder" noSpecialCharacters :label="$t('PAYMENTS.CARD_HOLDER')"/>
            </div>
            <div>
                <Document v-model="document" :label="$t('PAYMENTS.CARD_HOLDER_ID')" :minLength="6" :maxLength="8"/>
            </div>
            <div>
                <Document v-model="cardNumber" :label="$t('PAYMENTS.CARD_NUMBER')" :minLength="15" :maxLength="16" />
            </div>
            <div>
                <Document v-model="cvc" :label="$t('PAYMENTS.CVC')" :maxLength="3"/>
            </div>
            <div class="col-span-2">
                <DateCard @changedDate="updateDate" :label="$t('PAYMENTS.EXPIRATION_DATE')" />
            </div>
            <div class="col-span-2">
                <Btn text="Pagar" isFull/>
            </div>
        </div>
    </form>

</template>
