import { defineStore } from 'pinia'

export default defineStore({
  id: 'Payment',
  state: () => ({
    _status: null,
    _error: null,
    _data: null,
    _paymentMethod: null
  }),
  getters: {
    paymentMethod: (state) => state._paymentMethod
  },
  actions: {
    setPaymentData(_values) {
      this._data = _values
    },
    setPaymentMethod(_value) {
      this._paymentMethod = _value
    }
  },
})
