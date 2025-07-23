import React, {useState} from 'react';
import {Outlet, Link, useLocation, useNavigate} from 'react-router-dom';
import {useAuth} from '../context/AuthContext';
import SideBar from "../components/SideBar.jsx";
import Button from "../components/Button.jsx";
import {Menu, ShoppingCart, User} from "lucide-react";

const AdminLayout = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const menuItems = [
    {
      text: "Dashboard",
      href: "/admin/dashboard",
    },
    {
      text: "Products",
      href: "/admin/products",
    },
    {
      text: "Users",
      href: "/admin/users",
    },
    {
      text: "Orders",
      href: "/admin/orders",
    },
    {
      text: "Settings",
      href: "/admin/settings",
    },
    {
      text: "",
      href: "#",
      className: "my-7 border-dashed !border-0 !border-b-2 !border-dark-10 pointer-cursor !bg-transparent !h-1 !w-full"
    },
  ];


  return (
    <div className="flex h-screen bg-[#0d0d0d]">
      {/*Sidebar */}
      <div className={"z-90"}>
        <SideBar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          sidebarItems={menuItems}
          isAdmin={true}
          isAuthenticated={isAuthenticated}
        />
      </div>
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <nav className="bg-dark-06 h-[123px] flex items-center sticky top-0 z-50 border-b-2 border-dark-15  border-dashed ">
          <div className=" min-w-full h-[90px] flex items-center rounded-3xl ">
            <div className="flex items-center border-x-2 border-dark-15  border-dashed w-full justify-between h-full p-4">
              <div className="flex items-center space-x-4">
                <Button
                  text={""}
                  isTransparent={false}
                  CustomIcon={Menu}
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className={"lg:hidden"}
                />
                <Link to={"/admin"} className="text-2xl font-bold text-white">Admin Panel</Link>
              </div>
            </div>
          </div>

        </nav>







        {/* Content area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#0d0d0d] p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;