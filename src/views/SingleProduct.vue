<script setup lang="ts">
import CartStore from '@/stores/cart/cart'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel'

const cartStore = CartStore()
const router = useRouter()

const currentSlide = ref(0)
const slideTo = (val) => {
  currentSlide.value = val
}
const productsImg = ref([
  {
    id: 1,
    image:
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 2,
    image:
      'https://images.unsplash.com/photo-1598032895455-526c9e347a87?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 3,
    image:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
])
const goToRoute = () => router.push({ name: 'home' })
// const goToOrder = () => router.push({ name: 'cart' })
</script>
<template>
  <div class="mx-auto bg-white pb-20 lg:max-w-7xl">
    <div class="pt-6">
      <nav aria-label="Breadcrumb">
        <ol role="list" class="flex max-w-2xl items-center space-x-2 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
          <li @click="goToRoute">
            <div class="flex items-center">
              <div class="mr-2 mt-1 -rotate-180 transform cursor-pointer text-sm font-medium text-gray-900">
                <span class="" aria-hidden="true">→</span>
              </div>
            </div>
          </li>
          <li>
            <div class="flex items-center">
              <div class="mr-2 text-sm font-medium text-gray-900">name product</div>
              <svg width="16" height="20" viewBox="0 0 16 20" fill="currentColor" aria-hidden="true" class="h-5 w-4 text-gray-300">
                <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
              </svg>
            </div>
          </li>
          <li>
            <div class="flex items-center">
              <div class="mr-2 text-sm font-medium text-gray-900">category</div>
              <svg width="16" height="20" viewBox="0 0 16 20" fill="currentColor" aria-hidden="true" class="h-5 w-4 text-gray-300">
                <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
              </svg>
            </div>
          </li>
        </ol>
      </nav>

      <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
        <!-- Image gallery -->
        <div>
          <Carousel class="mb-4" id="gallery" :items-to-show="1" :wrap-around="false" v-model="currentSlide">
            <Slide v-for="(slide, index) in productsImg" :key="index">
              <img class="h-[30rem] w-full rounded-lg object-cover" :src="slide.image" />
            </Slide>
          </Carousel>

          <Carousel id="thumbnails" :items-to-show="3" :wrap-around="true" v-model="currentSlide" ref="carousel">
            <Slide v-for="(slide, index) in productsImg" :key="index">
              <img class="h-40 rounded-lg border border-white hover:border-red-500 cursor-pointer mx-2 w-full object-cover" :src="slide.image" @click="slideTo(slide.id - 1)" />
            </Slide>
          </Carousel>
        </div>

        <!-- Product info -->
        <div
          class="mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pb-24 lg:pt-16"
        >
          <div class="text-end lg:col-span-1">
            <p class="text-3xl tracking-tight text-gray-900">$1200</p>
          </div>

          <div class="pb-10 lg:col-span-2 lg:col-start-1 lg:pb-16 lg:pr-8 lg:pt-6">
            <!-- Description and details -->
            <div>
              <h3 class="sr-only">Description</h3>

              <div class="space-y-6">
                <p class="text-base text-gray-900" v-html="'description'"></p>
              </div>
            </div>
            <!-- Options -->
            <div class="mt-4 lg:row-span-3 lg:mt-0">
              <h2 class="sr-only">Product information</h2>

              <!-- Reviews -->
              <div class="mt-6">
                <h3 class="sr-only">Reviews</h3>
                <div class="flex items-center">
                  <div class="flex items-center">
                    <!-- Active: "text-gray-900", Default: "text-gray-200" -->
                    <svg class="h-5 w-5 flex-shrink-0 text-gray-900" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path
                        fill-rule="evenodd"
                        d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <svg class="h-5 w-5 flex-shrink-0 text-gray-900" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path
                        fill-rule="evenodd"
                        d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <svg class="h-5 w-5 flex-shrink-0 text-gray-900" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path
                        fill-rule="evenodd"
                        d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <svg class="h-5 w-5 flex-shrink-0 text-gray-900" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path
                        fill-rule="evenodd"
                        d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <svg class="h-5 w-5 flex-shrink-0 text-gray-200" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path
                        fill-rule="evenodd"
                        d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                  <p class="sr-only">4 out of 5 stars</p>
                  <div class="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500">117 reviews</div>
                </div>
              </div>

              <button
                :disabled="false"
                class="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <span v-if="false">adding to cart...</span>
                <span v-else> Add to bag</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
