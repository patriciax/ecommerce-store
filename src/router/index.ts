import _storeCart from '@/stores/cart/cart'
import CountryStore from '@/stores/country'
import _storeUser from '@/stores/user'
import Category from '@/views/Category.vue'
import GiftCard from '@/views/GiftCard.vue'
import Offers from '@/views/Offers.vue'
import OrderManagement from '@/views/OrderManagement.vue'
import { createRouter, createWebHistory } from 'vue-router'
import Checkout from '../views/Checkout.vue'
import HomeView from '../views/HomeView.vue'
import Search from '../views/Search.vue'
import Product from '../views/SingleProduct.vue'

const router = createRouter({
  history: createWebHistory((import.meta as any).env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/product/:slug',
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
    {
      path: '/gift-card',
      name: 'gift-card',
      component: GiftCard
    },
    {
      path: '/search/:search',
      name: 'search',
      component: Search
    },
    {
      path: '/category/:slug',
      name: 'category',
      component: Category,
      props: (route) => ({
        id: route.query.id,
        name: route.query.name
      }),
    },
    {
      path: '/offers',
      name: 'offers',
      component: Offers
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
