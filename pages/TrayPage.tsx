
import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ButtonSpinner } from '../components/LoadingSpinner';

interface TrayPageProps {
  onExploreMenu: () => void;
  onNavToLogin: () => void;
  onOrderSuccess?: () => void;
}

export const TrayPage: React.FC<TrayPageProps> = ({ onExploreMenu, onNavToLogin, onOrderSuccess }) => {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const { placeOrder } = useOrders();
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  const [instructions, setInstructions] = useState('');
  const [address, setAddress] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = () => {
    if (!currentUser) {
      showToast("Identity verification required for checkout.", "warning");
      return onNavToLogin();
    }
    if (!cart.length) return;
    if (!address.trim()) {
      showToast("Deployment Destination required for logistics.", "error");
      return;
    }

    setIsProcessing(true);
    
    setTimeout(() => {
      placeOrder(currentUser, cart, cartTotal, address, instructions);
      clearCart();
      setIsProcessing(false);
      showToast("Order Dispatched: Logistics team notified.", "success");
      if (onOrderSuccess) onOrderSuccess();
    }, 2000);
  };

  if (!cart.length) return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 animate-fade-in text-center">
      <div className="w-72 h-72 bg-gray-50 dark:bg-zinc-900 rounded-[60px] flex items-center justify-center mb-12 border-4 border-dashed dark:border-zinc-800 shadow-inner group">
        <span className="text-9xl drop-shadow-2xl grayscale group-hover:grayscale-0 transition-all duration-700 transform group-hover:scale-110">🥡</span>
      </div>
      <h2 className="text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-4 italic">Empty Manifest</h2>
      <p className="text-gray-400 max-w-sm mb-12 text-[10px] font-black uppercase tracking-[0.4em] leading-relaxed">
        The logistics tray contains no active inventory units. Replenishment required.
      </p>
      <button 
        onClick={onExploreMenu} 
        className="bg-ino-red text-white px-16 py-7 rounded-[32px] font-black uppercase tracking-[0.3em] text-[11px] shadow-2xl shadow-red-500/30 hover:bg-red-700 transition-all transform hover:-translate-y-1 active:scale-95"
      >
        Replenish Inventory
      </button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-20 animate-fade-in">
      <div className="flex flex-col lg:flex-row gap-16 items-start">
        <div className="flex-grow space-y-12 w-full">
          <div className="border-b dark:border-zinc-800 pb-12 flex justify-between items-end">
            <div>
               <h1 className="text-6xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic leading-none">Review <span className="text-ino-red">Tray</span></h1>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.6em] mt-5 italic">Logistics Stage 02: Verification</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-black text-ino-red uppercase tracking-[0.4em] block mb-1">Status</span>
              <span className="text-xs font-black text-gray-300 uppercase tracking-widest">Active Manifest</span>
            </div>
          </div>

          <div className="space-y-6">
            {cart.map(item => (
              <div key={item.cartItemId} className="bg-white dark:bg-zinc-900 p-8 rounded-[48px] border dark:border-zinc-800 shadow-sm flex items-center gap-10 group transition-all hover:shadow-2xl hover:border-ino-red/20">
                <div className="w-32 h-32 rounded-[32px] overflow-hidden shadow-2xl border border-white/10 flex-shrink-0 relative">
                  <img src={item.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={item.name} />
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h4 className="text-2xl font-black text-gray-900 dark:text-white uppercase italic tracking-tight mb-2">{item.name}</h4>
                      <div className="flex flex-wrap gap-3">
                         <span className="text-[9px] font-black uppercase text-ino-red bg-red-50 dark:bg-red-900/10 px-4 py-1.5 rounded-xl border border-ino-red/10">{item.selectedSize}</span>
                         {item.excludedIngredients?.map(ing => (
                           <span key={ing} className="text-[9px] font-black uppercase text-gray-400 bg-gray-100 dark:bg-zinc-800 px-3 py-1.5 rounded-xl border dark:border-zinc-700 flex items-center gap-1.5">
                             <i className="ph ph-prohibit"></i> {ing}
                           </span>
                         ))}
                      </div>
                    </div>
                    <span className="font-black text-3xl text-gray-900 dark:text-white italic tracking-tighter">${(item.selectedPrice * item.quantity).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center mt-6">
                    <div className="flex items-center gap-8 bg-gray-50 dark:bg-zinc-800 p-3.5 rounded-2xl border dark:border-zinc-700">
                      <button onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)} className="w-8 h-8 font-black text-gray-400 hover:text-ino-red transition-colors text-xl">-</button>
                      <span className="text-sm font-black dark:text-white w-6 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)} className="w-8 h-8 font-black text-gray-400 hover:text-emerald-500 transition-colors text-xl">+</button>
                    </div>
                    <button onClick={() => removeFromCart(item.cartItemId)} className="text-[10px] font-black text-gray-300 hover:text-ino-red uppercase tracking-[0.4em] transition-all hover:scale-110">Decommission</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button onClick={onExploreMenu} className="flex items-center gap-3 text-[10px] font-black text-gray-400 hover:text-ino-red uppercase tracking-widest transition-all group">
            <i className="ph-bold ph-arrow-left group-hover:-translate-x-2 transition-transform"></i>
            Return to kitchen manifest
          </button>
        </div>

        <div className="lg:w-[480px] w-full shrink-0">
          <div className="bg-white dark:bg-zinc-900 p-12 rounded-[60px] border dark:border-zinc-800 shadow-2xl sticky top-32">
            <div className="flex items-center gap-4 mb-12">
              <div className="w-12 h-12 bg-ino-yellow rounded-2xl flex items-center justify-center text-red-900 text-xl shadow-xl shadow-yellow-500/10">
                <i className="ph-fill ph-receipt"></i>
              </div>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-widest italic leading-none">Manifest <br/> Summary</h3>
            </div>
            
            <div className="mb-8 space-y-4">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.4em] ml-4">Deployment Destination</label>
              <input 
                type="text"
                value={address} 
                onChange={e => setAddress(e.target.value)} 
                placeholder="STREET, BUILDING, OFFICE/APT NO." 
                className="w-full bg-gray-50 dark:bg-zinc-800 border-0 rounded-2xl px-8 py-5 text-xs font-bold uppercase tracking-widest focus:ring-2 focus:ring-ino-red transition-all placeholder:text-gray-300 dark:placeholder:text-gray-600 dark:text-white shadow-inner" 
              />
            </div>

            <div className="mb-12 space-y-4">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.4em] ml-4">Deployment Directives</label>
              <textarea 
                value={instructions} 
                onChange={e => setInstructions(e.target.value)} 
                placeholder="E.G. SEVERE ALLERGIES, DROP-OFF CODES, EXTRA CRISPY PREFERENCES..." 
                className="w-full bg-gray-50 dark:bg-zinc-800 border-0 rounded-[32px] p-8 text-xs font-bold uppercase tracking-widest focus:ring-2 focus:ring-ino-red h-44 resize-none transition-all placeholder:text-gray-300 dark:placeholder:text-gray-600 dark:text-white shadow-inner" 
              />
            </div>

            <div className="space-y-6 mb-12 border-t dark:border-zinc-800 pt-10">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Base Value</span>
                <span className="font-black text-xl dark:text-white tracking-tight italic">${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Logistic Fee</span>
                <span className="font-black text-xl dark:text-white tracking-tight italic text-emerald-500">$2.99</span>
              </div>
              <div className="flex justify-between items-center pt-10 border-t dark:border-zinc-800">
                <span className="text-3xl font-black uppercase italic dark:text-white tracking-tighter">Gross Total</span>
                <span className="text-5xl font-black text-ino-red italic tracking-tighter drop-shadow-sm">${(cartTotal + 2.99).toFixed(2)}</span>
              </div>
            </div>

            <button 
              onClick={handleCheckout} 
              disabled={isProcessing}
              className={`w-full ${isProcessing ? 'bg-gray-100 dark:bg-zinc-800' : 'bg-ino-red'} text-white py-9 rounded-[32px] font-black uppercase text-[11px] tracking-[0.4em] shadow-2xl shadow-red-500/20 hover:bg-red-700 transition-all active:scale-95 flex items-center justify-center gap-4`}
            >
              {isProcessing ? (
                <>
                  <ButtonSpinner />
                  Transmitting...
                </>
              ) : (
                <>
                  Authorize Deployment
                  <i className="ph-bold ph-arrow-right"></i>
                </>
              )}
            </button>
            <p className="text-center text-[8px] font-black text-gray-300 dark:text-zinc-600 uppercase tracking-[0.3em] mt-10 italic">
              Military-Grade Encrypted Protocol Active
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
