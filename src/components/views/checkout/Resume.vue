<script setup>
import Btn from '@/components/common/Btn.vue'
import CartList from '@/components/common/CartList.vue'
import StorePaymentMethods from '@/stores/paymentMethods'
import { ref, computed } from 'vue'
// const storePaymentMethods = StorePaymentMethods()

const storePaymentMethods = ref({
  invoice: {
    user: '65e7a0993c9ee9516ed3a5a7',
    name: 'Willian',
    email: 'williandev95@gmail.com',
    phone: '58672344',
    transactionOrder: '9041697917308755',
    payment: '660609a47e9fadf36da41bb7',
    carrier: { carrierName: 'ZOOM', state: 'MIRANDA', office: '1247', address: 'CALLE SUCRE CON AV. AYACUCHO, LOCAL C. NRO. 3.' },
    _id: '660609a57e9fadf36da41bb9',
    created: '2024-03-29T00:21:57.064Z',
    __v: 0,
    id: '660609a57e9fadf36da41bb9',
  },
  cart: [
    {
      name: 'Producto 1',
      nameEnglish: 'Product 1',
      description: '<p>Descripción del producto</p>',
      descriptionEnglish: '<p>Product description\t</p>',
      showInHomeSection: 'section-1',
      price: 56,
      priceDiscount: 0,
      productVariations: [
        { size: ['65d954b4a7b0505966912fae'], color: ['65d8faed42cb44b16c66e0d6'], stock: 1, _id: '65fd6f51498019add7dd9c66' },
        { size: ['65d8f7ae631166cea10c8d19'], color: ['65d8faed42cb44b16c66e0d6'], stock: 7, _id: '65fd6f51498019add7dd9c67' },
        { size: ['65d8f7ae631166cea10c8d19'], color: ['65d954cda7b0505966912fb8'], stock: 6, _id: '65fd6f51498019add7dd9c68' },
      ],
      mainImage: 'https://ecommerce-r.sfo3.cdn.digitaloceanspaces.com/1710977390362',
      categories: [
        {
          _id: '65e8fde1d745911b0a107221',
          name: 'test',
          englishName: 'test',
          parent_id: '65dbeacd0f53862eaaf97114',
          categoryType: 'final',
          slug: 'test-1709768161033',
          deletedAt: null,
          createdAt: '2024-03-06T23:36:01.034Z',
          __v: 0,
        },
        {
          _id: '65dfc5f8ea507a4003d3e4d3',
          name: 'Categoría 1',
          englishName: 'Category 1',
          parent_id: '65dbec44cb520acfb2794839',
          categoryType: 'final',
          slug: 'categoria-1',
          deletedAt: null,
          createdAt: '2024-02-28T23:47:04.118Z',
          __v: 0,
        },
      ],
      tags: ['categoria', '1', 'category', '1', 'test', 'test', 'producto', '1', 'product', '1'],
      images: [],
      slug: 'producto-1',
      deletedAt: null,
      createdAt: '2024-03-20T23:29:54.539Z',
      __v: 0,
      size: {
        _id: '65d954b4a7b0505966912fae',
        name: 'talla 35',
        englishName: 'size 35',
        deletedAt: null,
        createdAt: '2024-02-24T02:30:12.918Z',
        __v: 0,
      },
      color: {
        _id: '65d8faed42cb44b16c66e0d6',
        name: 'Verde',
        englishName: 'Green',
        hex: '#1ed22a',
        deletedAt: null,
        createdAt: '2024-02-23T20:07:09.966Z',
        __v: 0,
      },
      stock: 1,
      quantity: 1,
      productId: '65fb71726e61828b37bd7357',
    },
  ],
})

const total = computed(() => {
  let total = 0
  storePaymentMethods.value.cart.forEach((item) => {
    total += item.price * item.quantity
  })
  return total.toFixed(2)
})
</script>
<template>
  <section>
    <p class="text-2xl font-bold" v-text="'Resumen del pedido'" />
    <div class="text-md mb-4 flex items-center gap-1 border-b pb-2 text-sm font-bold text-gray-500">
      Orden:
      <p class="mt-0.5 lowercase">{{ storePaymentMethods.invoice.transactionOrder }}</p>
    </div>
    <section class="grid grid-cols-2 gap-x-6">

      <div v-for="(item, index) in storePaymentMethods.cart" :key="index">
        <li class="mb-6 flex items-center gap-4 rounded-2xl border bg-white px-0 py-0 text-lg">
          <img :src="item.mainImage || item.product?.mainImage" alt="" class="h-24 w-24 rounded-bl-xl rounded-br-xl object-cover" />
          <section>
            <h3 class="max-w-72 text-lg text-gray-900">
              {{ locale === 'en_US' ? item.nameEnglish || item.product?.nameEnglish : item.name }}
            </h3>

            <div class="flex gap-0.5">
              <p class="flex text-sm text-gray-700">{{ $t('COLOR') }}: {{ item?.color?.name }}</p>
              <p class="flex text-sm text-gray-700">{{ $t('SIZE') }}: {{ item?.size?.name }}</p>
              <p class="flex text-sm text-gray-700">{{ $t('COMMON.QUANTITY') }}: {{ item.quantity }}</p>
            </div>
          </section>
          <div class="mt-5 flex flex-1 items-center justify-end">
            <p class="inline pr-4 font-bold">${{ item.priceDiscount || item.price }}</p>
          </div>
        </li>
      </div>
      <section class="grid gap-x-4 gap-y-1">
        <section class="grid gap-3 border-b pb-2">
          <div class="flex flex-col text-base font-bold">
            Dirección de facturación
            <p class="mt-0.5 lowercase text-gray-500">{{ storePaymentMethods.invoice.carrier.address }}</p>
          </div>
          <div class="flex flex-col text-base font-bold">
            Fecha del pedido
            <p class="mt-0.5 lowercase text-gray-500">{{ storePaymentMethods.invoice.created }}</p>
          </div>

          <div class="flex flex-col text-base font-bold">
            Número de pedido
            <p class="mt-0.5 lowercase text-gray-500">{{ storePaymentMethods.invoice.transactionOrder }}</p>
          </div>
        </section>
        <div class="mb-6 flex flex-col text-base font-bold">
          Total
          <p class="mt-0.5 lowercase text-gray-500">{{ total }}</p>
        </div>
        <Btn isFull color="primary" :text="'Seguir comprando'" @click="goToPayment" />
      </section>
    </section>
  </section>
</template>
