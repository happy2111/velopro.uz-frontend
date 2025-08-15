import React, {useEffect, useState} from 'react';
import {Search, RefreshCw, Trash2, Plus, Loader2, Edit, Info} from 'lucide-react';
import Button from "../../../components/Button.jsx";
import axiosInstance from "../../../utils/axiosInstance.js";
import {useAdminData} from "../../../context/AdminDataContext.jsx";
import {Link, useNavigate} from "react-router-dom";


const AdminUsers = (({}) => {
  const {users} = useAdminData()


  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('');


  const LoadingSpinner = () => (
    <div className="flex items-center justify-center p-8">
      <Loader2 className="h-8 w-8 animate-spin text-brown-60" />
    </div>
  );

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const params = {};
      if (searchQuery) params.search = searchQuery;
      if (typeFilter) params.role = typeFilter;
      const response = await axiosInstance.get("/api/users", {params});
      setFilteredProducts(response.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const removeProduct = async (id) => {
    try {
      const response = await axiosInstance.delete(`/api/users/${id}`);
      if (response.status === 200) {
        setFilteredProducts((prevProducts) => prevProducts.filter(product => product._id !== productId));
        fetchProducts()
      } else {
        console.error("Failed to delete product:", response.data);
      }
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Failed to delete product. Please try again.");
    }
  }


  useEffect(() => {
    fetchProducts();
  }, [searchQuery, typeFilter]);
  const navigate = useNavigate()
  return (
    <div className="bg-dark-10 rounded-lg overflow-hidden shadow-sm max-md:w-[calc(100vw-50px)] box-border">
      <div className="p-6 box-border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-xl font-semibold text-white mb-2 md:mb-0">Ro‘yxatdan o‘tgan foydalanuvchilar</h2>
          <div className="flex flex-col md:flex-row flex-wrap gap-2 md:gap-3 w-full md:w-auto">
            <Button
              text={"Qo‘shish"}
              isTransparent={false}
              CustomIcon={Plus}
              onClick={() => setShowAddUserModal(true)}
              className="!bg-dark-15 gap-2"
            />
            <div className="relative w-full md:w-56 ">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Mahsulotlarni qidiring..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 h-[49px] border border-dark-25 text-white rounded-lg focus:ring-2 focus:ring-brown-60 focus:border-transparent w-full"
              />

            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border text-gray-95 bg-dark-15 border-dark-25 rounded-lg focus:ring-2 focus:ring-brown-60 focus:border-transparent w-full md:w-auto"
            >
              <option
                className={"capitalize"}
                value=""
              >Barchasi
              </option>
              <option
                className={"capitalize"}
                value="admin"
              >Admin
              </option>
              <option
                className={"capitalize"}
                value="user"
              >User
              </option>



            </select>
            <Button
              text={"Yangilash"}
              isTransparent={false}
              CustomIcon={RefreshCw}
              onClick={fetchProducts}
              className="!bg-dark-15 gap-2"
            />
          </div>
        </div>
      </div>
      {loading ? (
          <LoadingSpinner />
        ) :

        (
          <>
            {users.length > 0 && (
              <div className="overflow-x-scroll">
                <table className="min-w-full divide-y divide-dark-25">
                  <thead className="bg-dark-15">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-80 uppercase tracking-wider">Username</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-80 uppercase tracking-wider max-md:hidden">Phone</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-80 uppercase tracking-wider max-md:hidden">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-80 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-80 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-dark-10  divide-y divide-dark-25">
                    {users.map((user) => (
                      <tr
                        key={user._id || user.id}
                        className="hover:bg-dark-15"
                        onClick={() => navigate(`/admin/users/${user._id}`)}
                      >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-95">{user.username}</div>
                                <div className="text-sm font-medium md:hidden text-gray-70">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap max-md:hidden">
                            <div className="flex items-center">
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-95">{user.phone}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap max-md:hidden">
                            <div className="flex items-center">
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-95">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-95">{user.role}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <button
                                className="!text-sky-600 !p-5 !border-sky-600 active:scale-105  "
                              >
                                <Info/>
                              </button>
                              {/*<Button*/}
                              {/*  isTransparent={false}*/}
                              {/*  CustomIcon={Trash2}*/}
                              {/*  onClick={() => {*/}
                              {/*    console.log(`Deleting product with ID: ${user._id}`);*/}
                              {/*    if (window.confirm(`Are you sure you want to delete product with ID: ${user._id}?`)) {*/}
                              {/*      removeProduct(user._id);*/}
                              {/*    }*/}
                              {/*  }*/}
                              {/*  }*/}
                              {/*  className="!bg-red-600"*/}
                              {/*/>*/}
                              {/*<Button*/}
                              {/*  isTransparent={false}*/}
                              {/*  CustomIcon={Edit}*/}
                              {/*  onClick={() => {*/}
                              {/*    console.log(`Editing product with ID: ${user._id}`);*/}
                              {/*  }}*/}
                              {/*  className="!bg-yellow-600"*/}
                              {/*/>*/}
                            </div>
                          </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
            }
          </>
        )
      }
    </div>
  );
});

export default AdminUsers;
