<script setup lang="ts">
defineProps<{name: string}>();
const paths: Record<string, string> = {
  cart: 'M2 3h3l2.5 12h11l3-9H6M9 20h.01M18 20h.01',
  profile: 'M20 21v-2a7 7 0 0 0-14 0v2M13 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z',
  catalog: 'M3 3h6v6H3zM15 3h6v6h-6zM3 15h6v6H3zM15 15h6v6h-6z',
  phone: 'M7 2h10v20H7zM11 18h2',
  mail: 'M3 5h18v14H3zM3 5l9 8 9-8',
  pin: 'M12 22s8-8 8-14A8 8 0 0 0 4 8c0 6 8 14 8 14ZM12 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
  close: 'M5 5l14 14M19 5 5 19',
  arrow: 'M9 4l8 8-8 8',
  rocket: 'M14 3l7-1-1 7-9 9-5-5ZM5 14l-3 7 7-3M6 13 3 9l7-2M11 18l4 3 2-7',
  return: 'M3 10a9 9 0 1 1 0 5M3 3v7h7M12 7v10M15 9h-5v4h5v3h-5',
  shield: 'M12 2 3 6v6c0 5 9 10 9 10s9-5 9-10V6ZM7 12l3 3 7-7',
};
</script>
<template>
  <svg
    class="icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <path :d="paths[name] || paths.cart" />
  </svg>
</template>
