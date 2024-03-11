<script setup>
const props = defineProps({
  modelValue: {
    type: [String, Number],
  },
  id: {
    type: String,
  },
  name: {
    type: String,
    default: 'name',
  },
  color: {
    type: String,
  },
  isDisabled: {
    type: Boolean,
  },
  errorMessage: {
    type: String,
  },
  haveError: {
    type: Boolean,
  },
  label: {
    type: String,
  },
  isChecked: {
    type: Boolean,
  },
})

const emit = defineEmits(['update:modelValue'])
const handleInput = (_event) => {
  emit('update:modelValue', _event.target.value)
}
</script>
<template>
  <section class="relative flex items-center">
    <label class="mb-2 flex cursor-pointer items-center text-xs font-medium text-gray-600 dark:text-gray-300" :for="id">
      <input
        :id="id"
        type="radio"
        :name="props.name"
        :value="props.modelValue"
        :disabled="props.isDisabled"
        :checked="isChecked"
        :class="[
          haveError ? 'border border-red-500  dark:border-red-500 ' : '',
          isDisabled ? 'cursor-not-allowed text-gray-400 dark:text-gray-500' : '',
          props.label ? 'hidden' : '',
          props.isChecked ? 'after:bg-white' : '',
        ]"
        :style="`background-color: ${props.color}`"
        class="border-slate-150 0 relative mr-2 h-5 w-5 cursor-pointer appearance-none rounded-full border border-solid align-top text-base after:absolute after:right-1.5 after:top-1.5 after:flex after:h-2 after:w-2 after:items-center after:justify-center after:rounded-full after:bg-white after:text-white after:opacity-0 after:transition-all after:content-[''] checked:border-0 checked:border-transparent checked:bg-blue-600 checked:after:opacity-100"
        @input="handleInput"
      />
      <p
        class="border p-3 text-gray-900 capitalize"
        v-if="props.label"
        :class="[
          isDisabled ? 'cursor-not-allowed text-gray-400 dark:text-gray-500' : '',
          props.isChecked ? ' border-gray-900 font-bold ' : ' text-gray-900  ',
        ]"
        v-text="props.label"
      />

      <slot />
    </label>
    <!-- <p v-if="props.haveError" class="absolute left-2 mt-9 text-xs font-medium text-red-500" v-text="props.errorMessage" /> -->
  </section>
</template>
