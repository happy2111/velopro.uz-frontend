import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/api/products/${id}`);
      setProduct(response.data);
    } catch (err) {
      setError('Товар не найден');
      console.error('Product fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async () => {
    try {
      setAddingToCart(true);
      await axiosInstance.post('/api/cart', {
        productId: parseInt(id),
        quantity
      });

      // Show success message
      const successDiv = document.createElement('div');
      successDiv.className = 'fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-2xl shadow-xl z-50';
      successDiv.textContent = 'Товар добавлен в корзину!';
      document.body.appendChild(successDiv);

      setTimeout(() => {
        document.body.removeChild(successDiv);
      }, 3000);

    } catch (err) {
      console.error('Add to cart error:', err);
      const errorDiv = document.createElement('div');
      errorDiv.className = 'fixed top-4 right-4 bg-red-600 text-white px-6 py-3 rounded-2xl shadow-xl z-50';
      errorDiv.textContent = 'Ошибка при добавлении в корзину';
      document.body.appendChild(errorDiv);

      setTimeout(() => {
        document.body.removeChild(errorDiv);
      }, 3000);
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] text-[#f5f5f5] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-xl">Загрузка товара...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] text-[#f5f5f5] flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.history.back()}
            className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-2xl transition-colors"
          >
            Вернуться назад
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-[#f5f5f5]">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="bg-gray-900 rounded-2xl shadow-xl overflow-hidden">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-96 lg:h-full object-cover"
              />
            ) : (
              <div className="w-full h-96 lg:h-full flex items-center justify-center bg-gray-800">
                <svg className="w-24 h-24 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L3 7l9 5 9-5-9-5zM3 17l9 5 9-5M3 12l9 5 9-5"/>
                </svg>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
              <p className="text-gray-400 text-lg leading-relaxed">{product.description}</p>
            </div>

            {/* Price */}
            <div className="border-t border-gray-700 pt-6">
              <span className="text-4xl font-bold text-red-600">
                {product.price ? `${product.price.toLocaleString()} сум` : 'Цена не указана'}
              </span>
            </div>

            {/* Specifications */}
            {product.specifications && (
              <div className="border-t border-gray-700 pt-6">
                <h3 className="text-2xl font-bold mb-4">Характеристики</h3>
                <div className="space-y-3">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-gray-800">
                      <span className="text-gray-400 capitalize">{key.replace('_', ' ')}</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add to Cart */}
            <div className="border-t border-gray-700 pt-6 space-y-4">
              <div className="flex items-center space-x-4">
                <label htmlFor="quantity" className="text-lg font-medium">Количество:</label>
                <select
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="px-4 py-2 rounded-xl bg-gray-800 text-[#f5f5f5] border border-gray-700 focus:border-red-600 focus:outline-none"
                >
                  {[1, 2, 3, 4, 5].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={addToCart}
                  disabled={addingToCart}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed px-8 py-4 rounded-2xl text-lg font-bold transition-colors"
                >
                  {addingToCart ? 'Добавление...' : 'Добавить в корзину'}
                </button>

                <button
                  onClick={() => window.location.href = '/checkout'}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 border border-red-600 px-8 py-4 rounded-2xl text-lg font-bold transition-colors"
                >
                  Купить сейчас
                </button>
              </div>
            </div>

            {/* Additional Info */}
            <div className="border-t border-gray-700 pt-6 space-y-3 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>В наличии</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
                <span>Бесплатная доставка по Ташкенту</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Гарантия 1 год</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;