import {computed, ref} from 'vue';

import {request} from '../api/client.js';

const user = ref(null);
const initialized = ref(false);
const loading = ref(false);

export const useAuth = () => {
  const restore = async () => {
    if (initialized.value) {
      return user.value;
    }

    loading.value = true;

    try {
      const result = await request('/me');
      user.value = result.user;
    } catch {
      user.value = null;
    } finally {
      initialized.value = true;
      loading.value = false;
    }

    return user.value;
  };

  const login = async (credentials) => {
    const result = await request('/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    user.value = result.user;
    initialized.value = true;
    return user.value;
  };

  const logout = async () => {
    await request('/logout', {method: 'POST'});
    user.value = null;
  };

  return {
    user: computed(() => user.value),
    isAuthenticated: computed(() => Boolean(user.value)),
    initialized: computed(() => initialized.value),
    loading: computed(() => loading.value),
    restore,
    login,
    logout,
  };
};
