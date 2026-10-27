<script setup lang="ts">
import type {Good} from '../../../shared/types';
defineProps<{good: Good}>();
</script>
<template>
  <div class="badges">
    <span v-if="good.isNew" class="badge badge-new">Новинка</span
    ><span v-if="good.isHit" class="badge badge-hit">Хит</span>
  </div>
</template>
