<script lang="ts" setup>
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/vue/24/outline'
import { onMounted, ref } from 'vue'

const props = defineProps({
  photos: {
    type: Array,
  },
  isLoading: {
    type: Boolean,
  },
})

const activePhoto: any = ref(0)

const nextPhoto = () => {
  activePhoto.value = activePhoto.value + 1 < props.photos.length ? activePhoto.value + 1 : 0
}

const previousPhoto = () => {
  activePhoto.value = activePhoto.value - 1 >= 0 ? activePhoto.value - 1 : props.photos.length - 1
}

onMounted(() => {
  document.addEventListener('keydown', (event) => {
    if (event.which == 37) previousPhoto()
    if (event.which == 39) nextPhoto()
  })
})
</script>
<template>
  <div class="flex gap-2" v-if="props.isLoading">
    <div class="w-1/5 hidden lg:block ">
      <div class="h-28 mb-2 w-28 animate-pulse rounded-md bg-gray-200" ></div>
      <div class="h-28 mb-2 w-28 animate-pulse rounded-md bg-gray-200" ></div>
      <div class="h-28 mb-2 w-28 animate-pulse rounded-md bg-gray-200" ></div>
    </div>
    <div class=" w-full h-56 lg:h-[500px] animate-pulse rounded-md bg-gray-200 activePhoto" />
  </div>
  <div class="vueGallery flex gap-2" v-else>
    <div class="thumbnails hidden lg:block" v-if="props.photos.length > 1">
      <div
        v-for="(photo, index) in props.photos"
        :src="photo"
        :key="index"
        @click="activePhoto = index"
        :class="{ active: activePhoto == index }"
        :style="'background-image: url(' + photo + ')'"
      ></div>
    </div>
    <div class="activePhoto" :style="'background-image: url(' + props.photos[activePhoto] + ');'">
      <button v-if="props.photos.length > 1" type="button" aria-label="Previous Photo" class="previous" @click="previousPhoto()">
        <ArrowLeftIcon class="mx-auto w-4 text-gray-900" />
      </button>
      <button v-if="props.photos.length > 1" type="button" aria-label="Next Photo" class="next" @click="nextPhoto()">
        <ArrowRightIcon class="mx-auto w-4 text-gray-900" />
      </button>
    </div>
  </div>
</template>
