import { _getUser } from '@/api/repositories/user.repository'
import { defineStore } from 'pinia'

export default defineStore({
  id: 'User',
  state: () => ({
    _status: null,
    _error: null,
    _user: null,
  }),
  getters: {
    isLoading: (state) => state._status === 'loading',
    isReady: (state) => state._status === 'ready',
    isError: (state) => state._status === 'error',
    error: (state) => state._error,
    currentUser: (state) => state._user,
  },
  actions: {
    async getUser(body) {
      this.changeStatus('loading')
      try {
        const response = await _getUser(body)
        if (response) {
          this._user = response.data
          this.changeStatus('ready')
        }
      } catch (error) {
        this.changeStatus('error', error)
      }
    },
    reset() {
      localStorage.removeItem(import.meta.env.VITE_BEARER_TOKEN_KEY)
      sessionStorage.removeItem('cart')
      this._cart = []
      this._status = null
      this._user = null

    },
    changeStatus(status, error = null) {
      this._status = status
      if (status === 'error') this._error = error
    },
  },
})
