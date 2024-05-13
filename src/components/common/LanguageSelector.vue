<script setup>
import { ChevronDownIcon } from '@heroicons/vue/24/outline'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Dropdown from './Dropdown.vue'

const { locale } = useI18n()
const currentLocale = ref(locale)

const langs = [
  {
    name: 'ES',
    locale: 'es_ES',
  },
  {
    name: 'US',
    locale: 'en_US',
  },
]

const changeActiveLanguage = (lang, _closeDropdown) => {
  currentLocale.value = lang.locale
  localStorage.setItem('lang', currentLocale.value)
  _closeDropdown()
}

const selected = computed(() => (currentLocale.value === 'es_ES' ? 'ES' : 'US'))
</script>
<template>
  <Dropdown>
    <template v-slot:trigger="{ openDropdown, isOpen }">
      <button class="my-2 flex items-center bg-white hover:bg-opacity-90 font-bold  gap-1 item-pcenter group relative hover:bg-gray-700 hover:text-white text-gray-800 py-1.5 rounded-md px-2 justify-center" @click="openDropdown">
        <p v-text="selected"  class="mr-1 text-sm md:text-base" />
        <ChevronDownIcon class=" hidden lg:block text-gray transition-all w-4 ease-in-out" :class="{ 'rotate-180': isOpen }" />
      </button>
    </template>
    <template v-slot:content="{ closeDropdown }">
      <button
        class="w-20  hover:bg-gray-200"
        @click="changeActiveLanguage(option, closeDropdown)"
        v-for="(option, index) in langs"
        :key="index"
      >
        <p v-text="option.name" class="p-1 text-base" />
      </button>
    </template>
  </Dropdown>
</template>
