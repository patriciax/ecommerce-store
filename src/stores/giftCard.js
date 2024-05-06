import { sendGiftCardBalance } from '@/api/repositories/giftCard.repository'
import { _getAllHome } from '@/api/repositories/product.repository'
import { defineStore } from 'pinia'

export default defineStore({
  id: 'GiftCard',
  state: () => ({
    _status: null,
    _error: null,
    _purchaseData: null,
    _balance:null
  }),
  getters: {
    isLoading: (state) => state._status === 'loading',
    isReady: (state) => state._status === 'ready',
    isError: (state) => state._status === 'error',
    error: (state) => state._error,
  },
  actions: {
    async purchaseGiftCard(data) {
      this.changeStatus('loading')
      try {
        const response = await this.purchaseGiftCard(data)
        if (response) {
          this._purchaseData = response.data
          this.changeStatus('ready')
        }
      } catch (error) {
        this.changeStatus('error', error)
      }
    },
    async getAllProducts() {
      this.changeStatus('loading')
      try {
        const response = await _getAllHome()
        if (response) {
          this._allProduct = response.data
          this.changeStatus('ready')
        }
      } catch (error) {
        this.changeStatus('error', error)
      }
    },
    async getBalance(data) {
      this.changeStatus('loading')
      try {
        const response = await sendGiftCardBalance(data)
        console.log(response)
        if (response?.data?.status === 'success') {
          this.changeStatus('ready')
        }else {
          this.changeStatus('error')
        }
      } catch (error) {
        this.changeStatus('error', error)
      }
    },


    changeStatus(status, error = null) {
      this._status = status
      if (status === 'error') this._error = error
    },
  },
})
