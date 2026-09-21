<script setup>
import {useRouter} from 'vue-router';

import {useAuth} from '../composables/useAuth.js';
import {useCart} from '../composables/useCart.js';

const router = useRouter();
const auth = useAuth();
const cart = useCart();

const handleLogout = async () => {
  await auth.logout();
  await router.push('/');
};
</script>

<template>
  <header class="site-header">
    <div class="site-container site-header__inner">
      <RouterLink class="brand" to="/" aria-label="Gadget Hub — главная">
        <span class="brand__accent">Gadget</span> Hub
      </RouterLink>

      <nav class="main-nav" aria-label="Основная навигация">
        <RouterLink class="main-nav__link" to="/catalog">
          <img src="/assets/images/icons/catalog.svg" alt="" />
          Каталог
        </RouterLink>

        <RouterLink
          v-if="auth.isAuthenticated.value"
          class="main-nav__link"
          to="/cart"
        >
          <img src="/assets/images/icons/card.svg" alt="" />
          Корзина
          <span v-if="cart.count.value" class="cart-badge">{{
            cart.count.value
          }}</span>
        </RouterLink>

        <button
          v-if="auth.isAuthenticated.value"
          class="main-nav__link main-nav__button"
          type="button"
          @click="handleLogout"
        >
          <img src="/assets/images/icons/profile.svg" alt="" />
          Выйти
        </button>

        <RouterLink v-else class="main-nav__link" to="/login">
          <img src="/assets/images/icons/profile.svg" alt="" />
          Войти
        </RouterLink>
      </nav>
    </div>
  </header>
</template>
