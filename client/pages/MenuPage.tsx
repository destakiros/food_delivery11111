
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
  const { orders, placeOrder, updateOrderReview, updateOrderStatus } = useOrders();
  
  // Refined: Multi-select category state
  const [selectedCategories, setSelectedCategories] = useState<FoodCategory[]>([]);
  const [activeTab, setActiveTab] = useState<'menu' | 'history'>(initialHistory ? 'history' : 'menu');
  const [reviewingOrder, setReviewingOrder] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!currentUser) {
      onNavToLogin();
    }
  }, [currentUser, onNavToLogin]);

  useEffect(() => {
    setActiveTab(initialHistory ? 'history' : 'menu');
  }, [initialHistory]);

  const toggleCategory = (cat: FoodCategory) => {
    setSelectedCategories(prev => 
      prev.includes(cat) 
        ? prev.filter(c => c !== cat) 
        : [...prev, cat]
    );
  };

  const clearCategories = () => setSelectedCategories([]);

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
      alert("🛑 Sub-Optimal Payload: Minimum order value is ETB 5.00.");
      return;
    }
    placeOrder(currentUser, cart, cartTotal);
    clearCart();
    setActiveTab('history');
  };

  const handleCancelOrder = (orderId: string) => {
    if (window.confirm("⚠️ SYSTEM OVERRIDE: Are you sure you want to abort this deployment?")) {
      updateOrderStatus(orderId, 'Cancelled');
    }
  };

  const filtered = foodItems.filter(i => {
    // Refined logic: Match any of the selected categories, or show all if none selected
    const matchesCat = selectedCategories.length === 0 || selectedCategories.includes(i.category);
    const matchesSearch = i.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          i.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const myOrders = currentUser ? orders.filter(o => o.userId === currentUser.id) : [];

  if (!currentUser) return null;

  return (
    <div className="max-w-[1800px] mx-auto px-6 lg:px-12 py-12 relative min-h-screen">
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
            {/* Multi-Select Category Filters */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-[32px] border dark:border-zinc-800 shadow-sm flex flex-col xl:flex-row gap-6 sticky top-24 z-40 backdrop-blur-md">
              <div className="relative flex-grow">
                <i className="ph-bold ph-magnifying-glass absolute left-6 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input 
                  type="text" 
                  placeholder="SEARCH FOOD MANIFEST..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-zinc-800 border-0 rounded-2xl pl-14 pr-6 py-4 text-[11px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-ino-red transition-all dark:text-white"
                />
              </div>
              <div className="flex items-center gap-3 overflow-x-auto pb-2 xl:pb-0 no-scrollbar">
                <button 
                  onClick={clearCategories} 
                  className={`px-6 py-4 rounded-2xl font-black transition-all border-2 uppercase text-[9px] tracking-widest flex-shrink-0 ${selectedCategories.length === 0 ? 'bg-zinc-950 text-white border-zinc-950 shadow-lg dark:bg-white dark:text-zinc-950 dark:border-white' : 'bg-white dark:bg-zinc-900 text-gray-400 border-gray-100 dark:border-zinc-800 hover:border-gray-300'}`}
                >
                  Show All
                </button>
                <div className="w-px h-8 bg-gray-100 dark:bg-zinc-800 shrink-0 mx-2"></div>
                {CATEGORIES.map(cat => {
                  const isSelected = selectedCategories.includes(cat);
                  return (
                    <button 
                      key={cat} 
                      onClick={() => toggleCategory(cat)} 
                      className={`px-6 py-4 rounded-2xl font-black transition-all border-2 uppercase text-[9px] tracking-widest flex-shrink-0 flex items-center gap-2 ${isSelected ? 'bg-ino-red text-white border-ino-red shadow-lg shadow-red-500/20' : 'bg-white dark:bg-zinc-900 text-gray-400 dark:text-gray-500 border-gray-100 dark:border-zinc-800 hover:border-ino-red/30'}`}
                    >
                      {isSelected && <i className="ph-bold ph-check"></i>}
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filter Status Badge */}
            {selectedCategories.length > 0 && (
              <div className="flex items-center gap-3 animate-fade-in">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Filters:</span>
                <div className="flex flex-wrap gap-2">
                  {selectedCategories.map(cat => (
                    <span key={cat} className="px-3 py-1 bg-ino-red/10 text-ino-red rounded-lg text-[9px] font-black uppercase flex items-center gap-1">
                      {cat}
                      <button onClick={() => toggleCategory(cat)}><i className="ph ph-x"></i></button>
                    </span>
                  ))}
                  <button onClick={clearCategories} className="text-[9px] font-black text-gray-400 hover:text-ino-red uppercase tracking-widest underline underline-offset-4 decoration-2">Clear All</button>
                </div>
              </div>
            )}

            <div className="flex flex-col lg:flex-row gap-12">
              <div className="flex-grow min-w-0">
                {filtered.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">Adjust your filters to discover more items</p>
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
              <div className="py-40 text-center bg-white dark:bg-zinc-900 rounded-[60px] border dark:border-zinc-800 shadow-sm">
                <h3 className="text-3xl font-black uppercase text-gray-200 dark:text-zinc-800 italic">No Operation Records</h3>
                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mt-4">Your history manifest is currently empty.</p>
              </div>
            ) : (
              myOrders.map(order => (
                <div key={order.id} className="bg-white dark:bg-zinc-900 rounded-[40px] border dark:border-zinc-800 shadow-sm overflow-hidden group hover:shadow-xl transition-all duration-500">
                  <div className="flex flex-col md:flex-row">
                    <div className="p-10 flex-grow">
                      <div className="flex flex-wrap items-center gap-4 mb-6">
                        <span className="text-[10px] font-black text-ino-red bg-ino-red/10 px-4 py-2 rounded-xl uppercase tracking-widest">#{order.id}</span>
                        <div className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase border ${
                          order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                          order.status === 'Cancelled' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-yellow-50 text-yellow-600 border-yellow-100'
                        }`}>
                          {order.status}
                        </div>
                        <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">{order.timestamp}</span>
                      </div>
                      
                      <div className="space-y-4 mb-8">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="space-y-2">
                            <div className="flex items-center gap-4 font-bold text-gray-700 dark:text-gray-300 uppercase italic text-sm">
                              <span className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-zinc-800 flex items-center justify-center text-[10px]">{item.quantity}x</span>
                              {item.name} <span className="text-gray-400 text-[10px] not-italic">[{item.selectedSize}]</span>
                            </div>
                            
                            {item.excludedIngredients && item.excludedIngredients.length > 0 && (
                              <div className="flex flex-wrap gap-2 ml-12">
                                {item.excludedIngredients.map(ex => (
                                  <span key={ex} className="text-[8px] font-black uppercase text-gray-400 bg-gray-50 dark:bg-zinc-800/50 px-2 py-1 rounded-md border dark:border-zinc-700 flex items-center gap-1">
                                    <i className="ph ph-prohibit"></i> {ex}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-4">
                        {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                          <>
                            <button 
                              onClick={() => onTrackOrder?.(order)}
                              className="bg-gray-900 dark:bg-white dark:text-gray-900 text-white px-8 py-3 rounded-xl font-black uppercase text-[9px] tracking-widest hover:bg-ino-red hover:text-white transition flex items-center gap-2"
                            >
                              <i className="ph-bold ph-map-pin"></i> Track Logistics
                            </button>
                            {(order.status === 'Pending' || order.status === 'Approved') && (
                              <button 
                                onClick={() => handleCancelOrder(order.id)}
                                className="border-2 border-red-500 text-red-500 px-8 py-3 rounded-xl font-black uppercase text-[9px] tracking-widest hover:bg-red-500 hover:text-white transition flex items-center gap-2"
                              >
                                <i className="ph-bold ph-prohibit"></i> Abort Order
                              </button>
                            )}
                          </>
                        )}
                        {order.status === 'Delivered' && !order.review && (
                          <button 
                            onClick={() => setReviewingOrder(order)}
                            className="bg-ino-yellow text-red-900 px-8 py-3 rounded-xl font-black uppercase text-[9px] tracking-widest hover:bg-yellow-400 transition shadow-lg shadow-yellow-500/10"
                          >
                            Send Intelligence Feedback
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="md:w-64 bg-gray-50 dark:bg-zinc-800/50 p-10 flex flex-col justify-center items-end border-l dark:border-zinc-800">
                      <span className="text-[9px] font-black text-gray-400 uppercase mb-1 tracking-widest">Total Valuation</span>
                      <div className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter italic leading-none flex flex-col items-end">
                        <span className="text-xs not-italic text-ino-red mb-1">ETB</span>
                        {order.totalPrice.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
      {reviewingOrder && <ReviewModal order={reviewingOrder} onClose={() => setReviewingOrder(null)} onSubmit={(r, c) => { updateOrderReview(reviewingOrder.id, { id: Date.now().toString(), userId: currentUser!.id, userName: currentUser!.name, orderId: reviewingOrder.id, rating: r, comment: c, timestamp: new Date().toLocaleString() }); setReviewingOrder(null); }} />}
    </div>
  );
};
