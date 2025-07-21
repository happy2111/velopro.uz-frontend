import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import axiosInstance from '../utils/axiosInstance';

const Profile = () => {
  const { user, logout } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: ''
  });
  const [saving, setSaving] = useState(false);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (user) {
      fetchUserData();
      fetchOrders();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/users/me');
      setUserData(response.data);
      console.log(response.data);
      setFormData({
        username: response.data.username || '',
        email: response.data.email || '',
        phone: response.data.phone || ''
      });
    } catch (err) {
      console.error('Fetch user data error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      // Заглушка для заказов - API эндпоинт не указан в требованиях
      setOrders([
        {
          id: 1,
          date: '2024-01-15',
          status: 'delivered',
          total: 850000,
          items: [
            { name: 'Горный велосипед Trek X-Caliber', quantity: 1, price: 850000 }
          ]
        },
        {
          id: 2,
          date: '2024-01-10',
          status: 'processing',
          total: 1200000,
          items: [
            { name: 'Шоссейный велосипед Giant TCR', quantity: 1, price: 1200000 }
          ]
        }
      ]);
    } catch (err) {
      console.error('Fetch orders error:', err);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      // API для обновления профиля не указан в требованиях
      // await axiosInstance.put('/api/users/me', formData);

      // Симуляция сохранения
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUserData({ ...userData, ...formData });
      setEditing(false);

      // Show success message
      const successDiv = document.createElement('div');
      successDiv.className = 'fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-2xl shadow-xl z-50';
      successDiv.textContent = 'Профиль обновлен!';
      document.body.appendChild(successDiv);

      setTimeout(() => {
        document.body.removeChild(successDiv);
      }, 3000);

    } catch (err) {
      console.error('Save profile error:', err);
    } finally {
      setSaving(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'text-green-600';
      case 'processing': return 'text-yellow-600';
      case 'cancelled': return 'text-red-600';
      default: return 'text-gray-400';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'delivered': return 'Доставлен';
      case 'processing': return 'В обработке';
      case 'cancelled': return 'Отменен';
      default: return 'Неизвестно';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] text-[#f5f5f5] flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-600 mb-4">Необходимо войти в систему</p>
          <button
            onClick={() => window.location.href = '/login'}
            className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-2xl transition-colors"
          >
            Войти
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] text-[#f5f5f5] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-xl">Загрузка профиля...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-[#f5f5f5]">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Личный кабинет</h1>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-6 py-3 rounded-2xl transition-colors ${
              activeTab === 'profile'
                ? 'bg-red-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            Профиль
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-3 rounded-2xl transition-colors ${
              activeTab === 'orders'
                ? 'bg-red-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            Мои заказы
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Form */}
            <div className="lg:col-span-2">
              <div className="bg-gray-900 rounded-2xl shadow-xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Информация профиля</h2>
                  {!editing && (
                    <button
                      onClick={() => setEditing(true)}
                      className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl transition-colors"
                    >
                      Редактировать
                    </button>
                  )}
                </div>

                {editing ? (
                  <form onSubmit={handleSave} className="space-y-6">
                    <div>
                      <label htmlFor="username" className="block text-sm font-medium mb-2">
                        Имя пользователя
                      </label>
                      <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-2xl bg-gray-800 text-[#f5f5f5] border border-gray-700 focus:border-red-600 focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-2xl bg-gray-800 text-[#f5f5f5] border border-gray-700 focus:border-red-600 focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium mb-2">
                        Телефон
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-2xl bg-gray-800 text-[#f5f5f5] border border-gray-700 focus:border-red-600 focus:outline-none"
                      />
                    </div>

                    <div className="flex space-x-4">
                      <button
                        type="submit"
                        disabled={saving}
                        className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 py-3 rounded-2xl font-bold transition-colors"
                      >
                        {saving ? 'Сохранение...' : 'Сохранить'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditing(false);
                          setFormData({
                            username: userData.username || '',
                            email: userData.email || '',
                            phone: userData.phone || ''
                          });
                        }}
                        className="flex-1 bg-gray-800 hover:bg-gray-700 border border-gray-600 py-3 rounded-2xl font-bold transition-colors"
                      >
                        Отмена
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Имя пользователя
                      </label>
                      <p className="text-lg">{userData?.username || 'Не указано'}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Email
                      </label>
                      <p className="text-lg">{userData?.email || 'Не указано'}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Телефон
                      </label>
                      <p className="text-lg">{userData?.phone || 'Не указано'}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Дата регистрации
                      </label>
                      <p className="text-lg">{userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'Не указано'}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Account Actions */}
            <div className="lg:col-span-1">
              <div className="bg-gray-900 rounded-2xl shadow-xl p-6">
                <h2 className="text-2xl font-bold mb-6">Действия</h2>

                <div className="space-y-4">
                  <button
                    onClick={() => window.location.href = '/cart'}
                    className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-2xl font-bold transition-colors"
                  >
                    Корзина
                  </button>

                  <button
                    onClick={logout}
                    className="w-full bg-gray-800 hover:bg-gray-700 border border-gray-600 py-3 rounded-2xl font-bold transition-colors"
                  >
                    Выйти из системы
                  </button>
                </div>

                {/* Account Stats */}
                <div className="mt-6 pt-6 border-t border-gray-700 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Заказов:</span>
                    <span className="font-bold">{orders.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Статус:</span>
                    <span className="font-bold text-green-600">Активный</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="bg-gray-900 rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold mb-6">История заказов</h2>

            {orders.length === 0 ? (
              <div className="text-center py-16">
                <svg className="w-24 h-24 text-gray-600 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 className="text-xl font-bold mb-2">Заказов пока нет</h3>
                <p className="text-gray-400 mb-6">Сделайте свой первый заказ в нашем каталоге</p>
                <button
                  onClick={() => window.location.href = '/products'}
                  className="bg-red-600 hover:bg-red-700 px-8 py-3 rounded-2xl transition-colors"
                >
                  Перейти к каталогу
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map(order => (
                  <div key={order.id} className="border border-gray-700 rounded-2xl p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold mb-1">Заказ №{order.id}</h3>
                        <p className="text-gray-400 text-sm">{new Date(order.date).toLocaleDateString()}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{item.name} × {item.quantity}</span>
                          <span>{item.price.toLocaleString()} сум</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 border-t border-gray-700 flex justify-between items-center">
                      <span className="font-bold">Итого: {order.total.toLocaleString()} сум</span>
                      <button className="text-red-600 hover:text-red-700 transition-colors">
                        Подробнее
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;