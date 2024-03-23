<script setup>
import { ref } from 'vue'
import { ChevronDownIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  title: {
    type: String,
  },
})

const active = ref(false)
</script>

<template>
  <div
    class="border-gray-light mb-4 flex cursor-pointer items-center justify-between gap-3 border-b py-4 first-of-type:pt-0"
    @click="active = !active"
  >
  <div class="flex">
    <slot name="img"/>
    <p class="text-lg font-semibold" v-text="props.title" />

  </div>
    <ChevronDownIcon
      class="block w-5 transform transition-all duration-200"
      :class="active === true ? 'rotate-180 text-primary' : 'text-gray'"
    />
  </div>

  <div class="overflow-hidden transition-all" :class="active === true ? 'max-h-max ' : 'max-h-0 '">
    <slot />
  </div>
</template>