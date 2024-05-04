import { defineStore } from 'pinia'
import { _addToMassiveCart, _delete, _productInfoGuest, _productInfo, _addToUserCart, _update } from '@/api/repositories/cart.repository'
import _storeUser from '@/stores/user'

export default defineStore({
  id: 'cart',
  state: () => ({
    _firstLoadedCart: false,
    _status: null,
    _errors: null,
    _cart: sessionStorage.getItem('cart') ? JSON.parse(sessionStorage.getItem('cart')) : [],
    _isNew: false,
    _isCart: null,
    _shippingCost: 0
  }),
  getters: {
    isLoading: (state) => state._status === 'loading',
    isReady: (state) => state._status === 'ready',
    isError: (state) => state._status === 'error',
    error: (state) => state._errors,
    cart: (state) => state._cart,
    cartIsNew: (state) => state._isNew,
    quantityInCar: (state) => state._cart.reduce((acc, item) => acc + item.quantity, 0),
    total: (state) => {
      const total = state._cart.reduce((acc, item) => acc + (item.priceDiscount || item.price) * item.quantity, 0)
      return total + state._shippingCost
    },
    isCart: (state) => state._isCart,
    firstLoadedCart: (state) => state._firstLoadedCart,
    shippingCost: (state) => state._shippingCost
  },
  actions: {
    setFirstLoadedCart() {
      this._firstLoadedCart = true
    },
    getAmountInCartByProduct(product) {
     
      const productInCart = this.cart.find((item) => item.productId == product._id && item.color?._id == product.color?._id && item.size?._id == product.size?._id)
      return productInCart ? productInCart.quantity : 0

    },
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
        const response = await _productInfo()
        if (response) {
          const cartData = response.data.cart
          const updatedCart = cartData.map((item) => {
            const updatedItem = { ...item }
            updatedItem.productId = updatedItem?._id
            delete updatedItem._id
            return updatedItem
          })
          this._cart = updatedCart
          sessionStorage.setItem('cart', JSON.stringify(this.cart))
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
          sessionStorage.removeItem('cart')
        }
      } catch (error) {
        this.changeStatus('error', error)
      }
    },
    async update(body) {
      // this.changeStatus('loading')
      try {
        const response = await _update(body)
        if (response) {
          this.changeStatus('ready')
        }
      } catch (error) {
        this.changeStatus('error', error)
      }
    },
    setShippingCost(cost) {
      this._shippingCost = cost * 1
    },
    async addToUserCart(body) {
      this.changeStatus('loading')
      try {
        const response = await _addToUserCart(body)
        if (response) {
          const _indexExist = this.cart.findIndex((product) => product.productId === body.productId)

          if (_indexExist < 0) {
            this.cart.push({
              ...body,
              quantity: 0,
            })
          }
          const indexProduct = _indexExist >= 0 ? _indexExist : this.cart.length - 1
          this.cart[indexProduct].quantity++
          this._isCart = true
          this.changeStatus('ready')
        }
      } catch (error) {
        this.changeStatus('error', error)
      }
    },
    async addToCart(item) {

      const storeUser = _storeUser()

      const _indexExist = this.cart.findIndex((product) => product.productId == item.productId && product.color?._id == item.color?._id && product.size?._id == item.size?._id)

      if (_indexExist < 0) {
        this.cart.push({
          ...item,
        })
      }
      
      const indexProduct = _indexExist >= 0 ? _indexExist : this.cart.length - 1

      if(_indexExist >= 0){
        this.cart[indexProduct].quantity = this.cart[indexProduct].quantity + item.quantity
      }
      
      if(storeUser.currentUser){
        const response = await _addToUserCart(item)
        return response
      }
      
      sessionStorage.setItem('cart', JSON.stringify(this.cart))
      return {
        data:{
          'status': 'success',
          'message': 'CART.SUCCESS'
        }
      }
    },
    async removeCart(id) {
      // this.changeStatus('loading')
      try {
        const response = await _delete(id)

        if (response) {
          // this.changeStatus('ready')
          this.productInfo()
        }
      } catch (error) {
        this.changeStatus('error', error)
      }
    },
    removeCartStorage(id) {
      let cartItem = this.cart.findIndex((product) => product.productId == id)
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

    reset() {
      this._isCart = null
      this._cart = []
    },
    ResetCart() {
      this._cart = []
    },
  },
})
