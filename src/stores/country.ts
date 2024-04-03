import axios from 'axios'
import { defineStore } from 'pinia'
import { _getPrice } from '@/api/repositories/product.repository'

export default defineStore({
  id: 'country',
  state: () => ({
    _country: null,
  }),
  getters: {
    country: (state) => state._country,
  },
  actions: {

    async getCountry() {
      try {

        const response = await axios.get("https://ipapi.co/json/")
        if (response.status == 200) {
          this._country = response.data.country_name

        }

      } catch (err) {
        console.error(err)
      }

    },

  },
})
