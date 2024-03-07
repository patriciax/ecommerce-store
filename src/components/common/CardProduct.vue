<script setup lang="ts">
import { ref } from 'vue'
import Btn from '@/components/common/Btn.vue'
import { HeartIcon, ShoppingCartIcon, PhotoIcon } from '@heroicons/vue/24/outline'
import { useRouter } from 'vue-router'
import CartStore from '@/stores/cart/cart'
import { useI18n } from 'vue-i18n'

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

const goToProduct = (id: number) => router.push({ name: 'singleProduct', params: { id: id } })
</script>
<template>
  <section class="relative w-full pb-9 text-start">
    <div class="group/card mb-2 flex h-[350px] w-full overflow-hidden rounded-lg bg-gray-100">
      <PhotoIcon v-if="imageError" class="mx-auto w-7 text-gray-500" />

      <img
        v-else
        @click="goToProduct(props.data._id)"
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
      <Btn
        color="cart"
        is-tooltip
        :text="$t('COMMON.ADD_TO_CART')"
        with-icon
        @click="
          cartStore.addToCart({
            name: locale === 'en_US' ? props.data.nameEnglish : props.data.name,
            id: props.data._id,
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
