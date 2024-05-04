import { _getSearch } from '@/api/repositories/search.repository'
import { defineStore } from 'pinia'

export default defineStore({
  id: 'search',
  state: () => ({
    _status: null,
    _error: null,
    _search: null,
  }),
  getters: {
    isLoading: (state) => state._status === 'loading',
    isReady: (state) => state._status === 'ready',
    isError: (state) => state._status === 'error',
    error: (state) => state._error,
    search: (state) => state._search,
  },
  actions: {
    async getSearch(body,_priceMax, _priceMin) {
      this.changeStatus('loading')
      try {
        const response = await _getSearch(body,_priceMax, _priceMin)
        if (response) {
          this._search = response.data.data.products
          this.changeStatus('ready')
        }
      } catch (error) {
        this.changeStatus('error', error)
      }
    },
    reset() {},
    changeStatus(status, error = null) {
      this._status = status
      if (status === 'error') this._error = error
    },
  },
})
