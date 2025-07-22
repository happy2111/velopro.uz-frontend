import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from "./Button.jsx";
import { useLocation } from "react-router-dom";
import {ShoppingCart, Menu, User, Sidebar} from "lucide-react"
import SideBar from "./SideBar.jsx";

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
          <SideBar
            isAuthenticated={isAuthenticated}
            sidebarOpen={isMenuOpen}
            setSidebarOpen={setIsMenuOpen}
            sidebarItems={[
              {
                text: "Home",
                href: "/",
              },
              {
                text: "Products",
                href: "/products",
              },
              {
                text: "",
                href: "#",
                className: "my-5   border-dashed !border-0 !border-b-2 border-dark-25 pointer-cursor !bg-transparent !h-1 !w-full"
              },

            ]}
          />

        </div>
      </div>
    </nav>
  );
};

export default Navbar;