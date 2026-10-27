<script setup lang="ts">
import {onMounted, onBeforeUnmount, ref} from 'vue';
import Icon from './Icon.vue';
defineProps<{title: string; wide?: boolean}>();
const emit = defineEmits<{dismiss: []}>();
const dialog = ref<HTMLDialogElement | null>(null);
onMounted(() => dialog.value?.showModal());
onBeforeUnmount(() => dialog.value?.close());
</script>
<template>
  <dialog
    ref="dialog"
    class="dialog"
    :class="{'product-dialog': wide}"
    :aria-label="title"
    @cancel.prevent="emit('dismiss')"
    @click.self="emit('dismiss')"
  >
    <div class="dialog-content">
      <button
        type="button"
        class="icon-button dialog-close"
        aria-label="Закрыть окно"
        autofocus
        @click="emit('dismiss')"
      >
        <Icon name="close" /></button
      ><slot />
    </div>
  </dialog>
</template>
