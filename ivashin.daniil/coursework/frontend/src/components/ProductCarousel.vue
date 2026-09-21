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
      <img
        class="home-carousel__icon"
        :src="
          title === 'Хиты продаж'
            ? '/assets/images/icons/hits-icon.svg'
            : '/assets/images/icons/new-stuff-icon.svg'
        "
        alt=""
      />
      <h2>{{ title }}</h2>
      <p>{{ description }}</p>
      <div class="carousel-arrows">
        <button
          class="carousel-arrow carousel-arrow--left"
          type="button"
          aria-label="Назад"
          @click="move(-1)"
        >
          ‹
        </button>
        <button
          class="carousel-arrow carousel-arrow--right"
          type="button"
          aria-label="Вперёд"
          @click="move(1)"
        >
          ›
        </button>
      </div>
    </div>
    <div class="home-carousel__products">
      <ProductCard
        v-for="product in visibleProducts"
        :key="product.id"
        :product="product"
        compact
        @open="emit('open', $event)"
      />
    </div>
  </section>
</template>
