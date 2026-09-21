<script setup>
import {formatPrice} from '../api/client.js';
import {useCart} from '../composables/useCart.js';
import QuantityControl from './QuantityControl.vue';

defineProps({
  product: {
    type: Object,
    required: true,
  },
  compact: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['open']);
const cart = useCart();

const quantity = (id) =>
  cart.items.value.find((item) => item.productId === id)?.quantity || 0;
</script>

<template>
  <article
    class="product-card"
    :class="{'product-card--compact': compact}"
    @click="emit('open', product)"
  >
    <div class="product-card__image-wrap">
      <img
        class="product-card__image"
        :src="product.imagePath"
        :alt="product.name"
      />
      <div class="product-card__labels">
        <span v-if="product.isNew" class="label label--green">Новинка</span>
        <span v-if="product.isHit" class="label label--pink">Хит</span>
      </div>
    </div>
    <strong class="product-card__price">{{
      formatPrice(product.priceKopecks)
    }}</strong>
    <button
      class="product-card__name"
      type="button"
      @click.stop="emit('open', product)"
    >
      {{ product.name }}
    </button>
    <span class="product-card__rating">
      <img src="/assets/images/icons/star-icon.svg" alt="" />
      {{ product.rating }}
    </span>

    <template v-if="!compact">
      <button
        v-if="!quantity(product.id)"
        class="button button--blue product-card__cart"
        type="button"
        @click.stop="cart.add(product.id)"
      >
        <img
          class="product-card__cart-icon"
          src="/assets/images/icons/cart-icon.svg"
          alt=""
        />
        В корзину
      </button>
      <QuantityControl
        v-else
        class="product-card__quantity"
        :value="quantity(product.id)"
        @click.stop
        @decrement="cart.decrement(product.id)"
        @increment="cart.increment(product.id)"
      />
    </template>
  </article>
</template>
