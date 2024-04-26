import { _restorePass, _restorePassVerify, _updatePass } from '@/api/repositories/auth.repository'
import { defineStore } from 'pinia'

export default defineStore({
  id: 'resertPassword',
  state: () => ({
    _status: null,
    _error: null,
    _data: null,
    _login: false,
  }),
  getters: {
    isLoading: (state) => state._status === 'loading',
    isReady: (state) => state._status === 'ready',
    isError: (state) => state._status === 'error',
    isEmailVerifyNeeded: (state) => state._status === 'emailVerifyNeeded',
    error: (state) => state._error,
    data: (state) => state._data,
    login: (state) => state._login,
  },
  actions: {
    async restorePass(body) {
      this.changeStatus('loading')
      try {
        const response = await _restorePass(body)
        if (response.status === 'fail') {
          this.changeStatus('error')
        } else {
          this.changeStatus('ready')
        }
      } catch (error) {
        this.changeStatus('error', error)
      }
    },

    async verifyCode(body) {
      this.changeStatus('loading')
      try {
        const response = await _restorePassVerify(body)
        if (!response?.data) {
          this.changeStatus('error')
        }

        if (response?.data?.status === 'success') {
          this.changeStatus('ready')
        } else {
          this.changeStatus('error')
        }
      } catch (error) {
        this.changeStatus('error', error)
      }
    },

    async updatePass(body) {
      this.changeStatus('loading')
      try {
        const response = await _updatePass(body)
        console.log(response)
        if (response?.status === 'success') {
          this.changeStatus('ready')
        } else {
          this.changeStatus('error')
        }
      } catch (error) {
        this.changeStatus('error', error)
      }
    },
    setData(_value) {
      if (_value) this._login = true
    },
    changeStatus(status, error = null) {
      this._status = status
      if (status === 'error') this._error = error
    },
  },
})
