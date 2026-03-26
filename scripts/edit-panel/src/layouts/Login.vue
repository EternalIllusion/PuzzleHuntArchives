<template>
  <div class="login-container">
    <div class="login-card">
      <h1 class="title">系统登录</h1>
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="input-group">
          <input
            v-model="username"
            type="text"
            placeholder="用户名"
            class="input-field"
            :disabled="loading"
            required
          />
        </div>
        <div class="input-group">
          <input
            v-model="password"
            type="password"
            placeholder="密码"
            class="input-field"
            :disabled="loading"
            required
          />
        </div>
        <button
          type="submit"
          class="login-button"
          :disabled="loading || !username.trim() || !password.trim()"
        >
          {{ loading ? '登录中...' : '登录' }}
        </button>
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/user';

const username = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');
const router = useRouter();
const userStore = useUserStore();

const handleLogin = async () => {
  if (!username.value.trim() || !password.value.trim()) return;

  loading.value = true;
  error.value = '';

  try {
    await userStore.login(username.value, password.value);
    // 登录成功后跳转（例如到首页）
    router.push('/editor'); // 请根据你的路由调整
  } catch (err: any) {
    console.error('Login failed:', err);
    error.value = err.response?.data?.error || '登录失败，请检查用户名或密码';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* 扁平化设计 - 极简风格 */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 20px;
  box-sizing: border-box;
}

.login-card {
  width: 100%;
  max-width: 400px;
  padding: 0;
}

.title {
  text-align: center;
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 28px;
}

.input-group {
  margin-bottom: 16px;
}

.input-field {
    box-sizing: border-box;
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.2s;
  background-color: white;
}

.input-field:focus {
  border-color: #4096ff;
}

.login-button {
  width: 100%;
  padding: 12px;
  background-color: #1677ff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.login-button:hover:not(:disabled) {
  background-color: #0958d9;
}

.login-button:disabled {
  background-color: #b3d9ff;
  cursor: not-allowed;
}

.error-message {
  margin-top: 16px;
  color: #ff4d4f;
  text-align: center;
  font-size: 14px;
}
</style>