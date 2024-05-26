<script setup>
import BannerStore from '@/stores/banner'
import { onMounted, ref } from 'vue'
import { Carousel, Navigation, Pagination, Slide } from 'vue3-carousel'
import 'vue3-carousel/dist/carousel.css'

const bannerStore = BannerStore()
const imagesWithTexts = ref([])

onMounted(async () => {
  await bannerStore.getBanner()

  bannerStore.currentBanner?.images.forEach((image, index) => {
    const mainText = bannerStore.currentBanner?.mainTexts[index]
    const secondaryText = bannerStore.currentBanner?.secondaryTexts[index]
    const img = bannerStore.currentBanner?.images.slice().reverse()[index]

    imagesWithTexts.value.push({
      img,
      mainText,
      secondaryText,
    })
  })
})
</script>
<template>
  <section v-if="bannerStore.currentBanner?.type === 'image'">
    <carousel :items-to-show="1" class="w-full" autoplay="2500" :wrap-around="true">
      <slide v-for="({ img, mainText, secondaryText }, slide) in imagesWithTexts" :key="slide" class="relative">
        <div class="absolute z-50 h-[300px] lg:h-[590px] w-full rounded-[48px] bg-gray-950 bg-opacity-30" />
        <div
          class="absolute left-[3rem] top-1/2 z-50 max-w-xs -translate-y-1/2 px-2 text-start text-white md:left-28 md:max-w-xl md:px-0 lg:left-52"
        >
          <p class="mb-1 text-lg uppercase" v-text="secondaryText" />
          <p class="text-3xl font-bold md:text-7xl" v-text="mainText" />
        </div>
        <img class="h-[300px] lg:h-[590px] w-full rounded-[48px] object-cover object-center" :src="img" />
      </slide>

      <template #addons>
        <navigation />
        <pagination />
      </template>
    </carousel>
  </section>

  <section v-else>
    <video class="h-[300px] lg:h-[590px]  w-full rounded-[48px] object-cover object-center"  :src="bannerStore.currentBanner?.video" autoplay loop muted="w-full"></video>
  </section>
</template>
