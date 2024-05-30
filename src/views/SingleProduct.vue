<script setup lang="ts">
import Btn from '@/components/common/Btn.vue'
import Gallery from '@/components/common/Gallery.vue'
import RadioCheck from '@/components/common/RadioCheck.vue'
import NewProducts from '@/components/views/home/NewProducts.vue'
import useBreakpoints from '@/composables/useBreakpoints'
import useNotifications from '@/composables/useNotifications'
import CartStore from '@/stores/cart/cart'
import FavoriteStore from '@/stores/favorite'
import _storeProduct from '@/stores/product'
import { ChevronLeftIcon, ChevronRightIcon, HeartIcon, ShoppingCartIcon } from '@heroicons/vue/24/outline'
import { HeartIcon as SolidHeartIcon } from '@heroicons/vue/24/solid'
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const favoriteStore = FavoriteStore()
const isLoading = ref(false)
const productStore = _storeProduct()
const cartStore = CartStore()
const router = useRouter()
const { locale, t } = useI18n()
const { pushNotification } = useNotifications()
const { isDesktop, isTablet, isMobile } = useBreakpoints()

const availableColors = ref([])

const variations = ref(null)
const maxAmount = ref(0)
const color = ref(null)
const size = ref(null)
const favorite = ref(null)
const favoriteLoading = ref(false)
const productsImg = computed(() => {
  return productStore.product?.images
})

const quantity = ref(1)
const goToRoute = () => router.push({ name: 'home' })
// const goToOrder = () => router.push({ name: 'cart' })
const addFavorite = async () => {
  favoriteLoading.value = true
  const response = await favoriteStore.addFavorite(productStore.product?._id)
  if (response) {
    pushNotification({
      id: '',
      title: response.message,
      type: response.status == 'success' ? 'success' : 'error',
    })
  }
  favoriteLoading.value = false
}

const add = () => {
  if (quantity.value < maxAmount.value) {
    quantity.value++
  }
}

const remove = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const addProduct = async () => {
  isLoading.value = true

  if (
    cartStore.getAmountInCartByProduct({
      _id: productStore.product?._id,
      size: {
        _id: size.value,
      },
      color: {
        _id: color.value,
      },
    }) +
      quantity.value >
    maxAmount.value
  ) {
    isLoading.value = false
    pushNotification({
      id: '',
      title: t('QUANTITY_EXCEEDS_STOCK'),
      type: 'error',
      isLink: '/checkout',
      description: t('CART.SHOW'),
    })
    return
  }

  const response = await cartStore.addToCart({
    productId: productStore.product?._id,
    size: {
      _id: size.value,
    },
    color: {
      _id: color.value,
    },
    quantity: quantity.value,
  })

  isLoading.value = false

  if (response.data?.status == 'success') {
    pushNotification({
      id: '',
      title: t('CART.SUCCESS'),
      type: 'success',
      isLink: '/checkout',
      description: t('CART.SHOW'),
    })

    return
  }

  pushNotification({
    id: '',
    title: t(response.data?.message) ?? t('CART.ERROR'),
    type: 'error',
    isLink: '/checkout',
    description: t('CART.SHOW'),
  })
}

const isFavorite = computed(() => favoriteStore.favorites.find((item) => item.product._id == productStore.product?._id))

const sizesToShow = computed(() => {
  const sizes = []
  if (color.value) {
    variations.value
      ?.filter((variation) => variation?.color[0]?._id == color.value)
      .forEach((item) => {
        if (!sizes.find((size) => size?._id == item?.size[0]?._id) && item?.size[0]) {
          sizes.push(item.size[0])
        }
      })
  }

  maxAmount.value = variations.value?.find((item) => item.color[0]?._id == color.value && item.size[0]?._id == size.value)?.stock ?? 0
  return sizes
})

onMounted(async () => {
  await productStore.getSingleProduct(router.currentRoute.value.params.slug)
  await productStore.getAllProducts()

  if (productStore.product) {
    productsImg.value.unshift(productStore.product.mainImage)
  }

  variations.value = productStore.product?.productVariations
  variations.value?.forEach((item) => {
    if(item?.color?.length > 0){
      if (!availableColors.value.find((color) => color?._id == item?.color[0]?._id)) {
        availableColors.value.push(item.color[0])
      }
    }
    
  })

  color.value = availableColors.value[0]?._id ?? null
  size.value = sizesToShow?.value[0]?._id ?? null
  maxAmount.value = variations.value?.find((item) => item?.color[0]?._id == color?.value && item?.size[0]?._id == size?.value)?.stock ?? 0
})

watch(
  () => router.currentRoute.value.params.slug,
  async () => {
    await productStore.getSingleProduct(router.currentRoute.value.params.slug)
  }
)
</script>
<template>
  <div class="mx-auto bg-white px-6 pb-20 md:px-0 lg:max-w-7xl">
    <div class="pt-2">
      <nav aria-label="Breadcrumb" class="">
        <ol role="list" class="mb-4 flex max-w-2xl items-center space-x-2 lg:max-w-7xl">
          <li @click="goToRoute">
            <div class="flex items-center">
              <div class="mt-1 -rotate-180 transform cursor-pointer text-sm font-medium text-gray-900">
                <span class="" aria-hidden="true">→</span>
              </div>
            </div>
          </li>
          <li>
            <div class="flex items-center">
              <div class="mr-2 w-32 truncate text-sm font-medium text-gray-900 md:w-auto">
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

      <section class="reverse grid grid-cols-1 gap-8 lg:grid-cols-2">
        <section class="col-span-1" v-if="isDesktop ">
          <Gallery v-if="productStore.product" :photos="productsImg"></Gallery>
        </section>

        <!-- Product info -->
        <div class="relative max-w-2xl px-4 pb-0 pt-0 sm:px-6 lg:max-w-7xl lg:gap-x-8 lg:px-8 lg:pb-24 lg:pt-0">
          <button @click="addFavorite" class="group absolute right-4 top-0 rounded-full bg-gray-100 p-2 lg:p-3">
            <HeartIcon class="w-4 lg:w-6 group-hover:text-red-600" :class="{ 'text-red-600': favorite }" v-if="!isFavorite" />
            <SolidHeartIcon class="w-6" v-else />
          </button>
          <div class="lg:col-span-1">
            <p
              v-text="locale === 'en_US' ? productStore.product?.nameEnglish : productStore.product?.name"
              class="mb-4 mr-8 max-w-4xl text-base lg:text-3xl font-bold text-gray-900"
            />
            <section class="col-span-1" v-if="isMobile|| isTablet">
              <Gallery v-if="productStore.product" :photos="productsImg"></Gallery>
            </section>
            <p class="text-2xl tracking-tight text-gray-900">
              ${{ productStore.product?.priceDiscount ? productStore.product?.priceDiscount : productStore.product?.price }}
            
        
              <span v-if="productStore.price" class="ml-2 font-sans text-sm text-gray-500">
                Bs.{{
                  (
                    productStore.price *
                    (productStore.product?.priceDiscount ? productStore.product?.priceDiscount : productStore.product?.price)
                  ).toLocaleString()
                }}</span
              >
            </p>
    
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
              <section v-if="availableColors.length">
                <div class="mb-2 flex">
                  <p class="" v-text="$t('COMMON.COLOR') + ':'" />
                  <p
                    class="ml-2 font-bold"
                    v-text="
                      locale === 'en_US'
                        ? availableColors?.find((item) => item?._id == color)?.englishName
                        : availableColors?.find((item) => item?._id == color).name
                    "
                  />
                </div>
                <!-- Reviews -->
                <div class="mb-4 flex gap-2">
                  <RadioCheck
                    v-for="(item, index) in availableColors"
                    :key="index"
                    :color="item.hex"
                    :value="item._id"
                    v-model="color"
                    @click="size = null,quantity = 1
                    "
                    @update:modelValue="color = item._id"
                  />
                </div>
              </section>

              <section v-if="sizesToShow">
                <div class="mb-2 flex">
                  <p class="" v-text="$t('COMMON.SIZE') + ':'" />
                  <p
                    class="ml-2 font-bold"
                    v-text="
                      locale === 'en_US'
                        ? sizesToShow?.find((item) => item?._id == size)?.englishName
                        : sizesToShow?.find((item) => item?._id == size)?.name
                    "
                  />
                </div>
                <div class="flex gap-2" v-if="sizesToShow">
                  <RadioCheck
                    v-for="(item, index) in sizesToShow"
                    :key="index"
                    :is-checked="item?.name === size"
                    :color="item?.hex"
                    :label="item?.name"
                    :value="item?._id"
                    v-model="size"
                    @update:modelValue="size = item?._id"
                  />
                </div>
              </section>

              <section class="mb-4">
                <div class="mt-2">
                  <section class="items-center justify-between">
                    <p class="" v-text="$t('COMMON.QUANTITY')" />
                    <div class="border-burgerPrimary flex w-24 items-center justify-between rounded-md border px-3 py-1">
                      <button class="transition duration-500 hover:opacity-50" @click="remove">
                        <ChevronLeftIcon class="w-4" />
                      </button>
                      <p class="text-burgerPrimary text-base" v-text="quantity" />
                      <button class="transition duration-500 hover:opacity-50" @click="add">
                        <ChevronRightIcon class="w-4" />
                      </button>
                    </div>
                  </section>
                </div>
              </section>
              <Btn
                class="flex h-10 items-center justify-center"
                with-icon
                is-full
                color="primaryProduct"
                :text="maxAmount <= 0 ? $t('COMMON.NOT_AVAILABLE') : $t('COMMON.ADD_TO_CART')"
                :isLoading="isLoading"
                @click="addProduct()"
                :is-disabled="!size || !color || maxAmount <= 0"
              >
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
