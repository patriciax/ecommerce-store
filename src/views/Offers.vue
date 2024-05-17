<script setup>
import CardProduct from '@/components/common/CardProduct.vue'
import Pagination from '@/components/common/Pagination.vue'
import SkeletonCard from '@/components/skeleton/Card.vue'
import _storeProduct from '@/stores/product'
import { onMounted } from 'vue'
const productStore = _storeProduct()

const handlePageChange = async (_page) => await productStore.getOnSale(_page)

onMounted(async () => {
  await productStore.getOnSale()
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
            <div class="mr-2 text-sm font-medium text-gray-900">{{ $t('COMMOM.HOME') }}</div>
            <svg width="16" height="20" viewBox="0 0 16 20" fill="currentColor" aria-hidden="true" class="h-5 w-4 text-gray-300">
              <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
            </svg>
          </div>
        </li>
        <li>
          <div class="flex items-center">
            <div class="mr-2 text-sm font-medium text-gray-900">{{ $t('COMMOM.OFFERS') }}</div>
          </div>
        </li>
      </ol>
    </nav>
    <p class="mt-6 text-2xl font-bold" v-text="$t('COMMOM.TEXT_OFFERS')" />
    <p
      class="mb-14 max-w-2xl font-light"
      v-text="$t('COMMOM.TEXT_OFFERS2')"
    />

    <section class="relative mb-10 grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3 xl:grid-cols-4">
      <template v-if="productStore.isLoading">
        <SkeletonCard v-for="index in 4" :key="index" />
      </template>

      <template v-else>
        <CardProduct v-for="(product, index) in productStore.onSale" :key="index" :data="product" />
      </template>
    </section>
    <Pagination @changePage="handlePageChange" :pagination="productStore.pagination" />
  </section>
</template>
