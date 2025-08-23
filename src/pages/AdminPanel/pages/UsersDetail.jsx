import {useNavigate, useParams} from "react-router-dom";
import axiosInstance from "../../../utils/axiosInstance.js";
import React, {useEffect, useState} from "react";
import {ArrowLeft, Edit2, X, Star, Phone, Mail, MapPin} from "lucide-react"
import ConfirmModal from "../../../components/ConfirmModal.jsx";
import toast from "react-hot-toast";
import UserDetailSkeleton from "../components/UserDetailSkeleton.jsx";

const UsersDetail = ({refreshData}) => {
  const {id} = useParams()
  const [user, setUser] = useState({})
  const [loading, setLoading] = useState(false)
  const [confirmModal, setConfirmModal] = useState(false);
  const [modalPromise, setModalPromise] = useState(null);
  const navigte = useNavigate()

  // requests
  const getUser = async () => {
    try {
      setLoading(true)
      const res = await axiosInstance(`/api/users/${id}`)
      setUser(res.data.user)
      setOrders(res.data.orders)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => getUser, [id])

  const showConfirm = (text) => {
    return new Promise((resolve) => {
      setConfirmModal({isOpen: true, text});
      setModalPromise(() => resolve);
    });
  };

  const handleDelete = async () => {
    try {
      const confirmed = await showConfirm("Are you sure you want to delete?");
      if (confirmed) {
        await axiosInstance.delete(`/api/users/${id}`);
        toast.success('User deleted successful', {
          style: {
            borderRadius: '8px',
            background: 'var(--color-dark-12)',
            color: 'var(--color-gray-95)',
          },
        });
        navigte('/admin/users')
        setConfirmModal(false)
        console.log("Удаляем...");
      } else {
        console.log("Отменено");
      }
    } catch (err) {
      console.log(err)
    } finally {

    }

  };

  const [orders, setOrders] = useState([]);

  const [customerNotes, setCustomerNotes] = useState('');
  const [tags, setTags] = useState(['Vip Customer', 'Europe']);
  const [newTag, setNewTag] = useState('');
  const [rating] = useState(5);

  // Calculate customer stats
  const totalOrders = orders.length;
  const completedOrders = orders.filter(order => order.status === 'delivered').length;
  const customerSince = new Date(user.createdAt).getFullYear();
  const currentYear = new Date().getFullYear();
  const yearsAsCustomer = currentYear - customerSince;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };


  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'delivered':
        return 'bg-green-500/20 text-green-400';
      case 'processing':
        return 'bg-blue-500/20 text-blue-400';
      case 'shipped':
        return 'bg-purple-500/20 text-purple-400';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getStatusText = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddTag();
    }
  };

  if (loading) {
    return (
     <UserDetailSkeleton />
    );
  }
  return (
    <div className="min-h-screen overflow-hidden rounded-2xl text-white">
      {/* Header */}
      <div className="">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigte(-1)}
                className="bg-dark-10 rounded-2xl px-6 py-3 flex items-center text-dark-35 hover:text-white transition-colors"
              >
                <ArrowLeft
                  size={20}
                  className="mr-2"
                />
                Back
              </button>
            </div>

          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 pt-2">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Customer Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Profile */}
            <div
              style={{backgroundColor: '#1A1A1A'}}
              className="rounded-lg p-6"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div
                    style={{backgroundColor: '#676665'}}
                    className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-semibold"
                  >
                    {(user?.username ?? '').charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">{user?.username}</h2>
                    <p
                      style={{color: '#81807E'}}
                      className="text-sm"
                    >
                      {totalOrders} Orders
                    </p>
                    <p
                      style={{color: '#81807E'}}
                      className="text-sm"
                    >
                      Customer for {yearsAsCustomer} years
                    </p>
                  </div>
                </div>
              </div>

              {/* Customer Notes */}
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">Customer Notes</h3>
                <div
                  style={{backgroundColor: '#1F1F1F'}}
                  className="rounded-lg p-4"
                >
                  <textarea
                    value={customerNotes}
                    onChange={(e) => setCustomerNotes(e.target.value)}
                    placeholder="Add notes about customer"
                    className="w-full bg-transparent text-gray-300 placeholder-gray-500 resize-none outline-none"
                    rows="3"
                  />
                </div>
              </div>

              {/* Customer Orders */}
              <div>
                <h3 className="text-lg font-medium mb-4">Customer Orders</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-4 gap-4 text-sm font-medium text-gray-400 pb-2 border-b border-gray-700">
                    <div>Order</div>
                    <div>Date</div>
                    <div>Order Status</div>
                    <div>Price</div>
                  </div>
                  {orders.length === 0 ? (
                    <p className="text-sm text-gray-400">No orders yet</p>
                  ) : (
                    orders.map((order, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-4 gap-4 text-sm py-3 border-b border-gray-800 last:border-b-0"
                      >
                        <div className="font-medium text-sm">{order._id}</div>
                        <div style={{color: '#81807E'}}>{formatDate(order.createdAt)}</div>
                        <div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                        </div>
                        <div className="font-medium">${order.total.toFixed(2)}</div>
                      </div>
                    ))
                  )}


                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Overview and Actions */}
          <div className="space-y-6">
            {/* Overview */}
            <div
              style={{backgroundColor: '#1A1A1A'}}
              className="rounded-lg p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium">Overview</h3>
                <button
                  style={{color: '#C33636'}}
                  className="text-sm hover:text-opacity-80 transition-colors"
                >
                  Edit
                </button>
              </div>

              <div className="space-y-4">
                {orders.map((product, index) => (
                  <div
                    key={index}
                    className=""
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <MapPin
                        size={16}
                        style={{color: '#81807E'}}
                      />
                      <span
                        style={{color: '#81807E'}}
                        className="text-sm"
                      >Address {index + 1}</span>
                    </div>
                    <p className="text-sm">
                      {product.shippingAddress?.address}
                      {product.shippingAddress?.city}
                      {product.shippingAddress?.postalCode}
                    </p>
                  </div>
                ))}
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <Mail
                      size={16}
                      style={{color: '#81807E'}}
                    />
                    <span
                      style={{color: '#81807E'}}
                      className="text-sm"
                    >Email Address</span>
                  </div>
                  <p className="text-sm">{user?.email}</p>
                </div>

                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <Phone
                      size={16}
                      style={{color: '#81807E'}}
                    />
                    <span
                      style={{color: '#81807E'}}
                      className="text-sm"
                    >Phone</span>
                  </div>
                  <p className="text-sm">{user?.phone}</p>
                </div>
              </div>

              <button
                onClick={handleDelete}
                style={{color: '#C33636'}}
                className="w-full mt-6 py-2 text-sm hover:text-opacity-80 transition-colors"
              >
                Delete Customer
              </button>
            </div>

          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-700">
          <button className="px-6 py-2 text-gray-400 hover:text-white transition-colors">
            Cancel
          </button>
          <button
            style={{backgroundColor: '#C33636'}}
            className="px-6 py-2 rounded-lg text-white hover:bg-opacity-90 transition-colors"
          >
            Save
          </button>
        </div>
      </div>

      <ConfirmModal
        isOpen={!!confirmModal.isOpen}
        text={confirmModal.text}
        onConfirm={() => {
          modalPromise(true);
          setConfirmModal(false);
        }}
        onCancel={() => {
          modalPromise(false);
          setConfirmModal(false);
        }}
      />
    </div>
  );
};

export default UsersDetail;