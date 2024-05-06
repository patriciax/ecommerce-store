<script setup>
import CartList from '@/components/common/CartList.vue'
import FavoriteStore from '@/stores/favorite'
import { computed } from 'vue';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const favoriteStore = FavoriteStore()

const removeItem = async (id) => {
    await favoriteStore.removeFavorite(id)
}

const favorites = computed(() => favoriteStore.favorites)

</script>
<template>
  
    <div class="px-[25%]">
        <CartList
      v-for="(item, index) in favorites"
      :key="index"
      :isLast="index === favorites.length - 1"
      :item="item.product"
      :index="index"
      :isCart="false"
      @removeItem="removeItem(item._id)"
    />
    </div>

  <p class="rounded-lg bg-gray-100 p-3 mb-6 text-center text-xl font-bold" v-if="!favorites.length && favoriteStore.isReady">Empty favorites</p>

</template>
