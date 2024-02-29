<script setup lang="ts">
import Banner from '@/components/views/home/Banner.vue'
import NewProducts from '@/components/views/home/NewProducts.vue'
import Products from '@/components/views/home/Products.vue'
</script>

<template>
  <main>
      <section class="mx-auto max-w-[1440px] px-6">
        <Banner class="mb-16" />
        <NewProducts class="mb-8" />
        <Products />
      </section>
  </main>
</template>
