<script setup>
import {computed, ref} from 'vue';

import ProductCard from './ProductCard.vue';

const props = defineProps({
  title: {type: String, required: true},
  description: {type: String, required: true},
  products: {type: Array, required: true},
});

const emit = defineEmits(['open']);
const start = ref(0);
const visibleProducts = computed(() => {
  if (props.products.length <= 3) {
    return props.products;
  }

  return [0, 1, 2].map(
    (offset) => props.products[(start.value + offset) % props.products.length],
  );
});

const move = (direction) => {
  start.value =
    (start.value + direction + props.products.length) % props.products.length;
};
</script>

<template>
  <section class="home-carousel site-container">
    <div class="home-carousel__intro">
      <span class="home-carousel__icon">{{
        title === 'Хиты продаж' ? '♨' : '✦'
      }}</span>
      <h2>{{ title }}</h2>
      <p>{{ description }}</p>
      <button
        class="carousel-arrow carousel-arrow--left"
        type="button"
        aria-label="Назад"
        @click="move(-1)"
      >
        ‹
      </button>
    </div>
    <div class="home-carousel__products">
      <ProductCard
        v-for="product in visibleProducts"
        :key="product.id"
        :product="product"
        @open="emit('open', $event)"
      />
      <button
        class="carousel-arrow carousel-arrow--right"
        type="button"
        aria-label="Вперёд"
        @click="move(1)"
      >
        ›
      </button>
    </div>
  </section>
</template>
