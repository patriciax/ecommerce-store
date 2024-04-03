import { _changeDolar } from '@/api/repositories/search.repository'
import { defineStore } from 'pinia'

export default defineStore({
  id: 'User',
  state: () => ({
    _status: null,
    _error: null,
    _price: null,
  }),
  getters: {
    isLoading: (state) => state._status === 'loading',
    isReady: (state) => state._status === 'ready',
    isError: (state) => state._status === 'error',
    error: (state) => state._error,
    price: (state) => state._price,
  },
  actions: {
    async changeDolar(body) {
      this.changeStatus('loading')
      try {
        const response = await _changeDolar(body)
        if (response) {
          this._price = response.data
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
