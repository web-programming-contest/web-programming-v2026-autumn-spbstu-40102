<script setup lang="ts">
import {onMounted, onUnmounted} from 'vue';
import {RouterView} from 'vue-router';
import {router} from './router';
import {initializeShop, shop} from './store';
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';
import ProductDialog from './components/ProductDialog.vue';
function expired(): void {
  shop.user = null;
  shop.cart = [];
  shop.product = null;
  shop.message = 'Сессия закончилась. Войдите снова.';
  void router.replace('/login');
}
onMounted(() => window.addEventListener('session-expired', expired));
onUnmounted(() => window.removeEventListener('session-expired', expired));
</script>
<template>
  <div class="site-shell">
    <Header />
    <div v-if="shop.message" class="notice container" role="status">
      {{ shop.message
      }}<button
        type="button"
        class="icon-button"
        aria-label="Скрыть сообщение"
        @click="shop.message = ''"
      >
        ×
      </button>
    </div>
    <main v-if="shop.loading" class="container loading" role="status">
      Загружаем Gadget Hub…
    </main>
    <main v-else-if="shop.loadError" class="container loading">
      <p role="alert">{{ shop.loadError }}</p>
      <button class="button" type="button" @click="initializeShop(true)">
        Повторить
      </button>
    </main>
    <RouterView v-else />
    <Footer /><ProductDialog
      v-if="shop.product"
      :good="shop.product"
      @dismiss="shop.product = null"
    />
  </div>
</template>
