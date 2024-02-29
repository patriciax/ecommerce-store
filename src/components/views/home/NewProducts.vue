<script setup lang="ts">
import CardProduct from '@/components/common/CardProduct.vue'
import { ref } from 'vue'
import 'vue3-carousel/dist/carousel.css'
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel'

const products = ref([
  {
    name: 'Sweater',
    image:
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    price: '19.99',
    id: 1,
  },
  {
    name: 'Lorem ipsum',
    image:
      'https://images.unsplash.com/photo-1598032895455-526c9e347a87?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    price: '19.99',
    id: 2,
  },
  {
    name: 'Ipsum asmet',
    image:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    price: '19.99',
    id: 3,
  },
  {
    name: 'Sweater',
    image:
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    price: '19.99',
    id: 4,
  },
  {
    name: 'LOrem ipsum asmet',
    image:
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=2030&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    price: '$ 19.99',
    id: 5,
  },
])

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
  <p class="title_products" v-text="$t('HOME.NEW_PRODUCTS')"/>
  <carousel :v-bind="settings" :breakpoints="breakpoints" class="c-carouselProduct">
    <slide v-for="(product, index) in products" :key="index" class="relative">
      <CardProduct :data="product" class="md:mr-8" />
    </slide>
    <template #addons>
      <navigation />
    </template>
  </carousel>
</section>
  
</template>
