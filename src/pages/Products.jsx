import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import ProductSwiper from "../components/ProductSwiper.jsx";
import {Link} from "react-router-dom";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/products');
      setProducts(response.data);
    } catch (err) {
      setError('Ошибка загрузки товаров');
      console.error('Products fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products
    .filter(product =>
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'price_low':
          return (a.price || 0) - (b.price || 0);
        case 'price_high':
          return (b.price || 0) - (a.price || 0);
        case 'name':
          return (a.name || '').localeCompare(b.name || '');
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] text-[#f5f5f5] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brown-60 mx-auto mb-4"></div>
          <p className="text-xl">Загрузка товаров...</p>
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
            onClick={fetchProducts}
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-6">Каталог велосипедов</h1>

          {/* Search and Sort */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Поиск велосипедов..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-dark-10 text-[#f5f5f5] border border-gray-40 focus:border-brown-60 focus:outline-none"
              />
            </div>
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 rounded-2xl bg-dark-10 text-[#f5f5f5] border border-gray-40 focus:border-brown-60 focus:outline-none"
              >
                <option value="name">По названию</option>
                <option value="price_low">Цена: по возрастанию</option>
                <option value="price_high">Цена: по убыванию</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-gray-400">Товары не найдены</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <Link to={`/product/${product._id}`}  key={product._id} className="bg-dark-12 rounded-2xl shadow-xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300">
                <div className="aspect-square bg-dark-12 productSwiper">
                  {product.images.length > 0 ? (
                    <ProductSwiper
                      images={product.images}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-16 h-16 text-dark-25" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L3 7l9 5 9-5-9-5zM3 17l9 5 9-5M3 12l9 5 9-5"/>
                      </svg>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 line-clamp-2">{product.title}</h3>
                  <span className="text-sm text-dark-12 bg-brown-70 px-2 py-1 text-[12px] font-semibold rounded-xl">{product.type}</span>
                  <p className="text-gray-400 my-2 line-clamp-3">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-brown-60">
                      165837230 so'm
                      {/*{product.price ? `${product.price.toLocaleString()} сум` : 'Цена не указана'}*/}
                    </span>
                    <Link
                      to={`/product/${product._id}`}
                      className="bg-brown-60 hover:bg-brown-70 px-4 py-2 rounded-xl duration-150 transition-colors"
                    >
                      Подробнее
                    </Link>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;