<script setup>
import { MagnifyingGlassIcon, XCircleIcon } from '@heroicons/vue/24/outline'

const emit = defineEmits(['update:modelValue', 'search', 'clear'])

const props = defineProps({
  id: {
    type: String,
  },
  modelValue: {
    type: [String, Number],
  },
  placeholder: {
    type: String,
    default: '',
  },
  name: {
    type: String,
  },
  isDisabled: {
    type: Boolean,
  },
  label: {
    type: String,
  },
})

const handleInput = (_event) => emit('update:modelValue', _event.target.value)
const search = () => {
  if (props.modelValue.trim()) {
    emit('search')
  }
}
</script>
<template>
  <section>
    <span class="text-sm font-bold" v-text="props.label" />
    <section class="relative overflow-hidden">
      <input
        :id="props.id"
        class="w-52 rounded-lg bg-white p-2 pr-0 text-sm focus:outline-none dark:border-gray-700 dark:bg-gray-600 dark:text-gray-300"
        :class="{ 'cursor-not-allowed bg-gray-100': isDisabled }"
        :name="props.name"
        :placeholder="props.placeholder"
        :value="props.modelValue"
        :disabled="props.isDisabled"
        autocomplete="off"
        :maxlength="props.maxlength"
        type="text"
        @input="handleInput"
        @keyup.enter="search"
      />

      <section class="absolute right-0 top-0 flex h-full">
        <button v-if="props.modelValue" @click="emit('clear')">
          <XCircleIcon class="w-5" />
        </button>
        <button
          class="group ml-3 flex h-full items-center justify-center px-3 dark:border-gray-700"
          :disabled="props.isDisabled"
          @click="search"
        >
          <MagnifyingGlassIcon class="h-5 w-5 group-hover:text-primary" />
        </button>
      </section>
    </section>
  </section>
</template>
