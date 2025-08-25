import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from "../components/Button.jsx";

const Login = () => {
  const [formData, setFormData] = useState({
    login: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';
  const params = new URLSearchParams(location.search);
  const redirect = params.get("redirect") || "/";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Очищаем ошибку поля при вводе
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.password) {
      newErrors.password = 'Пароль обязателен';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const result = await login(formData.login, formData.password);

      if (result.success) {
        navigate(redirect, { replace: true });
      } else {
        setErrors({ submit: result.error });
      }
    } catch (error) {
      setErrors({ submit: 'Произошла ошибка. Попробуйте еще раз.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-123px)] flex items-center justify-center py-12  px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 ">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[#f5f5f5]">
            Log In
          </h2>
          <p className="mt-2 text-gray-400">
            Войдите, чтобы получить доступ к вашему профилю
          </p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.submit && (
              <div className="bg-red-600/10 border border-red-600/20 rounded-lg p-4">
                <p className="text-red-400 text-sm">{errors.submit}</p>
              </div>
            )}

            <div>
              <label htmlFor="login" className="block text-sm font-medium text-[#f5f5f5] mb-2">
                Email адрес
              </label>
              <input
                id="login"
                name="login"
                type="text"
                value={formData.login}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-dark-10 border rounded-2xl focus:ring-2 focus:ring-dark-35 focus:border-transparent transition-colors text-[#f5f5f5]  ${
                  errors.password ? 'border-red-500' : 'border-transparent'
                }`}
                placeholder="Введите ваш email или телефон"
              />
              {errors.login && (
                <p className="mt-1 text-sm text-red-400">{errors.login}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#f5f5f5] mb-2">
                Пароль
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-dark-10 border rounded-2xl focus:ring-2 focus:ring-dark-35 focus:border-transparent transition-colors text-[#f5f5f5]  ${
                  errors.password ? 'border-red-500' : 'border-transparent'
                }`}
                placeholder="Введите ваш пароль"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">{errors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              {/*<div className="flex items-center">*/}
              {/*  <input*/}
              {/*    id="remember-me"*/}
              {/*    name="remember-me"*/}
              {/*    type="checkbox"*/}
              {/*    className="h-4 w-4 bg-gray-800 border-gray-600 rounded focus:ring-red-500"*/}
              {/*  />*/}
              {/*  <label htmlFor="remember-me" className="ml-2 text-sm text-gray-400">*/}
              {/*    Запомнить меня*/}
              {/*  </label>*/}
              {/*</div>*/}

              <a href="#" className="text-sm text-red-400 hover:text-red-300 transition-colors">
                Забыли пароль?
              </a>
            </div>
            <Button
              text={loading ? 'Входим...' : 'Войти'}
              isTransparent={false}
              className={`w-full !bg-brown-60 ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
              type="submit"
              disabled={loading}
            />
            {/*<button*/}
            {/*  type="submit"*/}
            {/*  disabled={loading}*/}
            {/*  className={`w-full btn-primary ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}*/}
            {/*>*/}
            {/*  {loading ? 'Входим...' : 'Войти'}*/}
            {/*</button>*/}

            <div className="text-center">
              <span className="text-gray-400">Нет аккаунта? </span>
              <Link to="/register" className="text-red-400 hover:text-red-300 transition-colors">
                Зарегистрироваться
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;