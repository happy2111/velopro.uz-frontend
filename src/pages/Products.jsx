import React, {useState, useEffect} from 'react';
import axiosInstance from '../utils/axiosInstance';
import ProductSwiper from "../components/ProductSwiper.jsx";
import {Link} from "react-router-dom";
import Button from "../components/Button.jsx";
import {Funnel} from "lucide-react"

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [isFilterOpened, setIsFilterOpened] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [priceRange, setPriceRange] = useState({min: 0, max: 1000000});
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const limit = 18; // количество товаров на одной странице


  useEffect(() => {
    fetchProducts(currentPage);
  }, [searchTerm, currentPage, priceRange, selectedTypes, selectedCategory]);


  const fetchProducts = async (page = 1) => {
    try {
      setLoading(true);

      const params = {
        page,
        limit,
        search: searchTerm,
      };

      if (selectedTypes.length > 0) {
        params.type = selectedTypes.join(','); // multiple types support
      }
      if (selectedCategory.length > 0) {
        params.category = selectedCategory.join(',');
      }

      if (priceRange.min !== undefined) params.min = priceRange.min;
      if (priceRange.max !== undefined) params.max = priceRange.max;

      const response = await axiosInstance.get("/api/products", {params});

      setProducts(response.data.products);
      setTotalPages(response.data.totalPages || 1);
    } catch (err) {
      setError('Ошибка загрузки товаров');
      console.error('Products fetch error:', err);
    } finally {
      setLoading(false);
    }
  };


  const filteredProducts = products
    .filter(product => (
      (product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (product.price >= priceRange.min && product.price <= priceRange.max) &&
      (selectedTypes.length === 0 || selectedTypes.includes(product.type)) &&
      (selectedCategory.length === 0 || selectedCategory.includes(product.category))
    ))
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

  if (error) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] text-[#f5f5f5] flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-brown-60 mb-4">{error}</p>
          <button
            onClick={fetchProducts}
            className="bg-brown-65 hover:bg-brown-60 px-6 py-3 rounded-2xl transition-colors"
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
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // сбросить страницу при поиске
                }}
                className="w-full px-4 py-3 rounded-2xl bg-dark-10 text-[#f5f5f5] border border-gray-40 focus:border-brown-60 focus:outline-none"
              />
            </div>
            <div>
              <Button
                text={"Фильтры"}
                CustomIconLeft={Funnel}
                className={"gap-2"}
                onClick={() => setIsFilterOpened(!isFilterOpened)}
              />
            </div>
          </div>



          {isFilterOpened && (
            <div className="mt-4 p-6 bg-dark-12 rounded-2xl">
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Цена</h3>
                <div className="flex gap-4">
                  <input
                    type="number"
                    placeholder="От"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({
                      ...prev,
                      min: Number(e.target.value)
                    }))}
                    className="w-full px-4 py-2 rounded-xl bg-dark-10 border border-gray-40"
                  />
                  <input
                    type="number"
                    placeholder="До"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({
                      ...prev,
                      max: Number(e.target.value)
                    }))}
                    className="w-full px-4 py-2 rounded-xl bg-dark-10 border border-gray-40"
                  />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Категория</h3>
                <div className="flex flex-wrap gap-2">
                  {['bike', 'part', 'accessory' ].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(prev =>
                        prev.includes(cat)
                          ? prev.filter(t => t !== cat)
                          : [...prev, cat]
                      )}
                      className={`px-4 py-2 rounded-xl border ${
                        selectedCategory.includes(cat)
                          ? 'bg-brown-60 border-brown-60'
                          : 'border-gray-40'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Тип велосипеда</h3>
                <div className="flex flex-wrap gap-2">
                  {['горный', 'шоссейный', 'городской', 'электро', 'детский'].map(type => (
                    <button
                      key={type}
                      onClick={() => setSelectedTypes(prev =>
                        prev.includes(type)
                          ? prev.filter(t => t !== type)
                          : [...prev, type]
                      )}
                      className={`px-4 py-2 rounded-xl border ${
                        selectedTypes.includes(type)
                          ? 'bg-brown-60 border-brown-60'
                          : 'border-gray-40'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>


        {loading ? (
            <div className="min-h-screen bg-[#0d0d0d] text-[#f5f5f5] flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brown-60 mx-auto mb-4"></div>
                <p className="text-xl">Загрузка товаров...</p>
              </div>
            </div>
          ) : (
          filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-gray-400">Товары не найдены</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <Link
                to={`/product/${product._id}`}
                key={product._id}
                className="bg-dark-12  rounded-2xl shadow-xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300"
              >
                <div className="aspect-square bg-dark-12 productSwiper">
                  {product.images.length > 0 ? (
                    <ProductSwiper
                      images={product.images}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg
                        className="w-16 h-16 text-dark-25"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2L3 7l9 5 9-5-9-5zM3 17l9 5 9-5M3 12l9 5 9-5" />
                      </svg>
                    </div>
                  )}
                </div>

                <div className="p-6 ">
                  <h3 className="text-xl font-bold mb-2 line-clamp-2">{product.title}</h3>
                  <span className="text-sm text-dark-12 bg-brown-70 px-2 py-1 text-[12px] font-semibold rounded-xl">{product.type}</span>
                  <p className="text-gray-400 my-2 line-clamp-2">{product.description} <br/><br/></p>
                  <div className="flex justify-between flex-col !mt-full">
                    <span className="text-2xl font-bold text-brown-60">
                      {product.price.toLocaleString()} so'm
                    </span>
                    <Link
                      to={`/product/${product._id}`}
                      className="bg-brown-60 hover:bg-brown-70 w-full text-center mt-3 px-4 py-2 rounded-xl duration-150 transition-colors"
                    >
                      Подробнее
                    </Link>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )
        )
        }

        {totalPages > 1 && (
          <div className="p-6 flex justify-center gap-2 flex-wrap">
            {Array.from({length: totalPages}, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  currentPage === page
                    ? 'bg-brown-60 text-white'
                    : 'bg-dark-15 text-gray-400 hover:bg-dark-25'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Products;



