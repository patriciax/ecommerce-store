import axios from 'axios'
import { defineStore } from 'pinia'

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
      
        const response = await axios.get("https://ipapi.co/json/")
        if(response.status == 200){
            this._country = response.data.country_name
        }

    }
  },
})
