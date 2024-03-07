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
  <section>
    <p class="title_products" v-text="$t('COMMON.RECOMMENDED')" />
    <section class="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-8">
      <CardProduct v-for="(product, index) in props.products" :key="index"  :data="product"  />
    </section>
  </section>
</template>
