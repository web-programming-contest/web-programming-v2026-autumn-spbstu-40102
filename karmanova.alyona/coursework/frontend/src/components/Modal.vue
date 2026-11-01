<script setup lang="ts">
import { onMounted, ref } from "vue";
defineProps<{ title: string }>();
const emit = defineEmits<{ close: [] }>();
const dialog = ref<HTMLDialogElement>();
onMounted(() => {
  dialog.value?.showModal();
});
</script>
<template>
  <dialog
    ref="dialog"
    class="modal"
    :aria-label="title"
    @cancel.prevent="emit('close')"
  >
    <button class="modal-close" aria-label="Закрыть" @click="emit('close')">
      ×</button
    ><slot />
  </dialog>
</template>
