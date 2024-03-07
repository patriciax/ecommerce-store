import { _getAllHome, _getSingleProduct } from '@/api/repositories/product.repository'
import { defineStore } from 'pinia'

export default defineStore({
  id: 'Products',
  state: () => ({
    _status: null,
    _error: null,
    _allProduct: null,
    _product: null,
  }),
  getters: {
    isLoading: (state) => state._status === 'loading',
    isReady: (state) => state._status === 'ready',
    isError: (state) => state._status === 'error',
    error: (state) => state._error,
    allProduct: (state) => state._allProduct,
    product: (state) => state._product,
  },
  actions: {
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
    async getSingleProduct(id) {
      this.changeStatus('loading')
      try {
        const response = await _getSingleProduct(id)
        if (response) {
          this._product = response.data
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
