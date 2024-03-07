<script setup lang="ts">
import CardProduct from '@/components/common/CardProduct.vue'
import { ref } from 'vue'
import 'vue3-carousel/dist/carousel.css'
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel'

const props = defineProps({
  products: {
    type: Object,
  },
})

const settings = ref({
  itemsToShow: 1,
  snapAlign: 'center',
})

const breakpoints = ref({
  700: {
    itemsToShow: 2,
    snapAlign: 'start',
  },
  1024: {
    itemsToShow: 3,
    snapAlign: 'start',
  },
  1200: {
    itemsToShow: 4,
    snapAlign: 'start',
  },
})
</script>
<template>
  <section class="rounded-lg bg-gray-100  p-8 shadow-sm popular">
    <p class="title_products" v-text="$t('COMMON.POPULAR_NOW')" />
    <carousel :v-bind="settings" :breakpoints="breakpoints" class="c-carouselProduct">
      <slide v-for="(product, index) in props.products" :key="index" class="relative">
        <CardProduct :data="product" class="md:mr-4" />
      </slide>
      <template #addons>
        <navigation />
      </template>
    </carousel>
  </section>
</template>
