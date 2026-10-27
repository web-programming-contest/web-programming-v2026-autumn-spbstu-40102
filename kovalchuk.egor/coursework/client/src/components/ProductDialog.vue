<script setup lang="ts">
import type {Good} from '../../../shared/types';
import {shop} from '../store';
import {money} from '../api';
import Dialog from './Dialog.vue';
import Badges from './Badges.vue';
import Rating from './Rating.vue';
import CartControl from './CartControl.vue';
defineProps<{good: Good}>();
defineEmits<{dismiss: []}>();
</script>
<template>
  <Dialog :title="good.name" wide @dismiss="$emit('dismiss')"
    ><div class="product-detail">
      <div class="detail-photo">
        <img :src="good.image" :alt="good.name" /><Badges :good="good" />
      </div>
      <div class="detail-information">
        <h2>{{ good.name }}</h2>
        <Rating :rating="good.rating" />
        <p>{{ good.description }}</p>
        <h3>Характеристики</h3>
        <dl class="specifications">
          <div v-for="(value, name) in good.specifications" :key="name">
            <dt>{{ name }}</dt>
            <dd>{{ value }}</dd>
          </div>
        </dl>
        <strong class="detail-price">{{ money(good.price) }}</strong
        ><CartControl v-if="shop.user" :good="good" />
      </div></div
  ></Dialog>
</template>
