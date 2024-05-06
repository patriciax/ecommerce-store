<script setup lang="ts">
import CartList from '@/components/common/CartList.vue'
import useNotifications from '@/composables/useNotifications'
import CartStore from '@/stores/cart/cart'
import _storeUser from '@/stores/user'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const cartStore = CartStore()
const storeUser = _storeUser()
const { pushNotification } = useNotifications()
const isDisabledStock = ref(false)

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
    cartStore.removeCartStorage(item.productId)
  }
}

const lessItem = (index) => {
  isDisabledStock.value = false
  const cart = cartStore.cart
  if (cart[index].quantity - 1 > 0) {
    cart[index].quantity--

    if (storeUser.currentUser) {
      cartStore.update({
        productId: cart[index].productId,
        size: 
          {
            _id: cart[index].size._id
          }
        ,
        color: 
          {
            _id: cart[index].color._id
          }
        ,
        quantity: cart[index].quantity,
      })
    }
  }
}
const moreItem = (index) => {
  const cart = cartStore.cart

  if (cart[index].quantity != cart[index].product?.stock) {
    cart[index].quantity++

    if (storeUser.currentUser) {
      cartStore.update({
        productId: cart[index].productId,
        size: 
          {
            _id: cart[index].size._id
          }
        ,
        color: 
          {
            _id: cart[index].color._id
          }
        ,
        quantity: cart[index].quantity,
      })
    }
  }
}

onMounted(async () => {
  if (storeUser.currentUser) {
    if (cartStore.cartIsNew) {
      await cartStore.addToMassiveCart({ cartItems: cartStore.cart })
    }
    await cartStore.productInfo()
  }

  if (!storeUser.currentUser) {
    await cartStore.productInfoGuest({ cartProducts: cartStore.cart })
  }
})
</script>
<template>
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
      :disableStock="isDisabledStock"
    />
  </template>

  <p class="rounded-lg bg-gray-100 p-3 mb-6 text-center text-xl font-bold" v-if="!cartStore.cart.length && cartStore.isReady">Empty cart</p>

  <div class="flex justify-center gap-4">
    <button
    v-if="cartStore.cart.length"
      class="group flex items-center justify-center gap-1 rounded-xl bg-gray-800 p-8 py-3 text-sm font-bold leading-6 text-white shadow-sm hover:bg-opacity-90"
      type="submit"
      @click="$emit('nextStep')"
    >
      Continuar
    </button>
  </div>
</template>
