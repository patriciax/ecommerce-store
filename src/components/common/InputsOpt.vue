<script setup>
import { ref } from 'vue'

const props = defineProps({
  codeLength: {
    type: Number,
  },
  isDisabled: {
    type: Boolean,
  },
  modelValue: {
    type: String,
  },
  errorMessage: {
    type: String,
  },
})

const code = ref(Array(props.codeLength).fill(''))
const emit = defineEmits(['update:modelValue'])

const handleKeyUp = (index, event) => {
  const input = event.target
  const value = input.value

  if (value.length > 1) {
    // Limit input to single character
    input.value = value.slice(0, 1)
  }

  code.value[index] = value

  if (value && index < props.codeLength - 1) {
    const nextInput = input.nextElementSibling
    if (nextInput) nextInput.focus()
  }

  updateCodeValue()
}

const handleDelete = (index, event) => {
  const input = event.target
  const value = input.value

  if (!value && index > 0) {
    const prevInput = input.previousElementSibling
    if (prevInput) prevInput.focus()
  }

  code.value[index] = value

  updateCodeValue()
}

const handlePaste = (event) => {
  const pastedData = event.clipboardData.getData('text')
  const validPastedData = pastedData.slice(0, props.codeLength)

  code.value = validPastedData.split('')
  updateCodeValue()
  const lastInput = event.target.parentElement.querySelector('input:last-child')
  if (lastInput) lastInput.focus()
}

const updateCodeValue = () => {
  const emitCode = code.value.join('')
  if (emitCode.length === props.codeLength) {
    emit('update:modelValue', emitCode)
  } else {
    emit('update:modelValue', '')
  }
}

</script>

<template>
  <section class="relative grid gap-x-2 lg:gap-x-2" :class="`grid-cols-${props.codeLength}`">
    <input
      v-for="(item, index) in props.codeLength"
      :key="index"
      :class="[
        props.errorMessage ? 'border border-red-500  dark:border-red-500 ' : '',
        props.codeLength == 6 ? 'w-12' : 'w-10',
        props.codeLength == 6 ? 'h-12' : 'h-10',
      ]"
      :value="code[index]"
      class="block rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-center text-sm text-gray-900 outline-none dark:border-gray-600 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
      placeholder="0"
      maxlength="1"
      :disabled="props.isDisabled"
      :autofocus="index === 0"
      @input="handleKeyUp(index, $event)"
      @keydown.delete="handleDelete(index, $event)"
      @paste="index === 0 ? handlePaste($event) : null"
    />
    <p v-if="props.errorMessage" class="absolute -bottom-5 left-2 mt-1 text-xs font-medium text-red-500" v-text="props.errorMessage" />
  </section>
</template>
