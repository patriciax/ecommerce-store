<script setup>
import 'vue3-carousel/dist/carousel.css'
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel'
</script>
<template>
  <carousel :items-to-show="1" class="w-full">
    <slide v-for="slide in 3" :key="slide" class="relative">
        <div class="bg-gray-950 bg-opacity-30 h-[590px] z-50 rounded-[48px]  w-full absolute"/>
        <div class="absolute z-50 top-1/2 md:left-28 lg:left-52 left-[3rem] -translate-y-1/2 text-start max-w-xs px-2 md:px-0 md:max-w-xl text-white">
          <p class="text-lg mb-1 uppercase" v-text="'Comprar es divertido'" />
          <p class=" text-5xl md:text-7xl font-bold" v-text="'Explora, Elige y compra lo mejor en moda'" />
        </div>
        <img class="h-[590px] w-full rounded-[48px] object-cover object-center" src="https://img.freepik.com/foto-gratis/joven-hispana-que-usa-telefono-inteligente-comprar-tienda-ropa_839833-9772.jpg?t=st=1709069952~exp=1709073552~hmac=b6adf2581246c32420fe49fe52f982255d147eeba4b7fcc4a121502268b9898f&w=1380" />
    </slide>

    <template #addons>
      <navigation />
      <pagination />
    </template>
  </carousel>
</template>
