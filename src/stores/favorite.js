import { _addFavorite, _getFavorites, _removeFavorite } from '@/api/repositories/favorite.repository'
import { defineStore } from 'pinia'

export default defineStore({
  id: 'Favorite',
  state: () => ({
    _status: null,
    _error: null,
    _favorites: [],
    _firstLoad: false
  }),
  getters: {
    isLoading: (state) => state._status === 'loading',
    isReady: (state) => state._status === 'ready',
    isError: (state) => state._status === 'error',
    error: (state) => state._error,
    favorites: (state) => state._favorites,
    firstLoad: (state) => state._firstLoad
  },
  actions: {
    async addFavorite(productId) {
        this.changeStatus('loading')
        try {
            const response = await _addFavorite({"productId": productId})
            if (response) {
                this.changeStatus('ready')
                
                if(response.data?.status == 'success') {
                    this.getFavorites()
                }

                return response.data
            }
        } catch (error) {
            this.changeStatus('error', error)
        }
    },
    async getFavorites() {
        this.changeStatus('loading')
        try {
            const response = await _getFavorites()
            if (response) {
                this._favorites = response.data
                this.changeStatus('ready')
            }
        } catch (error) {
            this.changeStatus('error', error)
        }
    },
    async removeFavorite(id) {
      this.changeStatus('loading')
      try {
          const response = await _removeFavorite(id)
          console.log(response)
          if (response) {
            if(response.status == 'success') {
              this.getFavorites()
            }
            this.changeStatus('ready')
          }
      } catch (error) {
          this.changeStatus('error', error)
      }
    },
    setFirstLoad(){
        this._firstLoad = true
    },
    reset() {
      this._status = null
      this._banner = null

    },
    changeStatus(status, error = null) {
      this._status = status
      if (status === 'error') this._error = error
    },
  },
})
