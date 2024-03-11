<script setup lang="ts">
import CartStore from '@/stores/cart/cart'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import _storeProduct from '@/stores/product'
import { onMounted } from 'vue'
import Gallery from '@/components/common/Gallery.vue'
import Products from '@/components/views/home/Products.vue'
import { useI18n } from 'vue-i18n'
import RadioCheck from '@/components/common/RadioCheck.vue'
import { HeartIcon, ChevronLeftIcon, ChevronRightIcon, ShoppingCartIcon } from '@heroicons/vue/24/outline'
import Btn from '@/components/common/Btn.vue'
import NewProducts from '@/components/views/home/NewProducts.vue'
import useNotifications from '@/composables/useNotifications'

const productStore = _storeProduct()
const cartStore = CartStore()
const router = useRouter()
const { locale } = useI18n()
const { pushNotification } = useNotifications()

const color = ref(null)
const size = ref(null)
const favorite = ref(null)
const productsImg = computed(() => {
  return productStore.product?.images
})
const goToRoute = () => router.push({ name: 'home' })
// const goToOrder = () => router.push({ name: 'cart' })
const addFavorite = () => {
  favorite.value = true
}
const addProduct = () => {
  cartStore.addToCart({
    productId: productStore.product?._id,
  })

  pushNotification({
    id: '',
    title: 'Añadido al carrito. ',
    type: 'success',
    isLink: '/checkout',
    description: 'Ver carrito ',
  })
}

onMounted(async () => {
  await productStore.getSingleProduct(router.currentRoute.value.params.id)
  await productStore.getAllProducts()

  if (productStore.product) {
    productsImg.value.unshift(productStore.product.mainImage)
  }

  color.value = locale.value === 'en_US' ? productStore.product?.colors[0].englishName : productStore.product?.colors[0].name
  size.value = locale.value === 'en_US' ? productStore.product?.sizes[0].englishName : productStore.product?.sizes[0].name
})
</script>
<template>
  <div class="mx-auto bg-white pb-20 lg:max-w-7xl">
    <div class="pt-6">
      <nav aria-label="Breadcrumb" class="">
        <ol role="list" class="mb-16 flex max-w-2xl items-center space-x-2 lg:max-w-7xl">
          <li @click="goToRoute">
            <div class="flex items-center">
              <div class="mt-1 -rotate-180 transform cursor-pointer text-sm font-medium text-gray-900">
                <span class="" aria-hidden="true">→</span>
              </div>
            </div>
          </li>
          <li>
            <div class="flex items-center">
              <div class="mr-2 text-sm font-medium text-gray-900">
                {{ locale === 'en_US' ? productStore.product?.nameEnglish : productStore.product?.name }}
              </div>
              <svg width="16" height="20" viewBox="0 0 16 20" fill="currentColor" aria-hidden="true" class="h-5 w-4 text-gray-300">
                <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
              </svg>
            </div>
          </li>
          <li>
            <div class="flex items-center">
              <div class="mr-2 text-sm font-medium text-gray-900">
                {{ locale === 'en_US' ? productStore.product?.categories[0].englishName : productStore.product?.categories[0].name }}
              </div>
            </div>
          </li>
        </ol>
      </nav>

      <section class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2">
        <section class="col-span-1">
          <Gallery v-if="productStore.product" :photos="productsImg"></Gallery>
        </section>

        <!-- Product info -->
        <div class="relative max-w-2xl px-4 pb-16 pt-10 sm:px-6 lg:max-w-7xl lg:gap-x-8 lg:px-8 lg:pb-24 lg:pt-0">
          <button @click="addFavorite" class="group absolute right-4 top-0 rounded-full bg-gray-100 p-3">
            <HeartIcon class="w-6 group-hover:text-red-600" :class="{ 'text-red-600': favorite }" />
          </button>
          <div class="lg:col-span-1">
            <p
              v-text="locale === 'en_US' ? productStore.product?.nameEnglish : productStore.product?.name"
              class="mb-4 mr-8 max-w-4xl text-3xl font-bold text-gray-900"
            />

            <p class="text-2xl tracking-tight text-gray-900">${{ productStore.product?.price }}</p>
          </div>

          <div class="pb-10 lg:col-span-2 lg:col-start-1 lg:pb-16 lg:pt-6">
            <!-- Description and details -->
            <div>
              <div class="space-y-2">
                <p class="text-base text-gray-900" v-html="$t('COMMON.DESCRIPTION')"></p>
                <p
                  class="text-gray-600"
                  v-html="locale === 'en_US' ? productStore.product?.descriptionEnglish : productStore.product?.description"
                ></p>
              </div>
            </div>
            <!-- Options -->
            <div class="my-6 lg:row-span-3">
              <section v-if="productStore.product?.colors.length">
                <div class="mb-2 flex">
                  <p class="" v-text="$t('COMMON.COLOR') + ':'" />
                  <p class="ml-2 font-bold" v-text="color" />
                </div>
                <!-- Reviews -->
                <div class="mb-4 flex gap-2">
                  <RadioCheck
                    v-for="(item, index) in productStore.product?.colors"
                    :key="index"
                    :color="item.hex"
                    :value="item.hex"
                    v-model="color"
                    @update:modelValue="color = locale === 'en_US' ? item.englishName : item.name"
                  />
                </div>
              </section>

              <section v-if="productStore.product?.sizes.length">
                <div class="mb-2 flex">
                  <p class="" v-text="$t('COMMON.SIZE') + ':'" />
                  <p class="ml-2 font-bold" v-text="size" />
                </div>
                <!-- Reviews -->
                <div class="flex gap-2">
                  <RadioCheck
                    v-for="(item, index) in productStore.product?.sizes"
                    :key="index"
                    :is-checked="item.name === size"
                    :color="item.hex"
                    :label="item.name"
                    :value="item.hex"
                    v-model="size"
                    @update:modelValue="size = locale === 'en_US' ? item.englishName : item.name"
                  />
                </div>
              </section>

              <section class="mb-4">
                <!-- <div class="mt-2">
                  <section class="items-center justify-between">
                    <p class="" v-text="'Cantidad:'" />
                    <div class="border-burgerPrimary flex w-24 items-center justify-between rounded-md border px-3 py-1">
                      <button class="transition duration-500 hover:opacity-50">
                        <ChevronLeftIcon class="w-4" />
                      </button>
                      <p class="text-burgerPrimary text-base" v-text="'1'" />
                      <button class="transition duration-500 hover:opacity-50">
                        <ChevronRightIcon class="w-4" />
                      </button>
                    </div>
                  </section>
                </div> -->
              </section>
              <Btn with-icon is-full color="primaryProduct" :text="$t('COMMON.ADD_TO_CART')" @click="addProduct()">
                <template #icon>
                  <ShoppingCartIcon class="mx-2 w-5" />
                </template>
              </Btn>
            </div>
          </div>
        </div>
      </section>
    </div>

    <NewProducts v-if="productStore.allProduct?.section1.length" :products="productStore.allProduct?.section1" class="mb-8" />
  </div>
</template>
