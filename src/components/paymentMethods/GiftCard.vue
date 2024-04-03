<script lang="ts" setup>

import TextFields from '@/components/common/TextFields.vue';
import Document from '@/components/common/Document.vue';
import Btn from '@/components/common/Btn.vue'

import { ref } from 'vue'
import { showNotification } from '@/composables/useNotification';
import { _submitPay } from '@/api/repositories/banesco.repository';

const props = defineProps({
    cart: {
        type: Array
    },
    card:{
        type: Object
    },
    isCard: {
        type: Boolean,
        default: false
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
    },
    endpoint:{
        type: String,
        default: 'checkout'
    }
})

const cardNumber = ref('')
const cvc = ref('')
const date: any = ref('')
const email = ref('')

const submitPay = async () => {
    
    try{

        let data = {}
        if(props.isCard){
            data = {
                paymentMethod: 'giftCard',
                carts:props.cart,
                name: props.name,
                email: props.email,
                phone: props.phone,
                card: props.card
            }
        }else{
            data = {
                paymentMethod: 'giftCard',
                carts:props.cart,
                name: props.name,
                email: props.email,
                phone: props.phone,
                carrier: props.carrier
            }
        }
        
        await _submitPay(data, props.endpoint)
    }catch(err){
        showNotification("Algo ha ido mal", 'error')
    }
}

</script>

<template>
    <div>

        <form class="flex flex-col" @submit.prevent="submitPay">

            <TextFields v-model="email" :label="$t('FORM.EMAIL')" />

            <div>
                <Document v-model="cardNumber" :label="$t('PAYMENTS.CARD_NUMBER')" :minLength="15" :maxLength="16" />
            </div>
            <div>
                <Document v-model="cvc" :label="$t('PAYMENTS.CVC')" :maxLength="3"/>
            </div>

            <div class="col-span-2 mt-3">
                <Btn text="Pagar" isFull/>
            </div>

        </form>

    </div>
</template>