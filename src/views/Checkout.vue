<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { CheckIcon } from '@heroicons/vue/24/outline'
import CartStore from '@/stores/cart/cart'
import _storeUser from '@/stores/user'
import useNotifications from '@/composables/useNotifications'
import { useI18n } from 'vue-i18n'
import Cart from '@/components/views/checkout/Cart.vue'
import Billing from '@/components/views/checkout/Billing.vue'

const { t } = useI18n()

const page = ref(1)
const cartStore = CartStore()
const storeUser = _storeUser()
const { pushNotification } = useNotifications()
const total = computed(() => {
  let total = 0
  cartStore.cart.forEach((item) => {
    total += item.price * item.quantity
  })
  return total.toFixed(2)
})

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
  if (localStorage.getItem('step')) {
    page.value = Number(localStorage.getItem('step'))
  } else {
    localStorage.setItem('step', '1')
  }
})
</script>
<template>
  <section class="mx-auto mt-32 max-w-4xl">
    <div class="mb-10 after:mt-4 after:block after:h-1 after:w-full after:rounded-lg after:bg-gray-200">
      <ol class="grid grid-cols-3 text-sm font-medium text-gray-500">
        <li @click="page = 1" class="relative flex justify-start text-gray-800">
          <span class="absolute -bottom-[1.75rem] start-0 rounded-full bg-gray-800 text-white">
            <CheckIcon class="w-5 p-1" />
          </span>

          <span class="hidden sm:block"> Carro de compras </span>
        </li>

        <li @click="page = 2" class="relative flex justify-center text-gray-800">
          <span class="absolute -bottom-[1.75rem] left-1/2 -translate-x-1/2 rounded-full bg-gray-800 text-white">
            <CheckIcon class="w-5 p-1" />
          </span>

          <span class="hidden sm:block"> Pago </span>
        </li>

        <li @click="page = 3" class="relative flex justify-end">
          <span class="absolute -bottom-[1.75rem] end-0 rounded-full bg-gray-600 text-white">
            <CheckIcon class="w-5 p-1" />
          </span>

          <span class="hidden sm:block"> Resumen </span>
        </li>
      </ol>
    </div>

    <section class="min-h-[360px]">
      <div v-if="page == 1">
        <Cart />
      </div>

      <div v-if="page == 2">
        <Billing />
      </div>

      <div v-if="page == 3">TEST 3</div>
    </section>

    <div class="flex justify-center gap-4">
      <button
        v-if="page > 1"
        class="mt-10 rounded-lg border border-gray-300 p-8 py-3 text-sm font-bold leading-6"
        type="submit"
        @click="page <= 4 && page > 1 ? (page -= 1) : ''"
      >
        Volver
      </button>
      <button
        v-if="cartStore.cart.length"
        :class="{ hidden: page == 2 }"
        :disabled="!cartStore.cart.length || cartStore.isLoading"
        class="group flex items-center justify-center gap-1 rounded-xl bg-gray-800 p-8 py-3 text-sm font-bold leading-6 text-white shadow-sm hover:bg-opacity-90"
        type="submit"
        @click="changePages"
      >
        Continuar
      </button>
    </div>
  </section>
</template>
