<script lang="ts" setup>
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/vue/24/outline';
import { onMounted, ref } from 'vue';

const props = defineProps({
  photos: {
    type: Array,
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
  <div class="vueGallery flex   gap-2">
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
        <ArrowLeftIcon class="w-4 mx-auto text-gray-900" />
      </button>
      <button v-if="props.photos.length > 1" type="button" aria-label="Next Photo" class="next" @click="nextPhoto()">
        <ArrowRightIcon  class="w-4 mx-auto text-gray-900" />
      </button>
    </div>
 
  </div>
</template>
