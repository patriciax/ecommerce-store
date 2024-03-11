import { defineStore } from 'pinia'
import { _addToMassiveCart, _delete, _productInfoGuest, _productInfo, _addToUserCart, _update } from '@/api/repositories/cart.repository'
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
    async productInfoGuest(body) {
      this.changeStatus('loading')
      try {
        const response = await _productInfoGuest(body)
        if (response) {
          const cartData = response.data.data.cart
          const updatedCart = cartData.map((item) => {
            const updatedItem = { ...item }
            updatedItem.productId = updatedItem._id
            delete updatedItem._id
            return updatedItem
          })
          this._cart = updatedCart
          this.changeStatus('ready')
        }
      } catch (error) {
        this.changeStatus('error', error)
      }
    },
    async productInfo() {
      this.changeStatus('loading')
      try {
        const response = await _productInfo(this.cart)
        if (response) {
          const cartData = response.data.cart
          const updatedCart = cartData.map((item) => {
            const updatedItem = { ...item }
            updatedItem.productId = updatedItem._id
            delete updatedItem._id
            return updatedItem
          })
          this._cart = updatedCart
          this.changeStatus('ready')
        }
      } catch (error) {
        this.changeStatus('error', error)
      }
    },
    async addToMassiveCart(body) {
      this.changeStatus('loading')
      try {
        const response = await _addToMassiveCart(body)
        if (response) {
          this.changeStatus('ready')
          this.productInfo()
        }
      } catch (error) {
        this.changeStatus('error', error)
      }
    },
    async update(body) {
      console.log(body)
      this.changeStatus('loading')
      try {
        const response = await _update(body)
        if (response) {
          this.changeStatus('ready')
        }
      } catch (error) {
        this.changeStatus('error', error)
      }
    },

    async addToUserCart(body) {
      this.changeStatus('loading')
      try {
        const response = await _addToUserCart(body)
        if (response) {
          this.changeStatus('ready')
        }
      } catch (error) {
        this.changeStatus('error', error)
      }
    },
    addToCart(item) {
      const _indexExist = this.cart.findIndex((product) => product.productId === item.productId)

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
    async removeCart(id) {
      this.changeStatus('loading')
      try {
        const response = await _delete(id)

        if (response) {
          this.changeStatus('ready')
          this.productInfo()
        }
      } catch (error) {
        this.changeStatus('error', error)
      }
    },

    removeCartStorage(id) {
      let cartItem = this.cart.findIndex((product) => product._id === id)
      if (cartItem >= 0) {
        this.cart.splice(cartItem, cartItem + 1)
        sessionStorage.setItem('cart', JSON.stringify(this.cart))
      }
    },

    clearCart() {
      this._cart = []
      sessionStorage.setItem('cart', JSON.stringify(this.cart))
    },

    changeStatus(status, error = null) {
      this._status = status
      if (status === 'error') this._error = error
    },

    Reset() {
      this._isCart = null
    },
    ResetCart() {
      this._cart = []
    },
  },
})
