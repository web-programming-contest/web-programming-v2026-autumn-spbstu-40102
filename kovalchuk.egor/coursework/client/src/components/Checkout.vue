<script setup lang="ts">
import {reactive, ref} from 'vue';
import type {Customer, FieldErrors, Order} from '../../../shared/types';
import {ApiError, errorMessage} from '../api';
import {placeOrder, shop} from '../store';
import Field from './Field.vue';
const emit = defineEmits<{success: [order: Order]}>();
const values = reactive<
  Omit<Customer, 'payment'> & {payment: Customer['payment'] | ''}
>({
  phone: '',
  email: '',
  delivery: 'pickup',
  address: '',
  payment: '',
  packaging: false,
});
const errors = ref<FieldErrors>({});
const requestError = ref('');
let attempt = {signature: '', id: ''};
async function submit(): Promise<void> {
  if (shop.locked) {
    return;
  }
  const issues: FieldErrors = {};
  if (!values.phone.trim()) {
    issues.phone = 'Заполните обязательное поле';
  } else if (
    !/^\+?[\d\s()-]{7,25}$/.test(values.phone.trim()) ||
    values.phone.replace(/\D/g, '').length < 7
  ) {
    issues.phone = 'Введите корректный номер телефона';
  }
  if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    issues.email = 'Введите корректный e-mail';
  }
  if (values.delivery === 'delivery' && !values.address.trim()) {
    issues.address = 'Заполните обязательное поле';
  }
  if (!values.payment) {
    issues.payment = 'Выберите способ оплаты';
  }
  errors.value = issues;
  requestError.value = '';
  if (Object.keys(issues).length || !values.payment) {
    return;
  }
  const signature = JSON.stringify({cart: shop.cart, values});
  if (attempt.signature !== signature) {
    attempt = {signature, id: crypto.randomUUID()};
  }
  try {
    const order = await placeOrder(
      {...values, payment: values.payment},
      attempt.id,
    );
    emit('success', order);
  } catch (error) {
    requestError.value = errorMessage(error);
    errors.value = error instanceof ApiError ? error.fields : {};
  }
}
</script>
<template>
  <section class="checkout-section">
    <h2>Оформление заказа</h2>
    <form
      class="checkout-form white-panel"
      novalidate
      aria-label="Оформление заказа"
      @submit.prevent="submit"
    >
      <fieldset :disabled="shop.locked">
        <legend class="visually-hidden">Данные покупателя</legend>
        <div class="customer-fields">
          <Field
            v-model="values.phone"
            label="Телефон"
            name="phone"
            type="tel"
            required
            autocomplete="tel"
            :maxlength="25"
            :error="errors.phone"
            @update:model-value="errors.phone = ''"
          /><Field
            v-model="values.email"
            label="E-mail"
            name="email"
            type="email"
            autocomplete="email"
            :maxlength="150"
            :error="errors.email"
            @update:model-value="errors.email = ''"
          />
        </div>
        <div class="delivery-choice" role="group" aria-label="Способ получения">
          <label class="check-label"
            ><input
              v-model="values.delivery"
              type="radio"
              name="delivery"
              value="pickup"
            />Самовывоз</label
          ><label class="check-label"
            ><input
              v-model="values.delivery"
              type="radio"
              name="delivery"
              value="delivery"
            />Доставка</label
          >
        </div>
        <Field
          v-if="values.delivery === 'delivery'"
          v-model="values.address"
          label="Адрес доставки"
          name="address"
          required
          autocomplete="street-address"
          :maxlength="500"
          :error="errors.address"
          @update:model-value="errors.address = ''"
        />
        <div class="field">
          <label for="payment" class="required-label">Способ оплаты</label
          ><select
            id="payment"
            v-model="values.payment"
            name="payment"
            :aria-invalid="Boolean(errors.payment)"
            :aria-describedby="errors.payment ? 'payment-error' : undefined"
            @change="errors.payment = ''"
          >
            <option value="">Не выбрано</option>
            <option value="card">По карте</option>
            <option value="cash">Наличными</option></select
          ><span v-if="errors.payment" id="payment-error" class="field-error">{{
            errors.payment
          }}</span>
        </div>
        <label class="check-label packaging"
          ><input
            v-model="values.packaging"
            type="checkbox"
            name="packaging"
          />Нужна упаковка</label
        >
        <p v-if="requestError" role="alert" class="field-error">
          {{ requestError }}
        </p>
        <button type="submit" class="button">
          {{ shop.locked ? 'Оформляем…' : 'Оформить заказ' }}
        </button>
      </fieldset>
    </form>
  </section>
</template>
