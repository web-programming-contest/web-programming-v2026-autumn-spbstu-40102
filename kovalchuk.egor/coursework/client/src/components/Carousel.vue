<script setup lang="ts">
import {computed, ref} from 'vue';
import type {Good} from '../../../shared/types';
import ProductCard from './ProductCard.vue';
import Icon from './Icon.vue';
const props = defineProps<{
  title: string;
  description: string;
  goods: Good[];
  fresh?: boolean;
}>();
const offset = ref(0);
const visible = computed(() =>
  Array.from(
    {length: Math.min(3, props.goods.length)},
    (_, index) => props.goods[(offset.value + index) % props.goods.length],
  ),
);
function move(direction: number): void {
  offset.value =
    (offset.value + direction + props.goods.length) % props.goods.length;
}
</script>
<template>
  <section v-if="goods.length" class="carousel" :aria-label="title">
    <div class="carousel-intro" :class="{'fresh-intro': fresh}">
      <span class="carousel-symbol" aria-hidden="true">{{
        fresh ? '✦' : '♨'
      }}</span>
      <h2>{{ title }}</h2>
      <p>{{ description }}</p>
    </div>
    <div class="carousel-body">
      <button
        type="button"
        class="carousel-arrow previous"
        :aria-label="`${title}: предыдущие товары`"
        @click="move(-1)"
      >
        <Icon name="arrow" />
      </button>
      <div class="carousel-grid">
        <ProductCard
          v-for="good in visible"
          :key="good.id"
          :good="good"
          :controls="false"
        />
      </div>
      <button
        type="button"
        class="carousel-arrow next"
        :aria-label="`${title}: следующие товары`"
        @click="move(1)"
      >
        <Icon name="arrow" />
      </button>
    </div>
  </section>
</template>
