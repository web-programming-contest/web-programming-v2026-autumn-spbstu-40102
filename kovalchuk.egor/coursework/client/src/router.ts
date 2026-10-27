import {createRouter, createWebHistory} from 'vue-router';
import {initializeShop, shop} from './store';
import Home from './pages/Home.vue';
import Login from './pages/Login.vue';
import Catalog from './pages/Catalog.vue';
import Cart from './pages/Cart.vue';

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {path: '/', component: Home},
    {path: '/login', component: Login},
    {path: '/catalog', component: Catalog, meta: {requiresAuth: true}},
    {path: '/cart', component: Cart, meta: {requiresAuth: true}},
    {path: '/:pathMatch(.*)*', redirect: '/'},
  ],
});
router.beforeEach(async (to) => {
  await initializeShop();
  if (to.meta.requiresAuth && !shop.user) {
    return '/login';
  }
  if (to.path === '/login' && shop.user) {
    return '/';
  }
  return true;
});
