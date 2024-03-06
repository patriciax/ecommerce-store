<script setup>
import { ref } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  withOutClose: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String,
    default: 'max-w-lg',
  },
})

const target = ref(null)
const emit = defineEmits(['close'])
const handleClose = () => emit('close')
</script>
<template>
  <section class="fixed left-0 top-0 z-40 flex h-full w-full items-center justify-center">
    <div ref="target" class="absolute inset-0 -m-4 bg-black bg-opacity-50" @click="handleClose" />
    <section class="relative rounded-lg p-4" :class="props.size">
      <button v-if="!props.withOutClose" class="hiddem m absolute right-8 mt-4 focus:outline-none" @click="handleClose">
        <XMarkIcon class="w-6 text-gray-800" />
      </button>
      <slot></slot>
    </section>
  </section>
</template>
