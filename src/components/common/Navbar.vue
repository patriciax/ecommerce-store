<script setup lang="ts">
import { XMarkIcon, ShoppingCartIcon, HeartIcon, UserIcon, Bars3BottomLeftIcon } from '@heroicons/vue/24/outline'
import { ref } from 'vue'
import Btn from '@/components/common/Btn.vue'
import InputSearch from '@/components/common/InputSearch.vue'

const filter = ref('')
</script>
<template>
  <header>
    <nav class="fixed left-0 top-0 z-20 w-full border-gray-200 bg-gray-100 dark:border-gray-600">
      <ul class="navigation relative mx-auto flex flex-wrap items-center justify-between py-2 lg:py-0">
        <label for="check" class="open-menu"><Bars3BottomLeftIcon class="w-6 text-gray-800" /></label>

        <div class="ml-14 w-1/6">
          <a class="logo" href="#">
            <h3 class="text-2xl font-bold">LOGO</h3>
          </a>
        </div>

        <section class="flex justify-between lg:w-4/5">
          <input type="checkbox" id="check" />

          <span
            class="menu m-auto flex lg:gap-8 [&>li>a]:relative [&>li>a]:text-center [&>li>a]:text-lg [&>li>a]:font-medium [&>li>a]:transition [&>li>a]:duration-200 [&>li>a]:ease-in-out"
          >
            <li class="group inline-block">
              <button class="h-full border-b-4 border-transparent p-3 text-lg uppercase hover:border-b-4 hover:border-gray-900">
                <!---CATEGORIA PADRE------>
                <h4>Mujer</h4>
              </button>
              <ul class="absolute left-0 hidden w-full border-y bg-gray-100 text-gray-800 ring-0 group-hover:block">
                <div class="m-auto mx-auto grid max-w-screen-xl px-4 py-5 text-sm dark:text-gray-400 md:grid-cols-6 md:px-6">
                  <ul class="mx-auto space-y-1 sm:mb-4 md:mb-0" aria-labelledby="mega-menu-full-cta-button">
                    <li>
                      <!---SUBCATEGORIA------>
                      <h3 href="#" class="font-bold uppercase">NUEVO Y TENDENCIA</h3>
                    </li>
                    <li class="flex flex-col gap-2 text-sm">
                      <!---ITEMS DE SUBCATEGORIA------>
                      <a href="#" class="hover:underline"> Lorem ipsum asmet</a>
                      <a href="#" class="hover:underline"> Lorem ipsum asmet</a>
                      <a href="#" class="hover:underline"> Lorem ipsum asmet</a>
                    </li>
                  </ul>
                  <ul class="mx-auto space-y-1 sm:mb-4 md:mb-0" aria-labelledby="mega-menu-full-cta-button">
                    <li>
                      <!---SUBCATEGORIA------>
                      <h3 href="#" class="font-bold uppercase">ZAPATOS</h3>
                    </li>
                    <li class="flex flex-col gap-2 text-sm">
                      <!---ITEMS DE SUBCATEGORIA------>
                      <a href="#" class="hover:underline"> Lorem ipsum asmet</a>
                      <a href="#" class="hover:underline"> Lorem ipsum asmet</a>
                      <a href="#" class="hover:underline"> Lorem ipsum asmet</a>
                      <a href="#" class="hover:underline"> Lorem ipsum asmet</a>

                      <a href="#" class="hover:underline"> Lorem ipsum asmet</a>
                    </li>
                  </ul>
                  <ul class="mx-auto space-y-1 sm:mb-4 md:mb-0" aria-labelledby="mega-menu-full-cta-button">
                    <li>
                      <!---SUBCATEGORIA------>
                      <h3 href="#" class="font-bold uppercase">ROPA</h3>
                    </li>
                    <li class="flex flex-col gap-2 text-sm">
                      <!---ITEMS DE SUBCATEGORIA------>
                      <a href="#" class="hover:underline"> Lorem ipsum asmet</a>
                      <a href="#" class="hover:underline"> Lorem ipsum asmet</a>
                    </li>
                  </ul>
                  <ul class="mx-auto space-y-1 sm:mb-4 md:mb-0" aria-labelledby="mega-menu-full-cta-button">
                    <li>
                      <!---SUBCATEGORIA------>
                      <h3 href="#" class="font-bold uppercase">ACCESORIOS</h3>
                    </li>
                    <li class="flex flex-col gap-2 text-sm">
                      <!---ITEMS DE SUBCATEGORIA------>
                      <a href="#" class="hover:underline"> Lorem ipsum asmet</a>
                    </li>
                  </ul>
                  <ul class="mx-auto space-y-1 sm:mb-4 md:mb-0" aria-labelledby="mega-menu-full-cta-button">
                    <li>
                      <!---SUBCATEGORIA------>
                      <h3 href="#" class="font-bold uppercase">DEPORTE</h3>
                    </li>
                    <li class="flex flex-col gap-2 text-sm">
                      <!---ITEMS DE SUBCATEGORIA------>
                      <a href="#" class="hover:underline"> Lorem ipsum asmet</a>
                      <a href="#" class="hover:underline"> Lorem ipsum asmet</a>
                      <a href="#" class="hover:underline"> Lorem ipsum asmet</a>

                      <a href="#" class="hover:underline"> Lorem ipsum asmet</a>
                    </li>
                  </ul>
                  <ul class="mx-auto space-y-1 sm:mb-4 md:mb-0" aria-labelledby="mega-menu-full-cta-button">
                    <li>
                      <!---SUBCATEGORIA------>
                      <h3 href="#" class="font-bold uppercase">ROPA INTERIOR</h3>
                    </li>
                    <li class="flex flex-col gap-2 text-sm">
                      <!---ITEMS DE SUBCATEGORIA------>
                      <a href="#" class="hover:underline"> Lorem ipsum asmet</a>
                      <a href="#" class="hover:underline"> Lorem ipsum asmet</a>
                    </li>
                  </ul>
                </div>
              </ul>
            </li>
            <li class="group inline-block">
              <button class="h-full border-b-4 border-transparent p-3 text-lg uppercase hover:border-b-4 hover:border-gray-900">
                <!---CATEGORIA PADRE------>
                <h4>Hombre</h4>
              </button>
              <ul class="absolute left-0 hidden w-full border-y bg-gray-100 text-gray-800 ring-0 group-hover:block">
                <div class="m-auto mx-auto grid max-w-screen-xl px-4 py-5 text-sm dark:text-gray-400 md:grid-cols-6 md:px-6">
                  <ul class="mx-auto space-y-1 sm:mb-4 md:mb-0" aria-labelledby="mega-menu-full-cta-button">
                    <li>
                      <!---SUBCATEGORIA------>
                      <h3 href="#" class="font-bold uppercase">NUEVO Y TENDENCIA</h3>
                    </li>
                    <li class="flex flex-col gap-2 text-sm">
                      <!---ITEMS DE SUBCATEGORIA------>
                      <a href="#" class="hover:underline"> Lorem ipsum asmet</a>
                      <a href="#" class="hover:underline"> Lorem ipsum asmet</a>
                      <a href="#" class="hover:underline"> Lorem ipsum asmet</a>
                    </li>
                  </ul>
                  <ul class="mx-auto space-y-1 sm:mb-4 md:mb-0" aria-labelledby="mega-menu-full-cta-button">
                    <li>
                      <!---SUBCATEGORIA------>
                      <h3 href="#" class="font-bold uppercase">ZAPATOS</h3>
                    </li>
                    <li class="flex flex-col gap-2 text-sm">
                      <!---ITEMS DE SUBCATEGORIA------>
                      <a href="#" class="hover:underline"> Lorem ipsum asmet</a>
                      <a href="#" class="hover:underline"> Lorem ipsum asmet</a>
                      <a href="#" class="hover:underline"> Lorem ipsum asmet</a>
                      <a href="#" class="hover:underline"> Lorem ipsum asmet</a>

                      <a href="#" class="hover:underline"> Lorem ipsum asmet</a>
                    </li>
                  </ul>
                  <ul class="mx-auto space-y-1 sm:mb-4 md:mb-0" aria-labelledby="mega-menu-full-cta-button">
                    <li>
                      <!---SUBCATEGORIA------>
                      <h3 href="#" class="font-bold uppercase">ROPA</h3>
                    </li>
                    <li class="flex flex-col gap-2 text-sm">
                      <!---ITEMS DE SUBCATEGORIA------>
                      <a href="#" class="hover:underline"> Lorem ipsum asmet</a>
                      <a href="#" class="hover:underline"> Lorem ipsum asmet</a>
                    </li>
                  </ul>
                  <ul class="mx-auto space-y-1 sm:mb-4 md:mb-0" aria-labelledby="mega-menu-full-cta-button">
                    <li>
                      <!---SUBCATEGORIA------>
                      <h3 href="#" class="font-bold uppercase">ACCESORIOS</h3>
                    </li>
                    <li class="flex flex-col gap-2 text-sm">
                      <!---ITEMS DE SUBCATEGORIA------>
                      <a href="#" class="hover:underline"> Lorem ipsum asmet</a>
                    </li>
                  </ul>
                  <ul class="mx-auto space-y-1 sm:mb-4 md:mb-0" aria-labelledby="mega-menu-full-cta-button">
                    <li>
                      <!---SUBCATEGORIA------>
                      <h3 href="#" class="font-bold uppercase">DEPORTE</h3>
                    </li>
                    <li class="flex flex-col gap-2 text-sm">
                      <!---ITEMS DE SUBCATEGORIA------>
                      <a href="#" class="hover:underline"> Lorem ipsum asmet</a>
                      <a href="#" class="hover:underline"> Lorem ipsum asmet</a>
                      <a href="#" class="hover:underline"> Lorem ipsum asmet</a>

                      <a href="#" class="hover:underline"> Lorem ipsum asmet</a>
                    </li>
                  </ul>
                  <ul class="mx-auto space-y-1 sm:mb-4 md:mb-0" aria-labelledby="mega-menu-full-cta-button">
                    <li>
                      <!---SUBCATEGORIA------>
                      <h3 href="#" class="font-bold uppercase">ROPA INTERIOR</h3>
                    </li>
                    <li class="flex flex-col gap-2 text-sm">
                      <!---ITEMS DE SUBCATEGORIA------>
                      <a href="#" class="hover:underline"> Lorem ipsum asmet</a>
                      <a href="#" class="hover:underline"> Lorem ipsum asmet</a>
                    </li>
                  </ul>
                </div>
              </ul>
            </li>

            <li>
              <a href="#"
                ><h4 class="h-full border-b-4 border-transparent p-3 text-lg hover:border-b-4 hover:border-gray-900">Ofertas del dia</h4></a
              >
            </li>
            <li>
              <a href="#"
                ><h4 class="h-full border-b-4 border-transparent p-3 text-lg hover:border-b-4 hover:border-gray-900">
                  Tarjeta de regalo
                </h4></a
              >
            </li>
            <label for="check" class="close-menu"><XMarkIcon class="w-4 text-white" /></label>
          </span>

          <div class="mr-5 flex items-center gap-2 lg:mr-14">
            <InputSearch
              class="mr-4 hidden lg:block"
              id="search"
              v-model="filter"
              name="Search"
              :placeholder="'Search'"
              @clear="filter = ''"
            />

            <Btn color="secondary" with-icon :text="'Registrarse'" isFull>
              <template #icon>
                <UserIcon class="w-5" />
              </template>
            </Btn>
            <Btn color="secondary" class="hidden lg:block" is-tooltip with-icon :text="$t('COMMON.FAVORITE')" isFull>
              <template #icon>
                <HeartIcon class="w-5" />
              </template>
            </Btn>
            <Btn color="secondary" is-tooltip with-icon :text="$t('COMMON.CART')" isFull>
              <template #icon>
                <ShoppingCartIcon class="w-5" />
              </template>
              <span class="text-md h-5 w-5 rounded-full bg-gray-800 text-white group-hover:bg-white group-hover:text-gray-900">2</span>
            </Btn>
          </div>
        </section>
      </ul>
    </nav>
  </header>
</template>
