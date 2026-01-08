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
    <div className="bg-white dark:bg-zinc-900 p-8 rounded-[40px] shadow-2xl border dark:border-zinc-800 sticky top-24 animate-fade-in transition-colors">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-black uppercase tracking-tighter italic dark:text-white">Tray Preview</h2>
        {onViewTray && <button onClick={onViewTray} className="text-[9px] font-black text-ino-red uppercase tracking-widest hover:underline decoration-2 underline-offset-4">Full Tray View</button>}
      </div>
      <div className="space-y-4 mb-8">
        {cart.slice(0, 3).map(item => (
          <div key={item.cartItemId} className="flex justify-between text-xs font-bold uppercase italic tracking-tight">
            <span className="text-gray-400 truncate pr-4">{item.quantity}x {item.name}</span>
            <span className="text-gray-900 dark:text-white shrink-0">${(item.selectedPrice * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        {cart.length > 3 && <div className="text-[10px] font-black text-ino-red uppercase tracking-widest">+{cart.length - 3} more items in tray</div>}
      </div>
      <div className="border-t dark:border-zinc-800 pt-6 flex justify-between items-center mb-8">
        <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Subtotal Estimate</span>
        <span className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter italic">${(cartTotal + 2.99).toFixed(2)}</span>
      </div>
      <button onClick={onPlaceOrder} className="w-full bg-ino-red text-white py-5 rounded-3xl font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl shadow-red-500/20 hover:bg-red-700 transition transform active:scale-95">Checkout Prototype</button>
    </div>
  );
};