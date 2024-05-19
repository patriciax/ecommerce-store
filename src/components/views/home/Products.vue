<script setup lang="ts">
import CardProduct from '@/components/common/CardProduct.vue';
import 'vue3-carousel/dist/carousel.css';

const props = defineProps({
  products: {
    type: Object,
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
