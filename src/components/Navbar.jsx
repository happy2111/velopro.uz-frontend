import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from "./Button.jsx";
import { useLocation } from "react-router-dom";
import {ShoppingCart, Menu, User} from "lucide-react"

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [cartCount, setCartCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Получаем количество товаров в корзине
  useEffect(() => {
    const updateCartCount = () => {
      if (isAuthenticated) {
        // TODO: Получать количество с backend
        setCartCount(0);
      } else {
        const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
        const count = localCart.reduce((total, item) => total + item.quantity, 0);
        setCartCount(count);
      }
    };

    updateCartCount();

    // Слушаем изменения в localStorage
    window.addEventListener('storage', updateCartCount);
    window.addEventListener('cartUpdated', updateCartCount);

    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, [isAuthenticated]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };
  const location = useLocation();

  return (

    <nav className="bg-dark-06 h-[123px] flex items-center sticky top-0 z-50 border-b-2 border-dark-15  border-dashed ">
      <div className="container h-[90px] flex items-center overflow-hidden rounded-3xl ">
        <div className="flex items-center border-x-2 border-dark-15  border-dashed w-full justify-between h-full p-4">
          <div className={"flex gap-2 max-md:hidden"}>
            <Button
              text={"Home"}
              href={"/"}
              isTransparent={location.pathname === "/" ? false : true}
              border={location.pathname === "/" ? false : true}
            />
            <Button
              text={"Products"}
              href={"/products"}
              isTransparent={location.pathname === "/products" ? false : true}
              border={location.pathname === "/products" ? false : true}
            />
          </div>
          <div className="md:hidden flex items-center space-x-4">
            <Button
              text={""}
              isTransparent={false}
              CustomIcon={Menu}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            />
          </div>

          <Link to="/" className="md:absolute left-1/2 md:-translate-x-1/2 space-x-2">
            <span className="text-2xl font-bold font-roboto text-white ">VeloPro</span>
          </Link>

          <div className={"flex gap-2 max-md:hidden"}>
            <Button
              text={""}
              isTransparent={false}
              href={"/cart"}
              CustomIcon={ShoppingCart}
            />
            {isAuthenticated ? (
              <Button
                isTransparent={false}
                href={"/profile"}
                CustomIcon={User}
              />
            ) : (
              <>
                <Button
                  text={"Sign Up"}
                  isTransparent={false}
                  href={"/register"}
                />
                <Button
                  text={"Log In"}
                  isTransparent={false}
                  href={"/login"}
                  className={"!bg-brown-60"}
                />
              </>
            )}

          </div>

          {/* Mobile меню */}
          <div className="md:hidden flex items-center space-x-4">
            <Button
              isTransparent={false}
              href={"/cart"}
              CustomIcon={ShoppingCart}
            />
            {isAuthenticated && (
              <div className="relative">
                <Button
                    isTransparent={false}
                    href={"/profile"}
                    CustomIcon={User}
                />

              </div>
            )}
          </div>



          {/* Mobile меню открывается при клике на иконку Menu */}
          {isMenuOpen && (
            <div className={`absolute h-screen top-[123px] duration-150 transition-all left-0 w-full bg-dark-06 rounded-2xl shadow-lg p-4 z-50`}>
              <div className="flex flex-col space-y-2">
                <Link
                  to="/"
                  className="text-[#f5f5f5] hover:text-red-400 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Главная
                </Link>
                <Link
                  to="/products"
                  className="text-[#f5f5f5] hover:text-red-400 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Каталог
                </Link>
                {isAuthenticated ? (
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="text-[#f5f5f5] hover:text-red-400 transition-colors w-full text-left"
                  >
                    Выйти
                  </button>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="text-[#f5f5f5] hover:text-red-400 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Войти
                    </Link>
                    <Link
                      to="/register"
                      className="btn-primary text-sm py-2 px-4 w-full text-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Регистрация
                    </Link>
                  </>
                )}

            </div>
          </div>
          )}

          {/*/!* Desktop меню *!/*/}
          {/*<div className="hidden md:flex items-center space-x-8">*/}
          {/*  <Link to="/" className="text-[#f5f5f5] hover:text-red-400 transition-colors">*/}
          {/*    Главная*/}
          {/*  </Link>*/}
          {/*  <Link to="/products" className="text-[#f5f5f5] hover:text-red-400 transition-colors">*/}
          {/*    Каталог*/}
          {/*  </Link>*/}
          {/*</div>*/}

          {/*/!* Правая часть *!/*/}
          {/*<div className="flex items-center space-x-4">*/}
          {/*  /!* Корзина *!/*/}
          {/*  <Link*/}
          {/*    to="/cart"*/}
          {/*    className="relative p-2 text-[#f5f5f5] hover:text-red-400 transition-colors"*/}
          {/*  >*/}
          {/*    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">*/}
          {/*      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"*/}
          {/*            d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m4.5-5a2 2 0 11-4 0 2 2 0 014 0zm8 0a2 2 0 11-4 0 2 2 0 014 0z" />*/}
          {/*    </svg>*/}
          {/*    {cartCount > 0 && (*/}
          {/*      <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">*/}
          {/*        {cartCount}*/}
          {/*      </span>*/}
          {/*    )}*/}
          {/*  </Link>*/}

          {/*  /!* Авторизация *!/*/}
          {/*  {isAuthenticated ? (*/}
          {/*    <div className="relative">*/}
          {/*      <button*/}
          {/*        onClick={() => setIsMenuOpen(!isMenuOpen)}*/}
          {/*        className="flex items-center space-x-2 text-[#f5f5f5] hover:text-red-400 transition-colors"*/}
          {/*      >*/}
          {/*        <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">*/}
          {/*          <span className="text-sm font-semibold">*/}
          {/*            {user?.username?.charAt(0).toUpperCase()}*/}
          {/*          </span>*/}
          {/*        </div>*/}
          {/*        <span className="hidden sm:block">{user?.username}</span>*/}
          {/*      </button>*/}

          {/*      {isMenuOpen && (*/}
          {/*        <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-2xl shadow-xl border border-gray-700 py-2">*/}
          {/*          <Link*/}
          {/*            to="/profile"*/}
          {/*            className="block px-4 py-2 text-[#f5f5f5] hover:bg-gray-700 transition-colors"*/}
          {/*            onClick={() => setIsMenuOpen(false)}*/}
          {/*          >*/}
          {/*            Профиль*/}
          {/*          </Link>*/}
          {/*          <button*/}
          {/*            onClick={() => {*/}
          {/*              handleLogout();*/}
          {/*              setIsMenuOpen(false);*/}
          {/*            }}*/}
          {/*            className="block w-full text-left px-4 py-2 text-[#f5f5f5] hover:bg-gray-700 transition-colors"*/}
          {/*          >*/}
          {/*            Выйти*/}
          {/*          </button>*/}
          {/*        </div>*/}
          {/*      )}*/}
          {/*    </div>*/}
          {/*  ) : (*/}
          {/*    <div className="flex items-center space-x-3">*/}
          {/*      <Link to="/login" className="text-[#f5f5f5] hover:text-red-400 transition-colors">*/}
          {/*        Войти*/}
          {/*      </Link>*/}
          {/*      <Link to="/register" className="btn-primary text-sm py-2 px-4">*/}
          {/*        Регистрация*/}
          {/*      </Link>*/}
          {/*    </div>*/}
          {/*  )}*/}

          {/*  /!* Mobile menu button *!/*/}
          {/*  <button*/}
          {/*    onClick={() => setIsMenuOpen(!isMenuOpen)}*/}
          {/*    className="md:hidden p-2 text-[#f5f5f5] hover:text-red-400 transition-colors"*/}
          {/*  >*/}
          {/*    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">*/}
          {/*      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />*/}
          {/*    </svg>*/}
          {/*  </button>*/}
          {/*</div>*/}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;