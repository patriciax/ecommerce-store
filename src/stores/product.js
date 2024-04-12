import { _getCategory } from '@/api/repositories/category.repository'
import { _getAllHome, _getOnSale, _getPrice, _getSingleProduct } from '@/api/repositories/product.repository'

import { defineStore } from 'pinia'

export default defineStore({
  id: 'Products',
  state: () => ({
    _status: null,
    _error: null,
    _allProduct: null,
    _product: null,
    _price: null,
    _onSale: null,
    _category: null,
    _paginate: {
      results: null,
      currentPage: 0,
      totalPages: null
    }
  }),
  getters: {
    isLoading: (state) => state._status === 'loading',
    isLoadingCategory: (state) => state._status === 'loadingCategory',
    isReady: (state) => state._status === 'ready',
    isError: (state) => state._status === 'error',
    error: (state) => state._error,
    allProduct: (state) => state._allProduct,
    product: (state) => state._product,
    price: (state) => state._price,
    onSale: (state) => state._onSale,
    category: (state) => state._category,
    pagination: (state) => state._paginate,

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
    async getPrice() {
      this.changeStatus('loading')
      try {
        const response = await _getPrice()
        if (response) {
          this._price = response.price
          this.changeStatus('ready')
        }
      } catch (error) {
        console.error(error)
      }
    },
    async getOnSale(page = 1, limit = 10) {
      this.changeStatus('loading')
      try {
        const response = await _getOnSale( page, limit)
        if (response) {
          this._onSale = response.data.products
          this._paginate = {
            results: response.results,
            totalPages: response.totalPages,
            page: page
          }
          this.changeStatus('ready')
        }
      } catch (error) {
        console.error(error)
      }
    },
    async getCategory(id, page = 1, limit = 10) {
      this.changeStatus('loading')
      try {
        const response = await _getCategory(id, page, limit)
        if (response) {
          this._category = response.data.products
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
