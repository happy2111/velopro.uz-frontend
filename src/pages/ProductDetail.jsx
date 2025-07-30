import React, {useState, useEffect} from 'react';
import {Link, useParams} from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import ProductDetailSwiper from "../components/ProductDetailSwiper.jsx";
import {useCart} from '../context/CartContext';
import ShareButton from "../components/ShareButton.jsx";
import Button from "../components/Button.jsx";
import {ArrowLeftFromLineIcon} from "lucide-react";
import toast from "react-hot-toast";

const ProductDetail = () => {
  const {id} = useParams();
  const {addToCart} = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [isAdded, setIsAdded] = useState(false)

  useEffect(() => {
    fetchProduct();
  }, [id]);



  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/api/products/${id}`);
      setProduct(response.data);
      console.log(response.data);
    } catch (err) {
      setError('Товар не найден');
      console.error('Product fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {

    const success = await addToCart(product, quantity);


    if (success) {
      toast.success('Товар добавлен в корзину', {
        style: {
          borderRadius: '8px',
          background: 'var(--color-dark-12)',
          color: 'var(--color-gray-95)',
        },
      });
      setIsAdded(true)
    } else {
      alert('Ошибка при добавлении в корзину', 'error');
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] text-[#f5f5f5] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brown-60 mx-auto mb-4"></div>
          <p className="text-xl">Загрузка товара...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] text-[#f5f5f5] flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-brown-60 mb-4">{error}</p>
          <button
            onClick={() => window.history.back()}
            className="bg-brown-60 hover:bg-brown-65 px-6 py-3 rounded-2xl transition-colors"
          >
            Вернуться назад
          </button>
        </div>
      </div>
    );
  }


  const currectUrl = window.location.href

  return (
    <div className="min-h-[calc(100vh-123px)] relative bgdark-06 text-[#f5f5f5]">
      <div className="container mx-auto px-4 py-8 ">
        <div className={'flex justify-between mb-5'}>
          <Button
            text={"Back"}
            CustomIcon={ArrowLeftFromLineIcon}
            className={"gap-2"}
            onClick={() => window.history.back()}
          />
          <ShareButton
            title={product.title}
            text={product.description}
            url={currectUrl}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="bg-dark-12 max-h-[calc(100vh-200px)] rounded-2xl shadow-xl productDetailSwiper overflow-hidden">
            {product.images.length > 0 ? (
              <ProductDetailSwiper images={product.images} />
            ) : (
              <div className="w-full h-96 lg:h-full flex items-center justify-center bg-gray-800">
                <svg
                  className="w-24 h-24 text-gray-600"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2L3 7l9 5 9-5-9-5zM3 17l9 5 9-5M3 12l9 5 9-5" />
                </svg>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-4">{product.title}</h1>
              <h2 className="text-2xl font-semibold text-gray-300 mb-2">
                <span className={"opacity-55 text-base"}>Brand:</span>{" "}
                <span className={"text-brown-60"}>{product.brand}</span></h2>
              <p className="my-2">
                <span className={"opacity-55 text-base font-semibold text-gray-300"}>Type:</span>{"  "}
                <span className="text-sm text-dark-12 bg-brown-70 px-2 py-1 text-[12px] font-semibold rounded-xl">{product.type}</span>
              </p>
              <p className="text-gray-400 text-lg leading-relaxed">{product.description}</p>
            </div>

            {/* Ratings */}
            <div className="flex items-center space-x-2">
              <span className="text-yellow-400 text-lg font-semibold">
                {product.averageRating ? product.averageRating.toFixed(1) : 'Нет оценок'}
              </span>
              <svg
                className="w-5 h-5 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 15l-5.878 3.09 1.122-6.535L1 7.91l6.556-.955L10 1l2.444 5.955L19 7.91l-4.244 3.645 1.122 6.535L10 15z" />
              </svg>
              <span className="text-gray-400 text-sm">
                {product.reviews && product.reviews.length > 0 ? `(${product.reviews.length} отзывов)` : '(Нет отзывов)'}
              </span>
            </div>

            {/* Price */}
            <div className="border-t-2 border-dark-12 border-dashed pt-6">
              <span className="text-4xl font-bold text-brown-60">
                {product.price ? `${product.price.toLocaleString()} сум` : 'Цена не указана'}
              </span>
            </div>

            {/* Specifications */}
            <div className="border-t-2 border-dark-12 border-dashed pt-6 space-y-4">
              <div className="flex items-center space-x-4">
                <span className="text-lg font-medium">Размер рамы:</span>
                <span className="text-gray-400">{product.frameSize || 'Не указано'}</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-lg font-medium">Размер колес:</span>
                <span className="text-gray-400">{product.wheelSize || 'Не указано'}</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-lg font-medium">Вес:</span>
                <span className="text-gray-400">{product.weight ? `${product.weight} кг` : 'Не указано'}</span>
              </div>
            </div>
            {/* Stock */}
            <div className="border-t-2  border-dark-12 border-dashed pt-6">
              <div className="flex items-center space-x-4">
                <span className="text-lg font-medium">Наличие:</span>
                <span className={`text-lg font-semibold ${product.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {product.stock > 0 ? 'В наличии' : 'Нет в наличии'}
                </span>
              </div>
              <p className="text-gray-400 text-sm mt-2">
                {product.stock > 0 ? `Осталось ${product.stock} шт.` : 'Ожидается поступление'}
              </p>
            </div>

            {/* Add to Cart */}
            <div className="border-t-2 border-dark-12 border-dashed pt-6 space-y-4">
              <div className="flex items-center space-x-4">
                <label
                  htmlFor="quantity"
                  className="text-lg font-medium"
                >Количество:
                </label>
                <select
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="px-4 py-2 rounded-xl bg-dark-12 text-[#f5f5f5] border border-gray-700 focus:border-brown-60 focus:outline-none"
                >
                  {[1, 2, 3, 4, 5].map(num => (
                    <option
                      key={num}
                      value={num}
                    >{num}</option>
                  ))}
                </select>
              </div>

            </div>
            <div className="max-sm:sticky bottom-0 p-3 bg-dark-06 rounded-t-2xl flex space-x-4">
              <button
                onClick={handleAddToCart}
                disabled={addingToCart}
                className={`active:scale-95  ${isAdded ? "bg-dark-15" : "bg-brown-60 hover:bg-brown-70 flex-1"}  disabled:opacity-50 disabled:cursor-not-allowed px-8 py-4 rounded-2xl text-lg font-bold transition-colors`}
              >
                {addingToCart ? 'Добавление...' : !isAdded ? "Добавить" : "+1"}
              </button>
              {isAdded ?

                (
                  <Link
                    to={"/cart"}
                    className="flex-1 flex flex-col items-center justify-center bg-brown-60 hover:bg-dark-15 border border-brown-60 duration-150 px-8 py-4 rounded-2xl text-lg font-bold transition-colors"
                  >
                    В Карзине
                    <span className={"opacity-75 text-base block"}>Перейти</span>
                  </Link>
                ): (<button
                  onClick={() => window.location.href = '/checkout'}
                  className="flex-1 bg-dark-12 hover:bg-gray-700 border border-brown-60 duration-150 px-8 py-4 rounded-2xl text-lg font-bold transition-colors"
                >
                  Купить сейчас
                </button>)}




            </div>


            {/* Additional Info */}
            <div className="border-t-2 border-dark-12 border-dashed pt-6 space-y-3 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
                <span>Бесплатная доставка по Ташкенту</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg
                  className="w-5 h-5 text-yellow-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
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