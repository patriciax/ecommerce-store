<script setup lang="ts">
import { XMarkIcon, ShoppingCartIcon, HeartIcon, UserIcon, Bars3BottomLeftIcon } from '@heroicons/vue/24/outline'
import {ChevronDownIcon } from '@heroicons/vue/24/outline'
import { onMounted, ref } from 'vue'
import Btn from '@/components/common/Btn.vue'
import { getAllCategoriesMenu } from '@/api/repositories/category.repository'
import InputSearch from '@/components/common/InputSearch.vue'
import LanguageSelector from './LanguageSelector.vue'
import CartStore from '@/stores/cart/cart'
import Register from '@/components/views/home/auth/Register.vue'
import Login from '@/components/views/home/auth/Login.vue'
import _storeUser from '@/stores/user'
import Dropdown from './Dropdown.vue'
import router from '@/router'

const cartStore = CartStore()
const storeUser = _storeUser()

const filter = ref('')
const mainCategories = ref([])
const subCategories = ref([])
const finalCategories = ref([])
const register = ref(false)
const login = ref(false)

const logout = (_closeDropdown: () => void) => {
  router.push({ name: 'home' })
  storeUser.reset()
  cartStore.reset()
  _closeDropdown()
}
const goToCart = () => {router.push({ name: 'checkout' })}

onMounted(async () => {
  const response = await getAllCategoriesMenu()
  if (response.status === 'success') {
    mainCategories.value = response.data?.mainCategories
    subCategories.value = response.data?.subCategories
    finalCategories.value = response.data?.finalCategories
  }
})
</script>
<template>
  <header>
    <nav class="fixed left-0 top-0 z-20 w-full border-gray-200 bg-gray-100 dark:border-gray-600">
      <ul class="navigation relative mx-auto flex flex-wrap items-center justify-between py-2 lg:py-0">
        <label for="check" class="open-menu"><Bars3BottomLeftIcon class="w-6 text-gray-800" /></label>

        <div class="ml-14 w-1/6 xl:ml-12">
          <a class="logo" href="/">
            <h3 class="text-2xl font-bold">LOGO</h3>
          </a>
        </div>

        <section class="flex justify-between xl:w-4/5">
          <input type="checkbox" id="check" />

          <span
            class="menu m-auto flex lg:gap-4 [&>li>a]:relative [&>li>a]:text-center [&>li>a]:text-lg [&>li>a]:font-medium [&>li>a]:transition [&>li>a]:duration-200 [&>li>a]:ease-in-out"
          >
            <li class="group inline-block" v-for="mainCategory in mainCategories">
              <button class="h-full border-b-4 border-transparent p-3 uppercase hover:border-b-4 hover:border-gray-900">
                <!---CATEGORIA PADRE------>
                <h4>{{ $i18n.locale.toLowerCase() == 'es_es' ? mainCategory?.name : mainCategory?.englishName }}</h4>
              </button>
              <ul class="absolute left-0 hidden w-full border-y bg-gray-100 text-gray-800 ring-0 group-hover:block">
                <div class="m-auto mx-auto grid max-w-screen-xl px-4 py-5 text-sm dark:text-gray-400 md:grid-cols-6 md:px-6">
                  <ul
                    v-for="subCategory in subCategories.filter((category) => category.parent_id == mainCategory._id)"
                    class="mx-auto space-y-1 sm:mb-4 md:mb-0"
                    aria-labelledby="mega-menu-full-cta-button"
                  >
                    <li>
                      <!---SUBCATEGORIA------>
                      <h3 href="#" class="font-bold uppercase">
                        {{ $i18n.locale.toLowerCase() == 'es_es' ? subCategory?.name : subCategory?.englishName }}
                      </h3>
                    </li>
                    <li class="flex flex-col gap-2 text-sm">
                      <!---ITEMS DE SUBCATEGORIA------>
                      <a
                        v-for="finalCategory in finalCategories.filter((category) => category.parent_id == subCategory._id)"
                        href="#"
                        class="hover:underline"
                        >{{ $i18n.locale.toLowerCase() == 'es_es' ? finalCategory?.name : finalCategory?.englishName }}</a
                      >
                    </li>
                  </ul>
                </div>
              </ul>
            </li>

            <li>
              <a href="#"
                ><h4 class="h-full border-b-4 border-transparent p-3 text-base uppercase hover:border-b-4 hover:border-gray-900">
                  Ofertas del dia
                </h4></a
              >
            </li>
            <li>
              <a href="#"
                ><h4 class="h-full border-b-4 border-transparent p-3 text-base uppercase hover:border-b-4 hover:border-gray-900">
                  {{ $t('COMMON.GIFT_CART') }}
                </h4></a
              >
            </li>
            <label for="check" class="close-menu"><XMarkIcon class="w-4 text-white" /></label>
          </span>

          <div class="mr-5 flex items-center gap-2 lg:mr-10">
            <InputSearch
              class="mr-4 hidden xl:block"
              id="search"
              v-model="filter"
              name="Search"
              :placeholder="'Search'"
              @clear="filter = ''"
            />

            <LanguageSelector />
            <Dropdown v-if="storeUser.currentUser">
              <template v-slot:trigger="{ openDropdown, isOpen }">
                <button
                  class="item-pcenter group relative my-2 flex w-max items-center justify-center gap-1 rounded-md bg-white px-2 py-1.5 font-bold text-gray-800 hover:bg-gray-700 hover:bg-opacity-90 hover:text-white"
                  @click="openDropdown"
                >
                  <p v-text="`${storeUser.currentUser?.name} ${storeUser.currentUser?.lastname?.charAt(0) ?? ''}`" class="mr-1 text-base" />
                  <ChevronDownIcon class="text-gray w-4 transition-all ease-in-out" :class="{ 'rotate-180': isOpen }" />
                </button>
              </template>
              <template v-slot:content="{ closeDropdown }">
                <button @click="logout(closeDropdown)" class="w-28 py-2 hover:bg-gray-200">
                  <p>Cerrar sesion</p>
                </button>
              </template>
            </Dropdown>

            <Btn class="" color="secondary" v-else @click="register = true" with-icon :text="$t('COMMON.REGISTER')">
              <template #icon>
                <UserIcon class="w-5" />
              </template>
            </Btn>
            <Btn color="secondary" class="hidden lg:block" is-tooltip with-icon :text="$t('COMMON.FAVORITE')" isFull>
              <template #icon>
                <HeartIcon class="w-5" />
              </template>
            </Btn>
            <Btn @click="goToCart" color="secondary" is-tooltip with-icon :text="$t('COMMON.CART')" isFull>
              <template #icon>
                <ShoppingCartIcon class="w-5" />
              </template>
              <span
                class="text-md h-5 w-5 rounded-full bg-gray-800 text-white group-hover:bg-white group-hover:text-gray-900"
                v-text="cartStore.quantityInCar"
              ></span>
            </Btn>
          </div>
        </section>
      </ul>
    </nav>
  </header>

  <Register v-if="register" @close="register = false" @closeRegister="login = true" @login="(login = true), (register = false)" />
  <Login v-if="login" @close="login = false" @register="(login = false), (register = true)" />
</template>
