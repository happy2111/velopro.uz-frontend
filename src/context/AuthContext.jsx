import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Проверяем авторизацию при загрузке приложения
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Пытаемся обновить токен через refresh token в cookie
        const response = await axiosInstance.post('/api/auth/refresh');
        const { accessToken: newToken } = response.data;

        setAccessToken(newToken);

        // Получаем данные пользователя
        const userResponse = await axiosInstance.get('/api/users/me');
        setUser(userResponse.data);
      } catch (error) {
        console.log('No valid session found');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (login, password) => {
    try {
      const response = await axiosInstance.post('/api/auth/login', {
        login,
        password
      });

      const { accessToken: token, user: userData } = response.data;

      setAccessToken(token);
      setUser(userData);

      // Синхронизируем корзину после входа
      await syncCartWithBackend();

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Ошибка входа'
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await axiosInstance.post('/api/auth/register', userData);
      const { accessToken: token, user: newUser } = response.data;

      setAccessToken(token);
      setUser(newUser);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Ошибка регистрации'
      };
    }
  };

  const logout = async () => {
    try {
      await axiosInstance.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  };

  const syncCartWithBackend = async () => {
    try {
      const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
      if (localCart.length > 0) {
        // Отправляем товары из локальной корзины на сервер
        for (const item of localCart) {
          await axiosInstance.post('/api/cart', {
            productId: item.productId,
            quantity: item.quantity
          });
        }
        // Очищаем локальную корзину
        localStorage.removeItem('cart');
      }
    } catch (error) {
      console.error('Cart sync error:', error);
    }
  };

  const value = {
    user,
    accessToken,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!accessToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};