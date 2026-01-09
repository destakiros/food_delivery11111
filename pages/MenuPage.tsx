
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';
import { useMenu } from '../context/MenuContext';
import { FoodItem, FoodCategory, Order } from '../types';
import { CATEGORIES } from '../constants';
import { FoodCard } from '../components/FoodCard';
import { CartSidebar } from '../components/CartSidebar';
import { ReviewModal } from '../components/ReviewModal';

interface MenuPageProps {
  onNavToLogin: () => void;
  onViewTray?: () => void;
  onTrackOrder?: (order: Order) => void;
  initialHistory?: boolean;
}

export const MenuPage: React.FC<MenuPageProps> = ({ onNavToLogin, onViewTray, onTrackOrder, initialHistory = false }) => {
  const { currentUser } = useAuth();
  const { foodItems } = useMenu();
  const { addToCart, cartTotal, clearCart, cart } = useCart();
  const { orders, placeOrder, updateOrderReview } = useOrders();
  const [activeCategory, setActiveCategory] = useState<FoodCategory | 'All'>('All');
  const [activeTab, setActiveTab] = useState<'menu' | 'history'>(initialHistory ? 'history' : 'menu');
  const [reviewingOrder, setReviewingOrder] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // SECURE RELAY: Direct to Auth if no identity
  useEffect(() => {
    if (!currentUser) {
      onNavToLogin();
    }
  }, [currentUser, onNavToLogin]);

  useEffect(() => {
    setActiveTab(initialHistory ? 'history' : 'menu');
  }, [initialHistory]);

  const handleAddToCartAttempt = (item: FoodItem, size: string, price: number, exclusions: string[]) => {
    if (!currentUser) {
      onNavToLogin();
      return;
    }
    
    if (item.isAvailable === false) {
      alert("❌ Unit Depleted: Item currently out of inventory.");
      return;
    }

    addToCart(item, size, price, exclusions);
  };

  const handleCheckout = () => {
    if (!currentUser) return;
    if (cartTotal < 5) {
      alert("🛑 Sub-Optimal Payload: Minimum order value is $5.00.");
      return;
    }
    placeOrder(currentUser, cart, cartTotal, '', '');
    clearCart();
    setActiveTab('history');
  };

  const filtered = foodItems.filter(i => {
    const matchesCat = activeCategory === 'All' || i.category === activeCategory;
    const matchesSearch = i.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          i.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const myOrders = currentUser ? orders.filter(o => o.userId === currentUser.id) : [];

  if (!currentUser) return null; // Avoid flicker during relay

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative min-h-screen">
      <div className="mb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-10">
          <div className="flex-grow">
            <h1 className="text-5xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none mb-3 italic">
              {activeTab === 'menu' ? 'THE' : 'MY'} <span className="text-ino-red">{activeTab === 'menu' ? 'KITCHEN' : 'ORDERS'}</span>
            </h1>
            <p className="text-gray-400 font-bold uppercase text-[9px] tracking-[0.4em]">
              Station Terminal: {currentUser?.name || 'GUEST-01'} • HUB-DELTA
            </p>
          </div>
          
          <div className="flex bg-gray-100 dark:bg-zinc-800 p-1.5 rounded-3xl border dark:border-zinc-700 shrink-0">
            <button onClick={() => setActiveTab('menu')} className={`px-8 py-4 rounded-[22px] font-black uppercase text-[10px] tracking-widest transition-all ${activeTab === 'menu' ? 'bg-white dark:bg-zinc-700 text-gray-900 dark:text-white shadow-xl' : 'text-gray-400'}`}>The Menu</button>
            <button onClick={() => setActiveTab('history')} className={`px-8 py-4 rounded-[22px] font-black uppercase text-[10px] tracking-widest transition-all ${activeTab === 'history' ? 'bg-white dark:bg-zinc-700 text-gray-900 dark:text-white shadow-xl' : 'text-gray-400'}`}>Logistics ({myOrders.length})</button>
          </div>
        </div>

        {activeTab === 'menu' ? (
          <div className="animate-fade-in space-y-10">
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-[32px] border dark:border-zinc-800 shadow-sm flex flex-col md:flex-row gap-6 sticky top-24 z-40 backdrop-blur-md">
              <div className="relative flex-grow">
                <i className="ph-bold ph-magnifying-glass absolute left-6 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input 
                  type="text" 
                  placeholder="SEARCH FOOD MANIFEST..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-zinc-800 border-0 rounded-2xl pl-14 pr-6 py-4 text-[11px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-ino-red transition-all"
                />
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                {['All', ...CATEGORIES].map(cat => (
                  <button 
                    key={cat} 
                    onClick={() => setActiveCategory(cat as any)} 
                    className={`px-6 py-4 rounded-2xl font-black transition-all border-2 uppercase text-[9px] tracking-widest flex-shrink-0 ${activeCategory === cat ? 'bg-ino-red text-white border-ino-red shadow-lg shadow-red-500/20' : 'bg-white dark:bg-zinc-900 text-gray-400 dark:text-gray-500 border-gray-100 dark:border-zinc-800 hover:border-ino-red/30'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-12">
              <div className="flex-grow">
                {filtered.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {filtered.map(item => (
                      <div key={item.id} className={item.isAvailable === false ? 'opacity-60 grayscale' : ''}>
                        <FoodCard item={item} onAddClick={handleAddToCartAttempt} />
                        {item.isAvailable === false && (
                          <div className="mt-4 text-center">
                            <span className="text-[9px] font-black text-white bg-gray-500 px-4 py-1.5 rounded-lg uppercase tracking-widest">Out of Stock</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-40 text-center bg-gray-50 dark:bg-zinc-900/50 rounded-[40px] border-2 border-dashed dark:border-zinc-800">
                    <i className="ph ph-mask-sad text-5xl text-gray-200 mb-4"></i>
                    <h3 className="text-xl font-black text-gray-300 uppercase italic">No matches in manifest</h3>
                  </div>
                )}
              </div>
              <div className="lg:w-96 shrink-0">
                <CartSidebar onPlaceOrder={handleCheckout} onViewTray={onViewTray} />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
            {myOrders.length === 0 ? (
              <div className="py-40 text-center bg-white dark:bg-zinc-900 rounded-[60px] border dark:border-zinc-800">
                <h3 className="text-3xl font-black uppercase text-gray-200 dark:text-zinc-800">No Operation Records</h3>
              </div>
            ) : (
              myOrders.map(order => (
                <div key={order.id} className="bg-white dark:bg-zinc-900 rounded-[40px] border dark:border-zinc-800 shadow-sm overflow-hidden group hover:shadow-xl transition-all duration-500">
                  <div className="flex flex-col md:flex-row">
                    <div className="p-10 flex-grow">
                      <div className="flex items-center gap-4 mb-6">
                        <span className="text-[10px] font-black text-ino-red bg-ino-red/10 px-4 py-2 rounded-xl uppercase tracking-widest">#{order.id}</span>
                        <div className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase border ${
                          order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                          order.status === 'Cancelled' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-yellow-50 text-yellow-600 border-yellow-100'
                        }`}>
                          {order.status}
                        </div>
                        <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">{order.timestamp}</span>
                      </div>
                      <div className="flex gap-4">
                        {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                          <button 
                            onClick={() => onTrackOrder?.(order)}
                            className="bg-gray-900 dark:bg-white dark:text-gray-900 text-white px-8 py-3 rounded-xl font-black uppercase text-[9px] tracking-widest hover:bg-ino-red hover:text-white transition flex items-center gap-2"
                          >
                            <i className="ph-bold ph-map-pin"></i> Track Logistics
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
