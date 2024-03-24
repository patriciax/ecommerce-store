<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import Datepicker, { DatePickerInstance } from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

const date = ref(new Date())

const props = defineProps({
  label: {
    type: String,
  },
  errorMessage: {
    type: [String, Boolean],
  },
  isRequired: {
    type: Boolean,
  },
})

const emit = defineEmits(['changedDate'])

const handleDate = (modelData) => {
  date.value = modelData
  emit('changedDate', modelData)
}


</script>

<template>
  <div class="relative">
    <label>
      <span :class="{ 'text-red-500': props.errorMessage }" class="text-sm font-bold" v-text="props.label" />
      <span v-if="isRequired" class="text-red-500">*</span>
    </label>
    <Datepicker
      v-model="date"
      date-picker
      @update:model-value="handleDate"
      :min-date="new Date()"
      auto-apply
    />
    <p v-if="props.errorMessage" class="absolute right-0 mt-0.5 text-xs font-medium text-red-500" v-text="props.errorMessage" />

  </div>
</template>
