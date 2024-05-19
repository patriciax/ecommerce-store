<script setup>
import _storeInvoice from '@/stores/profile'
import _storeUser from '@/stores/user'
import { onMounted, ref } from 'vue'

const storeInvoices = _storeInvoice()
const storeUser = _storeUser()
const orderInfo = ref(true)
const personalInfo = ref(false)

onMounted(async () => {
  await storeInvoices.getInvoices()
})

const formatDateTime = (dateString) => {
  if (dateString) {
    const date = new Date(dateString)
    let day = date.getDate()
    let month = date.getMonth() + 1
    let year = date.getFullYear()
    const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
    return `${day} de ${meses[month - 1]} de ${year}`
  } else {
    return ''
  }
}
</script>
<template>
  <section class="min-h-[80vh]">
    <p class="text-center text-lg font-bold text-gray-900">
      <span class="text-gray-500">Hello, {{ `${storeUser.currentUser?.name} ${storeUser.currentUser?.lastname ?? ''}` }}</span> <br />
      {{ $t('PROFILE.TITLE') }}
    </p>
    <div class="my-8 text-center">
      <button
        @click="(orderInfo = true), (personalInfo = false)"
        class="mb-1 mr-6 rounded-lg bg-gray-900 p-2 px-4 text-base font-bold text-white"
      >
       {{ $t('PROFILE.MYBUYS') }}
      </button>
      <button
        @click="(orderInfo = false), (personalInfo = true)"
        class="rounded-lg bg-gray-100 p-2 px-4 text-base font-bold text-gray-900 hover:bg-gray-900 hover:text-white"
      >
       {{ $t('PROFILE.MYPROFILE') }}
      </button>
    </div>
    <section class="flex justify-center gap-10">
      <section class="mx-auto w-full max-w-3xl">
        <div v-if="orderInfo" class="item-body dashboard-wrapper w-full">
          <div class="relative w-full overflow-x-auto sm:rounded-lg">
            <table class="w-full text-left text-sm text-gray-500 dark:text-gray-400">
              <tbody>
                <tr class="text-qgray default-border-bottom whitespace-nowrap border-b px-2 text-base">
                  <td class="block whitespace-nowrap py-4 text-center">{{ $t('PROFILE.ORDER') }}</td>
                  <td class="whitespace-nowrap py-4 text-center">{{ $t('PROFILE.DATE') }}</td>
                  <td class="whitespace-nowrap py-4 text-center">{{ $t('PROFILE.STATUS') }}</td>
                  <td class="whitespace-nowrap py-4 text-center">{{ $t('PROFILE.AMOUT') }}</td>
                  <!-- <td class="whitespace-nowrap py-4 text-center">Action</td> -->
                </tr>
                <tr class="border-b bg-white hover:bg-gray-50" v-for="(item , index) in storeInvoices.invoice" :key="index">
                  <td class="py-4 text-center"><p class="text-qgray text-lg font-medium">#{{ item.transactionOrder }}</p></td>
                  <td class="px-2 py-4 text-center"><span class="text-qgray whitespace-nowrap text-base">{{ formatDateTime(item.created) }}</span></td>
                  <td class="px-2 py-4 text-center"><span class="rounded bg-green-100 p-2 text-sm text-green-500">{{ item.payment.status }}</span></td>
                  <td class="px-2 py-4 text-center"><p class="text-qblack whitespace-nowrap px-2 text-base">${{ item.payment.total }}</p></td>
                  <td class="py-4 text-center">
                    <button type="button" class="bg-gray-400 text-white rounded-lg h-[46px] w-[116px] font-bold">{{ $t('PROFILE.VIEWDETAILS') }}</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div v-if="personalInfo" class="dashboard-info flex max-w-3xl items-center justify-between rounded-lg bg-gray-100 px-7 py-7">
          <div class="">
            <p class="title text-[22px] font-semibold">{{ $t('PROFILE.PERSONALINFORMATION') }}</p>
            <div class="mt-5">
              <table>
                <tr class="mb-5 inline-flex">
                  <td class="text-qgraytwo block w-[100px] text-base"><div>{{ $t('FORM.NAME') }}:</div></td>
                  <td class="text-qblack text-base font-medium">
                    {{ `${storeUser.currentUser?.name} ${storeUser.currentUser?.lastname ?? ''}` }}
                  </td>
                </tr>
                <tr class="mb-5 inline-flex">
                  <td class="text-qgraytwo block w-[100px] text-base"><div>{{ $t('FORM.EMAIL') }}:</div></td>
                  <td class="text-qblack text-base font-medium">{{ storeUser.currentUser?.email }}</td>
                </tr>
                <tr class="mb-5 inline-flex">
                  <td class="text-qgraytwo block w-[100px] text-base"><div>{{ $t('FORM.PHONE') }}:</div></td>
                  <td class="text-qblack text-base font-medium">{{ storeUser.currentUser?.phone }}</td>
                </tr>
                <tr class="mb-5 inline-flex">
                  <td class="text-qgraytwo block w-[100px] text-base"><div>{{ $t('FORM.ADDRESS') }}:</div></td>
                  <td class="text-qblack text-base font-medium">{{ storeUser.currentUser?.address }}</td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </section>
    </section>
  </section>
</template>
