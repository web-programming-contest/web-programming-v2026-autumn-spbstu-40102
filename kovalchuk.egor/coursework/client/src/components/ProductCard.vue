<script setup lang="ts">
import type {Good} from '../../../shared/types';
import {shop} from '../store';
import {money} from '../api';
import Badges from './Badges.vue';
import Rating from './Rating.vue';
import CartControl from './CartControl.vue';
withDefaults(defineProps<{good: Good; controls?: boolean}>(), {controls: true});
</script>
<template>
  <article class="product-card" data-testid="product-card">
    <button
      class="product-open"
      type="button"
      :aria-label="`Подробнее: ${good.name}`"
      @click="shop.product = good"
    >
      <div class="product-photo">
        <img
          :src="good.image"
          :alt="good.name"
          width="250"
          height="250"
        /><Badges :good="good" />
      </div>
      <strong class="product-price">{{ money(good.price) }}</strong
      ><span class="product-name">{{ good.name }}</span
      ><Rating :rating="good.rating" /></button
    ><CartControl v-if="controls" :good="good" />
  </article>
</template>
