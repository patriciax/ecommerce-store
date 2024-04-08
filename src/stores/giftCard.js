import { _getAllHome, _getSingleProduct, _getPrice } from '@/api/repositories/product.repository'
import { defineStore } from 'pinia'

export default defineStore({
  id: 'GiftCard',
  state: () => ({
    _status: null,
    _error: null,
    _purchaseData: null
  }),
  getters: {
    isLoading: (state) => state._status === 'loading',
    isReady: (state) => state._status === 'ready',
    isError: (state) => state._status === 'error',
    error: (state) => state._error,
  },
  actions: {

    async purchaseGiftCard(data){
        this.changeStatus('loading')
        try {
            const response = await this.purchaseGiftCard(data)
            console.log(response)
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
    

    changeStatus(status, error = null) {
      this._status = status
      if (status === 'error') this._error = error
    },
  },
})
