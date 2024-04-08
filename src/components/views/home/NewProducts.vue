<script setup lang="ts">
import CardProduct from '@/components/common/CardProduct.vue';
import { ref } from 'vue';
import { Carousel, Navigation, Slide } from 'vue3-carousel';
import 'vue3-carousel/dist/carousel.css';

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
  <p class="title_products" v-text="$t('COMMON.NEWS')"/>
  <carousel :v-bind="settings" :breakpoints="breakpoints" class="c-carouselProduct">
    <slide v-for="(product, index) in props.products" :key="index" class="relative">
      <CardProduct :data="product" class="md:mr-8" />
    </slide>
    <template #addons>
      <navigation />
    </template>
  </carousel>
</section>
  
</template>
