import {createRouter, createWebHistory} from 'vue-router';

import {useAuth} from '../composables/useAuth.js';
import CartView from '../views/CartView.vue';
import CatalogView from '../views/CatalogView.vue';
import HomeView from '../views/HomeView.vue';
import LoginView from '../views/LoginView.vue';
import NotFoundView from '../views/NotFoundView.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {path: '/', component: HomeView},
    {path: '/login', component: LoginView},
    {path: '/catalog', component: CatalogView, meta: {requiresAuth: true}},
    {path: '/cart', component: CartView, meta: {requiresAuth: true}},
    {path: '/:pathMatch(.*)*', component: NotFoundView},
  ],
  scrollBehavior: () => ({top: 0}),
});

router.beforeEach(async (to) => {
  const auth = useAuth();
  await auth.restore();

  if (to.meta.requiresAuth && !auth.isAuthenticated.value) {
    return {path: '/login', query: {redirect: to.fullPath}};
  }

  if (to.path === '/login' && auth.isAuthenticated.value) {
    return '/';
  }

  return true;
});

export default router;
