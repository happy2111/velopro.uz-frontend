import React, { useState } from "react";
import axios from "axios";
import axiosInstance from "../../../utils/axiosInstance.js";
import Button from "../../../components/Button.jsx";
import {useAdminData} from "../../../context/AdminDataContext.jsx";

export default function AddProductModal({ isOpen, onClose, onProductCreated }) {
  const [form, setForm] = useState({
    title: "",
    brand: "",
    description: "",
    type: "",
    category: "",
    price: "",
    stock: "",
    frameSize: "",
    wheelSize: "",
    weight: "",
    isFeatured: false,
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const {createProduct} = useAdminData()


  const bikeTypes = [
    { value: "горный", label: "Горный" },
    { value: "шоссейный", label: "Шоссейный" },
    { value: "городской", label: "Городской" },
    { value: "электро", label: "Электро" },
    { value: "детский", label: "Детский" },
  ];
  const categories = [
    { value: "bike", label: "bike" },
    { value: "part", label: "part" },
    { value: "accessory", label: "accessory" },
  ];

  const handleChange = (e) => {
    const { name, value, type, checked, category } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value
    });
    setError("");
    setSuccess("");
  };

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Создаем FormData для отправки файлов
      const formData = new FormData();

      // Добавляем все поля формы
      Object.keys(form).forEach(key => {
        if (key === 'isFeatured') {
          formData.append(key, form[key]);
        } else if (form[key] !== '') {
          formData.append(key, form[key]);
        }
      });

      // Добавляем изображения
      images.forEach(image => {
        formData.append('images', image);
      });

      const res = await createProduct(formData)

      setSuccess("Продукт успешно создан!");
      setForm({
        title: "",
        brand: "",
        description: "",
        type: "",
        price: "",
        stock: "",
        frameSize: "",
        wheelSize: "",
        weight: "",
        isFeatured: false,
      });
      setImages([]);

      if (onProductCreated) onProductCreated(res.data);

      // Закрываем модал через 1.5 секунды
      setTimeout(() => {
        onClose();
      }, 1500);

    } catch (err) {
      setError(err.response?.data?.message || err.message || "Произошла ошибка");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-dark-12 z-20 rounded-lg shadow-lg p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl text-gray-95 font-bold mb-4">Добавить продукт</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Название */}
          <div>
            <label className="block text-gray-95 text-sm font-bold mb-1">
              Название <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              className="w-full border text-gray-95 bg-dark-20 border-gray-40 px-3 py-2 rounded focus:border-brown-60 outline-none"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          {/* Бренд */}
          <div>
            <label className="block text-gray-95 text-sm font-bold mb-1">Бренд</label>
            <input
              type="text"
              name="brand"
              className="w-full border text-gray-95 bg-dark-20 border-gray-40 px-3 py-2 rounded focus:border-brown-60 outline-none"
              value={form.brand}
              onChange={handleChange}
            />
          </div>

          {/* Тип велосипеда */}
          <div>
            <label className="block text-gray-95 text-sm font-bold mb-1">
              Тип велосипеда <span className="text-red-500">*</span>
            </label>
            <select
              name="type"
              className="w-full border text-gray-95 bg-dark-20 border-gray-40 px-3 py-2 rounded focus:border-brown-60 outline-none"
              value={form.type}
              onChange={handleChange}
              required
            >
              <option value="" hidden>Выберите тип</option>
              {bikeTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-95 text-sm font-bold mb-1">
              Категория <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              className="w-full border text-gray-95 bg-dark-20 border-gray-40 px-3 py-2 rounded focus:border-brown-60 outline-none"
              value={form.category}
              onChange={handleChange}
              required
            >
              <option value="" hidden>Выберите категорию</option>
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Описание */}
          <div>
            <label className="block text-gray-95 text-sm font-bold mb-1">Описание</label>
            <textarea
              name="description"
              rows="3"
              className="w-full border text-gray-95 bg-dark-20 border-gray-40 px-3 py-2 rounded focus:border-brown-60 outline-none resize-vertical"
              value={form.description}
              onChange={handleChange}
            />
          </div>

          {/* Цена и количество в одной строке */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-95 text-sm font-bold mb-1">
                Цена <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                min="0"
                step="0.01"
                className="w-full border text-gray-95 bg-dark-20 border-gray-40 px-3 py-2 rounded focus:border-brown-60 outline-none"
                value={form.price}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-gray-95 text-sm font-bold mb-1">Количество</label>
              <input
                type="number"
                name="stock"
                min="0"
                className="w-full border text-gray-95 bg-dark-20 border-gray-40 px-3 py-2 rounded focus:border-brown-60 outline-none"
                value={form.stock}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Размер рамы и размер колес */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-95 text-sm font-bold mb-1">Размер рамы</label>
              <input
                type="text"
                name="frameSize"
                placeholder="например: M, L, 18'"
                className="w-full border text-gray-95 bg-dark-20 border-gray-40 px-3 py-2 rounded focus:border-brown-60 outline-none"
                value={form.frameSize}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-gray-95 text-sm font-bold mb-1">Размер колес</label>
              <input
                type="text"
                name="wheelSize"
                placeholder="например: 26', 27.5', 29'"
                className="w-full border text-gray-95 bg-dark-20 border-gray-40 px-3 py-2 rounded focus:border-brown-60 outline-none"
                value={form.wheelSize}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Вес */}
          <div>
            <label className="block text-gray-95 text-sm font-bold mb-1">Вес (кг)</label>
            <input
              type="number"
              name="weight"
              min="0"
              step="0.1"
              className="w-full border text-gray-95 bg-dark-20 border-gray-40 px-3 py-2 rounded focus:border-brown-60 outline-none"
              value={form.weight}
              onChange={handleChange}
            />
          </div>

          {/* Изображения */}
          <div>
            <label className="block text-gray-95 text-sm font-bold mb-1">Изображения</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="w-full border text-gray-95 bg-dark-20 border-gray-40 px-3 py-2 rounded focus:border-brown-60 outline-none file:mr-4 file:py-1 file:px-4 file:rounded file:border-0 file:bg-brown-60 file:text-white file:cursor-pointer"
            />
            {images.length > 0 && (
              <p className="text-gray-70 text-sm mt-1">
                Выбрано файлов: {images.length}
              </p>
            )}
          </div>

          {/* Рекомендуемый товар */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="isFeatured"
              id="isFeatured"
              className="mr-2 w-4 h-4 text-brown-60 bg-dark-20 border-gray-40 rounded focus:ring-brown-60"
              checked={form.isFeatured}
              onChange={handleChange}
            />
            <label htmlFor="isFeatured" className="text-gray-95 text-sm">
              Показывать на главной странице
            </label>
          </div>

          {error && <div className="text-red-600 text-sm bg-red-100 p-2 rounded">{error}</div>}
          {success && <div className="text-green-600 text-sm bg-green-100 p-2 rounded">{success}</div>}

          <div className="flex justify-end space-x-2 mt-6 pt-4 border-t border-gray-40">
            <Button
              text="Отмена"
              className="!bg-dark-20 gap-2 hover:!bg-dark-30"
              onClick={onClose}
              type="button"
              disabled={loading}
            />
            <Button
              text={loading ? "Создание..." : "Создать продукт"}
              className="!bg-brown-60 gap-2 hover:!bg-brown-70"
              type="submit"
              disabled={loading}
            />
          </div>
        </form>
      </div>
      <div className="absolute inset-0 z-10 backdrop-blur-sm bg-dark-06/70" onClick={onClose}></div>
    </div>
  );
}