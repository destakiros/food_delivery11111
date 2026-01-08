
import React from 'react';
import { useCart } from '../context/CartContext';

interface CartSidebarProps {
  onPlaceOrder: () => void;
  onViewTray?: () => void;
}

export const CartSidebar: React.FC<CartSidebarProps> = ({ onPlaceOrder, onViewTray }) => {
  const { cart, cartTotal } = useCart();

  if (cart.length === 0) return null;

  return (
    <div className="bg-white p-6 rounded-3xl shadow-xl border sticky top-24 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-black uppercase tracking-tight italic">Tray Preview</h2>
        {onViewTray && (
          <button onClick={onViewTray} className="text-[9px] font-black text-red-600 uppercase tracking-widest hover:underline">
            Full View
          </button>
        )}
      </div>
      
      <div className="space-y-3 mb-6">
        {cart.slice(0, 4).map(item => {
          const iExclusions = item.excludedIngredients || [];
          const configKey = `${item.id}-${item.selectedSize || 'Standard'}-${[...iExclusions].sort().join(',')}`;
          
          return (
            <div key={configKey} className="flex justify-between text-xs font-bold uppercase">
              <span className="text-gray-400 truncate pr-4">{item.quantity}x {item.name}</span>
              <span className="text-gray-900 shrink-0">${(item.selectedPrice * item.quantity).toFixed(2)}</span>
            </div>
          );
        })}
        {cart.length > 4 && (
          <div className="text-[10px] font-black text-[#D62828] uppercase tracking-widest">
            +{cart.length - 4} more items
          </div>
        )}
      </div>
      
      <div className="border-t border-gray-50 pt-4 flex justify-between items-center">
        <span className="text-xs font-black uppercase text-gray-400">Est. Total</span>
        <span className="text-xl font-black text-gray-900">${(cartTotal + 2.99).toFixed(2)}</span>
      </div>
      
      <button 
        onClick={onPlaceOrder} 
        className="w-full bg-[#D62828] text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest mt-6 hover:bg-red-700 transition shadow-lg shadow-red-100"
      >
        Quick Checkout
      </button>
    </div>
  );
};
