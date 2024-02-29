<script setup>
import Navbar from '@/components/common/Navbar.vue'
import Footer from '@/components/common/Footer.vue'
</script>
<template>
  <Navbar />
  <section class="mt-24">
    <RouterView />
  </section>
  <Footer />
</template>
