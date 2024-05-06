import { _getInvoices } from '@/api/repositories/profile.repository'
import { defineStore } from 'pinia'

export default defineStore({
  id: 'Profile',
  state: () => ({
    _status: null,
    _error: null,
    _allProduct: null,
    _product: null,
    _price: null,
    _invoice: null,
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
    invoice: (state) => state._invoice,
    pagination: (state) => state._paginate,

  },
  actions: {
 

    async getInvoices(page = 1, limit = 10) {
      this.changeStatus('loading')
      try {
        const response = await  _getInvoices( page, limit)
        if (response) {
          this._invoice = response.data.invoices
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
 
    changeStatus(status, error = null) {
      this._status = status
      if (status === 'error') this._error = error
    },
  },
})
