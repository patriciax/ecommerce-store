<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import Datepicker, { DatePickerInstance } from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

const date = ref()
const datepicker = ref<DatePickerInstance>(null)

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
  useMinDate: {
    default: true,
    type: Boolean,
  }
})

const emit = defineEmits(['changedDate'])

const handleDate = (modelData) => {
  date.value = modelData
  emit('changedDate', modelData)
}

</script>

<template>
  <div>
    <label>
      <span :class="{ 'text-red-500': props.errorMessage }" class="text-sm font-bold" v-text="props.label" />
      <span v-if="isRequired" class="text-red-500">*</span>
    </label>
    <Datepicker
      :ref="datepicker"
      teleport-center
      v-model="date"
      month-picker
      @update:model-value="handleDate"
      :min-date="props.useMinDate ? `${new Date().getFullYear()}-${new Date().getMonth() + 2}-01` : undefined"
      auto-apply
    />
    <div>
      <p v-if="props.errorMessage" class="mt-0.5 text-xs font-medium text-red-500" v-text="props.errorMessage" />
    </div>
  </div>
  
</template>
<style>
.dp--menu-wrapper {
  top: 57% !important;
  left: 63% !important;
}
</style>
