import { defineStore } from 'pinia'

export default defineStore({
  id: 'Payment',
  state: () => ({
    _status: null,
    _error: null,
    _data: null,
  }),
  getters: {},
  actions: {
    setPaymentData(_values) {
      this._data = _values
    },
  },
})
