<script setup lang="ts">
import Billing from '@/components/views/checkout/Billing.vue'
import Cart from '@/components/views/checkout/Cart.vue'
import Resume from '@/components/views/checkout/Resume.vue'
import CartStore from '@/stores/cart/cart'
import CountryStore from '@/stores/country'
import _storePagoMovil from '@/stores/pagoMovil'
import _storeProduct from '@/stores/product'
import _storeZelle from '@/stores/zelle'
import { CheckIcon } from '@heroicons/vue/24/outline'
import { onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const page = ref(1)
const cartStore = CartStore()
const pagoMovilStore = _storePagoMovil()
const zelleStore = _storeZelle()
const productStore = _storeProduct()
const countryStore = CountryStore()

const changePages = () => {
  page.value >= 1 && page.value < 4 ? (page.value += 1) : ''
}

watch(
  () => page.value,
  (newValue, oldValue) => {
    if (newValue != oldValue) {
      localStorage.setItem('step', newValue.toString())
    }
  }
)

onMounted(async () => {
  if (cartStore.cart.length) {
    if (localStorage.getItem('step')) {
      page.value = Number(localStorage.getItem('step'))
    } else {
      localStorage.setItem('step', '1')
    }
  }

  if (countryStore.country === 'Venezuela') {
    await productStore.getPrice()
    await pagoMovilStore.getPagoMovil()
  }

  await zelleStore.getZelle()
})
</script>
<template>
  <section class="mx-auto mt-16 lg:mt-32 max-w-4xl px-6 lg:px-0">
    <div class="mb-10 after:mt-4 after:block after:h-1 after:w-full after:rounded-lg after:bg-gray-200">
      <ol class="grid grid-cols-3 text-xs lg:text-sm font-medium text-gray-500">
        <li class="relative flex justify-start text-gray-800">
          <span class="absolute -bottom-[1.75rem] start-0 rounded-full bg-gray-800 text-white">
            <CheckIcon class="w-5 p-1" />
          </span>

          <span class=""> {{ $t('STEP.SHOPPING_CART') }}</span>
        </li>

        <li class="relative flex justify-center text-gray-800">
          <span class="absolute -bottom-[1.75rem] left-1/2 -translate-x-1/2 rounded-full bg-gray-800 text-white">
            <CheckIcon class="w-5 p-1" />
          </span>

          <span class="">  {{ $t('STEP.PAYMENT') }} </span>
        </li>

        <li class="relative flex justify-end">
          <span class="absolute -bottom-[1.75rem] end-0 rounded-full bg-gray-600 text-white">
            <CheckIcon class="w-5 p-1" />
          </span>

          <span class="">  {{ $t('STEP.PRODUCT_AND_SHIPPING') }}</span>
        </li>
      </ol>
    </div>

    <section class="min-h-[360px]">
      <div v-if="page == 1">
        <Cart @nextStep="changePages" />
      </div>

      <div v-if="page == 2">
        <Billing @nextStep="changePages" @prevStep="page = 1" />
      </div>

      <div v-if="page == 3">
        <Resume />
      </div>
    </section>
  </section>
</template>
