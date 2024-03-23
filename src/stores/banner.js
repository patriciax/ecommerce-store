import { _getBanner } from '@/api/repositories/banner.repository'
import { defineStore } from 'pinia'

export default defineStore({
  id: 'Banner',
  state: () => ({
    _status: null,
    _error: null,
    _banner: null,
  }),
  getters: {
    isLoading: (state) => state._status === 'loading',
    isReady: (state) => state._status === 'ready',
    isError: (state) => state._status === 'error',
    error: (state) => state._error,
    currentBanner: (state) => state._banner,
  },
  actions: {
    async getBanner(body) {
      this.changeStatus('loading')
      try {
        const response = await _getBanner(body)
        if (response) {
          this._banner = response.data
          this.changeStatus('ready')
        }
      } catch (error) {
        this.changeStatus('error', error)
      }
    },
    reset() {
      this._status = null
      this._banner = null

    },
    changeStatus(status, error = null) {
      this._status = status
      if (status === 'error') this._error = error
    },
  },
})
