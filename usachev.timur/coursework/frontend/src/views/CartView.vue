<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { api, NetworkError, ApiError } from "../api/client";
import { money, imageUrl, units, type OrderSummary } from "../api/models";
import { cart } from "../state/cart";
import Modal from "../components/Modal.vue";
import QuantityControl from "../components/QuantityControl.vue";
const tab = ref("cart"),
  checked = ref<number[]>([]),
  removal = ref<number[] | null>(null);
const history = ref<OrderSummary[]>([]),
  historyLoading = ref(false),
  historyError = ref("");
const submitting = ref(false),
  fields = ref<Record<string, string>>({}),
  error = ref(""),
  success = ref<OrderSummary | null>(null);
const form = ref({
  phone: "",
  email: "",
  deliveryMethod: "pickup",
  address: "",
  paymentMethod: "",
  packaging: false,
});
const allSelected = computed(
  () =>
    cart.state.items.length > 0 &&
    cart.state.items.every((i) => checked.value.includes(i.productId)),
);
function selectAll() {
  checked.value = allSelected.value
    ? []
    : cart.state.items.map((i) => i.productId);
}
async function remove() {
  if (!removal.value) return;
  const ids = removal.value;
  try {
    await cart.setItems(
      cart.state.items.filter((i) => !ids.includes(i.productId)),
    );
    checked.value = [];
    removal.value = null;
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Не удалось удалить товар";
  }
}
async function loadHistory() {
  tab.value = "history";
  historyLoading.value = true;
  historyError.value = "";
  try {
    history.value = await api.get("/orders");
  } catch (e) {
    historyError.value =
      e instanceof Error ? e.message : "Не удалось загрузить историю";
  } finally {
    historyLoading.value = false;
  }
}
async function submit() {
  if (submitting.value || cart.state.isLoading || !cart.state.calculation)
    return;
  fields.value = {};
  error.value = "";
  if (!form.value.phone.trim())
    fields.value.phone = "Заполните обязательное поле";
  if (
    form.value.email.trim() &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email.trim())
  )
    fields.value.email = "Укажите корректный e-mail";
  if (form.value.deliveryMethod === "delivery" && !form.value.address.trim())
    fields.value.address = "Укажите адрес доставки";
  if (!form.value.paymentMethod)
    fields.value.paymentMethod = "Выберите способ оплаты";
  if (Object.keys(fields.value).length) return;
  submitting.value = true;
  try {
    const result = await api.post<OrderSummary>("/orders", {
      ...form.value,
      items: cart.state.items,
    });
    success.value = result;
    try {
      await cart.clear();
    } catch {
      error.value =
        "Заказ оформлен, но не удалось очистить сохранённую корзину. Удалите товары перед следующей покупкой.";
    }
    checked.value = [];
    form.value = {
      phone: "",
      email: "",
      deliveryMethod: "pickup",
      address: "",
      paymentMethod: "",
      packaging: false,
    };
  } catch (e) {
    if (e instanceof ApiError) {
      fields.value = e.fieldErrors;
      error.value = e.message;
    } else if (e instanceof NetworkError)
      error.value =
        "Не удалось получить ответ. Заказ мог быть создан. Проверьте историю заказов перед повторным оформлением.";
    else error.value = "Не удалось оформить заказ. Попробуйте позже.";
  } finally {
    submitting.value = false;
  }
}
onMounted(() => {
  if (!cart.state.isLoading) void cart.refresh();
});
</script>
<template>
  <div class="cart-page">
    <div class="tabs">
      <button :class="{ active: tab === 'cart' }" @click="tab = 'cart'">
        Корзина</button
      ><button :class="{ active: tab === 'history' }" @click="loadHistory">
        История заказов
      </button>
    </div>
    <div v-if="error" class="notice" role="alert">{{ error }}</div>
    <section v-if="tab === 'history'">
      <p v-if="historyLoading" role="status">Загружаем историю…</p>
      <div v-else-if="historyError" class="notice" role="alert">
        {{ historyError }} <button @click="loadHistory">Повторить</button>
      </div>
      <div v-else-if="history.length" class="order-history">
        <article v-for="order in history" :key="order.number">
          <span
            >№ {{ order.number }} от
            {{ new Date(order.createdAt).toLocaleDateString("ru-RU") }}</span
          ><span>{{ units(order.totalQuantity) }}</span
          ><strong>{{ money(order.totalPrice) }}</strong>
        </article>
      </div>
      <div v-else class="empty-cart">
        <h2>Заказов пока нет</h2>
        <RouterLink class="button" to="/catalog">Перейти в каталог</RouterLink>
      </div>
    </section>
    <template v-else
      ><div v-if="!cart.state.items.length" class="empty-cart">
        <img
          class="empty-illustration"
          src="../assets/design/empty-cart.png"
          alt=""
        />
        <h2>Пока пусто</h2>
        <p>
          Ознакомьтесь с новинками и хитами на главной<br />или найдите нужное в
          каталоге
        </p>
        <RouterLink class="button" to="/catalog">Перейти в каталог</RouterLink
        ><RouterLink class="text-button" to="/">Главная страница</RouterLink>
      </div>
      <template v-else
        ><p v-if="cart.state.isLoading" role="status">Обновляем корзину…</p>
        <div v-else-if="cart.state.calculation" class="cart-panel">
          <div class="cart-tools">
            <label class="check"
              ><input
                type="checkbox"
                :checked="allSelected"
                :disabled="submitting"
                @change="selectAll"
              />Выбрать все</label
            ><button
              v-if="checked.length"
              class="text-button pink"
              :disabled="submitting"
              @click="removal = [...checked]"
            >
              {{ allSelected ? "Удалить все" : "Удалить выбранные" }}
            </button>
          </div>
          <article
            v-for="item in cart.state.calculation.items"
            :key="item.product.id"
            class="cart-row"
          >
            <input
              v-model="checked"
              type="checkbox"
              :value="item.product.id"
              :disabled="submitting"
              :aria-label="'Выбрать ' + item.product.name"
            /><img
              :src="imageUrl(item.product.imageUrl)"
              :alt="item.product.name"
            /><span class="cart-product-name">{{ item.product.name }}</span
            ><QuantityControl
              :id="item.product.id"
              :disabled="submitting"
            /><strong>{{ money(item.totalPrice) }}</strong
            ><button
              class="text-button pink"
              :disabled="submitting"
              @click="removal = [item.product.id]"
            >
              Удалить
            </button>
          </article>
          <p class="cart-total">
            {{ units(cart.state.calculation.totalQuantity) }} на
            <strong>{{ money(cart.state.calculation.totalPrice) }}</strong>
          </p>
        </div>
        <section class="checkout">
          <h2>Оформление заказа</h2>
          <form class="checkout-form" novalidate @submit.prevent="submit">
            <fieldset :disabled="submitting">
              <div class="form-columns">
                <label
                  >Телефон <span class="pink">*</span
                  ><input
                    v-model="form.phone"
                    @input="delete fields.phone"
                    type="tel"
                    autocomplete="tel"
                    :aria-invalid="!!fields.phone"
                  /><span v-if="fields.phone" class="field-error">{{
                    fields.phone
                  }}</span></label
                ><label
                  >E-mail<input
                    v-model="form.email"
                    @input="delete fields.email"
                    type="email"
                    autocomplete="email"
                    :aria-invalid="!!fields.email"
                  /><span v-if="fields.email" class="field-error">{{
                    fields.email
                  }}</span></label
                >
              </div>
              <div class="delivery-options">
                <label
                  ><input
                    v-model="form.deliveryMethod"
                    type="radio"
                    value="pickup"
                  />Самовывоз</label
                ><label
                  ><input
                    v-model="form.deliveryMethod"
                    type="radio"
                    value="delivery"
                  />Доставка</label
                >
              </div>
              <label
                v-if="form.deliveryMethod === 'delivery'"
                class="address-field"
                >Адрес доставки <span class="pink">*</span
                ><input
                  v-model="form.address"
                  @input="delete fields.address"
                  autocomplete="street-address"
                  :aria-invalid="!!fields.address"
                /><span v-if="fields.address" class="field-error">{{
                  fields.address
                }}</span></label
              ><label class="payment-field"
                >Способ оплаты <span class="pink">*</span
                ><select
                  v-model="form.paymentMethod"
                  @change="delete fields.paymentMethod"
                  :aria-invalid="!!fields.paymentMethod"
                >
                  <option value="" disabled>Не выбрано</option>
                  <option value="card">По карте</option>
                  <option value="cash">Наличными</option></select
                ><span v-if="fields.paymentMethod" class="field-error">{{
                  fields.paymentMethod
                }}</span></label
              ><label class="check"
                ><input v-model="form.packaging" type="checkbox" />Нужна
                упаковка</label
              ><button
                class="button"
                :disabled="
                  submitting || cart.state.isLoading || !cart.state.calculation
                "
              >
                {{ submitting ? "Оформляем…" : "Оформить заказ" }}
              </button>
            </fieldset>
          </form>
        </section></template
      ></template
    >
  </div>
  <Modal v-if="removal" title="Удаление товаров" @close="removal = null"
    ><div class="confirmation">
      <h2>
        Вы действительно хотите удалить
        {{ removal.length === 1 ? "товар" : "выбранные товары" }}?
      </h2>
      <p v-if="removal.length === 1">
        {{
          cart.state.calculation?.items.find(
            (i) => i.product.id === removal![0],
          )?.product.name
        }}
      </p>
      <div class="dialog-actions">
        <button class="text-button pink" @click="removal = null">Отмена</button
        ><button class="button" @click="remove">Да, удалить</button>
      </div>
    </div></Modal
  ><Modal v-if="success" title="Спасибо за заказ" @close="success = null"
    ><div class="confirmation">
      <img class="section-symbol" src="../assets/design/flame.png" alt="" />
      <h2>Спасибо, ваш заказ успешно оформлен!</h2>
      <p>
        Номер заказа {{ success.number }}.<br />Мы свяжемся с вами, чтобы
        уточнить удобное время получения.
      </p>
      <div class="dialog-actions">
        <button
          class="text-button"
          @click="
            success = null;
            loadHistory();
          "
        >
          История заказов</button
        ><button class="button" @click="success = null">Ок</button>
      </div>
    </div></Modal
  >
</template>
