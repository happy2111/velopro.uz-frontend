import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Для отправки cookies с refresh token
});

let isRefreshing = false;
let refreshSubscribers = [];

// Функция для добавления подписчиков на обновление токена
const subscribeTokenRefresh = (cb) => {
  refreshSubscribers.push(cb);
};

// Функция для уведомления всех подписчиков о новом токене
const onRefreshed = (token) => {
  refreshSubscribers.map(cb => cb(token));
  refreshSubscribers = [];
};

// Request interceptor для добавления access token
axiosInstance.interceptors.request.use(
  (config) => {
    const authStore = window.__AUTH_STORE__;
    if (authStore && authStore.accessToken) {
      config.headers.Authorization = `Bearer ${authStore.accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor для обработки 401 ошибок
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;

    if (response?.status === 401 && !config._retry) {
      if (config.url === '/api/auth/refresh') {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Если уже обновляем токен, добавляем запрос в очередь
        return new Promise((resolve, reject) => {
          subscribeTokenRefresh((token) => {
            config.headers.Authorization = `Bearer ${token}`;
            config._retry = true;
            resolve(axiosInstance(config));
          });
        });
      }

      config._retry = true;
      isRefreshing = true;

      try {
        const response = await axiosInstance.post('/api/auth/refresh');
        const { accessToken } = response.data;

        // Обновляем токен в store
        if (window.__AUTH_STORE__) {
          window.__AUTH_STORE__.accessToken = accessToken;
        }

        // Уведомляем всех подписчиков
        onRefreshed(accessToken);

        // Повторяем оригинальный запрос
        config.headers.Authorization = `Bearer ${accessToken}`;
        return axiosInstance(config);
      } catch (refreshError) {
        // Если refresh не удался, разлогиниваем пользователя
        if (window.__AUTH_STORE__) {
          window.__AUTH_STORE__.logout();
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);


export default axiosInstance;