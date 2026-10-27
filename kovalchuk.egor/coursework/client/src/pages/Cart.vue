<script setup lang="ts">
import {computed, ref} from 'vue';
import {RouterLink, useRoute, useRouter} from 'vue-router';
import type {Good, Order} from '../../../shared/types';
import {clearOrderedCart, removeItems, shop} from '../store';
import {money, productWord} from '../api';
import History from '../components/History.vue';
import Checkout from '../components/Checkout.vue';
import CartControl from '../components/CartControl.vue';
import Dialog from '../components/Dialog.vue';
import Icon from '../components/Icon.vue';
const route = useRoute();
const router = useRouter();
const history = computed(() => route.query.tab === 'history');
const selected = ref<number[]>([]);
const deleting = ref<number[] | null>(null);
const success = ref<Order | null>(null);
const rows = computed(() =>
  shop.cart.flatMap((item) => {
    const good = shop.goods.find((entry) => entry.id === item.id);
    return good ? [{...item, good: good as Good}] : [];
  }),
);
const count = computed(() =>
  rows.value.reduce((sum, item) => sum + item.quantity, 0),
);
const total = computed(() =>
  rows.value.reduce((sum, item) => sum + item.quantity * item.good.price, 0),
);
const allSelected = computed(
  () =>
    rows.value.length > 0 &&
    rows.value.every((item) => selected.value.includes(item.id)),
);
const selectedIds = computed(() =>
  selected.value.filter((id) => rows.value.some((item) => item.id === id)),
);
function selectAll(): void {
  selected.value = allSelected.value ? [] : rows.value.map((item) => item.id);
}
function confirmRemoval(): void {
  if (deleting.value && removeItems(deleting.value)) {
    selected.value = selected.value.filter(
      (id) => !deleting.value!.includes(id),
    );
    deleting.value = null;
  }
}
function ordered(order: Order): void {
  clearOrderedCart();
  selected.value = [];
  success.value = order;
}
</script>
<template>
  <main class="cart-page">
    <div class="container">
      <h1 class="visually-hidden">Корзина и история заказов</h1>
      <div class="cart-tabs" role="tablist" aria-label="Покупки">
        <button
          role="tab"
          type="button"
          :aria-selected="!history"
          :class="{'tab-active': !history}"
          @click="router.replace({path: '/cart'})"
        >
          Корзина</button
        ><button
          role="tab"
          type="button"
          :aria-selected="history"
          :class="{'tab-active': history}"
          @click="router.replace({path: '/cart', query: {tab: 'history'}})"
        >
          История заказов
        </button>
      </div>
      <History v-if="history" />
      <div v-else-if="rows.length === 0" class="empty-panel">
        <div class="empty-cart-icon"><Icon name="cart" /></div>
        <h2>
          {{ success ? 'Спасибо, ваш заказ успешно оформлен' : 'Пока пусто' }}
        </h2>
        <p>
          Ознакомьтесь с новинками и хитами на главной<br />или найдите нужное в
          каталоге
        </p>
        <div class="empty-links">
          <RouterLink class="text-link" to="/">Главная страница</RouterLink
          ><RouterLink class="button" to="/catalog"
            >Перейти в каталог</RouterLink
          >
        </div>
      </div>
      <template v-else
        ><section class="white-panel cart-items" aria-label="Товары в корзине">
          <div class="bulk-actions">
            <label class="check-label"
              ><input
                type="checkbox"
                :checked="allSelected"
                :disabled="shop.locked"
                @change="selectAll"
              />Выбрать все</label
            ><button
              v-if="selectedIds.length"
              type="button"
              class="text-button"
              :disabled="shop.locked"
              @click="deleting = [...selectedIds]"
            >
              Удалить выбранные ({{ selectedIds.length }})
            </button>
          </div>
          <article
            v-for="{id, quantity, good} in rows"
            :key="id"
            class="cart-row"
            data-testid="cart-row"
          >
            <input
              v-model="selected"
              type="checkbox"
              :value="id"
              :aria-label="`Выбрать товар: ${good.name}`"
              :disabled="shop.locked"
            /><img
              :src="good.image"
              :alt="good.name"
              width="145"
              height="145"
            /><span class="cart-product-name">{{ good.name }}</span
            ><CartControl :good="good" compact /><strong class="row-total">{{
              money(quantity * good.price)
            }}</strong
            ><button
              type="button"
              class="text-button remove-item"
              :disabled="shop.locked"
              :aria-label="`Удалить товар: ${good.name}`"
              @click="deleting = [id]"
            >
              <Icon name="close" />Удалить
            </button>
          </article>
          <p class="cart-total" data-testid="cart-total">
            {{ count }} {{ productWord(count) }} на {{ money(total) }}
          </p>
        </section>
        <Checkout @success="ordered" /></template
      ><Dialog
        v-if="deleting"
        title="Подтверждение удаления"
        @dismiss="deleting = null"
        ><h2>
          Удалить {{ deleting.length === 1 ? 'товар' : 'выбранные товары' }}?
        </h2>
        <p>
          Вы уверены, что хотите удалить
          {{
            deleting.length === 1
              ? shop.goods.find((good) => good.id === deleting![0])?.name
              : `${deleting.length} позиции из корзины`
          }}?
        </p>
        <div class="dialog-actions">
          <button class="button" type="button" @click="confirmRemoval">
            Да, удалить</button
          ><button class="text-button" type="button" @click="deleting = null">
            Отмена
          </button>
        </div></Dialog
      ><Dialog v-if="success" title="Заказ оформлен" @dismiss="success = null"
        ><h2>Спасибо за заказ!</h2>
        <p>Спасибо, ваш заказ успешно оформлен.</p>
        <p>
          Номер заказа {{ success.id }}. Мы свяжемся с вами в течение 10 минут,
          чтобы уточнить удобное для вас время
          {{
            success.customer.delivery === 'delivery'
              ? 'доставки'
              : 'самовывоза'
          }}.
        </p>
        <button type="button" class="button" @click="success = null">
          Ок
        </button></Dialog
      >
    </div>
  </main>
</template>
