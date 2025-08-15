import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import axiosInstance from '../utils/axiosInstance';

const AdminDataContext = createContext();

export const AdminDataProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersRes, productsRes, ordersRes] = await Promise.all([
        axiosInstance.get('/api/users'),
        axiosInstance.get('/api/products'),
        axiosInstance.get('/api/orders'),
      ]);
      setUsers(usersRes.data);
      setProducts(productsRes.data);
      setOrders(ordersRes.data);
    } catch (error) {
      console.error('Ошибка при получении данных:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEntity = async (endpoint, setState, filters = {}) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/api/${endpoint}`, { params: filters });
      setState(response.data);
    } catch (err) {
      console.error(`Ошибка при получении ${endpoint}:`, err);
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (formData) => {
    const res = await axiosInstance.post('/api/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    setProducts(prev => Array.isArray(prev) ? [...prev, newProduct] : [newProduct]);
    // если хочешь обновить локальный стейт
    return res.data;
  };



  useEffect(() => {
    fetchData();
  }, []);

  const memoizedData = useMemo(() => ({
    users,
    products,
    orders,
    loading,
    createProduct,
    refetch: fetchData,
  }), [users, products, orders, loading]);

  return (
    <AdminDataContext.Provider value={memoizedData}>
      {children}
    </AdminDataContext.Provider>
  );
};

export const useAdminData = () => useContext(AdminDataContext);
