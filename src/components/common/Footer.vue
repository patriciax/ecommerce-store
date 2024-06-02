<script setup>
import { _getItem } from '@/api/repositories/footer.repository'
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'

const footerData = ref([])

onMounted(async () => {
  const response = await _getItem()
  footerData.value = response.data
})
</script>

<template>
  <div class="mb-1 mt-10 h-1.5 w-full bg-black"></div>
  <div class="flex w-full items-center justify-center gap-2 mb-1 bg-black p-3">
    <div class="rounded-full border p-1">
      <img class="h-4 w-4" src="@/assets/images/icons/Facebook.svg" alt="icon rrss" />
    </div>
    <div class="rounded-full border p-1">
      <img class="h-4 w-4" src="@/assets/images/icons/Instagram.svg" alt="icon rrss" />
    </div>
    <div class="rounded-full border p-1">
      <img class="h-4 w-4" src="@/assets/images/icons/youtube.png" alt="icon rrss" />
    </div>
    <div class="rounded-full border p-1">
      <img class="h-4 w-4 invert" src="@/assets/images/icons/x.svg" alt="icon rrss" />
    </div>
  </div>
  <footer class="relative z-10 border-spacing-0.5 border-b bg-black pb-10 pt-10 text-white lg:pb-20">
    <div class="mx-auto max-w-[1440px] px-6">
      <div class="mb-10">
        <img src="@/assets/images/iso.png" class="w-12 invert" alt="" />
      </div>
      <div class="-mx-4 grid grid-cols-1 lg:grid-cols-4">
        <div class="w-full grid-cols-4 px-4 lg:grid-cols-1">
          <div class="mb-10 w-full">
            <h4 class="text-dark mb-4 text-lg font-semibold dark:text-white">Envíos y entregas</h4>
            <ul class="space-y-3">
              <li v-for="item in footerData?.filter((data) => data.section === '1')" :key="item._id">
                <RouterLink
                  :to="`/footer/${item.slug}`"
                  class="text-body-color hover:text-primary dark:text-dark-6 inline-block text-base leading-loose"
                >
                  {{ $i18n.locale.toLowerCase() == 'es_es' ? item?.title : item?.titleEnglish }}
                </RouterLink>
              </li>
            </ul>
          </div>
        </div>

        <div class="w-full grid-cols-4 px-4 lg:grid-cols-1">
          <div class="mb-10 w-full">
            <h4 class="text-dark mb-4 text-lg font-semibold dark:text-white">Servicio al cliente</h4>
            <ul class="space-y-3">
              <li v-for="item in footerData?.filter((data) => data.section === '2')" :key="item._id">
                <RouterLink
                  :to="`/footer/${item.slug}`"
                  class="text-body-color hover:text-primary dark:text-dark-6 inline-block text-base leading-loose"
                >
                  {{ $i18n.locale.toLowerCase() == 'es_es' ? item?.title : item?.titleEnglish }}
                </RouterLink>
              </li>
            </ul>
          </div>
        </div>

        <div class="w-full grid-cols-4 px-4 lg:grid-cols-1">
          <div class="mb-10 w-full">
            <h4 class="text-dark mb-4 text-lg font-semibold dark:text-white">Acerca de ERoca</h4>
            <ul class="space-y-3">
              <li v-for="item in footerData?.filter((data) => data.section === '3')" :key="item._id">
                <RouterLink
                  :to="`/footer/${item.slug}`"
                  class="text-body-color hover:text-primary dark:text-dark-6 inline-block text-base leading-loose"
                >
                  {{ $i18n.locale.toLowerCase() == 'es_es' ? item?.title : item?.titleEnglish }}
                </RouterLink>
              </li>
            </ul>
          </div>
        </div>

        <!-- <div class="w-full grid-cols-3 px-4 lg:grid-cols-1">
          <div class="mb-10 w-full">
            <h4 class="text-dark mb-4 text-lg font-semibold dark:text-white uppercase"> {{ $t('FOOTER.CUSTOMER_SERVICE') }}</h4>
            <ul class="space-y-3">
              <li>
                <a
                  href="javascript:void(0)"
                  class="text-body-color hover:text-primary dark:text-dark-6 inline-block text-base leading-loose"
                >
                {{ $t('FOOTER.ORDER_STATUS') }}
            
                </a>
              </li>
              <li>
                <a
                  href="javascript:void(0)"
                  class="text-body-color hover:text-primary dark:text-dark-6 inline-block text-base leading-loose"
                >
                  Envió y entrega
                </a>
              </li>
              <li>
                <a
                  href="javascript:void(0)"
                  class="text-body-color hover:text-primary dark:text-dark-6 inline-block text-base leading-loose"
                >
                  Devoluciones
                </a>
              </li>
              <li>
                <a
                  href="javascript:void(0)"
                  class="text-body-color hover:text-primary dark:text-dark-6 inline-block text-base leading-loose"
                >
                  Cancelación del Pedido
                </a>
              </li>
              <li>
                <a
                  href="javascript:void(0)"
                  class="text-body-color hover:text-primary dark:text-dark-6 inline-block text-base leading-loose"
                >
                  Comunícate con nosotros
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div class="w-full grid-cols-3 px-4 lg:grid-cols-1">
          <div class="mb-10 w-full">
            <h4 class="text-dark mb-4 text-lg font-semibold dark:text-white uppercase">{{ $t('FOOTER.OUR_COMPANY') }}</h4>
            <ul class="space-y-3">
              <li>
                <a
                  href="javascript:void(0)"
                  class="text-body-color hover:text-primary dark:text-dark-6 inline-block text-base leading-loose"
                >
                  Propósito
                </a>
              </li>
              <li>
                <a
                  href="javascript:void(0)"
                  class="text-body-color hover:text-primary dark:text-dark-6 inline-block text-base leading-loose"
                >
                  Sustentabilidad
                </a>
              </li>
              <li>
                <a
                  href="javascript:void(0)"
                  class="text-body-color hover:text-primary dark:text-dark-6 inline-block text-base leading-loose"
                >
                  Términos y Condiciones
                </a>
              </li>
              <li>
                <a
                  href="javascript:void(0)"
                  class="text-body-color hover:text-primary dark:text-dark-6 inline-block text-base leading-loose"
                >
                  Políticas de Privacidad y cookies
                </a>
              </li>
            </ul>
          </div>
        </div> -->
        <div class="w-full grid-cols-4 px-4 lg:grid-cols-1">
          <div class="mb-10 w-full">
            <h4 class="text-dark mb-4 text-lg font-semibold uppercase dark:text-white">{{ $t('FOOTER.PAYMENT_METHODS') }}</h4>
            <section class="grid gap-2">
              <ul class="grid grid-cols-4 items-center gap-2">
                <li>
                  <img class="w-16" src="@/assets/images/paymentmethod/visa.webp" />
                </li>
                <li>
                  <img class="w-20" src="@/assets/images/paymentmethod/mastercard.webp" />
                </li>
                <li>
                  <img class="w-20" src="@/assets/images/paymentmethod/americanexpress.webp" />
                </li>
                <li>
                  <img class="w-20 invert" src="@/assets/images/paymentmethod/discover.webp" />
                </li>
              </ul>

              <ul class="grid grid-cols-4 items-center gap-2">
                <li>
                  <img class="w-20" src="@/assets/images/paymentmethod/paypal.webp" />
                </li>
                <!-- <li>
                  <img class="w-16 invert" src="@/assets/images/paymentmethod/applepay.webp" />
                </li> -->
                <li>
                  <img class="w-20 invert" src="@/assets/images/paymentmethod/giftcard.webp" />
                </li>
                <li>
                  <img class="w-16" src="@/assets/images/paymentmethod/zelle.webp" />
                </li>
              </ul>

              <ul class="grid grid-cols-4 items-center gap-2">
                <li>
                  <img class="w-28" src="@/assets/images/paymentmethod/banesco.webp" />
                </li>
                <li>
                  <img class="w-36" src="@/assets/images/paymentmethod/mercantil.webp" />
                </li>
                <li class="text-center">
                  <p v-text="'PagoMóvil'" class="text-base font-bold" />
                </li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  </footer>
  <div>
    <p class="w-full bg-black py-1 text-center text-white" v-text="'©2024 Rcroca, Llc. All Right Reserved'" />
  </div>
</template>
