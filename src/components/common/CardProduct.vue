<script setup lang="ts">
import Btn from '@/components/common/Btn.vue'
import _storeProduct from '@/stores/product'
import FavoriteStore from '@/stores/favorite'
import { EyeIcon, HeartIcon, PhotoIcon } from '@heroicons/vue/24/outline'
import { HeartIcon as SolidHearIcon} from '@heroicons/vue/24/solid'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import useNotificationsStore from '@/composables/useNotifications'
import { computed } from 'vue'

const { pushNotification } = useNotificationsStore()
const favoriteLoading = ref(false)
const productStore = _storeProduct()

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
  disabled: {
    type: Boolean,
  },
  
})

const addFavorite = async () => {
  favoriteLoading.value = true
  const response = await favoriteStore.addFavorite(props.data._id)
  if (response) {
    pushNotification({
        id: '',
        title: response.message,
        type: response.status == 'success' ? 'success' : 'error',
      })
  } 
  favoriteLoading.value = false
}

const isFavorite = computed(() => favoriteStore.favorites.find((item) => item.product._id == props.data._id))

const { locale } = useI18n()
const router = useRouter()
const imageError = ref(false)
const favoriteStore = FavoriteStore()

const goToProduct = (slug: any) => router.push({ name: 'singleProduct', params: { slug: slug } })
</script>
<template>
  <section class="relative w-full text-start">
    <div class="group/card mb-2 flex h-[300px] w-full overflow-hidden rounded-lg bg-gray-100">
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
        <Btn :isLoading="favoriteLoading" :isDisabled="favoriteLoading" @click="addFavorite" color="secondary" with-icon isFull>
          <template #icon>
            <HeartIcon class="w-5" v-if="!isFavorite" />
            <SolidHearIcon class="w-5" v-else />
          </template>
        </Btn>
      </div>
    </div>
    <section class="flex w-full items-center justify-between text-base">
      <div class="w-full">
        <p v-text="locale === 'en_US' ? props.data.nameEnglish : props.data.name" />
        <p class="text-xl font-bold flex items-center" >
          <p v-if="props.data.priceDiscount" class="line-through text-sm mr-2">${{ props.data.price }}</p>
          <p>${{ props.data.priceDiscount ? props.data.priceDiscount : props.data.price }}</p>
          <span v-if="productStore.price" class="font-sans text-sm text-gray-500 ml-2 "> Bs.{{ (productStore.price * (props.data.priceDiscount ? props.data.priceDiscount : props.data.price)).toLocaleString() }}</span>
        </p>
      </div>
      <Btn color="cart"  with-icon @click="goToProduct(props.data.slug)">
        <template #icon>
          <EyeIcon class="w-5" />
        </template>
      </Btn>
    </section>
  </section>
</template>
