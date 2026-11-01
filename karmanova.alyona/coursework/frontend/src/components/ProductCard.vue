<script setup lang="ts">
import type { Product } from "../api/models";
import { money, imageUrl } from "../api/models";
import QuantityControl from "./QuantityControl.vue";
defineProps<{ product: Product; purchasable?: boolean }>();
defineEmits<{ open: [product: Product] }>();
</script>
<template>
  <article class="product-card">
    <button class="product-open" @click="$emit('open', product)">
      <div class="product-photo">
        <img :src="imageUrl(product.imageUrl)" :alt="product.name" />
        <div class="badges">
          <span v-if="product.isNew" class="badge new">Новинка</span
          ><span v-if="product.isHit" class="badge hit">Хит</span>
        </div>
      </div>
      <strong class="product-price">{{ money(product.price) }}</strong
      ><span class="product-name" :title="product.name">{{ product.name }}</span
      ><span class="rating"
        ><span>★</span> {{ String(product.rating).replace(".", ",") }}</span
      ></button
    ><QuantityControl v-if="purchasable" :id="product.id" />
  </article>
</template>
