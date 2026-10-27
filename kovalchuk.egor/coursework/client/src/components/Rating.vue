<script setup lang="ts">
defineProps<{rating: number}>();
</script>
<template>
  <span
    class="rating"
    :aria-label="`Рейтинг ${rating.toLocaleString('ru-RU')} из 5`"
    ><span aria-hidden="true">★</span>{{ rating.toLocaleString('ru-RU') }}</span
  >
</template>
