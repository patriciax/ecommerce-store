<script setup>
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/solid'
import { computed } from 'vue'


const emit = defineEmits(['changePage'])

const props = defineProps({

  isLoading: {
    type: Boolean,
    default: false,
  },
  noHaveData: {
    type: Boolean,
    default: false,
  },
  pagination: {
    type: Object,
    default: () => {},
  },
  havePagination: {
    type: Boolean,
    default: true,
  },
  
})


const changePage = (_value) => emit('changePage', props.pagination.page + _value)
const prevDisabled = computed(() => props.pagination.page === 1)
const nextDisabled = computed(() => props.pagination.page === props.pagination.totalPages)

</script>
<template>
      <section
    v-if=" !props.noHaveData"
    class="flex w-full items-center justify-center gap-20 rounded-b-lg bg-gray-50 py-2 dark:bg-text-light"
  >
    <button
      :disabled="prevDisabled"
      class="px-3 py-2 flex font-bold  items-center underline"
      :class="[{ 'hover:text-primary': !prevDisabled }, { 'text-gray-300 dark:text-gray-800': prevDisabled }]"
      @click="changePage(-1)"
    >
      <ChevronLeftIcon class="w-5" />
    {{  $t('COMMON.PREVIOUS') }}
    </button>

    <p
      class="dark:text-light text-center dark:text-white"
      v-text="
        $t('COMMON.PAGINATE', {
          from: props.pagination.page,
          total: props.pagination.totalPages,
        })
      "
    />

    <button
      :disabled="nextDisabled"
      class="px-3 py-2 flex font-bold  items-center underline"
      :class="[{ 'hover:text-primary': !nextDisabled }, { 'text-gray-300 dark:text-gray-400': nextDisabled }]"
      @click="changePage(1)"
    >     {{  $t('COMMON.NEXT') }}

      <ChevronRightIcon class="w-4" />
    </button>
  </section>
</template>