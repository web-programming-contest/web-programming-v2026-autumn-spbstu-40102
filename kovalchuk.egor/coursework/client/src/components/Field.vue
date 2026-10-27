<script setup lang="ts">
withDefaults(
  defineProps<{
    label: string;
    name: string;
    modelValue: string;
    error?: string;
    required?: boolean;
    type?: string;
    autocomplete?: string;
    maxlength?: number;
  }>(),
  {type: 'text', error: '', required: false},
);
const emit = defineEmits<{'update:modelValue': [value: string]}>();
function update(event: Event): void {
  emit('update:modelValue', (event.target as HTMLInputElement).value);
}
</script>
<template>
  <div class="field">
    <label :for="name" :class="{'required-label': required}">{{ label }}</label
    ><input
      :id="name"
      :name="name"
      :type="type"
      :autocomplete="autocomplete"
      :maxlength="maxlength"
      :value="modelValue"
      :aria-required="required"
      :aria-invalid="Boolean(error)"
      :aria-describedby="error ? `${name}-error` : undefined"
      @input="update"
    /><span v-if="error" :id="`${name}-error`" class="field-error">{{
      error
    }}</span>
  </div>
</template>
