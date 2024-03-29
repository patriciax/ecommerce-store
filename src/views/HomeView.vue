<script setup lang="ts">
import Banner from '@/components/views/home/Banner.vue'
import NewProducts from '@/components/views/home/NewProducts.vue'
import Products from '@/components/views/home/Products.vue'
import Popular from '@/components/views/home/Popular.vue'
import _storeProduct from '@/stores/product'
import { onMounted } from 'vue'

const productStore = _storeProduct()

onMounted(async () => {
  await productStore.getAllProducts()
  localStorage.setItem('step', '1')

})
</script>

<template>
  <main>
    <section class="mx-auto max-w-[1440px] px-6">
      <Banner class="mb-16" />
      <NewProducts v-if="productStore.allProduct?.section1.length" :products="productStore.allProduct?.section1" class="mb-8" />
      <Products v-if="productStore.allProduct?.section2.length" :products="productStore.allProduct?.section2" />
      <Popular v-if="productStore.allProduct?.section3.length" :products="productStore.allProduct?.section3" />
    </section>
  </main>
</template>
