import { defineStore } from 'pinia'

export default defineStore({
  id: 'cart',
  state: () => ({
    _status: null,
    _errors: null,
    _cart: sessionStorage.getItem('cart') ? JSON.parse(sessionStorage.getItem('cart')) : [],
    _isShow: false,
    _isCart: null,
  }),
  getters: {
    isIdle: (state) => state._status === 'idle',
    isLoading: (state) => state._status === 'loading',
    isReady: (state) => state._status === 'ready',
    isError: (state) => state._status === 'error',
    error: (state) => state._errors,
    cart: (state) => state._cart,
    cartIsShow: (state) => state._isShow,
    quantityInCar: (state) => state._cart.reduce((acc, item) => acc + item.quantity, 0),
    total: (state) => {
      const total = state._cart.reduce((acc, item) => acc + item.price * item.quantity, 0)
      return total
    },
    isCart: (state) => state._isCart,
  },
  actions: {


    addToCart(item) {
      const _indexExist = this.cart.findIndex((product) => product.id === item.id)

      if (_indexExist < 0) {
        this.cart.push({
          ...item,
          quantity: 0,
        })
      }

      const indexProduct = _indexExist >= 0 ? _indexExist : this.cart.length - 1
      this.cart[indexProduct].quantity++
      sessionStorage.setItem('cart', JSON.stringify(this.cart))
    },

    removeCart(id) {

      let cartItem = this.cart.findIndex((product) => product.id === id)
      // const lineId = this.cart[cartItem].id

  

      if (cartItem >= 0) {
        this.cart.splice(cartItem, cartItem + 1)
        sessionStorage.setItem('cart', JSON.stringify(this.cart))
      }
    },


    clearCart() {
      this._cart = []
      sessionStorage.setItem('cart', JSON.stringify(this.cart))
    },

    changeStatus: (_status, _errors) => {
      this._status = _status
      this._errors = _status == 'error' ? _errors : null
    },

    setLoading() {
      this._status = 'loading'
    },
    setReady() {
      this._status = 'ready'
    },
    setError(error) {
      this._error = Object.assign({}, error)
      this._status = 'error'
    },
    Reset() {
      this._isCart = null
    },
    ResetCart() {
      this._cart = []
    },
  },
})
