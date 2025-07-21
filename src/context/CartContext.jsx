import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { useAuth } from '../hooks/useAuth';

const CartContext = createContext();

// Cart actions
const CART_ACTIONS = {
  SET_CART: 'SET_CART',
  ADD_ITEM: 'ADD_ITEM',
  UPDATE_ITEM: 'UPDATE_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  CLEAR_CART: 'CLEAR_CART',
  SET_LOADING: 'SET_LOADING'
};

// Cart reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };

    case CART_ACTIONS.SET_CART:
      return { ...state, items: action.payload, loading: false };

    case CART_ACTIONS.ADD_ITEM:
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          )
        };
      } else {
        return { ...state, items: [...state.items, action.payload] };
      }

    case CART_ACTIONS.UPDATE_ITEM:
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };

    case CART_ACTIONS.REMOVE_ITEM:
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      };

    case CART_ACTIONS.CLEAR_CART:
      return { ...state, items: [] };

    default:
      return state;
  }
};

// Initial state
const initialState = {
  items: [],
  loading: false
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { user } = useAuth();

  // Load cart on mount and when user changes
  useEffect(() => {
    loadCart();
  }, [user]);

  // Save to localStorage when cart changes (for non-logged in users)
  useEffect(() => {
    if (!user && state.items.length > 0) {
      localStorage.setItem('cart', JSON.stringify(state.items));
    }
  }, [state.items, user]);

  const loadCart = async () => {
    try {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });

      if (user) {
        // Load from server
        const response = await axiosInstance.get('/api/cart');
        dispatch({ type: CART_ACTIONS.SET_CART, payload: response.data.items || [] });
      } else {
        // Load from localStorage
        const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
        dispatch({ type: CART_ACTIONS.SET_CART, payload: localCart });
      }
    } catch (error) {
      console.error('Error loading cart:', error);
      // Fallback to localStorage
      const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
      dispatch({ type: CART_ACTIONS.SET_CART, payload: localCart });
    }
  };

  const addToCart = async (product, quantity = 1) => {
    try {
      const cartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: quantity
      };

      if (user) {
        // Add to server cart
        await axiosInstance.post('/api/cart', {
          productId: product.id,
          quantity: quantity
        });
      } else {
        // Add to local cart
        const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
        const existingItem = localCart.find(item => item.id === product.id);

        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          localCart.push(cartItem);
        }

        localStorage.setItem('cart', JSON.stringify(localCart));
      }

      dispatch({ type: CART_ACTIONS.ADD_ITEM, payload: cartItem });
      return true;
    } catch (error) {
      console.error('Error adding to cart:', error);
      return false;
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      if (quantity <= 0) {
        return removeFromCart(productId);
      }

      if (user) {
        // Update on server
        await axiosInstance.put(`/api/cart/${productId}`, { quantity });
      } else {
        // Update localStorage
        const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
        const updatedCart = localCart.map(item =>
          item.id === productId ? { ...item, quantity } : item
        );
        localStorage.setItem('cart', JSON.stringify(updatedCart));
      }

      dispatch({
        type: CART_ACTIONS.UPDATE_ITEM,
        payload: { id: productId, quantity }
      });
      return true;
    } catch (error) {
      console.error('Error updating cart:', error);
      return false;
    }
  };

  const removeFromCart = async (productId) => {
    try {
      if (user) {
        // Remove from server
        await axiosInstance.delete(`/api/cart/${productId}`);
      } else {
        // Remove from localStorage
        const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
        const updatedCart = localCart.filter(item => item.id !== productId);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
      }

      dispatch({ type: CART_ACTIONS.REMOVE_ITEM, payload: productId });
      return true;
    } catch (error) {
      console.error('Error removing from cart:', error);
      return false;
    }
  };

  const clearCart = async () => {
    try {
      if (user) {
        // Clear server cart
        await axiosInstance.delete('/api/cart');
      } else {
        // Clear localStorage
        localStorage.removeItem('cart');
      }

      dispatch({ type: CART_ACTIONS.CLEAR_CART });
      return true;
    } catch (error) {
      console.error('Error clearing cart:', error);
      return false;
    }
  };

  const syncCartWithServer = async () => {
    try {
      if (!user) return;

      const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
      if (localCart.length === 0) return;

      // Sync each item with server
      for (const item of localCart) {
        await axiosInstance.post('/api/cart', {
          productId: item.id,
          quantity: item.quantity
        });
      }

      // Clear localStorage after sync
      localStorage.removeItem('cart');

      // Reload cart from server
      loadCart();
    } catch (error) {
      console.error('Error syncing cart:', error);
    }
  };

  const getCartTotal = () => {
    return state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemsCount = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    cart: state.items,
    loading: state.loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    loadCart,
    syncCartWithServer,
    getCartTotal,
    getCartItemsCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};