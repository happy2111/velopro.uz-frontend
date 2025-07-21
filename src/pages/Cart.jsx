// 📁 src/pages/Cart.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import axiosInstance from '../utils/axiosInstance';

const Cart = () => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingItems, setUpdatingItems] = useState(new Set());

  useEffect(() => {
    loadCart();
  }, [user]);

  const loadCart = async () => {
    try {
      setLoading(true);

      if (user) {
        // Загрузить корзину с сервера
        const response = await axiosInstance.get('/api/cart');
        setCartItems(response.data.items || []);
      } else {
        // Загрузить корзину из localStorage
        const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
        setCartItems(localCart);
      }
    } catch (err) {
      setError('Ошибка загрузки корзины');
      console.error('Cart load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeItem(productId);
      return;
    }

    setUpdatingItems(prev => new Set(prev).add(productId));

    try {
      if (user) {
        // Обновить на сервере
        await axiosInstance.put(`/api/cart/${productId}`, { quantity: newQuantity });
      } else {
        // Обновить в localStorage
        const updatedCart = cartItems.map(item =>
          item.productId === productId ? { ...item, quantity: newQuantity } : item
        );
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        setCartItems(updatedCart);
      }

      if (user) {
        loadCart(); // Перезагрузить корзину с сервера
      }
    } catch (err) {
      console.error('Update quantity error:', err);
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const removeItem = async (productId) => {
    setUpdatingItems(prev => new Set(prev).add(productId));

    try {
      if (user) {
        // Удалить на сервере
        await axiosInstance.delete(`/api/cart/${productId}`);
      } else {
        // Удалить из localStorage
        const updatedCart = cartItems.filter(item => item.productId !== productId);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        setCartItems(updatedCart);
      }

      if (user) {
        loadCart(); // Перезагрузить корзину с сервера
      }
    } catch (err) {
      console.error('Remove item error:', err);
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const clearCart = async () => {
    if (!window.confirm('Очистить корзину?')) return;

    try {
      if (user) {
        // Очистить все товары на сервере
        for (const item of cartItems) {
          await axiosInstance.delete(`/api/cart/${item.productId}`);
        }
      } else {
        // Очистить localStorage
        localStorage.removeItem('cart');
        setCartItems([]);
      }

      if (user) {
        loadCart();
      }
    } catch (err) {
      console.error('Clear cart error:', err);
    }
  };

  const totalPrice = cartItems.reduce((sum, item) => {
    return sum + (item.product?.price || 0) * item.quantity;
  }, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] text-[#f5f5f5] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-xl">Загрузка корзины...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] text-[#f5f5f5] flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-600 mb-4">{error}</p>
          <button
            onClick={loadCart}
            className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-2xl transition-colors"
          >
            Повторить попытку
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-[#f5f5f5]">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Корзина</h1>
          {cartItems.length > 0 && (
            <button
              onClick={clearCart}
              className="text-gray-400 hover:text-red-600 transition-colors"
            >
              Очистить корзину
            </button>
          )}
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <svg className="w-24 h-24 text-gray-600 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h10m-10 0a2 2 0 100 4 2 2 0 000-4zm10 0a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
            <h2 className="text-2xl font-bold mb-4">Корзина пуста</h2>
            <p className="text-gray-400 mb-6">Добавьте товары в корзину, чтобы продолжить покупки</p>
            <Link
              to="/products"
              className="bg-red-600 hover:bg-red-700 px-8 py-3 rounded-2xl transition-colors inline-block"
            >
              Перейти к каталогу
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map(item => (
                <div key={item.productId} className="bg-gray-900 rounded-2xl shadow-xl p-6">
                  <div className="flex items-center space-x-4">
                    {/* Product Image */}
                    <div className="w-20 h-20 bg-gray-800 rounded-xl flex-shrink-0">
                      {item.product?.image ? (
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover rounded-xl"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className="w-8 h-8 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2L3 7l9 5 9-5-9-5zM3 17l9 5 9-5M3 12l9 5 9-5"/>
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-1">
                        {item.product?.name || 'Неизвестный товар'}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {item.product?.price ? `${item.product.price.toLocaleString()} сум` : 'Цена не указана'}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        disabled={updatingItems.has(item.productId)}
                        className="w-8 h-8 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center disabled:opacity-50"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </button>

                      <span className="w-8 text-center font-medium">
                        {updatingItems.has(item.productId) ? '...' : item.quantity}
                      </span>

                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        disabled={updatingItems.has(item.productId)}
                        className="w-8 h-8 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center disabled:opacity-50"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeItem(item.productId)}
                      disabled={updatingItems.has(item.productId)}
                      className="text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>

                  {/* Item Total */}
                  <div className="mt-4 pt-4 border-t border-gray-800 text-right">
                    <span className="text-lg font-bold">
                      {item.product?.price ?
                        `${(item.product.price * item.quantity).toLocaleString()} сум` :
                        'Цена не указана'
                      }
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gray-900 rounded-2xl shadow-xl p-6 sticky top-4">
                <h2 className="text-2xl font-bold mb-6">Итого</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-400">
                    <span>Товаров:</span>
                    <span>{cartItems.length}</span>
                  </div>

                  <div className="flex justify-between text-gray-400">
                    <span>Количество:</span>
                    <span>{cartItems.reduce((sum, item) => sum + item.quantity, 0)} шт.</span>
                  </div>

                  <div className="flex justify-between text-gray-400">
                    <span>Доставка:</span>
                    <span>Бесплатно</span>
                  </div>

                  <div className="border-t border-gray-700 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold">Всего:</span>
                      <span className="text-2xl font-bold text-red-600">
                        {totalPrice.toLocaleString()} сум
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Link
                    to="/checkout"
                    className="w-full bg-red-600 hover:bg-red-700 py-4 rounded-2xl text-center font-bold transition-colors block"
                  >
                    Оформить заказ
                  </Link>

                  <Link
                    to="/products"
                    className="w-full bg-gray-800 hover:bg-gray-700 border border-gray-600 py-4 rounded-2xl text-center font-bold transition-colors block"
                  >
                    Продолжить покупки
                  </Link>
                </div>

                {/* Promo Code */}
                <div className="mt-6 pt-6 border-t border-gray-700">
                  <h3 className="font-bold mb-3">Промокод</h3>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Введите промокод"
                      className="flex-1 px-3 py-2 rounded-xl bg-gray-800 text-[#f5f5f5] border border-gray-700 focus:border-red-600 focus:outline-none text-sm"
                    />
                    <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors text-sm">
                      Применить
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;