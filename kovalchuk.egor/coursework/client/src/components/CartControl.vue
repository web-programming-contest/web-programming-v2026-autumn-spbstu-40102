<script setup lang="ts">
import {computed} from 'vue';
import type {Good} from '../../../shared/types';
import {changeQuantity, shop} from '../store';
import Icon from './Icon.vue';
const props = defineProps<{good: Good; compact?: boolean}>();
const quantity = computed(
  () => shop.cart.find((item) => item.id === props.good.id)?.quantity || 0,
);
</script>
<template>
  <button
    v-if="quantity === 0"
    type="button"
    class="button"
    :disabled="shop.locked"
    data-testid="cart-add"
    :aria-label="`В корзину: ${good.name}`"
    @click="changeQuantity(good.id, 1)"
  >
    <Icon name="cart" />В корзину
  </button>
  <div v-else class="cart-control">
    <span v-if="!compact" class="in-cart"
      ><Icon name="cart" />{{ quantity }} шт.</span
    ><button
      type="button"
      class="quantity-button"
      :disabled="shop.locked"
      :aria-label="`Уменьшить количество: ${good.name}`"
      @click="changeQuantity(good.id, -1)"
    >
      −</button
    ><span class="quantity-value">{{ quantity }}</span
    ><button
      type="button"
      class="quantity-button"
      :disabled="shop.locked || quantity >= 99"
      :aria-label="`Увеличить количество: ${good.name}`"
      @click="changeQuantity(good.id, 1)"
    >
      +
    </button>
  </div>
</template>
