import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Product from '../views/SingleProduct.vue'
import CountryStore from '@/stores/country'


const router = createRouter({
  history: createWebHistory((import.meta as any).env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/product/:id',
      name: 'singleProduct',
      component: Product
    },

  ]
})

router.beforeEach( async(to, from) => {

  const countryStore = CountryStore()

  if(!countryStore.country){
    await countryStore.getCountry()
  }

})

export default router
