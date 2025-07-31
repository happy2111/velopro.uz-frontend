// components/RelatedProductsSection.jsx
import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { Link } from "react-router-dom";
import ProductSwiper from "./ProductSwiper";

const RelatedProductsSection = ({ type, excludeId }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    if (type && excludeId) {
      axiosInstance
        .get(`/api/products?type=${type}&excludeId=${excludeId}&limit=4`)
        .then(res => setRelatedProducts(res.data))
        .catch(err => console.error("Ошибка загрузки похожих товаров", err));
    }
  }, [type, excludeId]);

  if (!relatedProducts.length) return null;

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-bold mb-6">Похожие товары</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map(product => (
          <Link
            key={product._id}
            to={`/product/${product._id}`}
            className="bg-dark-12 rounded-2xl overflow-hidden shadow-xl hover:scale-[1.03] transition-all"
          >
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
            <div className="p-4">
              <h3 className="text-lg font-semibold line-clamp-2">{product.title}</h3>
              <p className="text-sm text-gray-400 line-clamp-2">{product.description}</p>
              <div className="flex justify-between items-center mt-4">
                <span className="text-xl font-bold text-brown-60">{product.price.toLocaleString()} so'm</span>
                <span className="text-xs bg-brown-70 px-2 py-1 rounded-xl text-dark-12 font-semibold">
                  {product.type}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default RelatedProductsSection;
