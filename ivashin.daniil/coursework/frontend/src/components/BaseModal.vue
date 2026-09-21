<script setup>
import {nextTick, onBeforeUnmount, onMounted, ref, watch} from 'vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '',
  },
  narrow: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue']);
const modal = ref(null);
const closeButton = ref(null);
let previousFocus = null;

const focusableSelector =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled])';

const closeOnEscape = (event) => {
  if (!props.modelValue) return;

  if (event.key === 'Escape') {
    emit('update:modelValue', false);
    return;
  }

  if (event.key !== 'Tab' || !modal.value) return;

  const focusable = [...modal.value.querySelectorAll(focusableSelector)];
  if (!focusable.length) return;

  const first = focusable[0];
  const last = focusable.at(-1);

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
};

watch(
  () => props.modelValue,
  async (isOpen) => {
    if (isOpen) {
      previousFocus = document.activeElement;
      await nextTick();
      closeButton.value?.focus();
    } else if (previousFocus && typeof previousFocus.focus === 'function') {
      previousFocus.focus();
      previousFocus = null;
    }
  },
);

onMounted(() => document.addEventListener('keydown', closeOnEscape));
onBeforeUnmount(() => document.removeEventListener('keydown', closeOnEscape));
</script>

<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="modal-backdrop"
      @click.self="emit('update:modelValue', false)"
    >
      <section
        ref="modal"
        class="modal"
        :class="{'modal--narrow': narrow}"
        role="dialog"
        aria-modal="true"
        :aria-label="title"
      >
        <button
          ref="closeButton"
          class="modal__close"
          type="button"
          aria-label="Закрыть"
          @click="emit('update:modelValue', false)"
        >
          ×
        </button>
        <slot />
      </section>
    </div>
  </Teleport>
</template>
