<script setup>
import { getAllCategoriesMenu } from '@/api/repositories/category.repository'
import CardProduct from '@/components/common/CardProduct.vue'
import InputSearch from '@/components/common/InputSearch.vue'
import SkeletonCard from '@/components/skeleton/Card.vue'
import _stroreSearch from '@/stores/search'
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const storeSearch = _stroreSearch()
const finalCategories = ref([])
const filter = ref(null)
const selectedCategories = ref([])
onMounted(async () => {
  await storeSearch.getSearch({ textSearch: router.currentRoute.value.params.search })

  const response = await getAllCategoriesMenu()
  if (response.status === 'success') {
    finalCategories.value = response.data?.finalCategories
  }
})
const search = async () => {
  await storeSearch.getSearch({ textSearch: router.currentRoute.value.params.search })
}

const selectCategory = (category) => {
  if (!selectedCategories.value.some((c) => c._id === category._id)) {
    selectedCategories.value.push(category)
  }
}

const searchCategory = async () => {
  const selectedCategoryIds = selectedCategories.value.map((category) => category._id)

  await storeSearch.getSearch({ textSearch: router.currentRoute.value.params.search, categories: selectedCategoryIds })
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
    <section v-if="!storeSearch.search?.length">
      <p v-text="'No hay resultados.'" class="text-2xl font-bold text-gray-900" />
    </section>
    <section v-else class="flex gap-9">
      <section class="w-96">
        <p class="mb-4 mr-8 max-w-4xl text-xl font-bold text-gray-900">
          Resultados para:
          <span>"{{ router.currentRoute.value.params.search }}"</span>
        </p>
        <InputSearch
          @search="search"
          class="mb-6 rounded-md border"
          id="search"
          v-model="filter"
          name="Search"
          :placeholder="'Buscar productos...'"
          @clear="filter = ''"
        />

        <section>
          <p v-text="'Categorias'" class="text-gray-900' mb-4 border-b pb-2 text-xl font-bold" />
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
              <span>x</span>
            </button>
          </div>
          <button class="mt-4 rounded-md bg-gray-900 px-3 py-1.5 text-white" @click="searchCategory">Buscar por categoria</button>
        </section>
      </section>

      <section class="relative mb-10 grid w-full grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3 xl:grid-cols-3">
        <template v-if="storeSearch.isLoading">
          <SkeletonCard v-for="index in 4" :key="index" />
        </template>
        <template v-else>
          <CardProduct v-for="(product, index) in storeSearch.search" :key="index" :data="product" />
        </template>
      </section>
    </section>
  </section>
</template>
