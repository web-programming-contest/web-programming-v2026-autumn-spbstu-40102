<script setup>
import {computed} from 'vue';
import {formatPrice} from '../api/client.js';

const props = defineProps({
  min: {type: Number, required: true},
  max: {type: Number, required: true},
  modelMin: {type: Number, required: true},
  modelMax: {type: Number, required: true},
});

const emit = defineEmits(['update:modelMin', 'update:modelMax']);

const range = computed(() => Math.max(props.max - props.min, 1));
const leftPercent = computed(
  () => ((props.modelMin - props.min) / range.value) * 100,
);
const rightPercent = computed(
  () => ((props.modelMax - props.min) / range.value) * 100,
);

const updateMin = (event) => {
  const value = Number(event.target.value);
  emit('update:modelMin', Math.min(value, props.modelMax - 100));
};

const updateMax = (event) => {
  const value = Number(event.target.value);
  emit('update:modelMax', Math.max(value, props.modelMin + 100));
};
</script>

<template>
  <div class="price-range">
    <div class="price-range__labels">
      <span>От {{ formatPrice(modelMin) }}</span>
      <span>До {{ formatPrice(modelMax) }}</span>
    </div>
    <div class="price-range__track">
      <span
        class="price-range__active"
        :style="{left: `${leftPercent}%`, right: `${100 - rightPercent}%`}"
      />
      <input
        class="price-range__input price-range__input--min"
        type="range"
        :min="min"
        :max="max"
        :value="modelMin"
        :aria-label="`Минимальная цена: ${formatPrice(modelMin)}`"
        @input="updateMin"
      />
      <input
        class="price-range__input price-range__input--max"
        type="range"
        :min="min"
        :max="max"
        :value="modelMax"
        :aria-label="`Максимальная цена: ${formatPrice(modelMax)}`"
        @input="updateMax"
      />
    </div>
  </div>
</template>
