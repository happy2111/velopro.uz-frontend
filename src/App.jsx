import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Checkout from './pages/Checkout';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <div className="flex flex-col min-h-screen bg-[#0d0d0d]">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />

                {/* Auth routes - redirect to home if already logged in */}
                <Route
                  path="/login"
                  element={
                    <ProtectedRoute requireAuth={false}>
                      <Login />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/register"
                  element={
                    <ProtectedRoute requireAuth={false}>
                      <Register />
                    </ProtectedRoute>
                  }
                />

                {/* Protected routes - require authentication */}
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/checkout"
                  element={<Checkout />}
                />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#0d0d0d] text-[#f5f5f5] flex items-center justify-center">
      <div className="text-center">
        <div className="mb-8">
          <svg
            className="mx-auto h-32 w-32 text-red-600 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.137 0-4.146-.832-5.657-2.343m0-3.314a7.962 7.962 0 015.657-2.343c2.137 0 4.146.832 5.657 2.343M6 20.291A9.955 9.955 0 0112 18a9.955 9.955 0 016 2.291"
            />
          </svg>
        </div>

        <h1 className="text-6xl font-bold text-red-600 mb-4">404</h1>
        <h2 className="text-3xl font-bold mb-4">Страница не найдена</h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          Страница, которую вы ищете, не существует или была перемещена.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/"
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg transition-colors inline-block"
          >
            На главную
          </a>
          <a
            href="/products"
            className="bg-gray-800 hover:bg-gray-700 text-[#f5f5f5] px-8 py-3 rounded-lg transition-colors inline-block"
          >
            К товарам
          </a>
        </div>
      </div>
    </div>
  );
};

export default App;