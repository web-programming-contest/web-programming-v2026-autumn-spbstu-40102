<script setup lang="ts">
import {onMounted, onUnmounted, ref} from 'vue';
import type {Order} from '../../../shared/types';
import {api, errorMessage, money, productWord} from '../api';
const orders = ref<Order[] | null>(null);
const error = ref('');
let active = true;
async function load(): Promise<void> {
  error.value = '';
  try {
    const data = await api<{orders: Order[]}>('/orders');
    if (active) {
      orders.value = data.orders;
    }
  } catch (issue) {
    if (active) {
      error.value = errorMessage(issue);
    }
  }
}
onMounted(load);
onUnmounted(() => {
  active = false;
});
</script>
<template>
  <div v-if="error" class="empty-panel">
    <p role="alert">{{ error }}</p>
    <button type="button" class="button" @click="load">Повторить</button>
  </div>
  <p v-else-if="orders === null" class="loading" role="status">
    Загрузка заказов…
  </p>
  <div v-else-if="orders.length === 0" class="empty-panel">
    <h2>Заказов пока нет</h2>
    <p>Оформленные заказы появятся здесь.</p>
  </div>
  <ul v-else class="order-list">
    <li v-for="order in orders" :key="order.id" data-testid="order-row">
      <strong
        >№ {{ order.id }} от
        {{
          new Date(order.createdAt).toLocaleDateString('ru-RU', {
            timeZone: 'Europe/Moscow',
          })
        }}</strong
      ><span>{{ order.quantity }} {{ productWord(order.quantity) }}</span
      ><strong>{{ money(order.total) }}</strong>
    </li>
  </ul>
</template>
