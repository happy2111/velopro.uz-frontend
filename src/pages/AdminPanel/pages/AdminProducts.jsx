import React, {useEffect, useState} from 'react';
import {Search, RefreshCw, Trash2, Plus, Loader2, Edit} from 'lucide-react';
import Button from "../../../components/Button.jsx";
import axiosInstance from "../../../utils/axiosInstance.js";
import AddProductModal from "../components/AddProductModal.jsx";


const AdminProducts = React.memo(({}) => {


  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddProductModal,setShowAddProductModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10; // Кол-во товаров на страницу


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

      const params = {
        page: currentPage,
        limit,
      };
      if (searchQuery) params.search = searchQuery;
      if (typeFilter) params.type = typeFilter;

      const response = await axiosInstance.get("/api/products", { params });
      setFilteredProducts(response.data.products);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };


  const removeProduct = async (productId) => {
    try {
      const response = await axiosInstance.delete(`/api/products/${productId}`);
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
  }, [searchQuery, typeFilter, currentPage]);


  return (
    <div className="bg-dark-10 rounded-lg overflow-hidden shadow-sm max-md:w-[calc(100vw-50px)] box-border">
      <div className="p-6 box-border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-xl font-semibold text-white mb-2 md:mb-0">
            Products
          </h2>
          <div className="flex flex-col md:flex-row flex-wrap gap-2 md:gap-3 w-full md:w-auto">
            <Button
              text={"Qo‘shish"}
              isTransparent={false}
              CustomIcon={Plus}
              onClick={() => setShowAddProductModal(true)}
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
                value="горный"
              >горный
              </option>
              <option
                className={"capitalize"}
                value="шоссейный"
              >шоссейный
              </option>
              <option
                className={"capitalize"}
                value="городской"
              >городской
              </option>
              <option
                className={"capitalize"}
                value="городской"
              >городской
              </option>
              <option
                className={"capitalize"}
                value="детский"
              >детский
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
            {filteredProducts.length > 0 && (
              <div className="overflow-x-scroll">
                <table className="min-w-full divide-y divide-dark-25">
                  <thead className="bg-dark-15">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-80 uppercase tracking-wider">Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-80 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-80 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-80 uppercase tracking-wider">Stock</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-80 uppercase tracking-wider">Description</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-80 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-dark-10  divide-y divide-dark-25">
                    {filteredProducts.map((user) => (
                      <tr
                        key={user._id || user.id}
                        className="hover:bg-dark-15"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-95">{user.title}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-95">{user.type}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-95">{user.price} so'm</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-95">{user.stock}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="ml-4 max-w-40">
                              <div className="text-sm font-medium text-gray-95 truncate text-nowrap ">{user.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <Button
                              isTransparent={false}
                              CustomIcon={Trash2}
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to delete product with ID: ${user._id}?`)) {
                                  removeProduct(user._id);
                                }
                              }
                              }
                              className="!bg-red-600"
                            />
                            <Button
                              isTransparent={false}
                              CustomIcon={Edit}
                              onClick={() => {
                                console.log(`Editing product with ID: ${user._id}`);
                              }}
                              className="!bg-yellow-600"
                            />
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

      {showAddProductModal && (
        <AddProductModal
          isOpen={showAddProductModal}
          onClose={() => setShowAddProductModal(false)}
        />
      )}

      {totalPages > 1 && (
        <div className="p-6 flex justify-center gap-2 flex-wrap">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                currentPage === page
                  ? 'bg-brown-60 text-white'
                  : 'bg-dark-15 text-gray-400 hover:bg-dark-25'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}

    </div>
  );
});

export default AdminProducts;
