<script setup>
import {computed, onMounted, ref} from 'vue';

import {request} from '../api/client.js';
import ProductCarousel from '../components/ProductCarousel.vue';
import ProductModal from '../components/ProductModal.vue';

const products = ref([]);
const selectedProduct = ref(null);
const loading = ref(true);
const error = ref('');

const hits = computed(() => products.value.filter((product) => product.isHit));
const newProducts = computed(() =>
  products.value.filter((product) => product.isNew),
);

onMounted(async () => {
  try {
    const result = await request('/goods');
    products.value = result.goods;
  } catch {
    error.value = 'Не удалось загрузить товары. Проверьте, запущен ли backend.';
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="home-page">
    <section class="hero-banner">
      <img
        class="hero-banner__image"
        src="/assets/hero-home.png"
        alt="Супер распродажа Gadget Hub"
      />
    </section>

    <p v-if="loading" class="status-message">Загрузка товаров…</p>
    <p v-else-if="error" class="status-message status-message--error">
      {{ error }}
    </p>

    <template v-else>
      <ProductCarousel
        title="Хиты продаж"
        description="Тысячи покупателей уже одобрили эти товары. Самые популярные, проверенные и надёжные гаджеты!"
        :products="hits"
        @open="selectedProduct = $event"
      />
      <ProductCarousel
        title="Новинки"
        description="Их только привезли — они уже у нас! Все самое новое и свежее на рынке электроники"
        :products="newProducts"
        @open="selectedProduct = $event"
      />

      <section class="benefits-section site-container">
        <h2>Преимущества</h2>
        <div class="benefits-grid">
          <article class="benefit-card">
            <span>🚀</span
            ><strong>Утром заказали,<br />вечером получили</strong>
          </article>
          <article class="benefit-card">
            <span>₽</span
            ><strong>С товаром что-то не так?<br />Вернем деньги</strong>
          </article>
          <article class="benefit-card">
            <span>▤</span><strong>Только оригинальные<br />товары</strong>
          </article>
        </div>
      </section>

      <section class="contacts-section site-container">
        <h2>Работаем 24/7</h2>
        <div class="contacts-grid">
          <span>▯&nbsp; 8 (800) 678-34-24</span>
          <a href="mailto:gadget@hub.ru">✉&nbsp; gadget@hub.ru</a>
          <span>●&nbsp; Санкт-Петербург, ул. Барочная, д.7, корпус 2</span>
        </div>
      </section>
    </template>

    <ProductModal
      :open="Boolean(selectedProduct)"
      :product="selectedProduct"
      @update:open="selectedProduct = null"
    />
  </div>
</template>
