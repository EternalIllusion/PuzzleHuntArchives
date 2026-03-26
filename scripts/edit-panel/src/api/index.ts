// src/api/index.ts
import axios, { AxiosInstance } from 'axios';
import CryptoJS from 'crypto-js';
import { useUserStore } from '../stores/user';
import { useRouter } from 'vue-router';

const API_BASE_URL = 'http://localhost:5000';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// 请求拦截器：自动加 X-Token 和 X-Signature
api.interceptors.request.use((config) => {
  const userStore = useUserStore();
  const { token, sk } = userStore;

  if (token && sk) {
    // 构造签名消息：method|path|sorted_query_string
    const method = (config.method || 'GET').toUpperCase();
    const path = config.url || '';
    // 排序 query 参数并拼接成 a=1&b=2 形式
    const params = new URLSearchParams(config.params || {});
    const sortedQuery = Array.from(params.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}=${v}`)
      .join('&');

    const message = `${method}|${path}|${sortedQuery}`;

    // 使用 crypto-js 生成 HMAC-SHA256 签名（十六进制小写）
    const signature = CryptoJS.HmacSHA256(message, sk).toString(CryptoJS.enc.Hex);

    config.headers['X-Token'] = token;
    config.headers['X-Signature'] = signature;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

// 响应拦截器：401 自动登出
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const userStore = useUserStore();
      userStore.logout();
    }
    const router = useRouter();
    router.push("/login");
    return Promise.reject(error);
  }
);

// ==================== 具体 API 方法 ====================

export interface LoginResponse {
  message: string;
  token: string;
  sk: string;
}

export const login = (username: string, password: string) =>
  axios.post<LoginResponse>(`${API_BASE_URL}/login`, { username, password }).then(res => res.data);

export const logout = () => api.post('/logout').then(() => {});

export const readJson = (path: string) => api.get(`/json/read`, { params: { path } }).then(res => res.data);

export const readDir = (path: string) => api.get(`/dir`, { params: { path } }).then(res => res.data);

export const writeJson = (path: string, data: any) => api.post(`/json/write`, data, { params: { path } }).then(() => {});

export interface UploadTokenResponse {
  upload_token: string;
  expires_in: number;
}

export const getUploadToken = () =>
  api.get<UploadTokenResponse>('/upload/token').then(res => res.data);

export const uploadImage = (file: File, uploadToken: string, path?: string) => {
  const formData = new FormData();
  formData.append('file', file);
  if (path) formData.append('path', path);

  return axios
    .post(`${API_BASE_URL}/upload`, formData, {
      headers: {
        'X-Upload-Token': uploadToken,
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(res => res.data);
};

export default api;