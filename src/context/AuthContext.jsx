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
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [accessToken, setAccessToken] = useState(() => {
    const storedToken = localStorage.getItem('accessToken');
    return storedToken ? JSON.parse(storedToken) : null;
  });

  const [loading, setLoading] = useState(true);

  // Проверяем авторизацию при первом запуске
  useEffect(() => {
    const checkAuth = async () => {
      // Если нет токена в localStorage, сразу завершаем проверку
      const storedToken = localStorage.getItem('accessToken');
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        // Сначала пытаемся получить данные пользователя с текущим токеном
        let userResponse;
        try {
          userResponse = await axiosInstance.get('/api/auth/me');
          setUser(userResponse.data);
          localStorage.setItem('user', JSON.stringify(userResponse.data));
          setLoading(false);
          return;
        } catch (error) {
          // Если текущий токен не работает, пытаемся обновить
          if (error.response?.status === 401) {
            console.log('Token expired, trying to refresh...');
          } else {
            throw error;
          }
        }

        // Пытаемся обновить токен
        const refreshResponse = await axiosInstance.post('/api/auth/refresh');
        const newToken = refreshResponse.data.accessToken;

        localStorage.setItem('accessToken', JSON.stringify(newToken));
        setAccessToken(newToken);

        // Получаем данные пользователя с новым токеном
        userResponse = await axiosInstance.get('/api/users/me');
        setUser(userResponse.data);
        localStorage.setItem('user', JSON.stringify(userResponse.data));

      } catch (error) {
        console.log('Authentication check failed:', error.message);
        // Очищаем все данные авторизации
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        setAccessToken(null);
        setUser(null);
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
      localStorage.setItem('accessToken', JSON.stringify(token));
      localStorage.setItem('user', JSON.stringify(userData));
      setAccessToken(token);
      setUser(userData);

      // Синхронизируем корзину после успешного логина
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
      localStorage.setItem('accessToken', JSON.stringify(token));
      localStorage.setItem('user', JSON.stringify(newUser));
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
      // Очищаем все данные
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      localStorage.removeItem('cart'); // Очищаем корзину при выходе
      setAccessToken(null);
      setUser(null);
    }
  };

  const syncCartWithBackend = async () => {
    try {
      const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
      if (localCart.length > 0) {
        for (const item of localCart) {
          await axiosInstance.post('/api/cart', {
            productId: item.productId,
            quantity: item.quantity
          });
        }
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
    isAuthenticated: !!accessToken && !!user, // Проверяем и токен, и пользователя
  };

  if (loading) {
    // Можете показать спиннер загрузки
    return <div>Загрузка...</div>;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};