<script setup lang="ts">
import { ref } from 'vue'
import Btn from '@/components/common/Btn.vue'
import { HeartIcon, ShoppingCartIcon } from '@heroicons/vue/24/outline'
import { useRouter } from 'vue-router'
import CartStore from '@/stores/cart/cart'

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
  disabled: {
    type: Boolean,
  },
})
const cartStore = CartStore()
const router = useRouter()
// const imageError = ref(false)

const goToProduct = (id: number) => router.push({ name: 'singleProduct', params: { id: id } })
</script>
<template>
  <section class="relative w-full pb-9 text-start">
    <div class="group/card mb-2 h-[350px] w-full overflow-hidden">
      <img
        @click="goToProduct(props.data.id)"
        :src="props.data.image"
        alt="product"
        class="h-full w-full rounded-lg bg-center object-cover"
      />
      <div class="absolute right-2 top-2 hidden group-hover/card:block">
        <Btn @click="$emit('addFavorite', props.data.id)" color="secondary" with-icon isFull>
          <template #icon>
            <HeartIcon class="w-5" />
          </template>
        </Btn>
      </div>
    </div>
    <section class="flex w-full items-center justify-between text-base">
      <div class="w-full">
        <p v-text="props.data.name" />
        <p class="font-bold" v-text="`$` + props.data.price" />
      </div>
      <Btn
        color="cart"
        is-tooltip
        :text="$t('COMMON.ADD_TO_CART')"
        with-icon
        @click="
          cartStore.addToCart({
            name: props.data.name,
            id: props.data.id,
          })
        "
      >
        <template #icon>
          <ShoppingCartIcon class="w-5" />
        </template>
      </Btn>
    </section>
  </section>
</template>
