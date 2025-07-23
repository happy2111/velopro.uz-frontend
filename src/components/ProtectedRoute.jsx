import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({
                          children,
                          requireAuth = true,
                          requireRole = null, // 'admin', 'user', etc.
                          redirectTo = null
                        }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  // Показываем загрузку пока проверяется авторизация
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] text-[#f5f5f5] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Загрузка...</p>
        </div>
      </div>
    );
  }

  // Если требуется авторизация
  if (requireAuth) {
    // Пользователь не авторизован
    if (!isAuthenticated) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Проверяем роль, если она требуется
    if (requireRole && user?.role !== requireRole) {
      // Если требуется роль админа, но пользователь не админ
      if (requireRole === 'admin') {
        return <Navigate to="/" replace />;
      }

      // Для других ролей можно добавить дополнительную логику
      return <Navigate to={redirectTo || "/"} replace />;
    }
  } else {
    // Роут для неавторизованных (например, login/register)
    if (isAuthenticated) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;