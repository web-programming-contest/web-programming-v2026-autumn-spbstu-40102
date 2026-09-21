<script setup>
defineProps({
  value: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(['decrement', 'increment']);
</script>

<template>
  <div class="quantity-control" aria-label="Количество товара">
    <button
      type="button"
      aria-label="Уменьшить количество"
      @click="emit('decrement')"
    >
      −
    </button>
    <span>{{ value }}</span>
    <button
      type="button"
      aria-label="Увеличить количество"
      @click="emit('increment')"
    >
      +
    </button>
  </div>
</template>
