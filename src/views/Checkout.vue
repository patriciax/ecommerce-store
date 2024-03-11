<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { CheckIcon } from '@heroicons/vue/24/outline'
import CartList from '../components/common/CartList.vue'
import CartStore from '@/stores/cart/cart'
import _storeUser from '@/stores/user'
import useNotifications from '@/composables/useNotifications'

const page = ref(1)
const cartStore = CartStore()
const storeUser = _storeUser()
const { pushNotification } = useNotifications()
const isDisabledStock = ref(false)
const total = computed(() => {
  let total = 0
  cartStore.cart.forEach((item) => {
    total += item.price * item.quantity
  })
  return total.toFixed(2)
})

const removeItem = async (item) => {
  if (storeUser.currentUser) {
    cartStore.removeCart(item.productId)

    if (cartStore.isError) {
      pushNotification({
        id: '',
        title: 'Error al eliminar el producto. ',
        type: 'error',
      })
    }
    if (cartStore.isReady) {
      pushNotification({
        id: '',
        title: 'Producto eliminado del carrito. ',
        type: 'success',
      })
    }
  } else {
    cartStore.removeCartStorage(item._id)
  }
}

const lessItem = (index) => {
  const cart = cartStore.cart
  if (cart[index].quantity - 1 > 0) {
    cart[index].quantity--
  }
}
const moreItem = (index) => {
  const cart = cartStore.cart

  if (cart[index].quantity + 1 <= cart[index].stock) {
    cart[index].quantity++
  }
  if (storeUser.currentUser ) {
    if( cart[index].product?.stock)isDisabledStock.value = true
    cartStore.update({
      productId: cart[index].product._id,
      quantity: cart[index].quantity,
    })
  }
}

onMounted(async () => {
  if (storeUser.currentUser) {
    await cartStore.addToMassiveCart({ cartItems: cartStore.cart })
  }
  if (!storeUser.currentUser) {
    await cartStore.productInfoGuest({ cartProducts: cartStore.cart })
  }
})
</script>
<template>
  <section class="mx-auto mt-32 max-w-3xl">
    <div class="mb-14 after:mt-4 after:block after:h-1 after:w-full after:rounded-lg after:bg-gray-200">
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

    <div class="min-h-[360px]">
      <div v-if="page == 1">
        <p class="text-xl font-bold" v-text="'Carrtito de compra'" />
        <p class="mb-6 font-light" v-text="`Tienes ${cartStore.cart.length} productos en el carrito`" />
        <template v-if="cartStore.isLoading">
          <div
            v-for="(item, index) in 3"
            :key="index"
            class="mb-6 flex h-24 animate-pulse items-center gap-4 rounded-2xl bg-gray-200 px-6 text-lg shadow-[0px_2px_5px_#00000038]"
          />
        </template>
        <template v-else>
          <CartList
            v-for="(item, index) in cartStore.cart"
            :key="index"
            :isLast="index === cartStore.cart.length - 1"
            :item="item"
            :index="index"
            :isLoading="cartStore.isLoading"
            @removeItem="removeItem(item)"
            @lessItem="lessItem(index)"
            @moreItem="moreItem(index)"
          />
        </template>

        <p class="rounded-lg bg-gray-100 p-3 text-center text-xl font-bold" v-if="!cartStore.cart.length">Empty cart</p>
      </div>

      <div v-if="page == 2">TEST 2</div>

      <div v-if="page == 3">TEST 3</div>
    </div>

    <div class="flex justify-center gap-4">
      <button v-if="page > 1" class="" type="submit" @click="page <= 4 && page > 1 ? (page -= 1) : ''">Volver</button>
      <button
        :class="{ 'opacity-50': !cartStore.cart.length || cartStore.isLoading }"
        :disabled="!cartStore.cart.length || cartStore.isLoading"
        class="group flex items-center justify-center gap-1 rounded-xl bg-gray-800 p-8 py-3 text-sm font-bold leading-6 text-white shadow-sm hover:bg-opacity-90"
        type="submit"
        @click="page >= 1 && page < 4 ? (page += 1) : ''"
      >
        Continuar
      </button>
    </div>
  </section>
</template>
