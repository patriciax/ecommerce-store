<script setup lang="ts">
import Billing from '@/components/views/checkout/Billing.vue'
import Cart from '@/components/views/checkout/Cart.vue'
import Resume from '@/components/views/checkout/Resume.vue'
import CartStore from '@/stores/cart/cart'
import { CheckIcon } from '@heroicons/vue/24/outline'
import { onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const page = ref(1)
const cartStore = CartStore()

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
})
</script>
<template>
  <section class="mx-auto mt-32 max-w-4xl">
    <div class="mb-10 after:mt-4 after:block after:h-1 after:w-full after:rounded-lg after:bg-gray-200">
      <ol class="grid grid-cols-3 text-sm font-medium text-gray-500">
        <li class="relative flex justify-start text-gray-800">
          <span class="absolute -bottom-[1.75rem] start-0 rounded-full bg-gray-800 text-white">
            <CheckIcon class="w-5 p-1" />
          </span>

          <span class="hidden sm:block"> Carro de compras </span>
        </li>

        <li class="relative flex justify-center text-gray-800">
          <span class="absolute -bottom-[1.75rem] left-1/2 -translate-x-1/2 rounded-full bg-gray-800 text-white">
            <CheckIcon class="w-5 p-1" />
          </span>

          <span class="hidden sm:block"> Pago </span>
        </li>

        <li class="relative flex justify-end">
          <span class="absolute -bottom-[1.75rem] end-0 rounded-full bg-gray-600 text-white">
            <CheckIcon class="w-5 p-1" />
          </span>

          <span class="hidden sm:block"> Productos y envío </span>
        </li>
      </ol>
    </div>

    <section class="min-h-[360px]">
      <div v-if="page == 1">
        <Cart @nextStep="changePages" />
      </div>

      <div v-if="page == 2">
        <Billing @nextStep="changePages" />
      </div>

      <div v-if="page == 3">
        <Resume />
      </div>
    </section>
  </section>
</template>
