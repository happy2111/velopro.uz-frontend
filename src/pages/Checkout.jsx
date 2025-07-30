import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import axiosInstance from '../utils/axiosInstance';
import {useCart} from "../context/CartContext.jsx";

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, loadCart, getCartTotal, clearCart , loading} = useCart()
  const [cart, setCart] = useState([]);
  // const [loading, setLoading] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'card',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        email: user.email || '',
        phone: user.phone || ''
      }));
    }
    loadCart();
  }, [user]);

  // const loadCart = async () => {
  //   try {
  //     setLoading(true);
  //     if (user) {
  //       const response = await axiosInstance.get('/api/cart');
  //       setCart(response.data.items || []);
  //     } else {
  //       const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
  //       setCart(localCart);
  //     }
  //   } catch (error) {
  //     console.error('Error loading cart:', error);
  //     const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
  //     setCart(localCart);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'Введите имя';
    if (!formData.lastName.trim()) newErrors.lastName = 'Введите фамилию';
    if (!formData.email.trim()) newErrors.email = 'Введите email';
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Некорректный email';
    if (!formData.phone.trim()) newErrors.phone = 'Введите номер телефона';
    if (!formData.address.trim()) newErrors.address = 'Введите адрес';
    if (!formData.city.trim()) newErrors.city = 'Введите город';
    if (!formData.postalCode.trim()) newErrors.postalCode = 'Введите почтовый индекс';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // const getCartTotal = () => {
  //   return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  // };

  const calculateTax = () => {
    return getCartTotal() * 0.12; // 12% tax
  };

  const calculateShipping = () => {
    const total = getCartTotal();
    return total > 500 ? 0 : 50; // Free shipping over $500
  };

  const calculateFinalTotal = () => {
    return getCartTotal() + calculateTax() + calculateShipping();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("uz-UZ", { style: "currency", currency: "UZS" }).format(
      amount,
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (cartItems.length === 0) {
      alert('Корзина пуста');
      return;
    }

    try {
      setOrderLoading(true);

      const transformedProducts = cartItems.map(item => ({
        product: item._id,      // This will be ObjectId in Mongo
        quantity: item.quantity // Already a number
      }));

      const orderData = {
        products: transformedProducts,
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode
        },
        contactInfo: {
          email: formData.email,
          phone: formData.phone
        },
        paymentMethod: formData.paymentMethod,
        notes: formData.notes,
        total: calculateFinalTotal()
      };

      const response = await axiosInstance.post('/api/orders', orderData);

      clearCart()

      alert('Заказ успешно оформлен! Спасибо за покупку!');
      navigate('/');

    } catch (error) {
      console.error('Error creating order:', error);
      alert('Ошибка при оформлении заказа. Попробуйте снова.');
    } finally {
      setOrderLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] text-[#f5f5f5] flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-brown-60"></div>
      </div>
    );
  }


  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] text-[#f5f5f5] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Корзина пуста</h2>
          <p className="text-gray-400 mb-6">Добавьте товары в корзину перед оформлением заказа</p>
          <button
            onClick={() => navigate('/products')}
            className="bg-brown-60 hover:bg-brown-65 text-white px-8 py-3 rounded-lg transition-colors"
          >
            К товарам
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-[#f5f5f5]">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-12">Оформление заказа</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-dark-10 p-8 rounded-2xl shadow-xl">
              <h2 className="text-2xl font-bold mb-6">Информация о доставке</h2>

              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Имя *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`w-full bg-dark-12 border ${errors.firstName ? 'bo text-brown-60' : 'border-gray-40'} rounded-lg px-4 py-3 text-[#f5f5f5] focus:outline-none focus:ring-2 focus:ring-brown-65`}
                  />
                  {errors.firstName && <p className="text-brown-60 text-sm mt-1">{errors.firstName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Фамилия *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`w-full bg-dark-12 border ${errors.lastName ? 'botext-brown-60' : 'border-gray-40'} rounded-lg px-4 py-3 text-[#f5f5f5] focus:outline-none focus:ring-2 focus:ring-brown-65`}
                  />
                  {errors.lastName && <p className="text-brown-60 text-sm mt-1">{errors.lastName}</p>}
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full bg-dark-12 border ${errors.email ? 'bo text-brown-60' : 'border-gray-40'} rounded-lg px-4 py-3 text-[#f5f5f5] focus:outline-none focus:ring-2 focus:ring-brown-65`}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Телефон *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full bg-dark-12 border ${errors.phone ? 'bo text-brown-60' : 'border-gray-40'} rounded-lg px-4 py-3 text-[#f5f5f5] focus:outline-none focus:ring-2 focus:ring-brown-65`}
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>
              </div>

              {/* Address */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Адрес *</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={`w-full bg-dark-12 border ${errors.address ? 'bo text-brown-60' : 'border-gray-40'} rounded-lg px-4 py-3 text-[#f5f5f5] focus:outline-none focus:ring-2 focus:ring-brown-65`}
                />
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Город *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={`w-full bg-dark-12 border ${errors.city ? 'bo text-brown-60' : 'border-gray-40'} rounded-lg px-4 py-3 text-[#f5f5f5] focus:outline-none focus:ring-2 focus:ring-brown-65`}
                  />
                  {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Индекс *</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className={`w-full bg-dark-12 border ${errors.postalCode ? 'bo text-brown-60' : 'border-gray-40'} rounded-lg px-4 py-3 text-[#f5f5f5] focus:outline-none focus:ring-2 focus:ring-brown-65`}
                  />
                  {errors.postalCode && <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>}
                </div>
              </div>

              {/* Payment Method */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Способ оплаты</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === 'card'}
                      onChange={handleInputChange}
                      className="text-red-600 focus:ring-red-600 mr-3"
                    />
                    <span>Банковская карта</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      checked={formData.paymentMethod === 'cash'}
                      onChange={handleInputChange}
                      className="text-red-600 focus:ring-red-600 mr-3"
                    />
                    <span>Наличные при получении</span>
                  </label>
                </div>
              </div>

              {/* Notes */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Комментарий к заказу</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows="3"
                  className={`w-full bg-dark-12 border border-gray-40 rounded-lg px-4 py-3 text-[#f5f5f5] focus:outline-none focus:ring-2 focus:ring-brown-65`}
                  placeholder="Дополнительная информация о заказе..."
                ></textarea>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-dark-10 p-6 rounded-2xl shadow-xl sticky top-32">
              <h3 className="text-2xl font-bold mb-6">Ваш заказ</h3>

              <div className="space-y-4 mb-6">
                {cartItems.map(item => {


                  return (
                    <div
                      key={item._id}
                      className="flex items-center space-x-4"
                    >
                      <img
                        src={`${import.meta.env.VITE_API_BASE_URL}${item.images[0]}` || `/api/placeholder/60/60`}
                        alt={item.title}
                        className="w-15 h-15 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{item.title}</h4>
                        <p className="text-sm text-gray-400">Количество: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{formatCurrency((item.price * item.quantity).toFixed(2))}</p>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="border-t border-dark-20 pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Подитог:</span>
                  <span>{formatCurrency(getCartTotal().toFixed(2))}</span>
                </div>
                <div className="flex justify-between">
                  <span>Налог (12%):</span>
                  <span>{formatCurrency(calculateTax().toFixed(2))}</span>
                </div>
                <div className="flex justify-between">
                  <span>Доставка:</span>
                  <span>{calculateShipping() === 0 ? 'Бесплатно' : `${formatCurrency(calculateShipping().toFixed(2))}`}</span>
                </div>
                <div className="border-t border-dark-20 pt-2 flex justify-between text-xl font-bold">
                  <span>Итого:</span>
                  <span className="tebg-brown-60">{formatCurrency(calculateFinalTotal().toFixed(2))}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={orderLoading}
                onClick={handleSubmit}
                className="w-full bg-brown-60 hover:bg-brown-65 text-white py-4 rounded-lg font-bold text-lg transition-colors mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {orderLoading ? 'Оформление...' : 'Оформить заказ'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;