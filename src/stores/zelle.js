import { _getZelle } from '@/api/repositories/zelle.repository'
import { defineStore } from 'pinia'

export default defineStore({
  id: 'Zelle',
  state: () => ({
    _status: null,
    _error: null,
    _zelle: null
  }),
  getters: {
    isLoading: (state) => state._status === 'loading',
    isReady: (state) => state._status === 'ready',
    isError: (state) => state._status === 'error',
    zelle: (state) => state._pagoMovil,
  },
  actions: {
    async getZelle() {
      this.changeStatus('loading')
      try {
        const response = await _getZelle()
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
