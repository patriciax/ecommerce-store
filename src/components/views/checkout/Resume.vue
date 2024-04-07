<script setup>
import Btn from '@/components/common/Btn.vue'
import StorePaymentMethods from '@/stores/paymentMethods'
import { ref, computed } from 'vue'
const storePaymentMethods = StorePaymentMethods()
import router from '@/router'

const total = computed(() => {
  let total = 0
  storePaymentMethods?._data?.cart?.forEach((item) => {
    total += item.price * item.quantity
  })
  return total.toFixed(2)
})

const goToHome = () => {
  router.push({ name: 'home' })
}

</script>
<template>
  <section>
    <p class="text-2xl font-bold" v-text="'Resumen del pedido'" />
    <div class="text-md mb-6 flex items-center gap-1 border-b pb-2 text-sm font-bold text-gray-500">
      Orden:
      <p class="mt-0.5 lowercase">{{ storePaymentMethods?._data?.invoice?.transactionOrder }}</p>
    </div>
    <section class="grid grid-cols-2 gap-x-6">
      <section class="">
        <div v-for="(item, index) in storePaymentMethods?._data?.cart" :key="index">
          <li class="mb-6 flex items-center gap-4 rounded-2xl border bg-white px-0 py-0 text-lg">
            <img :src="item.mainImage || item.product?.mainImage" alt="" class="h-24 w-24 rounded-bl-xl rounded-br-xl object-cover" />
            <section>
              <h3 class="max-w-72 text-lg text-gray-900">
                {{ locale === 'en_US' ? item.nameEnglish || item.product?.nameEnglish : item.name }}
              </h3>

              <div class="grid grid-cols-2 gap-0.5 gap-y-0">
                <p class="flex text-sm text-gray-700">{{ $t('COLOR') }}: {{ item?.color?.name }}</p>
                <p class="flex text-sm text-gray-700">{{ $t('SIZE') }}: {{ item?.size?.name }}</p>
                <p class="flex text-sm text-gray-700">{{ $t('COMMON.QUANTITY') }}: {{ item.quantity }}</p>
              </div>
            </section>
            <div class="mt-5 flex flex-1 items-center justify-end">
              <p class="inline pr-4 font-bold">${{ item.priceDiscount || item.price }}</p>
            </div>
          </li>
        </div>
      </section>
      <section class="grid gap-x-4 gap-y-1">
        <section class="grid gap-3 border-b pb-2">
          <div class="flex flex-col text-lg font-bold">
            Dirección de facturación
            <p class="lowercase text-gray-500">{{ storePaymentMethods?._data?.invoice?.carrier?.address }}</p>
          </div>
          <div class="flex flex-col text-lg font-bold">
            Fecha del pedido
            <p class="lowercase text-gray-500">{{ storePaymentMethods?._data?.invoice?.created }}</p>
          </div>

          <div class="flex flex-col text-lg font-bold">
            Número de pedido
            <p class="lowercase text-gray-500">{{ storePaymentMethods?._data?.invoice?.transactionOrder }}</p>
          </div>
        </section>
        <div class="mb-6 flex flex-col text-lg font-bold">
          Total
          <p class="mt-0.rcase text-gray-500">{{ total }}</p>
        </div>
        <Btn isFull color="primary" :text="'Seguir comprando'" @click="goToHome()" />
      </section>
    </section>
  </section>
</template>
