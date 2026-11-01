<script setup lang="ts">
import type { Product } from "../api/models";
import { imageUrl, money } from "../api/models";
import { auth } from "../state/auth";
import QuantityControl from "./QuantityControl.vue";
import Modal from "./Modal.vue";
defineProps<{ product: Product }>();
defineEmits<{ close: [] }>();
</script>
<template>
  <Modal :title="product.name" @close="$emit('close')"
    ><div class="product-detail">
      <div class="detail-image">
        <img :src="imageUrl(product.imageUrl)" :alt="product.name" />
        <div class="badges">
          <span v-if="product.isNew" class="badge new">Новинка</span
          ><span v-if="product.isHit" class="badge hit">Хит</span>
        </div>
      </div>
      <div>
        <h2>{{ product.name }}</h2>
        <div class="rating">
          <span>★</span> {{ String(product.rating).replace(".", ",") }}
        </div>
        <p>{{ product.description }}</p>
        <h3>Характеристики</h3>
        <dl>
          <div v-for="item in product.characteristics" :key="item.name">
            <dt>{{ item.name }}</dt>
            <dd>{{ item.value }}</dd>
          </div>
        </dl>
        <div class="detail-purchase">
          <strong>{{ money(product.price) }}</strong
          ><QuantityControl
            v-if="auth.isAuthenticated.value"
            :id="product.id"
            detailed
          /><RouterLink v-else class="button" to="/login"
            >Войти для покупки</RouterLink
          >
        </div>
      </div>
    </div></Modal
  >
</template>
