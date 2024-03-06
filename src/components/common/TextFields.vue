<script setup>
import { ref, computed } from 'vue'
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline'

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
  type: {
    default: 'text',
  },
  isDisabled: {
    type: Boolean,
  },
  errorMessage: {
    type: [String, Boolean],
  },
  label: {
    type: String,
  },
  isRequired: {
    type: Boolean,
  },
})

const showPassword = ref(false)

const changeType = () => (showPassword.value = !showPassword.value)

const typeApply = computed(() => {
  if (props.type === 'password') {
    return showPassword.value ? 'text' : 'password'
  }

  return props.type
})

const emit = defineEmits(['update:modelValue'])
const handleInput = (_event) => emit('update:modelValue', _event.target.value)
</script>
<template>
  <section class="relative">
    <label v-show="props.label">
      <span :class="{ 'text-red-500': props.errorMessage }" class="text-sm font-bold" v-text="props.label" />
      <span v-if="isRequired" class="text-red-500">*</span>

      <input
        :id="props.id"
        class="w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none dark:border-gray-700 dark:text-gray-300"
        :class="[
          props.errorMessage ? 'border border-red-500  dark:border-red-500 ' : '',
          isDisabled ? 'cursor-not-allowed bg-gray-200 opacity-70 dark:bg-gray-600' : 'bg-white dark:bg-gray-600',
        ]"
        :name="props.name"
        :type="typeApply"
        :placeholder="props.placeholder"
        :value="props.modelValue"
        :disabled="props.isDisabled"
        autocomplete="off"
        :maxlength="props.maxlength"
        @input="handleInput"
      />
      <button
        v-if="props.type === 'password'"
        class="absolute right-4 top-9"
        :disabled="props.isDisabled"
        aria-label="show password"
        type="button"
        @click="changeType"
      >
        <EyeIcon v-if="!showPassword" class="h-5 w-5" />
        <EyeSlashIcon v-else class="h-5 w-5" />
      </button>
      <p v-if="props.errorMessage" class="absolute right-0 mt-0.5 text-xs font-medium text-red-500" v-text="props.errorMessage" />
    </label>
  </section>
</template>
