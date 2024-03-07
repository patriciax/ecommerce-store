import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Product from '../views/SingleProduct.vue'
import CountryStore from '@/stores/country'
import _storeUser from '@/stores/user'

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

  const storeUser=_storeUser()

  if(!storeUser.currentUser && localStorage.getItem((import.meta as any).env.VITE_BEARER_TOKEN_KEY)){
    await storeUser.getUser()
  }
  
  // if (to.meta.requiresAuth && !storeUser.user) {
  //   return {
  //     name: 'login',
  //     query: { redirect: to.fullPath },
  //   }
  // }

  // else if(storeUser.user && to.name === 'login'){
  //   return {
  //     name: 'dashboard'
  //   }
  // }
})
export default router
