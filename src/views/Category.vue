<script setup>
import CardProduct from '@/components/common/CardProduct.vue'
import Pagination from '@/components/common/Pagination.vue'
import SkeletonCard from '@/components/skeleton/Card.vue'
import _storeProduct from '@/stores/product'
import { onMounted } from 'vue'

import { useRoute, useRouter } from 'vue-router'
const props = defineProps({
  id: {
    type: String,
  },
  name: {
    type: String,
  },
})
const productStore = _storeProduct()
const router = useRouter()
const route = useRoute()

const handlePageChange = async (_page) => await productStore.getCategory(props.id, _page)

onMounted(async () => {
  await productStore.getCategory(props.id)
})
</script>
<template>
  <section class="mx-auto max-w-[1440px] px-6">
    <nav aria-label="Breadcrumb" class="">
      <ol role="list" class="mb-4 flex max-w-2xl items-center space-x-2 lg:max-w-7xl">
        <router-link to="/">
          <div class="flex items-center">
            <div class="mt-1 -rotate-180 transform cursor-pointer text-sm font-medium text-gray-900">
              <span class="" aria-hidden="true">→</span>
            </div>
          </div>
        </router-link>
        <li>
          <div class="flex items-center">
            <div class="mr-2 text-sm font-medium text-gray-900">Home</div>
            <svg width="16" height="20" viewBox="0 0 16 20" fill="currentColor" aria-hidden="true" class="h-5 w-4 text-gray-300">
              <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
            </svg>
          </div>
        </li>
        <li>
          <div class="flex items-center">
            <div class="mr-2 text-sm font-medium text-gray-900">
              {{ props.name }}
            </div>
          </div>
        </li>
      </ol>
    </nav>
    <p class="mt-6 text-2xl font-bold" v-text="props.name" />
    <p
      class="mb-14 max-w-2xl font-light"
      v-text="
        `Rehace tu look por menos. Si eres un atleta ávido o buscas un estilo urbano fresco, encontrarás el mejor equipo en las rebajas de ropa y calzado.`
      "
    />

    <section class="relative mb-10 grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3 xl:grid-cols-4">
      <template v-if="productStore.isLoading">
        <SkeletonCard v-for="index in 4" :key="index" />
      </template>
      <template v-else>
        <CardProduct v-for="(product, index) in productStore.category" :key="index" :data="product" />
      </template>
    </section>
    <Pagination @changePage="handlePageChange" :pagination="productStore.pagination" />
  </section>
</template>
