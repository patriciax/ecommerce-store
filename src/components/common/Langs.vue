<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import LangES from '@/assets/images/flag/spain.png'
import LangUS from '@/assets/images/flag/united-states.png'
import { XMarkIcon } from '@heroicons/vue/24/outline'

const emit = defineEmits(['close'])

const props = defineProps({
  active: {
    type: Boolean,
  },
})

const { locale, t } = useI18n()
const currentLocale = ref(locale)
const isSelectedLanguage = ref(true)

const langs = [
  {
    name: t('COMMON.SPANISH'),
    locale: 'es_ES',
    lang: LangES,
  },
  {
    name: t('COMMON.ENGLISH'),
    locale: 'en_US',
    lang: LangUS,
  },
]

const changeActiveLanguage = (lang) => {
  currentLocale.value = lang.locale
}
const selectLang = () => {
  isSelectedLanguage.value = true
  localStorage.setItem('lang', currentLocale.value)
  emit('close')
}
onMounted(async () => {
  const selectLang = localStorage.getItem('lang')
  isSelectedLanguage.value = selectLang
})
</script>
<template>
    <section
      class="relative mx-auto flex max-w-sm flex-col overflow-hidden rounded-2xl bg-white p-8 dark:bg-background-dark dark:text-white"
    >
      <button class="absolute right-3 top-3 focus:outline-none" @click="emit('close')">
        <XMarkIcon class="w-6 dark:text-white" />
      </button>
      <p class="mb-6 text-center text-xl font-medium" v-text="$t('ACTIONS.SELECT_A_LANGUAJE')" />

      <button
        v-for="(option, index) in langs"
        :key="index"
        :class="
          currentLocale == option.locale
            ? 'bg-primary  text-white hover:bg-primary '
            : 'hover:bg-gray-100 dark:hover:bg-background-dark-secondary'
        "
        class="mb-2 flex items-center justify-between rounded-2xl px-6 py-2 font-medium uppercase outline-none"
        @click="changeActiveLanguage(option)"
      >
        <p class="p-1 text-base" v-text="option.name" />
        <img class="w-9" :src="option.lang" />
      </button>
      <span class="border-t" />
      <button
        class="up b mx-auto mt-6 w-1/2 rounded-2xl border border-primary py-2 font-medium text-text-light outline-none hover:bg-primary hover:text-white dark:text-white"
        @click="selectLang"
        v-text="$t('ACTIONS.ACCEPT')"
      />
    </section>
</template>
