
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Order, OrderStatus, CartItem, User, Review } from '../types';
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';

interface OrderContextType {
  orders: Order[];
  placeOrder: (user: User, items: CartItem[], total: number, address: string, instructions: string) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updateOrderReview: (orderId: string, review: Review) => void;
  deleteOrder: (orderId: string) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();
  const { addNotification } = useAuth();
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('innout_orders');
    return saved ? JSON.parse(saved) : [];
  });
  
  const prevOrdersRef = useRef<Order[]>(orders);

  useEffect(() => {
    localStorage.setItem('innout_orders', JSON.stringify(orders));
    
    const prevOrders = prevOrdersRef.current;
    orders.forEach(order => {
      const prevOrder = prevOrders.find(o => o.id === order.id);
      if (prevOrder && prevOrder.status !== order.status) {
        showToast(`Logistics Update: Order ${order.id} is now ${order.status}`, 'info');
        
        if (order.status === 'Approved') {
          addNotification(order.userId, "Approved");
        } else if (order.status === 'Cancelled') {
          addNotification(order.userId, "order cancelled");
        }
      }
    });
    prevOrdersRef.current = orders;
  }, [orders, showToast, addNotification]);

  const placeOrder = (user: User, items: CartItem[], total: number, address: string, instructions: string) => {
    const newOrder: Order = {
      id: `ORD-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      userId: user.id,
      userName: user.name,
      items: [...items],
      totalPrice: total + 2.99, 
      status: 'Pending',
      timestamp: new Date().toLocaleString(),
      address,
      instructions
    };
    setOrders(prev => [newOrder, ...prev]);
    showToast("Order in process — waiting for admin approval", 'warning');
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const updateOrderReview = (orderId: string, review: Review) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, review } : o));
    showToast("Intelligence received. Thank you.", "success");
  };

  const deleteOrder = (orderId: string) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
  };

  return (
    <OrderContext.Provider value={{ orders, placeOrder, updateOrderStatus, updateOrderReview, deleteOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) throw new Error('useOrders must be used within OrderProvider');
  return context;
};
