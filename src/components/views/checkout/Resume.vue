<script setup>
import CartStore from '@/stores/cart/cart'
import CountryStore from '@/stores/country'
import StorePaymentMethods from '@/stores/paymentMethods'
import _storeProduct from '@/stores/product'
import { decimalNumberFormat } from '@/utils/numberFormat'
import { justTax, taxCalculations } from '@/utils/taxCalculations'
import { computed, onUnmounted } from 'vue'

const storePaymentMethods = StorePaymentMethods()
const productStore = _storeProduct()
const countryStore = CountryStore()
const cartStore = CartStore()
const total = computed(() => {
  let total = 0
  storePaymentMethods?._data?.cart?.forEach((item) => {
    total += item.priceDiscount || item.price * item.quantity
  })
  return total
})



onUnmounted(() => {
  sessionStorage.setItem('cart', [])
  cartStore.reset()
})

let date = new Date(storePaymentMethods?._data?.invoice?.created)
let day = date.getDate()
let month = date.getMonth() + 1
let year = date.getFullYear()
const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
let dateFormatted = `${day} de ${meses[month - 1]} de ${year}`
</script>
<template>
  <section>
    <p
      class="mb-10 text-center text-2xl font-bold"
      v-text="$t('RESUME.FINAL_DETAILS_ORDER') +' #' + storePaymentMethods?._data?.invoice?.transactionOrder"
    />
    <div class="text-md mb-6 items-center gap-1 border-b border-gray-900 pb-6 text-base font-bold text-gray-900">
      <p><strong>{{ $t('RESUME.ORDER_PLACED') }}:</strong> {{ dateFormatted }}</p>
      <p><strong>{{ $t('RESUME.ORDER_NUMBER_ROCK') }}:</strong> {{ storePaymentMethods?._data?.invoice?.transactionOrder }}</p>
      <p><strong>{{ $t('RESUME.ORDER_TOTAL') }}:</strong> ${{ total }}</p>
    </div>

    <section>
      <div class="mb-6 flex justify-between">
        <p class="text-lg font-bold" v-text="$t('RESUME.PRODUCTS_PURCHASED')" />
        <p class="text-lg font-bold" v-text="$t('RESUME.PRICE')" />
      </div>

      <div v-for="(item, index) in storePaymentMethods?._data?.cart" :key="index">
        <li
          class="mb-6 flex gap-4 bg-white px-0 py-0 text-lg"
          :class="{ 'border-b pb-6': index < storePaymentMethods?._data?.cart?.length - 1 }"
        >
          <img :src="item.mainImage || item.product?.mainImage" alt="" class="h-24 w-24 rounded-xl rounded-br-xl object-cover" />
          <section>
            <h3 class="max-w-[500px] text-sm lg:text-lg text-gray-900">
              {{ locale === 'en_US' ? item.nameEnglish || item.product?.nameEnglish : item.name }}
            </h3>

            <div class="mt-2 grid md:grid-cols-3 gap-0.5 gap-y-0">
              <p v-if="item?.color?.name" class="flex text-sm lg:text-base text-gray-800">
                <strong>{{ $t('COLOR') }}:</strong> {{ item?.color?.name }}
              </p>
              <p v-if="item?.size?.name" class="flex text-sm lg:text-base text-gray-800">
                <strong>{{ $t('SIZE') }}:</strong> {{ item?.size?.name }}
              </p>
              <p v-if="item.quantity" class="flex text-sm lg:text-base text-gray-800">
                <strong>{{ $t('COMMON.QUANTITY') }}: </strong>{{ item.quantity }}
              </p>
            </div>
          </section>
          <div class="flex flex-1 justify-end">
            <p class="inline font-bold">${{ item.priceDiscount || item.price }}</p>
          </div>
        </li>
      </div>
    </section>

    <section class="border-t border-gray-900 pb-6">
      <p class="mb-10 mt-6 text-center text-2xl font-bold" v-text="$t('RESUME.PAYMENT_INFORMATION')" />

      <section class="grid lg:grid-cols-2 gap-10 lg:gap-32">
        <section>
          <div class="mb-4">
            <p class="text-lg font-bold" v-text="$t('RESUME.METHOD_OF_PAYMENT')+':'" />
            <p class="text-lg capitalize" v-text="storePaymentMethods?.paymentMethod" />
          </div>

          <div>
            <p class="text-lg font-bold" v-text="$t('RESUME.BILLING_ADDRESS')+':'" />
            <p class="capitalize" v-text="storePaymentMethods?._data?.invoice?.carrier?.address" />
          </div>

          <div v-if="storePaymentMethods?._data?.invoice?.shippingTracking">
            <p class="text-lg font-bold" v-text="$t('RESUME.TRACKING_NUMBER')+':'" />
            <p class="capitalize" v-text="storePaymentMethods?._data?.invoice?.shippingTracking" />
          </div>
        </section>
        <div>
          <div class="mb-2 flex justify-between">
            <p class="text-lg" v-text="$t('RESUME.PRODUCTS')+':'" />
            <p class="text-lg capitalize" v-text="'$' + decimalNumberFormat(total)" />
          </div>
          <div class="mb-2 flex justify-between">
            <p class="text-lg" v-text="$t('RESUME.SHIPPING')+':'" />
            <p class="text-lg capitalize" v-text="'$' + decimalNumberFormat(cartStore.shippingCost)" />
          </div>
          <div class="mb-6 flex justify-between">
            <p class="text-lg" v-text="$t('RESUME.IVA')+':'" />
            <p class="text-lg capitalize" v-text="'$'+decimalNumberFormat(justTax(cartStore.total))" />
          </div>
          <div class="mb-4 flex justify-between font-bold">
            <p class="text-lg font-bold" v-text="$t('RESUME.TOTAL_INCLUDING_TAX')+':'" />
            <p
              class="text-lg font-bold capitalize"
              v-text="
                '$' + decimalNumberFormat(taxCalculations(cartStore.total, countryStore.country === 'Venezuela' ? 'national' : 'international'))
              "
            />
          </div>

          <div class="mb-4 flex justify-between font-bold" v-if="countryStore.country == 'Venezuela'">
            <p class="text-lg font-bold" v-text="'Total en Bolivares:'" />
            <div>
              <div class="text-lg font-bold capitalize text-right">Bs.{{ decimalNumberFormat(productStore.price * cartStore.total) }}</div>
              <div class="flex"><p class=" font-bold mr-2">+IVA </p> Bs.{{ decimalNumberFormat(taxCalculations(productStore.price * cartStore.total)) }}</div>
            </div>
          </div>

    
        </div>
      </section>
    </section>
  </section>
</template>
