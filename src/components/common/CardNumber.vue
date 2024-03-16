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
  onlyNumber:{
    type: Boolean,
    default: false
  }
})

const showPassword = ref(false)

const changeType = () => (showPassword.value = !showPassword.value)

const emit = defineEmits(['update:modelValue'])
const handleInput = (_event) => emit('update:modelValue', _event.target.value)

const isNumber = (evt) => {
  const keysAllowed = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const keyPressed = evt.key;
  
  if (!keysAllowed.includes(keyPressed)) {
  evt.preventDefault()
  }
}

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
        type="text"
        :placeholder="props.placeholder"
        :value="props.modelValue"
        :disabled="props.isDisabled"
        autocomplete="off"
        @input="handleInput"
        maxlength="20"
        @keypress="props.onlyNumber ? isNumber($event) : ''"
      />
      <p v-if="props.errorMessage" class="absolute right-0 mt-0.5 text-xs font-medium text-red-500" v-text="props.errorMessage" />
    </label>
  </section>
</template>
