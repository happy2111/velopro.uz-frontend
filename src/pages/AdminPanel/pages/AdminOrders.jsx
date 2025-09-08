import React, {useEffect, useState} from 'react';
import {Search, RefreshCw, Trash2, Plus, Loader2, Edit} from 'lucide-react';
import Button from "../../../components/Button.jsx";
import axiosInstance from "../../../utils/axiosInstance.js";


const AdminOrders = React.memo(({}) => {


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
      if (typeFilter) params.type = typeFilter;

      const response = await axiosInstance.get("/api/orders", {params});
      setFilteredProducts(response.data);
      console.log("Fetched products:", response.data);
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
  }, [searchQuery, typeFilter]);

  return (
    <div className="bg-dark-10 rounded-lg overflow-hidden shadow-sm max-md:w-[calc(100vw-50px)] box-border">
      <div className="p-6 box-border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
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
            {/*<select*/}
            {/*  value={typeFilter}*/}
            {/*  onChange={(e) => setTypeFilter(e.target.value)}*/}
            {/*  className="px-3 py-2 h-[49px] text-gray-95 bg-dark-15  rounded-lg focus:ring-2 focus:ring-brown-60 focus:border-transparent w-full md:w-auto"*/}
            {/*>*/}
            {/*  <option*/}
            {/*    className={"capitalize"}*/}
            {/*    value=""*/}
            {/*  >Barchasi*/}
            {/*  </option>*/}
            {/*  <option*/}
            {/*    className={"capitalize"}*/}
            {/*    value="горный"*/}
            {/*  >горный*/}
            {/*  </option>*/}
            {/*  <option*/}
            {/*    className={"capitalize"}*/}
            {/*    value="шоссейный"*/}
            {/*  >шоссейный*/}
            {/*  </option>*/}
            {/*  <option*/}
            {/*    className={"capitalize"}*/}
            {/*    value="городской"*/}
            {/*  >городской*/}
            {/*  </option>*/}
            {/*  <option*/}
            {/*    className={"capitalize"}*/}
            {/*    value="городской"*/}
            {/*  >городской*/}
            {/*  </option>*/}
            {/*  <option*/}
            {/*    className={"capitalize"}*/}
            {/*    value="детский"*/}
            {/*  >детский*/}
            {/*  </option>*/}
            {/*</select>*/}
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
                              <div className="text-sm font-medium text-gray-95">{user.shippingAddress.firstName}
                                <br /> {user.shippingAddress.lastName}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-95">{
                                user.products.map(product => (
                                  <div key={product._id} className="mb-1">
                                    {product?.product?.title} (x{product?.quantity})
                                  </div>
                                ))
                              }
                              </div>
                            </div>
                          </div>
                        </td>
                        {/*status: "pending"*/}
                        {/*total: 62715.52*/}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-95">{user.total} so'm</div>
                        </td>






                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-95">{`
                                ${user.shippingAddress.address},
                                ${user.shippingAddress.city},
                               ${user.shippingAddress.postalCode}`}
                              </div>
                            </div>
                          </div>
                        </td>
                        {/*products: Array [ {…} ]*/}
                        {/*​​​*/}
                        {/*0: Object { product: {…}, quantity: 4, _id: "688244b95eec4c87e3852f31" }*/}
                        {/*​​​​*/}
                        {/*_id: "688244b95eec4c87e3852f31"*/}
                        {/*​​​​*/}
                        {/*product: Object { _id: "688108f23de43c22cedb6b47", title: "Scott Foil RC", brand: "Scott", … }*/}
                        {/*​​​​​*/}
                        {/*__v: 0*/}
                        {/*​​​​​*/}
                        {/*_id: "688108f23de43c22cedb6b47"*/}
                        {/*​​​​​*/}
                        {/*averageRating: 0*/}
                        {/*​​​​​*/}
                        {/*brand: "Scott"*/}
                        {/*​​​​​*/}
                        {/*createdAt: "2025-07-23T16:08:18.817Z"*/}
                        {/*​​​​​*/}
                        {/*description: "    FOIL Disc HMX Carbon Frame\r\n    FOIL Disc HMX Fork\r\n    Shimano Dura-Ace Di2 24 Speed\r\n    Syncros Capital 1.0 S Aero 60\r\n    Schwalbe PRO ONE Aero TL-Tires"*/}
                        {/*​​​​​*/}
                        {/*frameSize: "M,L,XL,XXL"*/}
                        {/*​​​​​*/}
                        {/*images: Array [ "/uploads/images-1753286898794-532157196.png", "/uploads/images-1753286898808-506012235.jpg" ]*/}
                        {/*​​​​​*/}
                        {/*isFeatured: false*/}
                        {/*​​​​​*/}
                        {/*price: 13999*/}
                        {/*​​​​​*/}
                        {/*reviews: Array []*/}
                        {/*​​​​​*/}
                        {/*stock: 4*/}
                        {/*​​​​​*/}
                        {/*title: "Scott Foil RC"*/}
                        {/*​​​​​*/}
                        {/*type: "шоссейный"*/}
                        {/*​​​​​*/}
                        {/*updatedAt: "2025-07-23T16:08:18.817Z"*/}
                        {/*​​​​​*/}
                        {/*wheelSize: "26', 27.5'"*/}
                        {/*​​​​​*/}
                        {/*<prototype>: Object { … }*/}
                        {/*  ​​​​*/}
                        {/*  quantity: 4*/}

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
    </div>
  );
});

export default AdminOrders;
