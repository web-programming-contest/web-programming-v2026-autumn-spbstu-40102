<script setup lang="ts">
import {RouterLink, useRouter} from 'vue-router';
import {cartCount, logout, shop} from '../store';
import Icon from './Icon.vue';
const router = useRouter();
async function exit(): Promise<void> {
  if (await logout()) {
    await router.push('/');
  }
}
</script>
<template>
  <header class="site-header">
    <div class="container header-content">
      <RouterLink to="/" class="logo-link" aria-label="Gadget Hub — главная"
        ><img src="/assets/logo.svg" width="150" height="28" alt="Gadget Hub"
      /></RouterLink>
      <nav aria-label="Основная навигация">
        <RouterLink to="/catalog" class="menu-link" active-class="menu-active"
          ><Icon name="catalog" />Каталог</RouterLink
        ><RouterLink
          v-if="shop.user"
          to="/cart"
          class="menu-link"
          active-class="menu-active"
          ><Icon name="cart" />Корзина<span
            v-if="cartCount > 0"
            class="cart-count"
            data-testid="cart-count"
            >{{ cartCount }}</span
          ></RouterLink
        ><button
          v-if="shop.user"
          class="menu-link"
          type="button"
          :disabled="shop.locked"
          @click="exit"
        >
          <Icon name="profile" />Выйти</button
        ><RouterLink
          v-else
          to="/login"
          class="menu-link"
          active-class="menu-active"
          ><Icon name="profile" />Войти</RouterLink
        >
      </nav>
    </div>
  </header>
</template>
