<script setup>
import {reactive, ref} from 'vue';
import {useRoute, useRouter} from 'vue-router';

import {ApiError} from '../api/client.js';
import {useAuth} from '../composables/useAuth.js';

const router = useRouter();
const route = useRoute();
const auth = useAuth();
const form = reactive({username: '', password: ''});
const errors = reactive({username: '', password: ''});
const serverError = ref('');
const submitting = ref(false);

const clearError = (field) => {
  errors[field] = '';
  serverError.value = '';
};

const submit = async () => {
  errors.username = form.username.trim() ? '' : 'Заполните обязательное поле';
  errors.password = form.password ? '' : 'Заполните обязательное поле';

  if (errors.username || errors.password) {
    return;
  }

  submitting.value = true;
  serverError.value = '';

  try {
    await auth.login(form);
    await router.push(
      typeof route.query.redirect === 'string' ? route.query.redirect : '/',
    );
  } catch (error) {
    serverError.value =
      error instanceof ApiError ? error.message : 'Не удалось войти';
  } finally {
    submitting.value = false;
  }
};
</script>

<template>
  <section class="login-page">
    <h1 class="login-page__title">Добро пожаловать!</h1>
    <form class="login-card" novalidate @submit.prevent="submit">
      <label class="form-field" :class="{'form-field--error': errors.username}">
        Логин
        <input
          v-model="form.username"
          name="username"
          autocomplete="username"
          @input="clearError('username')"
        />
        <small v-if="errors.username">{{ errors.username }}</small>
      </label>
      <label class="form-field" :class="{'form-field--error': errors.password}">
        Пароль
        <input
          v-model="form.password"
          name="password"
          type="password"
          autocomplete="current-password"
          @input="clearError('password')"
        />
        <small v-if="errors.password">{{ errors.password }}</small>
      </label>
      <p v-if="serverError" class="form-error">{{ serverError }}</p>
      <button class="button button--blue" type="submit" :disabled="submitting">
        {{ submitting ? 'Входим…' : 'Войти' }}
      </button>
    </form>
  </section>
</template>
