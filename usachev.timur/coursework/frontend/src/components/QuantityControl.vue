<script setup lang="ts">
import { computed, ref } from "vue";
import { cart } from "../state/cart";
const props = defineProps<{
  id: number;
  disabled?: boolean;
  detailed?: boolean;
}>();
const quantity = computed(
  () => cart.state.items.find((i) => i.productId === props.id)?.quantity ?? 0,
);
const error = ref("");
async function change(delta: number) {
  if (props.disabled) return;
  error.value = "";
  const count = quantity.value + delta;
  try {
    await cart.setItems([
      ...cart.state.items.filter((i) => i.productId !== props.id),
      ...(count > 0 ? [{ productId: props.id, quantity: count }] : []),
    ]);
  } catch (e) {
    error.value =
      e instanceof Error ? e.message : "Не удалось сохранить корзину";
  }
}
</script>
<template>
  <div class="purchase-control" @click.stop>
    <div v-if="quantity" class="quantity">
      <button
        :disabled="disabled"
        :aria-label="'Уменьшить количество'"
        @click="change(-1)"
      >
        −</button
      ><span>{{ quantity }}</span
      ><button
        :disabled="disabled"
        aria-label="Увеличить количество"
        @click="change(1)"
      >
        +</button
      ><span v-if="detailed" class="in-cart-label"
        ><img src="../assets/icons/cart.svg" alt="" />В корзине
        {{ quantity }}</span
      >
    </div>
    <button v-else :disabled="disabled" class="button" @click="change(1)">
      <img src="../assets/icons/cart.svg" alt="" />В корзину</button
    ><span v-if="error" class="field-error" role="alert">{{ error }}</span>
  </div>
</template>
