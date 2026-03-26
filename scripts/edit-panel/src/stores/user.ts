// src/stores/user.ts
import { defineStore } from 'pinia';
import { login as apiLogin, logout as apiLogout } from '../api';

export const useUserStore = defineStore('user', {
  state: () => ({
    username: null as string | null,
    token: null as string | null,
    sk: null as string | null,
  }),

  getters: {
    isLoggedIn: (state) => !!state.token && !!state.sk,
  },

  actions: {
    async login(username: string, password: string) {
      const data = await apiLogin(username, password);
      this.username = username;
      this.token = data.token;
      this.sk = data.sk;
    },

    async logout() {
      try {
        await apiLogout();
      } catch (e) {
        // 忽略登出失败
      }
      this.$reset(); // pinia-plugin-persistedstate 会自动清除 localStorage
    },
  },

  // 启用持久化（自动存到 localStorage）
  persist: {
    key: 'user-session',
    storage: localStorage,
  },
});