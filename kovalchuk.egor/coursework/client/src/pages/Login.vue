<script setup lang="ts">
import {reactive, ref} from 'vue';
import {useRouter} from 'vue-router';
import type {FieldErrors} from '../../../shared/types';
import {login} from '../store';
import {errorMessage} from '../api';
import Field from '../components/Field.vue';
import Dialog from '../components/Dialog.vue';
const router = useRouter();
const values = reactive({login: '', password: ''});
const errors = ref<FieldErrors>({});
const popup = ref('');
const pending = ref(false);
async function submit(): Promise<void> {
  const issues: FieldErrors = {};
  if (!values.login.trim()) {
    issues.login = 'Заполните обязательное поле';
  }
  if (!values.password.trim()) {
    issues.password = 'Заполните обязательное поле';
  }
  errors.value = issues;
  if (Object.keys(issues).length || pending.value) {
    return;
  }
  pending.value = true;
  try {
    await login(values);
    await router.replace('/');
  } catch (error) {
    popup.value = errorMessage(error);
  } finally {
    pending.value = false;
  }
}
</script>
<template>
  <main class="login-page">
    <div class="login-box">
      <h1>Добро пожаловать!</h1>
      <form
        class="login-form"
        novalidate
        aria-label="Вход в систему"
        @submit.prevent="submit"
      >
        <Field
          v-model="values.login"
          label="Логин"
          name="login"
          required
          autocomplete="username"
          :maxlength="120"
          :error="errors.login"
          @update:model-value="errors.login = ''"
        /><Field
          v-model="values.password"
          label="Пароль"
          name="password"
          type="password"
          required
          autocomplete="current-password"
          :maxlength="200"
          :error="errors.password"
          @update:model-value="errors.password = ''"
        /><button type="submit" class="button" :disabled="pending">
          {{ pending ? 'Входим…' : 'Войти' }}
        </button>
      </form>
    </div>
    <Dialog v-if="popup" title="Ошибка входа" @dismiss="popup = ''"
      ><h2>Не удалось войти</h2>
      <p>{{ popup }}</p>
      <button type="button" class="button" @click="popup = ''">
        Понятно
      </button></Dialog
    >
  </main>
</template>
