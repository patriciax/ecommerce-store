<script setup>
import { ChevronLeftIcon, TrashIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'
import { useI18n } from 'vue-i18n'

const emit = defineEmits(['removeItem', 'lessItem', 'moreItem'])
const { locale } = useI18n()

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
})
const removeItem = (index) => emit('removeItem', index)
const lessItem = (index) => emit('lessItem', index)
const moreItem = (index) => emit('moreItem', index)
</script>
<template>
  <li class="mb-6 flex items-center gap-4 rounded-2xl bg-white px-6 py-2 text-lg shadow-[0px_2px_5px_#00000038]">
    <img :src="props.item.mainImage || props.item.product?.mainImage" alt="" class="h-24 w-24 rounded-lg object-cover" />
    <h3 class="max-w-72 text-lg text-gray-900">{{ locale === 'en_US' ? props.item.nameEnglish || props.item.product?.nameEnglish : props.item.name  || props.item.product?.name}}</h3>

    <div class="flex flex-1 items-center justify-end gap-16">
      <section class="flex items-center justify-between">
        <div class="border-burgerPrimary flex w-24 items-center justify-between rounded-md border px-3 py-1">
          <button class="transition duration-500 hover:opacity-50" :disabled="isLoading" @click="lessItem(props.index)">
            <ChevronLeftIcon class="w-4 text-gray-900" />
          </button>
          <p class="text-burgerPrimary text-base" v-text="props.item.quantity || props.item.product?.quantity" />
          <button :disabled="isLoading" class="transition duration-500 hover:opacity-50" @click="moreItem(props.index)">
            <ChevronRightIcon class="w-4 text-gray-900" />
          </button>
        </div>
      </section>

      <p class="inline">${{ props.item.price ||props.item.product?.price }}</p>

      <button class="text-gray-600 transition hover:text-red-600" @click="removeItem(props.index)">
        <TrashIcon class="w-6" />
      </button>
    </div>
  </li>
</template>
