
import React, { useState } from 'react';
import { User, FoodItem, CartItem, Order, FoodCategory } from '../types';
import { CATEGORIES } from '../constants';
import { FoodCard } from './FoodCard';
import { CartSidebar } from './CartSidebar';

interface CustomerDashboardProps {
  user: User;
  menu: FoodItem[];
  cart: CartItem[];
  orders: Order[];
  onAddToCart: (item: FoodItem, size: string, price: number, exclusions: string[]) => void;
  onPlaceOrder: () => void;
  onTrackOrder: (order: Order) => void;
}

const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ 
  user, menu, cart, orders, onAddToCart, onPlaceOrder, onTrackOrder
}) => {
  const [activeTab, setActiveTab] = useState<'menu' | 'orders'>('menu');
  const [activeCategory, setActiveCategory] = useState<FoodCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMenu = menu.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-[1800px] mx-auto px-6 py-10 animate-fade-in">
      {/* Dashboard Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Node Alpha-01 Status: Online</p>
          </div>
          <h1 className="text-5xl font-black text-gray-950 dark:text-white uppercase tracking-tighter italic leading-none">
            WELCOME, <span className="text-ino-red">{user.name.split(' ')[0]}</span>
          </h1>
        </div>

        {/* View Toggle */}
        <div className="flex bg-gray-100 dark:bg-zinc-800 p-1.5 rounded-[24px] border dark:border-zinc-700 shadow-inner">
          <button 
            onClick={() => setActiveTab('menu')}
            className={`px-10 py-4 rounded-[20px] font-black uppercase text-[10px] tracking-widest transition-all duration-500 ${activeTab === 'menu' ? 'bg-white dark:bg-zinc-700 text-gray-950 dark:text-white shadow-xl scale-105' : 'text-gray-400 hover:text-ino-red'}`}
          >
            <i className="ph-bold ph-fork-knife mr-2"></i> Manifest
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`px-10 py-4 rounded-[20px] font-black uppercase text-[10px] tracking-widest transition-all duration-500 ${activeTab === 'orders' ? 'bg-white dark:bg-zinc-700 text-gray-950 dark:text-white shadow-xl scale-105' : 'text-gray-400 hover:text-ino-red'}`}
          >
            <i className="ph-bold ph-clock-counter-clockwise mr-2"></i> Logistics ({orders.length})
          </button>
        </div>
      </div>

      {activeTab === 'menu' ? (
        <div className="flex flex-col 2xl:flex-row gap-12">
          <div className="flex-grow space-y-10">
            {/* Filters Bar */}
            <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl p-6 rounded-[32px] border dark:border-zinc-800 shadow-sm flex flex-col md:flex-row gap-6 sticky top-24 z-40 transition-all">
              <div className="relative flex-grow">
                <i className="ph-bold ph-magnifying-glass absolute left-6 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input 
                  type="text" 
                  placeholder="SEARCH MANIFEST..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-zinc-800 border-0 rounded-2xl pl-14 pr-6 py-4 text-[11px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-ino-red dark:text-white"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 md:pb-0">
                {['All', ...CATEGORIES].map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setActiveCategory(cat as any)}
                    className={`px-8 py-4 rounded-2xl font-black uppercase text-[9px] tracking-widest transition-all border-2 ${activeCategory === cat ? 'bg-ino-red text-white border-ino-red shadow-lg' : 'bg-white dark:bg-zinc-900 text-gray-400 border-gray-100 dark:border-zinc-800 hover:border-ino-red/30'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Food Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredMenu.map(item => (
                <FoodCard key={item.id} item={item} onAddClick={onAddToCart} />
              ))}
            </div>
          </div>

          <div className="2xl:w-[400px] shrink-0">
             <CartSidebar onPlaceOrder={onPlaceOrder} />
          </div>
        </div>
      ) : (
        /* Enhanced Order History */
        <div className="space-y-8 max-w-6xl mx-auto animate-slide-up">
          {orders.length === 0 ? (
            <div className="py-40 text-center bg-gray-50 dark:bg-zinc-900 rounded-[60px] border-4 border-dashed dark:border-zinc-800">
               <i className="ph ph-selection-background text-6xl text-gray-200 mb-6"></i>
               <h3 className="text-2xl font-black text-gray-300 uppercase italic">No logistics history found</h3>
            </div>
          ) : (
            orders.map(order => (
              <div key={order.id} className="bg-white dark:bg-zinc-900 rounded-[48px] border dark:border-zinc-800 shadow-xl overflow-hidden group hover:scale-[1.01] transition-all duration-500">
                <div className="flex flex-col md:flex-row">
                  <div className="p-10 flex-grow">
                    <div className="flex items-center gap-5 mb-8">
                       <span className="text-[10px] font-black text-white bg-ino-red px-5 py-2 rounded-xl uppercase italic tracking-widest shadow-lg shadow-red-500/10">#{order.id}</span>
                       <div className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase border ${
                         order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                         order.status === 'Cancelled' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-yellow-50 text-yellow-600 border-yellow-100'
                       }`}>
                         {order.status}
                       </div>
                       <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{order.timestamp}</span>
                    </div>

                    <div className="space-y-4 mb-10">
                       {order.items.map((item, idx) => (
                         <div key={idx} className="flex items-center gap-4 text-sm font-bold text-gray-800 dark:text-gray-300 uppercase italic">
                            <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-zinc-800 flex items-center justify-center text-[10px]">{item.quantity}x</div>
                            {item.name} <span className="text-gray-400 text-[10px] not-italic">({item.selectedSize})</span>
                         </div>
                       ))}
                    </div>

                    <div className="flex gap-4">
                       <button 
                         onClick={() => onTrackOrder(order)}
                         className="bg-zinc-950 dark:bg-white dark:text-zinc-950 text-white px-10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-ino-red hover:text-white transition-all flex items-center gap-3 shadow-xl shadow-black/10"
                       >
                         <i className="ph-bold ph-radar"></i> Live Tracking
                       </button>
                    </div>
                  </div>
                  <div className="md:w-72 bg-gray-50 dark:bg-zinc-800/30 p-12 flex flex-col justify-center items-end border-l dark:border-zinc-800">
                     <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Total Valuation</span>
                     <div className="text-5xl font-black text-gray-900 dark:text-white italic tracking-tighter leading-none">${order.totalPrice.toFixed(2)}</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;
