<script setup>
import { getAllCategoriesMenu } from '@/api/repositories/category.repository'
import CardProduct from '@/components/common/CardProduct.vue'
import InputSearch from '@/components/common/InputSearch.vue'
import TextFields from '@/components/common/TextFields.vue'
import SkeletonCard from '@/components/skeleton/Card.vue'
import _stroreSearch from '@/stores/search'
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const storeSearch = _stroreSearch()
const finalCategories = ref([])
const filter = ref(null)
const selectedCategories = ref([])
const priceMax = ref(null)
const priceMin = ref(null)

onMounted(async () => {
  await storeSearch.getSearch({ textSearch: router.currentRoute.value.params.search })

  const response = await getAllCategoriesMenu()
  if (response.status === 'success') {
    finalCategories.value = response.data?.finalCategories
  }
})

const search = async () => router.push({ name: 'search', params: { search: filter.value } })

const selectCategory = (category) => {
  if (!selectedCategories.value.some((c) => c._id === category._id)) {
    selectedCategories.value.push(category)
  }
}

const removeCategory = (category) => {
  selectedCategories.value = selectedCategories.value.filter((c) => c._id !== category._id)
}

const searchPrice = async () => {
  const selectedCategoryIds = selectedCategories.value.map((category) => category._id)
  await storeSearch.getSearch({ textSearch: router.currentRoute.value.params.search,categories: selectedCategoryIds }, priceMax.value, priceMin.value)
}
watch(
  () => router.currentRoute.value.params.search,
  async () => {
    await storeSearch.getSearch({ textSearch: router.currentRoute.value.params.search })
  }
)
</script>
<template>
  <section class="mx-auto min-h-[60vh] max-w-7xl">
    <section class="flex gap-9">
      <section class="w-96">
        <p class="mb-4 mr-8 max-w-4xl text-xl font-bold text-gray-900">
          {{ $t('SEARCH.TITLE') }}
          <span>"{{ router.currentRoute.value.params.search }}"</span>
        </p>
        <InputSearch
          @search="search"
          class="mb-6 rounded-md border"
          id="search"
          v-model="filter"
          name="Search"
          :placeholder="$t('SEARCH.SEARCH_PRODUCT')"
          @clear="filter = ''"
        />

        <section>
          <p v-text="$t('COMMON.CATEGORY')" class="text-gray-900' mb-4 border-b pb-2 text-xl font-bold" />
          <div class="max-h-64 overflow-y-auto">
            <button
              @click="selectCategory({ name: finalCategory?.name, englishName: finalCategory?.englishName, _id: finalCategory?._id })"
              :key="index"
              v-for="(finalCategory, index) in finalCategories"
              class="mb-1 flex flex-col hover:underline"
            >
              {{ $i18n.locale.toLowerCase() == 'es_es' ? finalCategory?.name : finalCategory?.englishName }}
            </button>
          </div>

          <div class="grid grid-cols-3 gap-3">
            <button
              v-for="category in selectedCategories"
              :key="category"
              class="flex justify-between truncate rounded-lg bg-gray-200 p-1.5 text-sm"
            >
              {{ category.name }}
              <span @click="removeCategory(category)">x</span>
            </button>
          </div>
       
        </section>

        <section class="mt-6">
          <p v-text="$t('FORM.PRICE')" class="text-gray-900' text-md mb-4 border-b pb-2 font-bold" />
          <section class="flex items-center justify-center">
            <TextFields label=" " type="number" placeholder="$10" v-model="priceMin" />
            <span class="mx-2" v-text="'-'" />
            <TextFields label=" " type="number" placeholder="$500" v-model="priceMax" />
          </section>
          <button class="mt-6 w-full rounded-md bg-gray-800 px-3 py-1.5 text-white" @click="searchPrice">{{ $t('COMMON.SEARCH') }}</button>
        </section>
      </section>

      <section class="relative mb-10 grid w-full grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3 xl:grid-cols-3">
        <template v-if="storeSearch.isLoading">
          <SkeletonCard v-for="index in 4" :key="index" />
        </template>

        <section v-else-if="!storeSearch.search?.length" class="col-span-full flex flex-col items-center justify-center rounded-lg bg-gray-100">
          <p v-text="`${$t('SEARCH.RESULT_NOT_FOUND')}:`" class="text-2xl font-bold text-gray-900" />
          <p class="text-2xl">"{{ router.currentRoute.value.params.search }}"</p>
        </section>

        <template v-else>
          <CardProduct v-for="(product, index) in storeSearch.search" :key="index" :data="product" />
        </template>
      </section>
    </section>
  </section>
</template>
