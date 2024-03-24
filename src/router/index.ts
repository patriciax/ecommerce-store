import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Product from '../views/SingleProduct.vue'
import CountryStore from '@/stores/country'
import _storeUser from '@/stores/user'
import _storeCart from '@/stores/cart/cart'
import Checkout from '../views/Checkout.vue'
import OrderManagement from '@/views/OrderManagement.vue'

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
    {
      path: '/checkout',
      name: 'checkout',
      component: Checkout
    },
    {
      path: '/order-management',
      name: 'corder-management',
      component: OrderManagement
    },
  ]
})

router.beforeEach(async (to, from) => {

  const countryStore = CountryStore()

  if(!countryStore.country){
    await countryStore.getCountry()
  }

  const storeUser=_storeUser()
  const storeCart = _storeCart()

  if (!storeUser.currentUser && localStorage.getItem((import.meta as any).env.VITE_BEARER_TOKEN_KEY)) {
    await storeUser.getUser()
    await storeCart.productInfo()
  }

  else{

    if(!storeCart.firstLoadedCart){
      storeCart.productInfoGuest({cartProducts: sessionStorage.getItem('cart') ? JSON.parse(sessionStorage.getItem('cart')) : []})
      storeCart.setFirstLoadedCart()
    }
    
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
