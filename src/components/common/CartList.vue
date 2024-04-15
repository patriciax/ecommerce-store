<script setup>
import _storeProduct from '@/stores/product'
import { ChevronLeftIcon, ChevronRightIcon, TrashIcon } from '@heroicons/vue/24/outline'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const emit = defineEmits(['removeItem', 'lessItem', 'moreItem'])
const { locale } = useI18n()

const disableStock = ref(false)
const productStore = _storeProduct()

const props = defineProps({
  item: {
    type: Object,
  },
  index: {
    type: Number,
  },
  isLast: {
    type: Boolean,
  },
  isLoading: {
    type: Boolean,
  },
  isCart: {
    type: Boolean,
    default: true,
  },
})
const removeItem = (index) => emit('removeItem', index)
const lessItem = (index) => {
  disableStock.value = false
  emit('lessItem', index)
}
const moreItem = (index) => {
  if (props.item.quantity >= props.item.stock) {
    disableStock.value = true
    return
  }

  emit('moreItem', index)
}
</script>
<template>
  <li class="mb-6 flex items-center gap-4 rounded-2xl bg-white px-6 py-2 text-lg shadow-[0px_2px_5px_#00000038]">
    <img :src="props.item.mainImage || props.item.product?.mainImage" alt="" class="h-24 w-24 rounded-lg object-cover" />
    <section>
      <RouterLink :to="`/product/${props.item.slug}`">
        <h3 class="max-w-72 text-lg text-gray-900">
          {{ locale === 'en_US' ? props.item.nameEnglish || props.item.product?.nameEnglish : props.item.name || props.item.product?.name }}
        </h3>
      </RouterLink>

      <div class="flex items-center">
        <p class="text-sm text-gray-700">{{ $t('COLOR') }}: {{ item?.color?.name }}</p>
        <div v-if="item?.color?.name" class="mx-2 h-4 w-0.5 bg-gray-200" />
        <p class="text-sm text-gray-700">{{ $t('SIZE') }}: {{ item?.size?.name }}</p>
      </div>
    </section>
    <div class="flex flex-1 items-center justify-end gap-16">
      <section class="flex items-center justify-between" v-if="props.isCart">
        <div class="border-burgerPrimary flex w-24 items-center justify-between rounded-md border px-3 py-1">
          <button class="transition duration-500 hover:opacity-50" :disabled="isLoading" @click="lessItem(props.index)">
            <ChevronLeftIcon class="w-4 text-gray-900" />
          </button>
          <p class="text-burgerPrimary text-base" v-text="props.item.quantity || props.item.product?.quantity" />
          <button :disabled="isLoading || disableStock" class="transition duration-500 hover:opacity-50" @click="moreItem(props.index)">
            <ChevronRightIcon class="w-4 text-gray-900" />
          </button>
        </div>
      </section>

      <div>
        <p class="inline">${{ props.item.priceDiscount || props.item.price }}</p>

        <span v-if="productStore.price" class="font-sans text-sm text-gray-500 ml-2 "> Bs.{{ (productStore.price * (props.item.priceDiscount || props.item.price)).toLocaleString() }}</span>

      </div>


      <button class="text-gray-600 transition hover:text-red-600" @click="removeItem(props.index)">
        <TrashIcon class="w-6" />
      </button>
    </div>
  </li>
</template>
