<script setup>
import {computed, nextTick, onMounted, reactive, ref, watch} from 'vue';

import {formatDate, formatPrice, request} from '../api/client.js';
import BaseModal from '../components/BaseModal.vue';
import QuantityControl from '../components/QuantityControl.vue';
import {useCart} from '../composables/useCart.js';

const cart = useCart();
const products = ref([]);
const orders = ref([]);
const activeTab = ref('cart');
const loading = ref(true);
const error = ref('');
const selectedIds = ref([]);
const previousIds = new Set();
const deleteModalOpen = ref(false);
const pendingDelete = ref(null);
const successModalOpen = ref(false);
const successOrder = ref(null);
const successDeliveryType = ref('pickup');
const successAddress = ref('');
const checkoutButton = ref(null);
const submitting = ref(false);
const form = reactive({
  email: '',
  phone: '',
  deliveryType: 'pickup',
  address: '',
  paymentMethod: 'card',
  packaging: false,
});
const errors = reactive({email: '', phone: '', address: ''});

const quantityLabel = (value) => {
  const mod10 = value % 10;
  const mod100 = value % 100;

  if (mod10 === 1 && mod100 !== 11) return 'товар';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20))
    return 'товара';
  return 'товаров';
};

const closeSuccessModal = () => {
  successModalOpen.value = false;
  nextTick(() => checkoutButton.value?.focus());
};

const productMap = computed(
  () => new Map(products.value.map((product) => [product.id, product])),
);
const cartProducts = computed(() =>
  cart.items.value
    .map((item) => ({...item, product: productMap.value.get(item.productId)}))
    .filter((item) => item.product),
);
const selectedCartProducts = computed(() =>
  cartProducts.value.filter((item) =>
    selectedIds.value.includes(item.productId),
  ),
);
const totalCount = computed(() =>
  selectedCartProducts.value.reduce((total, item) => total + item.quantity, 0),
);
const totalPrice = computed(() =>
  selectedCartProducts.value.reduce(
    (total, item) => total + item.quantity * item.product.priceKopecks,
    0,
  ),
);
const allSelected = computed(
  () =>
    cartProducts.value.length > 0 &&
    cartProducts.value.every((item) =>
      selectedIds.value.includes(item.productId),
    ),
);

watch(
  cartProducts,
  (items) => {
    const ids = new Set(items.map((item) => item.productId));
    selectedIds.value =
      !previousIds.size && ids.size
        ? [...ids]
        : selectedIds.value.filter((id) => ids.has(id));
    previousIds.clear();
    ids.forEach((id) => previousIds.add(id));
  },
  {deep: true, immediate: true},
);
const toggleAll = () => {
  selectedIds.value = allSelected.value
    ? []
    : cartProducts.value.map((item) => item.productId);
};

const askDelete = (productId = null) => {
  pendingDelete.value =
    productId === null ? [...selectedIds.value] : [productId];
  deleteModalOpen.value = true;
};

const confirmDelete = () => {
  for (const id of pendingDelete.value || []) cart.remove(id);
  selectedIds.value = [];
  deleteModalOpen.value = false;
};

const clearErrors = () => {
  errors.email = '';
  errors.phone = '';
  errors.address = '';
};

const submitOrder = async () => {
  clearErrors();
  error.value = '';
  const items = selectedCartProducts.value.map(({productId, quantity}) => ({
    productId,
    quantity,
  }));
  if (!items.length) {
    error.value = 'Выберите хотя бы один товар';
    return;
  }
  if (!form.phone.trim()) errors.phone = 'Заполните обязательное поле';
  if (form.email && !/^\S+@\S+\.\S+$/.test(form.email))
    errors.email = 'Введите корректный email';
  if (form.deliveryType === 'delivery' && !form.address.trim())
    errors.address = 'Укажите адрес доставки';
  if (errors.phone || errors.email || errors.address) return;

  submitting.value = true;
  error.value = '';

  try {
    const result = await request('/orders', {
      method: 'POST',
      body: JSON.stringify({items, ...form}),
    });
    successOrder.value = result.order;
    successDeliveryType.value = form.deliveryType;
    successAddress.value = form.address;
    for (const {productId} of items) cart.remove(productId);
    await loadOrders().catch(() => undefined);
    successModalOpen.value = true;
  } catch (requestError) {
    error.value = requestError.message || 'Не удалось оформить заказ';
  } finally {
    submitting.value = false;
  }
};

const loadOrders = async () => {
  const result = await request('/orders');
  orders.value = result.orders;
};

onMounted(async () => {
  try {
    const [goodsResult] = await Promise.all([request('/goods'), loadOrders()]);
    products.value = goodsResult.goods;
  } catch {
    error.value = 'Не удалось загрузить данные корзины';
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <section class="cart-page site-container">
    <div class="tabs">
      <button
        type="button"
        :class="{'is-active': activeTab === 'cart'}"
        @click="activeTab = 'cart'"
      >
        Корзина
      </button>
      <button
        type="button"
        :class="{'is-active': activeTab === 'orders'}"
        @click="activeTab = 'orders'"
      >
        История заказов
      </button>
    </div>

    <p v-if="loading" class="status-message">Загрузка…</p>
    <p v-else-if="error" class="status-message status-message--error">
      {{ error }}
    </p>

    <template v-else-if="activeTab === 'orders'">
      <div v-if="orders.length" class="orders-table">
        <div v-for="order in orders" :key="order.id" class="orders-table__row">
          <span>№ {{ order.id }} от {{ formatDate(order.createdAt) }}</span>
          <span
            >{{ order.itemCount }}
            {{ order.itemCount === 1 ? 'товар' : 'товара' }}</span
          >
          <strong>{{ formatPrice(order.totalKopecks) }}</strong>
        </div>
      </div>
      <p v-else class="empty-results">История заказов пока пуста.</p>
    </template>

    <template v-else>
      <div v-if="cartProducts.length" class="cart-list">
        <div class="cart-list__toolbar">
          <label class="check-field"
            ><input
              type="checkbox"
              :checked="allSelected"
              @change="toggleAll"
            />
            Выбрать все</label
          >
          <button
            v-if="selectedIds.length"
            class="button button--link button--danger"
            type="button"
            @click="askDelete()"
          >
            × Удалить все
          </button>
        </div>

        <div
          v-for="item in cartProducts"
          :key="item.productId"
          class="cart-item"
        >
          <input
            v-model="selectedIds"
            type="checkbox"
            :value="item.productId"
            aria-label="Выбрать товар"
          />
          <img :src="item.product.imagePath" :alt="item.product.name" />
          <span class="cart-item__name">{{ item.product.name }}</span>
          <QuantityControl
            :value="item.quantity"
            @decrement="cart.decrement(item.productId)"
            @increment="cart.increment(item.productId)"
          />
          <strong>{{
            formatPrice(item.quantity * item.product.priceKopecks)
          }}</strong>
          <button
            class="button button--link button--danger"
            type="button"
            @click="askDelete(item.productId)"
          >
            ×&nbsp; Удалить
          </button>
        </div>

        <div class="cart-list__total">
          {{ totalCount }} {{ quantityLabel(totalCount) }} на
          {{ formatPrice(totalPrice) }}
        </div>
      </div>

      <div v-else class="empty-cart">
        <span class="empty-cart__icon">🛒</span>
        <h1>Пока пусто</h1>
        <p>
          Ознакомьтесь с новинками и хитами на главной<br />или найдите нужное в
          каталоге
        </p>
        <RouterLink class="button button--blue" to="/catalog"
          >Перейти в каталог</RouterLink
        >
        <RouterLink class="button button--link" to="/"
          >Главная страница</RouterLink
        >
      </div>

      <section v-if="cartProducts.length" class="checkout-section">
        <h2>Оформление заказа</h2>
        <form class="checkout-card" novalidate @submit.prevent="submitOrder">
          <div class="checkout-card__fields">
            <label
              class="form-field"
              :class="{'form-field--error': errors.phone}"
              >Телефон<input
                v-model="form.phone"
                name="phone"
                type="tel"
                placeholder="+7 (___) ___-__-__"
              /><small v-if="errors.phone">{{ errors.phone }}</small></label
            >
            <label
              class="form-field"
              :class="{'form-field--error': errors.email}"
              >E-mail<input
                v-model="form.email"
                name="email"
                type="email"
                placeholder="Введите email"
              /><small v-if="errors.email">{{ errors.email }}</small></label
            >
          </div>
          <fieldset class="radio-group">
            <legend>Способ получения</legend>
            <label
              ><input v-model="form.deliveryType" type="radio" value="pickup" />
              Самовывоз</label
            ><label
              ><input
                v-model="form.deliveryType"
                type="radio"
                value="delivery"
              />
              Доставка</label
            >
          </fieldset>
          <label
            v-if="form.deliveryType === 'delivery'"
            class="form-field"
            :class="{'form-field--error': errors.address}"
            >Адрес доставки<input
              v-model="form.address"
              name="address"
              placeholder="Введите адрес"
            /><small v-if="errors.address">{{ errors.address }}</small></label
          >
          <label class="form-field checkout-card__select"
            >Способ оплаты<select
              v-model="form.paymentMethod"
              name="paymentMethod"
            >
              <option value="card">По карте</option>
              <option value="cash">Наличными</option>
            </select></label
          >
          <label class="check-field"
            ><input v-model="form.packaging" type="checkbox" /> Нужна
            упаковка</label
          >
          <button
            ref="checkoutButton"
            class="button button--blue"
            type="submit"
            :disabled="submitting || !selectedCartProducts.length"
          >
            {{ submitting ? 'Оформляем…' : 'Оформить заказ' }}
          </button>
        </form>
      </section>
    </template>

    <BaseModal v-model="deleteModalOpen" title="Подтверждение удаления" narrow>
      <div class="confirm-modal">
        <h2>Вы действительно хотите удалить товар?</h2>
        <div>
          <button
            class="button button--link"
            type="button"
            @click="deleteModalOpen = false"
          >
            Отмена</button
          ><button
            class="button button--blue"
            type="button"
            @click="confirmDelete"
          >
            Да, удалить
          </button>
        </div>
      </div>
    </BaseModal>
    <BaseModal v-model="successModalOpen" title="Заказ оформлен" narrow>
      <div class="confirm-modal">
        <span class="success-icon">☺</span>
        <h2>Спасибо за заказ!</h2>
        <p v-if="successOrder">Заказ №{{ successOrder.id }} оформлен.</p>
        <p v-if="successDeliveryType === 'delivery'">
          Доставим по адресу: {{ successAddress }}
        </p>
        <p v-else>Заказ можно забрать самовывозом.</p>
        <p>Мы свяжемся с вами в течение 10 минут.</p>
        <button
          class="button button--blue"
          type="button"
          @click="closeSuccessModal"
        >
          Ок
        </button>
      </div>
    </BaseModal>
  </section>
</template>
