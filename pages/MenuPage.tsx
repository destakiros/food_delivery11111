
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';
import { useMenu } from '../context/MenuContext';
import { FoodItem, Order } from '../types';
import CustomerDashboard from '../components/CustomerDashboard';

interface MenuPageProps {
  onNavToLogin: () => void;
  onViewTray?: () => void;
  onTrackOrder?: (order: Order) => void;
  initialHistory?: boolean;
}

export const MenuPage: React.FC<MenuPageProps> = ({ onNavToLogin, onTrackOrder, initialHistory = false }) => {
  const { currentUser } = useAuth();
  const { foodItems } = useMenu();
  const { addToCart, cartTotal, clearCart, cart } = useCart();
  const { orders, placeOrder } = useOrders();

  const handleAddToCartAttempt = (item: FoodItem, size: string, price: number, exclusions: string[]) => {
    if (!currentUser) {
      alert("🛑 Identity Required: Please sign-in to access the kitchen manifest.");
      onNavToLogin();
      return;
    }
    addToCart(item, size, price, exclusions);
  };

  const handleCheckout = () => {
    if (!currentUser) return;
    if (cartTotal < 5) {
      alert("🛑 Minimal Surcharge: Total tray value must exceed $5.00.");
      return;
    }
    // Fixed: Added missing address and instructions arguments to satisfy placeOrder signature in OrderContext (expected 5, got 3)
    placeOrder(currentUser, cart, cartTotal, '', '');
    clearCart();
  };

  const userOrders = currentUser ? orders.filter(o => o.userId === currentUser.id) : [];

  return (
    <div className="min-h-screen bg-[#fcfcfc] dark:bg-zinc-950">
      {currentUser ? (
        <CustomerDashboard 
          user={currentUser}
          menu={foodItems}
          cart={cart}
          orders={userOrders}
          onAddToCart={handleAddToCartAttempt}
          onPlaceOrder={handleCheckout}
          onTrackOrder={(order) => onTrackOrder?.(order)}
        />
      ) : (
        <div className="py-40 text-center animate-fade-in">
           <h2 className="text-4xl font-black text-gray-900 dark:text-white uppercase italic mb-8">Unauthorized Terminal Access</h2>
           <button 
             onClick={onNavToLogin}
             className="bg-ino-red text-white px-12 py-5 rounded-3xl font-black uppercase text-[10px] tracking-widest shadow-2xl"
           >
             Initialize Security Link
           </button>
        </div>
      )}
    </div>
  );
};
