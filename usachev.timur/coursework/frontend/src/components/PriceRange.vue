<script setup lang="ts">
import { computed } from "vue";
const props = defineProps<{
  minimum: number;
  maximum: number;
  from: string;
  to: string;
}>();
const emit = defineEmits<{
  "update:from": [value: string];
  "update:to": [value: string];
}>();
const clamp = (value: string, fallback: number) => {
  const parsed = Number(value);
  return value === "" || !Number.isFinite(parsed)
    ? fallback
    : Math.min(props.maximum, Math.max(props.minimum, parsed));
};
const lower = computed(() => clamp(props.from, props.minimum));
const upper = computed(() =>
  Math.max(lower.value, clamp(props.to, props.maximum)),
);
const percent = (value: number) =>
  props.maximum === props.minimum
    ? 0
    : ((value - props.minimum) / (props.maximum - props.minimum)) * 100;
const selection = computed(() => ({
  left: `${percent(lower.value)}%`,
  right: `${100 - percent(upper.value)}%`,
}));
function changeLower(event: Event) {
  const input = event.target as HTMLInputElement;
  input.value = String(Math.min(Number(input.value), upper.value));
  emit("update:from", input.value);
}
function changeUpper(event: Event) {
  const input = event.target as HTMLInputElement;
  input.value = String(Math.max(Number(input.value), lower.value));
  emit("update:to", input.value);
}
const spoken = (value: number) => `${value.toLocaleString("ru-RU")} рублей`;
</script>

<template>
  <div class="price-range" role="group" aria-label="Диапазон цен">
    <div class="range-track" aria-hidden="true">
      <div class="range-selection" :style="selection" />
    </div>
    <input
      class="range-handle lower"
      type="range"
      aria-label="Минимальная цена"
      :aria-valuetext="spoken(lower)"
      :min="minimum"
      :max="maximum"
      step="1"
      :value="lower"
      :disabled="minimum === maximum"
      :style="{ zIndex: lower === maximum ? 3 : 1 }"
      @input="changeLower"
    />
    <input
      class="range-handle upper"
      type="range"
      aria-label="Максимальная цена"
      :aria-valuetext="spoken(upper)"
      :min="minimum"
      :max="maximum"
      step="1"
      :value="upper"
      :disabled="minimum === maximum"
      @input="changeUpper"
    />
  </div>
</template>

<style scoped>
.price-range {
  position: relative;
  height: 40px;
  margin: 16px 10px 0;
}
.range-track {
  position: absolute;
  top: 18px;
  left: 0;
  right: 0;
  height: 4px;
  background: #e4e7eb;
  border-radius: 2px;
}
.range-selection {
  position: absolute;
  top: 0;
  bottom: 0;
  background: #00ce98;
}
.price-range input.range-handle {
  appearance: none;
  -webkit-appearance: none;
  position: absolute;
  inset: 0;
  width: calc(100% + 20px);
  height: 40px;
  margin: 0 -10px;
  padding: 0;
  border: 0;
  border-radius: 0;
  background: transparent;
  pointer-events: none;
  outline: none;
  box-shadow: none;
}
.price-range input.upper {
  z-index: 2;
}
.price-range input:focus-visible {
  z-index: 4 !important;
}
.range-handle::-webkit-slider-runnable-track {
  background: transparent;
  height: 4px;
}
.range-handle::-moz-range-track {
  background: transparent;
  height: 4px;
}
.range-handle::-webkit-slider-thumb {
  appearance: none;
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  margin-top: -8px;
  border: 0;
  border-radius: 50%;
  background: #115efb;
  pointer-events: auto;
  cursor: ew-resize;
}
.range-handle::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border: 0;
  border-radius: 50%;
  background: #115efb;
  pointer-events: auto;
  cursor: ew-resize;
}
.range-handle:hover::-webkit-slider-thumb,
.range-handle:active::-webkit-slider-thumb {
  background: #0c368a;
}
.range-handle:hover::-moz-range-thumb,
.range-handle:active::-moz-range-thumb {
  background: #0c368a;
}
.range-handle:focus-visible::-webkit-slider-thumb {
  outline: 2px solid #84adff;
  outline-offset: 3px;
}
.range-handle:focus-visible::-moz-range-thumb {
  outline: 2px solid #84adff;
  outline-offset: 3px;
}
.range-handle:disabled::-webkit-slider-thumb {
  background: #84adff;
  cursor: default;
}
.range-handle:disabled::-moz-range-thumb {
  background: #84adff;
  cursor: default;
}
</style>
