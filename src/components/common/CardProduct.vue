<script setup lang="ts">
import { ref } from 'vue'
import Btn from '@/components/common/Btn.vue'
import { HeartIcon, ShoppingCartIcon, PhotoIcon, EyeIcon } from '@heroicons/vue/24/outline'
import { useRouter } from 'vue-router'
import CartStore from '@/stores/cart/cart'
import { useI18n } from 'vue-i18n'
import _storeUser from '@/stores/user'
import useNotifications from '@/composables/useNotifications'

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
  disabled: {
    type: Boolean,
  },
})

const { locale } = useI18n()
const cartStore = CartStore()
const router = useRouter()
const imageError = ref(false)
const storeUser = _storeUser()
const { pushNotification } = useNotifications()

const addToCart = (_id: any) => {
  if (storeUser.currentUser) {
    cartStore.addToUserCart({
      productId: _id,
      quantity: cartStore.cart.find((item) => item.productId === _id)?.quantity || 1,
    })
  } else {
    cartStore.addToCart({
      productId: _id,
    })
  }

  pushNotification({
    id: '',
    title: 'Añadido al carrito. ',
    type: 'success',
    isLink: '/checkout',
    description: 'Ver carrito ',
  })
}

const goToProduct = (slug: any) => router.push({ name: 'singleProduct', params: { slug: slug } })
</script>
<template>
  <section class="relative w-full text-start">
    <div class="group/card mb-2 flex h-[350px] w-full overflow-hidden rounded-lg bg-gray-100">
      <PhotoIcon v-if="imageError" class="mx-auto w-7 text-gray-500" />

      <img
        v-else
        @click="goToProduct(props.data.slug)"
        :src="props.data.mainImage"
        alt="product"
        class="h-full w-full rounded-lg bg-center object-cover"
        @error="imageError = true"
      />
      <div class="absolute right-2 top-2 hidden group-hover/card:block">
        <Btn @click="$emit('addFavorite', props.data._id)" color="secondary" with-icon isFull>
          <template #icon>
            <HeartIcon class="w-5" />
          </template>
        </Btn>
      </div>
    </div>
    <section class="flex w-full items-center justify-between text-base">
      <div class="w-full">
        <p v-text="locale === 'en_US' ? props.data.nameEnglish : props.data.name" />
        <p class="text-xl font-bold" v-text="`$` + props.data.price" />
      </div>
      <Btn color="cart"  with-icon @click="goToProduct(props.data.slug)">
        <template #icon>
          <EyeIcon class="w-5" />
        </template>
      </Btn>
    </section>
  </section>
</template>
