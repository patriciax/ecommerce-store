<script setup>
import { computed } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  title: {
    type: String,
  },
  typeAlert: {
    type: String,
    validator: (value) => ['error', 'success', 'warning', 'info'].includes(String(value)),
    default: 'info',
  },
})

const classList = computed(() => {
  const classBase = `c-alert__content`
  const classColor = `${classBase}--${props.typeAlert}`
  return `${classBase} ${classColor}`
})

const emit = defineEmits(['close'])
const handleClose = () => emit('close')
</script>

<template>
  <section class="c-alert" :class="classList">
    <template v-if="props.title">
      <p v-text="props.title" />
      <button aria-label="close alert" @click="handleClose">
        <XMarkIcon class="w-5 text-white" />
      </button>
    </template>
    <slot v-else />
  </section>
</template>
