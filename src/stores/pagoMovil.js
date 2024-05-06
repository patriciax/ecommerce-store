import { _getPagoMovil } from '@/api/repositories/pagoMovil.repository'
import { defineStore } from 'pinia'

export default defineStore({
  id: 'PagoMovil',
  state: () => ({
    _status: null,
    _error: null,
    _pagoMovil: null
  }),
  getters: {
    isLoading: (state) => state._status === 'loading',
    isReady: (state) => state._status === 'ready',
    isError: (state) => state._status === 'error',
    pagoMovil: (state) => state._pagoMovil,
  },
  actions: {
    async getPagoMovil() {
      this.changeStatus('loading')
      try {
        const response = await _getPagoMovil()
        if (response) {
          this._pagoMovil = response.data
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
