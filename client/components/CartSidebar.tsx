
import React from 'react';
import { useCart } from '../context/CartContext';

interface CartSidebarProps {
  onPlaceOrder: () => void;
  onViewTray?: () => void;
}

export const CartSidebar: React.FC<CartSidebarProps> = ({ onPlaceOrder, onViewTray }) => {
  const { cart, cartTotal, updateQuantity } = useCart();

  if (cart.length === 0) return null;

  return (
    <div className="bg-white dark:bg-zinc-900 p-8 rounded-[40px] shadow-2xl border dark:border-zinc-800 sticky top-24 animate-fade-in transition-colors">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-black uppercase tracking-tighter italic dark:text-white leading-none">Tray <span className="text-ino-red">Status</span></h2>
        {onViewTray && (
          <button onClick={onViewTray} className="text-[9px] font-black text-ino-red uppercase tracking-widest hover:underline decoration-2 underline-offset-4">
            Manifest View
          </button>
        )}
      </div>
      
      <div className="space-y-6 mb-8">
        {cart.slice(0, 4).map(item => {
          // Use cartItemId as the key, falling back to a constructed one if not present
          const iExclusions = item.excludedIngredients || [];
          const configKey = item.cartItemId || `${item.id}-${item.selectedSize || 'Standard'}-${[...iExclusions].sort().join(',')}`;
          
          return (
            <div key={configKey} className="group animate-fade-in">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[11px] font-black uppercase italic tracking-tight text-gray-900 dark:text-white truncate pr-4">
                  {item.name}
                </span>
                <span className="text-[11px] font-black text-ino-red italic shrink-0">
                  ETB {(item.selectedPrice * item.quantity).toFixed(2)}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2.5 bg-gray-50 dark:bg-zinc-800/50 p-1 rounded-xl border dark:border-zinc-700/50">
                  <button 
                    onClick={() => updateQuantity(configKey, item.quantity - 1)}
                    className="w-6 h-6 flex items-center justify-center rounded-lg bg-white dark:bg-zinc-700 text-gray-400 hover:text-ino-red hover:shadow-sm transition-all active:scale-90"
                    title="Decrement quantity"
                  >
                    <i className="ph-bold ph-minus text-[10px]"></i>
                  </button>
                  <span className="text-[10px] font-black dark:text-white w-4 text-center">
                    {item.quantity}
                  </span>
                  <button 
                    onClick={() => updateQuantity(configKey, item.quantity + 1)}
                    className="w-6 h-6 flex items-center justify-center rounded-lg bg-white dark:bg-zinc-700 text-gray-400 hover:text-emerald-500 hover:shadow-sm transition-all active:scale-90"
                    title="Increment quantity"
                  >
                    <i className="ph-bold ph-plus text-[10px]"></i>
                  </button>
                </div>
                <div className="text-right">
                  <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest block opacity-60">
                    {item.selectedSize}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
        
        {cart.length > 4 && (
          <div className="pt-4 border-t dark:border-zinc-800 text-center">
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] italic">
              + {cart.length - 4} additional units in tray
            </span>
          </div>
        )}
      </div>
      
      <div className="border-t-2 border-dashed dark:border-zinc-800 pt-6 space-y-3 mb-8">
        <div className="flex justify-between items-center text-[9px] font-black uppercase text-gray-400 tracking-widest">
          <span>Payload Value</span>
          <span className="dark:text-white">ETB {cartTotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center text-[9px] font-black uppercase text-gray-400 tracking-widest">
          <span>Logistic Fee</span>
          <span className="text-emerald-500">ETB 2.99</span>
        </div>
        <div className="flex justify-between items-center pt-2">
          <span className="text-[10px] font-black uppercase text-gray-900 dark:text-white tracking-widest">Est. Gross Total</span>
          <span className="text-2xl font-black text-gray-900 dark:text-white italic tracking-tighter">ETB {(cartTotal + 2.99).toFixed(2)}</span>
        </div>
      </div>
      
      <button 
        onClick={onPlaceOrder} 
        className="w-full bg-ino-red text-white py-5 rounded-[24px] font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl shadow-red-500/20 hover:bg-red-700 transition transform active:scale-95 flex items-center justify-center gap-3"
      >
        Authorize Checkout
        <i className="ph-bold ph-arrow-right"></i>
      </button>
      
      <p className="text-center text-[7px] font-black text-gray-400 uppercase tracking-[0.4em] mt-6 italic opacity-40">
        System Node Alpha • Secure Relay Active
      </p>
    </div>
  );
};
