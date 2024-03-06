<script setup>
import MazPhoneNumberInput from 'maz-ui/components/MazPhoneNumberInput'

const props = defineProps({
  modelValue: {
    type: String,
  },
  errorMessage: {
    type: String,
  },
  isDisabled: {
    type: Boolean,
    default: false,
  },
  id: {
    type: String,
  },
})

const emit = defineEmits(['update:modelValue'])

function updateValue(_values) {
  emit('update:modelValue', _values.e164)
}
</script>

<template>
  <div>
    <MazPhoneNumberInput
      :id="id"
      :modelValue="modelValue"
      show-code-on-list
      default-country-code="VE"
      :disabled="isDisabled"
      :class="{ 'phone-number-error': errorMessage }"
      maxlength="15"
      @update="updateValue"
    />
    <p v-if="props.errorMessage" class="absolute mt-1 text-xs font-medium text-red-500" v-text="props.errorMessage" />
  </div>
</template>
