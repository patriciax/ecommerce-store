import { _verifyEmail, _register, _verifyCode, _resendCode, _login } from '@/api/repositories/auth.repository'
import { defineStore } from 'pinia'

export default defineStore({
  id: 'auth',
  state: () => ({
    _status: null,
    _error: null,
    _data: null,
  }),
  getters: {
    isLoading: (state) => state._status === 'loading',
    isReady: (state) => state._status === 'ready',
    isError: (state) => state._status === 'error',
    error: (state) => state._error,
    data: (state) => state._data,
  },
  actions: {
    async verifyEmail(body) {
      this.changeStatus('loading')
      try {
        const response = await _verifyEmail(body)

        if (response.status === 'fail') {
          this.changeStatus('ready')
        } else {
          this.changeStatus('error')
        }
      } catch (error) {
        this.changeStatus('error', error)
      }
    },
    async register(body) {
      this.changeStatus('loading')
      try {
        const response = await _register(body)
        if (response) {
          this._data = response.data.data
          this.changeStatus('ready')
        }
      } catch (error) {
        this.changeStatus('error', error)
      }
    },

    async verifyCode(body) {
      this.changeStatus('loading')
      try {
        const response = await _verifyCode(body)

        if (response) {
          this.changeStatus('ready')
        }
      } catch (error) {
        this.changeStatus('error', error)
      }
    },
    async resendCode(body) {
      this.changeStatus('loading')
      try {
        const response = await _resendCode(body)

        if (response) {
          this.changeStatus('ready')
        }
      } catch (error) {
        this.changeStatus('error', error)
      }
    },
    async login(body) {
      this.changeStatus('loading')
      try {
        const response = await _login(body)
        console.log('store', response)
        if (response.data.status == 'success') {
          localStorage.setItem(import.meta.env.VITE_BEARER_TOKEN_KEY, response.data.data)
          this.changeStatus('ready')
        }

        if (response.status === 'fail') {
          this.changeStatus('error')
        }
      } catch (error) {
        this.changeStatus('error', error)
      }
    },

    // async logout() {
    //   const { destroyToken } = _storeOauth()
    //   try {
    //     this.changeStatus('loading')
    //     const response = await _logout()
    //     if (response) {
    //       this.changeStatus('ready')
    //       destroyToken()
    //     }
    //   } catch (error) {
    //     this.changeStatus('error', error)
    //   }
    // },
    changeStatus(status, error = null) {
      this._status = status
      if (status === 'error') this._error = error
    },
  },
})
