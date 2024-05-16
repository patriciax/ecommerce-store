<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import {_getSingleItem} from '../../../api/repositories/footer.repository'
import { useI18n } from 'vue-i18n'

const footerHtml:any = ref({})
const { locale } = useI18n()

const router = useRouter()

  const getFooterItem = async (slug) => {
    const response = await _getSingleItem(slug)
    if(response.status == 'success'){
      footerHtml.value =  response.data
    }
  }

  onMounted(() => {
    
  })

  watch(
    () => router.currentRoute.value.params.slug,
    async () => {

      getFooterItem(router.currentRoute.value.params.slug)

    },
    { immediate: true }
  )

</script>

<template>
  <main>
    <section class="mx-auto max-w-[1440px] px-6">
      <p class="text-center font-bold text-4xl">{{ locale == 'en_US' ? footerHtml?.titleEnglish : footerHtml?.title }}</p>
      <div v-html="locale == 'en_US' ? footerHtml?.descriptionEnglish : footerHtml?.description"></div>
    </section>
  </main>
</template>