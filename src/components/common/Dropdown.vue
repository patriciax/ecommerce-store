<script setup>
import { computed } from 'vue'
import { ref } from 'vue'

const props = defineProps({
  disabled: {
    type: Boolean,
  },
  styles: {
    type: String,
  },
  position: {
    type: String,
    default: 'right-0',
  },
})
const isOpen = ref(false)

const openDropdown = () => (isOpen.value = !isOpen.value)
const closeDropdown = () => (isOpen.value = false)

const classList = computed(() => {
  const classBase = `c-dropdown`
  const classColor = `${classBase}--${props.styles}`
  return `${classBase} ${classColor}`
})
const target = ref()
window.addEventListener('click', (e) => {
  if (!target.value?.contains(e.target)) isOpen.value = false
})
</script>

<template>
  <section class="relative" ref="target">
    <slot name="trigger" :openDropdown="openDropdown" :isOpen="isOpen" />
    <section
      v-show="isOpen"
      :class="classList"
      class="border-tertiary absolute top-full z-50 cursor-pointer overflow-y-auto rounded-md border bg-white shadow-main lg:-right-3"
    >
      <slot name="content" :closeDropdown="closeDropdown" />
    </section>
  </section>
</template>

