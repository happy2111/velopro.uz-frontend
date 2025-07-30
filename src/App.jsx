import React, {useEffect} from 'react';
import {Routes, Route, Link, Navigate} from 'react-router-dom';
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
import ScrollTop from "./components/ScrollTop.jsx";
import NavLayout from "./Layouts/NavLayout.jsx";
import AdminLayout from "./Layouts/AdminLayout.jsx";
import AdminProducts from "./pages/AdminPanel/pages/AdminProducts.jsx";
import AdminUsers from "./pages/AdminPanel/pages/AdminUsers.jsx";
import AdminOrders from "./pages/AdminPanel/pages/AdminOrders.jsx";
import {Toaster} from "react-hot-toast";

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <Toaster position="top-center" reverseOrder={false}/>
          <div className="flex flex-col min-h-screen bg-[#0d0d0d]">
            <ScrollTop />
            <main className="flex-1">
              <Routes>
                <Route path={"/"} element={<NavLayout/>}>
                  <Route path="" element={<Home />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />

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
                    element={
                      <ProtectedRoute>
                        <Checkout />
                      </ProtectedRoute>
                    }
                  />


                  <Route path="*" element={<NotFound />} />
                </Route>

                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute requireAuth={true} requireRole="admin">
                      <AdminLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route path="" element={<Navigate to="products" replace />} />
                  <Route path={"profile"} element={<Profile/>}/>
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="users" element={<AdminUsers/>} />
                  <Route path="orders" element={<AdminOrders/>} />
                  <Route path="*" element={<NotFound />} />
                </Route>

              </Routes>
            </main>
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
            className="mx-auto h-32 w-32 text-brown-60 mb-4"
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

        <h1 className="text-6xl font-bold text-brown-60 mb-4">404</h1>
        <h2 className="text-3xl font-bold mb-4">Страница не найдена</h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          Страница, которую вы ищете, не существует или была перемещена.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="bg-brown-60 hover:bg-brown-65 text-white px-8 py-3 rounded-lg transition-colors inline-block"
          >
            На главную
          </Link>
          <Link
            to="/products"
            className="bg-dark-10 hover:bg-dark-20 text-[#f5f5f5] px-8 py-3 rounded-lg transition-colors inline-block"
          >
            К товарам
          </Link>
        </div>
      </div>
    </div>
  );
};

export default App;