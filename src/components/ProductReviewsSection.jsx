import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import Button from "./Button.jsx";
import toast from "react-hot-toast";
import {MessageCircleX} from "lucide-react";


const ProductReviewsSection = ({ productId, currentUser }) => {
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    rating: 5,
    comment: '',
    name: currentUser?.name || ''
  });

  // Editing state
  const [editingReview, setEditingReview] = useState(null);

  // Sorting
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  // Fetch reviews
  const fetchReviews = async (page = 1) => {
    try {
      setLoading(true);
      setError('');

      const response = await axiosInstance.get(
        `/api/products/${productId}/reviews?page=${page}&limit=5&sortBy=${sortBy}&sortOrder=${sortOrder}`
      );

      if (response.data.success) {
        setReviews(response.data.data.reviews);
        setCurrentPage(response.data.data.pagination.currentPage);
        setTotalPages(response.data.data.pagination.totalPages);
        setHasNext(response.data.data.pagination.hasNext);
        setHasPrev(response.data.data.pagination.hasPrev);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка при загрузке отзывов');
    } finally {
      setLoading(false);
    }
  };

  // Fetch review statistics
  const fetchReviewStats = async () => {
    try {
      const response = await axiosInstance.get(`/api/products/${productId}/reviews-stats`);
      if (response.data.success) {
        setReviewStats(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching review stats:', err);
    }
  };

  // Create review
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const response = await axiosInstance.post(`/api/products/${productId}/reviews`, formData);

      if (response.data.success) {
        toast.success('Отзыв успешно добавлен!', {
          style: {
            borderRadius: '8px',
            background: 'var(--color-dark-12)',
            color: 'var(--color-gray-95)',
          },
        });
        // setSuccess('Отзыв успешно добавлен!');
        setFormData({ rating: 5, comment: '', name: currentUser?.name || '' });
        setShowForm(false);
        fetchReviews(1);
        fetchReviewStats();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка при добавлении отзыва');
    } finally {
      setLoading(false);
    }
  };

  // Update review
  const handleUpdateReview = async (reviewId) => {
    try {
      setLoading(true);
      setError('');

      const response = await axiosInstance.put(
        `/api/products/${productId}/reviews/${reviewId}`,
        formData
      );

      if (response.data.success) {
        toast.success('Отзыв успешно обновлен!', {
          style: {
            borderRadius: '8px',
            background: 'var(--color-dark-12)',
            color: 'var(--color-gray-95)',
          },
        });
        // setSuccess('Отзыв успешно обновлен!');
        setShowForm(false);
        setEditingReview(null);
        setFormData({ rating: 5, comment: '', name: currentUser?.name || '' });
        fetchReviews(currentPage);
        fetchReviewStats();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка при обновлении отзыва');
    } finally {
      setLoading(false);
    }
  };

  // Delete review
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот отзыв?')) return;

    try {
      setLoading(true);
      setError('');

      const response = await axiosInstance.delete(`/api/products/${productId}/reviews/${reviewId}`);

      if (response.data.success) {
        toast.success('Отзыв успешно удален!', {
          style: {
            borderRadius: '8px',
            background: 'var(--color-dark-12)',
            color: 'var(--color-gray-95)',
          },
        });
        // setSuccess('Отзыв успешно удален!');
        fetchReviews(currentPage);
        fetchReviewStats();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка при удалении отзыва');
    } finally {
      setLoading(false);
    }
  };

  // Start editing
  const startEditing = (review) => {
    setEditingReview(review._id);
    setFormData({
      rating: review.rating,
      comment: review.comment,
      name: review.name
    });
    setShowForm(true);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingReview(null);
    setFormData({ rating: 5, comment: '', name: currentUser?.name || '' });
    setShowForm(false);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Star rating component
  const StarRating = ({ rating, interactive = false, onChange = null, size = 'md' }) => {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6'
    };

    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? 'button' : undefined}
            disabled={!interactive}
            onClick={() => interactive && onChange && onChange(star)}
            className={`${sizeClasses[size]} ${
              interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'
            }`}
          >
            <svg
              fill={star <= rating ? 'var(--color-brown-60)' : '#e5e7eb'}
              stroke={star <= rating ? 'var(--color-brown-60)' : '#d1d5db'}
              viewBox="0 0 24 24"
              className="transition-colors duration-200"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
          </button>
        ))}
      </div>
    );
  };

  // Rating distribution bar
  const RatingBar = ({ rating, count, total }) => {
    const percentage = total > 0 ? (count / total) * 100 : 0;

    return (
      <div className="flex items-center space-x-3 py-1">
        <span className="text-sm font-medium text-gray-300 w-8">
          {rating}★
        </span>
        <div className="flex-1 bg-dark-20 rounded-full h-2">
          <div
            className="bg-brown-60 h-2 rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="text-sm text-gray-400 w-12 text-right">
          {count}
        </span>
      </div>
    );
  };

  useEffect(() => {
    fetchReviews();
    fetchReviewStats();
  }, [productId, sortBy, sortOrder]);

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess('');
        setError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  return (
    <div className="w-full mx-auto mt-15">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">
          Отзывы покупателей
        </h2>

        {/* Review Statistics */}
        {reviewStats && (
          <div className="bg-dark-10 rounded-lg shadow-sm border-dashed border-2 border-dark-20 p-6 mb-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Overall Rating */}
              <div className="text-center lg:text-left">
                <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-4 lg:space-y-0 lg:space-x-6">
                  <div>
                    <div className="text-4xl lg:text-5xl font-bold text-white">
                      {reviewStats.averageRating.toFixed(1)}
                    </div>
                    <StarRating rating={Math.round(reviewStats.averageRating)} size="lg" />
                    <div className="text-sm text-gray-400 mt-2">
                      {reviewStats.totalReviews} отзыв{reviewStats.totalReviews === 1 ? '' : reviewStats.totalReviews < 5 ? 'а' : 'ов'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Rating Distribution */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Распределение оценок
                </h3>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <RatingBar
                      key={rating}
                      rating={rating}
                      count={reviewStats.ratingDistribution[rating]}
                      total={reviewStats.totalReviews}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          {currentUser && (
            <Button
              text={showForm ? 'Отменить' : 'Написать отзыв'}
              className={"!bg-brown-60"}
              onClick={() => setShowForm(!showForm)}
              disabled={loading}
            />
          )}

          {/* Sort Controls */}
          <div className="flex items-center space-x-4">
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [newSortBy, newSortOrder] = e.target.value.split('-');
                setSortBy(newSortBy);
                setSortOrder(newSortOrder);
              }}
              className="border border-dark-10 rounded-lg px-3 h-[49px] bg-dark-10 text-white focus:outline-none focus:ring-2 focus:ring-brown-60"
            >
              <option value="createdAt-desc">Сначала новые</option>
              <option value="createdAt-asc">Сначала старые</option>
              <option value="rating-desc">Высокая оценка</option>
              <option value="rating-asc">Низкая оценка</option>
            </select>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 dark:bg-green-900/50 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 px-4 py-3 rounded-lg mb-6">
          {success}
        </div>
      )}

      {/* Review Form */}
      {showForm && currentUser && (
        <div className="bg-dark-10 rounded-lg shadow-sm border-2 border-dashed border-dark-20 p-6 mb-8">
          <h3 className="text-lg font-medium text-white mb-4">
            {editingReview ? 'Редактировать отзыв' : 'Написать отзыв'}
          </h3>

          <div className="space-y-4">
            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Оценка
              </label>
              <StarRating
                rating={formData.rating}
                interactive={true}
                onChange={(rating) => setFormData({ ...formData, rating })}
                size="lg"
              />
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Имя
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-lg px-3 py-2 bg-dark-06 border-2 border-dark-20 text-white focus:outline-none focus:ring-2 focus:ring-brown-60"
                placeholder="Ваше имя"
                required
              />
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Комментарий
              </label>
              <textarea
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                rows={4}
                className="w-full rounded-lg px-3 py-2 bg-dark-06 border-2 border-dark-20 text-white focus:outline-none focus:ring-2 focus:ring-brown-60 resize-none"
                placeholder="Поделитесь своими впечатлениями о товаре..."
              />
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <Button
                text={loading ? 'Сохранение...' : (editingReview ? 'Обновить отзыв' : 'Опубликовать отзыв')}
                onClick={editingReview ? () => handleUpdateReview(editingReview) : handleSubmitReview}
                disabled={loading}
                className={"!bg-brown-60"}
              />
              <Button
                text={"Отменить"}
                onClick={cancelEditing}
                className={"!bg-dark-06"}

              />

            </div>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {loading && reviews.length === 0 ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brown-65 mx-auto"></div>
            <p className="text-gray-600 dark:text-gray-400 mt-4">Загрузка отзывов...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">💬</div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Пока нет отзывов
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Станьте первым, кто оставит отзыв о данном товаре
            </p>
          </div>
        ) : (
          reviews.map((review) => {
            console.log(review)
            return(
            <div
              key={review._id}
              className="bg-dark-10   rounded-lg shadow-sm border-2 border-dark-20 border-dashed  p-6"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
                <div className="flex items-start space-x-4 mb-4 lg:mb-0">
                  <div className="w-12 h-12 bg-dark-06 rounded-full flex items-center justify-center">
                    <span className="text-brown-60 font-medium text-lg">
                      {review?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-medium flex flex-col text-white">
                      {review?.name}
                      <span className={"opacity-75 text-[12px]"}>{review?.user?.email}</span>
                    </h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <StarRating rating={review.rating} size="sm" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions for review owner */}
                {currentUser && review.user.email === currentUser.email && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => startEditing(review)}
                      className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                    >
                      Редактировать
                    </button>
                    <button
                      onClick={() => handleDeleteReview(review._id)}
                      className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium"
                    >
                      Удалить
                    </button>
                  </div>
                )}
              </div>

              {review.comment && (
                <p className="text-gray-300 max-w-full break-words whitespace-normal">
                  {review.comment}
                </p>
              )}
            </div>
          )})
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Страница {currentPage} из {totalPages}
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => fetchReviews(currentPage - 1)}
              disabled={!hasPrev || loading}
              className="px-4 py-2 border-2 border-dark-20 bg-dark-10 rounded-lg   text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-75 transition-colors duration-200"
            >
              Назад
            </button>

            <button
              onClick={() => fetchReviews(currentPage + 1)}
              disabled={!hasNext || loading}
              className="px-4 py-2 border-2 border-dark-20 bg-dark-10 rounded-lg   text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-75 transition-colors duration-200"
            >
              Вперед
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductReviewsSection;