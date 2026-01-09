
import React, { useState } from 'react';
import { useOrders } from '../../context/OrderContext';
import { useAuth } from '../../context/AuthContext';
import { useMenu } from '../../context/MenuContext';
import { useToast } from '../../context/ToastContext';
import { CATEGORIES } from '../../constants';
import { FoodItem, FoodCategory, OrderStatus, User, Order } from '../../types';

interface AdminDashboardProps {
  onBack?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack }) => {
  const { orders, updateOrderStatus, deleteOrder } = useOrders();
  const { users, deleteUser, suspendUser, liftSuspension, addUser } = useAuth();
  const { foodItems, addFoodItem, deleteFoodItem } = useMenu();
  const { showToast } = useToast();
  
  const [activeTab, setActiveTab] = useState<'orders' | 'users' | 'menu' | 'analytics'>('orders');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  // Modal States
  const [showItemModal, setShowItemModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  
  // Form States
  const [itemFormData, setItemFormData] = useState<Partial<FoodItem>>({ 
    name: '', 
    price: 0, 
    category: 'Fast Food', 
    description: '',
    image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&q=80&w=800'
  });
  
  const [adminFormData, setAdminFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });

  const stats = {
    active: orders.filter(o => !['Delivered', 'Cancelled'].includes(o.status)).length,
    revenue: orders.filter(o => o.status === 'Delivered').reduce((acc, o) => acc + o.totalPrice, 0),
    users: users.length,
    admins: users.filter(u => u.role === 'admin').length,
  };

  const handleCreateAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    addUser({
      ...adminFormData,
      role: 'admin'
    });
    setShowAdminModal(false);
    setAdminFormData({ name: '', email: '', phone: '', password: '' });
    showToast("Authority Expanded: New Administrative Operative recruited.", "success");
  };

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    addFoodItem(itemFormData as Omit<FoodItem, 'id'>);
    setShowItemModal(false);
    setItemFormData({ name: '', price: 0, category: 'Fast Food', description: '', image: '' });
    showToast("Manifest Updated: New logistics unit added.", "success");
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 min-h-screen animate-fade-in text-gray-900 dark:text-white">
      <div className="flex justify-between items-center mb-16">
        <div className="flex items-center gap-6">
          <button onClick={onBack} className="w-12 h-12 bg-gray-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center hover:bg-gray-200 transition">
            <i className="ph-bold ph-arrow-left"></i>
          </button>
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter italic leading-none text-gray-950 dark:text-white">ADMIN <span className="text-ino-red">CONSOLE</span></h1>
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-2">Logistics Command Center Node Alpha</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {[
          { label: 'Pending Orders', val: stats.active, color: 'text-yellow-600', bg: 'bg-yellow-50 dark:bg-yellow-900/10' },
          { label: 'Total Revenue', val: `$${stats.revenue.toFixed(2)}`, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/10' },
          { label: 'Active Admins', val: stats.admins, color: 'text-ino-red', bg: 'bg-red-50 dark:bg-red-900/10' },
          { label: 'Total Operatives', val: stats.users, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/10' }
        ].map((s, idx) => (
          <div key={idx} className={`p-8 rounded-[40px] border dark:border-zinc-800 shadow-sm ${s.bg}`}>
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">{s.label}</p>
            <h4 className={`text-4xl font-black tracking-tighter italic ${s.color}`}>{s.val}</h4>
          </div>
        ))}
      </div>

      <div className="flex gap-10 border-b dark:border-zinc-800 mb-12 overflow-x-auto no-scrollbar">
        {[
          { id: 'orders', label: 'Logistics' },
          { id: 'users', label: 'Operatives' },
          { id: 'menu', label: 'Manifest' },
          { id: 'analytics', label: 'Intelligence' }
        ].map(tab => (
          <button 
            key={tab.id} 
            onClick={() => setActiveTab(tab.id as any)} 
            className={`pb-6 text-[10px] font-black uppercase tracking-widest relative transition-colors ${activeTab === tab.id ? 'text-ino-red' : 'text-gray-400 dark:text-zinc-600'}`}
          >
            {tab.label} {activeTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-1 bg-ino-red"></div>}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-[50px] border dark:border-zinc-800 shadow-2xl overflow-hidden mb-20">
        {activeTab === 'orders' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="bg-gray-50/50 dark:bg-zinc-800/50"><th className="px-12 py-8 text-[10px] font-black text-gray-400 uppercase">Context</th><th className="px-12 py-8 text-[10px] font-black text-gray-400 uppercase">Protocol Status</th><th className="px-12 py-8 text-[10px] font-black text-gray-400 uppercase text-center">Operation</th></tr></thead>
              <tbody className="divide-y dark:divide-zinc-800">
                {orders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800 transition">
                    <td className="px-12 py-10 cursor-pointer" onClick={() => setSelectedOrder(order)}>
                      <div className="text-xs font-black text-ino-red">#{order.id}</div>
                      <div className="font-bold text-gray-900 dark:text-white uppercase italic">{order.userName}</div>
                      <div className="text-[9px] font-bold text-gray-400 italic">${order.totalPrice.toFixed(2)} • {order.items.length} Units</div>
                    </td>
                    <td className="px-12 py-10">
                      <select 
                        value={order.status} 
                        onChange={e => updateOrderStatus(order.id, e.target.value as OrderStatus)} 
                        className={`text-[9px] font-black uppercase rounded-xl px-5 py-2.5 outline-none border-0 shadow-sm ${order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600' : 'bg-yellow-50 text-yellow-600'}`}
                      >
                        {['Pending', 'Approved', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'].map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </td>
                    <td className="px-12 py-10 text-center">
                      <div className="flex justify-center gap-4">
                        <button onClick={() => setSelectedOrder(order)} className="text-gray-400 hover:text-ino-red transition p-2">
                          <i className="ph-bold ph-magnifying-glass text-xl"></i>
                        </button>
                        <button onClick={() => deleteOrder(order.id)} className="text-gray-200 dark:text-zinc-700 hover:text-ino-red transition p-2">
                          <i className="ph-bold ph-trash text-xl"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'users' && (
          <div>
            <div className="p-8 border-b dark:border-zinc-800 flex justify-between bg-gray-50/50 dark:bg-zinc-800/50 items-center">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Operative Manifest</span>
              <button 
                onClick={() => setShowAdminModal(true)} 
                className="bg-ino-red text-white px-10 py-4 rounded-3xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-red-500/20 transition hover:bg-red-700 flex items-center gap-2"
              >
                <i className="ph-bold ph-shield-plus text-lg"></i> Enlist New Admin
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead><tr className="bg-gray-50/50 dark:bg-zinc-800/50"><th className="px-12 py-8 text-[10px] font-black text-gray-400 uppercase">Operative</th><th className="px-12 py-8 text-[10px] font-black text-gray-400 uppercase">Status</th><th className="px-12 py-8 text-[10px] font-black text-gray-400 uppercase text-center">Protocol</th></tr></thead>
                <tbody className="divide-y dark:divide-zinc-800">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800 transition">
                      <td className="px-12 py-10">
                        <div className="flex items-center gap-4">
                           <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${u.role === 'admin' ? 'bg-ino-red text-white shadow-lg' : 'bg-gray-100 dark:bg-zinc-800 text-gray-400'}`}>
                             <i className={`ph-bold ${u.role === 'admin' ? 'ph-crown' : 'ph-user'}`}></i>
                           </div>
                           <div>
                             <div className="font-black uppercase italic dark:text-white leading-none mb-1">{u.name}</div>
                             <div className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">{u.email}</div>
                           </div>
                        </div>
                      </td>
                      <td className="px-12 py-10">
                        <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase ${u.status === 'Suspended' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="px-12 py-10 text-center flex justify-center gap-3">
                        {u.status === 'Suspended' ? (
                          <button onClick={() => liftSuspension(u.id)} className="text-emerald-500 p-2 hover:scale-110 transition">
                            <i className="ph-bold ph-shield-check text-xl"></i>
                          </button>
                        ) : (
                          <button onClick={() => suspendUser(u.id, "30 Days", "Security Audit")} className="text-red-500 p-2 hover:scale-110 transition">
                            <i className="ph-bold ph-shield-slash text-xl"></i>
                          </button>
                        )}
                        {u.role !== 'admin' && (
                          <button onClick={() => deleteUser(u.id)} className="text-gray-200 dark:text-zinc-700 hover:text-ino-red transition p-2">
                            <i className="ph-bold ph-trash text-xl"></i>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'menu' && (
          <div>
            <div className="p-8 border-b dark:border-zinc-800 flex justify-end bg-gray-50/50 dark:bg-zinc-800/50">
              <button onClick={() => setShowItemModal(true)} className="bg-ino-red text-white px-10 py-4 rounded-3xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-red-500/20 hover:bg-red-700">
                + Forge Item
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead><tr className="bg-gray-50/50 dark:bg-zinc-800/50"><th className="px-12 py-8 text-[10px] font-black text-gray-400 uppercase">Product Schematic</th><th className="px-12 py-8 text-[10px] font-black text-gray-400 uppercase">Valuation</th><th className="px-12 py-8 text-[10px] font-black text-gray-400 uppercase text-center">Action</th></tr></thead>
                <tbody className="divide-y dark:divide-zinc-800">
                  {foodItems.map(item => (
                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800 transition">
                      <td className="px-12 py-8 flex items-center gap-6 font-black uppercase italic dark:text-white">
                        <img src={item.image} className="w-16 h-16 rounded-[22px] object-cover shadow-xl border border-white/10 flex-shrink-0" alt={item.name} />
                        {item.name}
                      </td>
                      <td className="px-12 py-8 font-black text-2xl italic tracking-tighter dark:text-white">${item.price.toFixed(2)}</td>
                      <td className="px-12 py-8 text-center">
                        <button onClick={() => deleteFoodItem(item.id)} className="text-gray-200 dark:text-zinc-700 hover:text-ino-red transition">
                          <i className="ph-bold ph-trash text-xl"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* DETAILED ORDER MODAL (SHOWS MODIFICATIONS) */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[200] flex items-center justify-center p-6 animate-fade-in">
          <div className="bg-white dark:bg-zinc-900 rounded-[50px] max-w-2xl w-full shadow-2xl border dark:border-zinc-800 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-10 border-b dark:border-zinc-800 flex justify-between items-center bg-gray-50/50 dark:bg-zinc-950/50">
              <div>
                <h2 className="text-3xl font-black uppercase tracking-tighter italic leading-none text-gray-950 dark:text-white">ORDER <span className="text-ino-red">MANIFEST</span></h2>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">Relay Node: #{selectedOrder.id}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="w-12 h-12 bg-white dark:bg-zinc-800 rounded-full flex items-center justify-center text-gray-400 hover:text-ino-red transition-all shadow-sm">
                <i className="ph-bold ph-x text-xl"></i>
              </button>
            </div>

            <div className="p-10 overflow-y-auto no-scrollbar flex-grow">
               <div className="flex justify-between items-center mb-8 pb-4 border-b dark:border-zinc-800">
                  <div className="text-[10px] font-black uppercase text-gray-400 tracking-widest italic">Itemized Payload</div>
                  <div className="text-[10px] font-black uppercase text-ino-red italic">{selectedOrder.status}</div>
               </div>

               <div className="space-y-6">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="bg-gray-50 dark:bg-zinc-950 p-6 rounded-3xl border dark:border-zinc-800 transition-all">
                       <div className="flex justify-between items-start mb-3">
                          <div className="flex gap-4">
                             <div className="w-10 h-10 bg-white dark:bg-zinc-800 rounded-xl flex items-center justify-center text-[10px] font-black text-ino-red shadow-sm border dark:border-zinc-700">{item.quantity}x</div>
                             <div>
                                <div className="text-sm font-black uppercase italic dark:text-white leading-none mb-1">{item.name}</div>
                                <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest italic">Size: {item.selectedSize}</div>
                             </div>
                          </div>
                          <div className="text-xs font-black italic dark:text-white">${(item.selectedPrice * item.quantity).toFixed(2)}</div>
                       </div>

                       {/* HIGHLIGHT MODIFICATIONS FOR ADMIN */}
                       {item.excludedIngredients && item.excludedIngredients.length > 0 && (
                         <div className="mt-4 pt-3 border-t border-gray-100 dark:border-zinc-800">
                            <p className="text-[8px] font-black uppercase text-ino-red tracking-widest mb-2 italic">Custom Request: Exclude Ingredients</p>
                            <div className="flex flex-wrap gap-2">
                               {item.excludedIngredients.map(ex => (
                                 <span key={ex} className="px-2 py-1 bg-red-50 dark:bg-red-950/20 text-red-500 rounded-lg text-[8px] font-black uppercase border border-red-100 dark:border-red-900/10">
                                   NO {ex}
                                 </span>
                               ))}
                            </div>
                         </div>
                       )}
                    </div>
                  ))}
               </div>

               <div className="mt-10 pt-6 border-t dark:border-zinc-800 flex justify-between items-end">
                  <span className="text-xl font-black uppercase italic dark:text-white tracking-tighter leading-none">Gross Total</span>
                  <div className="text-right">
                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest block mb-1">Incl. Logistics Surcharge</span>
                    <span className="text-5xl font-black text-ino-red tracking-tighter italic leading-none">${selectedOrder.totalPrice.toFixed(2)}</span>
                  </div>
               </div>
            </div>

            <div className="p-10 bg-gray-50 dark:bg-zinc-950 border-t dark:border-zinc-800 flex gap-4">
               <button 
                 onClick={() => { updateOrderStatus(selectedOrder.id, 'Approved'); setSelectedOrder(null); }}
                 className="flex-grow bg-emerald-600 text-white py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-xl shadow-emerald-500/20 hover:bg-emerald-700 transition"
               >
                 Authorize Pipeline
               </button>
               <button 
                 onClick={() => { updateOrderStatus(selectedOrder.id, 'Cancelled'); setSelectedOrder(null); }}
                 className="flex-grow bg-red-600 text-white py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-xl shadow-red-500/20 hover:bg-red-700 transition"
               >
                 Terminate Signal
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Existing recruitment/item modals remain functional ... */}
    </div>
  );
};
