<script setup>
import { ChevronDownIcon } from '@heroicons/vue/24/solid'
import { ref } from 'vue'
const props = defineProps({
  modelValue: {
    type: [String, Number],
  },
  id: {
    type: String,
  },
  name: {
    type: String,
  },
  placeholder: {
    type: String,
  },
  isDisabled: {
    type: Boolean,
  },
  autocomplete: {
    type: String,
    default: 'off',
  },
  errorMessage: {
    type: String,
  },
  haveError: {
    type: Boolean,
  },
  options: {
    type: Array,
    required: true,
    default: () => [],
  },
  class: {
    type: String,
  },
  label: {
    type: String,
  },
  hiddenLabel: {
    type: Boolean,
    default: false,
  },
  withErrorMessage: {
    type: Boolean,
    default: true,
  },
  isRequired: {
    type: Boolean,
  },
  actionText: String,
  withCreateAction: Boolean,
})
const emit = defineEmits(['update:modelValue', 'addAction'])

const isOpen = ref(false)
const handleChange = (_event) => {
  emit('update:modelValue', _event.target.value)
}
</script>

<template>
  <div :class="`c-select ${props.class}`">
    <div v-if="!hiddenLabel" class="flex justify-between text-sm">
      <label :class="{ 'text-red-500': props.errorMessage }" :for="id" class="text-sm font-bold"
        >{{ label }} <span v-if="isRequired" class="text-red-500">*</span>
      </label>
    </div>
    <select
      :id="id"
      :name="props.name"
      :value="props.modelValue"
      :disabled="props.isDisabled"
      :class="[
        props.errorMessage ? 'border  border-red-500' : 'border  border-gray-300 dark:border-gray-700',
        props.isDisabled ? ' bg-gray-200 opacity-70 dark:bg-gray-600 ' : 'bg-white dark:bg-gray-600',
      ]"
      class="placeholder:text-midgray relative p-2"
      @change="handleChange"
      @click="isOpen = !isOpen"
      @blur="isOpen = false"
    >
      <option value="" disabled selected hidden v-text="props.placeholder ? props.placeholder : $t('COMMON.SELECT')" />
      <option v-for="(option, index) in props.options" :key="index" :value="option.value" v-text="option.text" />
    </select>
    <ChevronDownIcon
      class="text-midgray peer pointer-events-none absolute right-2 w-5 rotate-0 transition-all"
      :class="{ 'top-[27%]': hiddenLabel, 'top-[52%]': !hiddenLabel, 'rotate-180': isOpen }"
    />

    <p v-if="props.errorMessage" class="absolute right-0 mt-0.5 text-xs font-medium text-red-500" v-text="props.errorMessage" />
  </div>
</template>
