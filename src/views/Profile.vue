<script setup>
import Modal from '@/components/common/Modal.vue'
import _storeInvoice from '@/stores/profile'
import _storeUser from '@/stores/user'
import { decimalNumberFormat } from '@/utils/numberFormat'
import { onMounted, ref } from 'vue'
const storeInvoices = _storeInvoice()
const storeUser = _storeUser()
const orderInfo = ref(true)
const personalInfo = ref(false)
const showModalInvoice = ref(false)
onMounted(async () => {
  await storeInvoices.getInvoices()
})

const formatDateTime = (dateString) => {
  if (dateString) {
    const date = new Date(dateString)
    let day = date.getDate()
    let month = date.getMonth() + 1
    let year = date.getFullYear()
    const meses = [
      'enero',
      'febrero',
      'marzo',
      'abril',
      'mayo',
      'junio',
      'julio',
      'agosto',
      'septiembre',
      'octubre',
      'noviembre',
      'diciembre',
    ]
    return `${day} de ${meses[month - 1]} de ${year}`
  } else {
    return ''
  }
}

function showDetails(invoice) {
  storeInvoices.setInvoice(invoice.invoiceProduct)
  showModalInvoice.value = true
}
function closeModal() {
  showModalInvoice.value = false
  storeInvoices.setInvoice(null)
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
        :class="orderInfo ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'"
        @click="(orderInfo = true), (personalInfo = false)"
        class="mb-1 mr-6 rounded-lg p-2 px-4 text-base font-bold"
      >
        {{ $t('PROFILE.MYBUYS') }}
      </button>
      <button
        :class="personalInfo ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'"
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
            <p
              class="rounded-lg border p-6 text-center text-lg font-bold text-gray-500"
              v-if="storeInvoices.invoice?.length == 0"
              v-text="$t('PROFILE.NO_ORDERS')"
            />

            <table v-else class="w-full text-left text-sm text-gray-500 dark:text-gray-400">
              <tbody>
                <tr class="text-qgray default-border-bottom whitespace-nowrap border-b px-2 text-base">
                  <td class="block whitespace-nowrap py-4 text-center">{{ $t('PROFILE.ORDER') }}</td>
                  <td class="whitespace-nowrap py-4 text-center">{{ $t('PROFILE.DATE') }}</td>
                  <td class="whitespace-nowrap py-4 text-center">{{ $t('PROFILE.STATUS') }}</td>
                  <td class="whitespace-nowrap py-4 text-center">{{ $t('PROFILE.AMOUT') }}</td>
                  <!-- <td class="whitespace-nowrap py-4 text-center">Action</td> -->
                </tr>
                <tr class="border-b bg-white hover:bg-gray-50" v-for="(item, index) in storeInvoices.invoice" :key="index">
                  <td class="py-4 text-center">
                    <p class="text-qgray text-lg font-medium">#{{ item.transactionOrder }}</p>
                  </td>
                  <td class="px-2 py-4 text-center">
                    <span class="text-qgray whitespace-nowrap text-base">{{ formatDateTime(item.created) }}</span>
                  </td>
                  <td class="px-2 py-4 text-center">
                    <span
                      :class="item.payment.status == 'approved' ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500'"
                      class="rounded p-2 text-sm"
                      >{{ item.payment.status }}</span
                    >
                  </td>
                  <td class="px-2 py-4 text-center">
                    <p class="text-qblack whitespace-nowrap px-2 text-base">
                      {{ item?.payment?.type === 'banesco' || item?.payment?.type === 'pagoMovil' ? 'Bs.' : '$' }}
                      {{
                        decimalNumberFormat(
                          item.payment?.total +
                            (item.payment?.carrierRate ? item.payment?.carrierRate?.amount * 1 : 0) +
                            item.payment.taxAmount
                        )
                      }}
                    </p>
                  </td>
                  <td class="py-4 text-center">
                    <button @click="showDetails(item)" type="button" class="h-[46px] w-[116px] rounded-lg bg-gray-900 font-bold text-white">
                      {{ $t('PROFILE.VIEWDETAILS') }}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div v-if="personalInfo" class="dashboard-info flex max-w-3xl items-center justify-between rounded-lg bg-gray-100 px-7 py-7">
          <div class="">
            <p class="title text-[22px] font-semibold">{{ $t('PROFILE.PERSONAL_INFORMATION') }}</p>
            <div class="mt-5">
              <section class="">
                <div class="mb-2 flex gap-2 text-base">
                  <div>{{ $t('FORM.NAME') }}:</div>
                  {{ `${storeUser.currentUser?.name} ${storeUser.currentUser?.lastname ?? ''}` }}
                </div>

                <div class="mb-2 flex gap-2 text-base">
                  <div>{{ $t('FORM.EMAIL') }}:</div>

                  <div class="text-qblack text-base font-medium">{{ storeUser.currentUser?.email }}</div>
                </div>
                <div class="mb-2 flex gap-2 text-base">
                  <div>{{ $t('FORM.PHONE') }}:</div>
                  <div class="text-qblack text-base font-medium">{{ storeUser.currentUser?.phone }}</div>
                </div>
                <div class="mb-2 flex gap-2 text-base">
                  <div>{{ $t('FORM.ADDRESS') }}:</div>
                  <div class="text-qblack text-base font-medium">{{ storeUser.currentUser?.address }}</div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>
    </section>
  </section>

  <Modal v-if="showModalInvoice" size="w-[675px]" @close="closeModal">
    <div class="flex  min-h-[300px] flex-col justify-center rounded-xl bg-white px-6 py-6">
      <p class="text-center text-lg font-bold mb-6 text-gray-900">
        {{ $t('COMMON.INVOICE_TITLE') }}
    </p>
      <table class="w-full text-left text-sm text-gray-500 dark:text-gray-400">
        <tbody>
          <tr class="text-qgray default-border-bottom whitespace-nowrap border-b px-2 text-base">
            <td class="block whitespace-nowrap py-4 ">{{ $t('COMMON.PRODUCT') }}</td>
            <td class="whitespace-nowrap py-4 text-center">{{ $t('COMMON.COLOR') }}</td>
            <td class="whitespace-nowrap py-4 text-center">{{ $t('COMMON.SIZE') }}</td>
            <td class="whitespace-nowrap py-4 text-center">{{ $t('FORM.PRICE') }}</td>
            <!-- <td class="whitespace-nowrap py-4 text-center">Action</td> -->
          </tr>
          <tr class="border-b bg-white hover:bg-gray-50" v-for="(item, index) in storeInvoices.detailInvoice" :key="index">
            <td class="py-4 ">
              <p class="text-qgray  font-medium">{{ locale === 'en_US' ? item.product?.nameEnglish : item.product?.name }}</p>
            </td>
            <td class="px-2 py-4 text-center">
              <p class="ml-2 font-bold" v-text="locale === 'en_US' ? item?.color?.englishName : item?.color?.name" />
            </td>
            <td class="px-2 py-4 text-center">
              <p class="ml-2 font-bold" v-text="locale === 'en_US' ? item?.size?.englishName : item?.size?.name" />

            </td>
            <td class="px-2 py-4 text-center">
             
            <p class=" tracking-tight text-gray-900">
              
              ${{ item.product?.priceDiscount ? item.product?.priceDiscount : item.product?.price }}
            </p>
            </td>
         
          </tr>
        </tbody>
      </table>
    </div>
  </Modal>
</template>
