<script setup>
import {formatPrice} from '../api/client.js';
import {useCart} from '../composables/useCart.js';
import BaseModal from './BaseModal.vue';
import QuantityControl from './QuantityControl.vue';

defineProps({
  open: {type: Boolean, default: false},
  product: {type: Object, default: null},
});

const emit = defineEmits(['update:open']);
const cart = useCart();
const quantity = (id) =>
  cart.items.value.find((item) => item.productId === id)?.quantity || 0;
</script>

<template>
  <BaseModal
    :model-value="open"
    title="Карточка товара"
    @update:model-value="emit('update:open', $event)"
  >
    <div v-if="product" class="product-modal">
      <img
        class="product-modal__image"
        :src="product.imagePath"
        :alt="product.name"
      />
      <div class="product-modal__body">
        <div class="product-card__labels product-modal__labels">
          <span v-if="product.isNew" class="label label--green">Новинка</span>
          <span v-if="product.isHit" class="label label--pink">Хит</span>
        </div>
        <h2>{{ product.name }}</h2>
        <p class="product-card__rating">★ {{ product.rating }}</p>
        <p class="product-modal__description">{{ product.description }}</p>
        <h3>Характеристики</h3>
        <dl class="specifications">
          <template v-for="(value, key) in product.specifications" :key="key">
            <dt>{{ key }}</dt>
            <dd>{{ value }}</dd>
          </template>
        </dl>
        <strong class="product-modal__price">{{
          formatPrice(product.priceKopecks)
        }}</strong>
        <button
          v-if="!quantity(product.id)"
          class="button button--blue"
          type="button"
          @click="cart.add(product.id)"
        >
          🛒&nbsp; В корзину
        </button>
        <QuantityControl
          v-else
          :value="quantity(product.id)"
          @decrement="cart.decrement(product.id)"
          @increment="cart.increment(product.id)"
        />
      </div>
    </div>
  </BaseModal>
</template>
