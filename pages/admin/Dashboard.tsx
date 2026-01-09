
import React, { useState, useRef } from 'react';
import { useOrders } from '../../context/OrderContext';
import { useAuth } from '../../context/AuthContext';
import { useMenu } from '../../context/MenuContext';
import { useToast } from '../../context/ToastContext';
import { CATEGORIES } from '../../constants';
import { FoodItem, FoodCategory, OrderStatus, Order, User } from '../../types';

interface AdminDashboardProps {
  onBack?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack }) => {
  const { orders, updateOrderStatus, deleteOrder } = useOrders();
  const { users, deleteUser, suspendUser, liftSuspension, addUser } = useAuth();
  const { foodItems, addFoodItem, deleteFoodItem, updateFoodItem, toggleAvailability } = useMenu();
  const { showToast } = useToast();
  
  const [activeTab, setActiveTab] = useState<'orders' | 'users' | 'menu' | 'analytics'>('orders');
  
  // Modal States
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showItemModal, setShowItemModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  
  // Form States
  const [itemFormData, setItemFormData] = useState<Partial<FoodItem>>({ 
    name: '', price: 0, category: 'Burger', description: '', image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&q=80&w=800'
  });
  
  const [adminFormData, setAdminFormData] = useState({
    name: '', email: '', phone: '', password: ''
  });

  const stats = {
    active: orders.filter(o => !['Delivered', 'Cancelled'].includes(o.status)).length,
    revenue: orders.filter(o => o.status === 'Delivered').reduce((acc, o) => acc + o.totalPrice, 0),
    users: users.length,
    admins: users.filter(u => u.role === 'admin').length,
  };

  const getOrderUser = (userId: string): User | undefined => users.find(u => u.id === userId);

  const handleCreateAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    addUser({ ...adminFormData, role: 'admin' });
    setShowAdminModal(false);
    setAdminFormData({ name: '', email: '', phone: '', password: '' });
    showToast("Authority Expanded: New Administrative Operative recruited.", "success");
  };

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    addFoodItem(itemFormData as Omit<FoodItem, 'id'>);
    setShowItemModal(false);
    setItemFormData({ name: '', price: 0, category: 'Burger', description: '', image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&q=80&w=800' });
    showToast("Manifest Updated: New logistics unit added.", "success");
  };

  const handleUpdateItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      updateFoodItem(editingItem.id, editingItem);
      setEditingItem(null);
      showToast("Schematic Recalibrated.", "success");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 min-h-screen animate-fade-in text-gray-900 dark:text-white">
      {/* Console Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
        <div className="flex items-center gap-6">
          <button onClick={onBack} className="w-12 h-12 bg-gray-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center hover:bg-gray-200 transition">
            <i className="ph-bold ph-arrow-left"></i>
          </button>
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter italic leading-none text-gray-950 dark:text-white">ADMIN <span className="text-ino-red">CONSOLE</span></h1>
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-2">Logistics Command Center Node Alpha</p>
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="flex flex-wrap gap-4 w-full md:w-auto">
          <button 
            onClick={() => setShowAdminModal(true)}
            className="flex-grow md:flex-grow-0 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest border-2 border-ino-red/20 hover:border-ino-red transition-all flex items-center justify-center gap-3 shadow-xl"
          >
            <i className="ph-bold ph-shield-plus text-lg text-ino-red"></i>
            Enlist Admin
          </button>
          <button 
            onClick={() => setShowItemModal(true)}
            className="flex-grow md:flex-grow-0 bg-ino-red text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-red-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-red-500/20"
          >
            <i className="ph-bold ph-plus-circle text-lg"></i>
            Forge Item
          </button>
        </div>
      </div>

      {/* Intelligence Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {[
          { label: 'Active Pipeline', val: stats.active, color: 'text-yellow-600', bg: 'bg-yellow-50 dark:bg-yellow-900/10' },
          { label: 'Total Revenue', val: `$${stats.revenue.toFixed(2)}`, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/10' },
          { label: 'Command Staff', val: stats.admins, color: 'text-ino-red', bg: 'bg-red-50 dark:bg-red-900/10' },
          { label: 'Field Operatives', val: stats.users, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/10' }
        ].map((s, idx) => (
          <div key={idx} className={`p-8 rounded-[40px] border dark:border-zinc-800 shadow-sm ${s.bg} transition-transform hover:scale-[1.02]`}>
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">{s.label}</p>
            <h4 className={`text-4xl font-black tracking-tighter italic ${s.color}`}>{s.val}</h4>
          </div>
        ))}
      </div>

      {/* Control Tabs */}
      <div className="flex gap-10 border-b dark:border-zinc-800 mb-12 overflow-x-auto no-scrollbar">
        {['LOGISTICS', 'OPERATIVES', 'MANIFEST'].map((label, idx) => (
          <button 
            key={label} 
            onClick={() => setActiveTab(['orders', 'users', 'menu'][idx] as any)} 
            className={`pb-6 text-[10px] font-black uppercase tracking-widest relative transition-colors ${activeTab === ['orders', 'users', 'menu'][idx] ? 'text-ino-red' : 'text-gray-400 dark:text-zinc-600'}`}
          >
            {label} {activeTab === ['orders', 'users', 'menu'][idx] && <div className="absolute bottom-0 left-0 w-full h-1 bg-ino-red"></div>}
          </button>
        ))}
      </div>

      {/* Main Command Window */}
      <div className="bg-white dark:bg-zinc-900 rounded-[50px] border dark:border-zinc-800 shadow-2xl overflow-hidden mb-20">
        {activeTab === 'orders' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="bg-gray-50/50 dark:bg-zinc-800/50"><th className="px-12 py-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Deployment</th><th className="px-12 py-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Protocol Status</th><th className="px-12 py-8 text-[10px] font-black text-gray-400 uppercase text-center tracking-widest">Protocol</th></tr></thead>
              <tbody className="divide-y dark:divide-zinc-800">
                {orders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800 transition">
                    <td className="px-12 py-10">
                      <div className="flex items-center gap-6">
                        <button 
                          onClick={() => setSelectedOrder(order)}
                          className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-zinc-800 text-gray-400 hover:text-ino-red transition flex items-center justify-center border dark:border-zinc-700 shadow-sm"
                        >
                          <i className="ph-bold ph-magnifying-glass text-xl"></i>
                        </button>
                        <div>
                          <div className="text-xs font-black text-ino-red leading-none mb-1">#{order.id}</div>
                          <div className="font-bold text-gray-900 dark:text-white uppercase italic">{order.userName}</div>
                          <div className="text-[9px] font-bold text-gray-400 italic">${order.totalPrice.toFixed(2)} • {order.items.length} Units</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-12 py-10">
                      <select 
                        value={order.status} 
                        onChange={e => updateOrderStatus(order.id, e.target.value as OrderStatus)} 
                        className={`text-[9px] font-black uppercase rounded-xl px-5 py-2.5 outline-none border-0 shadow-sm transition-colors ${
                          order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600' : 
                          order.status === 'Cancelled' ? 'bg-red-50 text-red-600' : 'bg-yellow-50 text-yellow-600'
                        }`}
                      >
                        {['Pending', 'Approved', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'].map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </td>
                    <td className="px-12 py-10 text-center">
                      <button onClick={() => deleteOrder(order.id)} className="text-gray-200 dark:text-zinc-700 hover:text-ino-red transition">
                        <i className="ph-bold ph-trash text-xl"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="bg-gray-50/50 dark:bg-zinc-800/50"><th className="px-12 py-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Operative</th><th className="px-12 py-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Security Status</th><th className="px-12 py-8 text-[10px] font-black text-gray-400 uppercase text-center tracking-widest">Control</th></tr></thead>
              <tbody className="divide-y dark:divide-zinc-800">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800 transition">
                    <td className="px-12 py-10">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${u.role === 'admin' ? 'bg-ino-red text-white shadow-lg' : 'bg-gray-100 dark:bg-zinc-800 text-gray-400'}`}>
                          <i className={`ph-bold ${u.role === 'admin' ? 'ph-shield-star' : 'ph-user'}`}></i>
                        </div>
                        <div>
                          <div className="font-black uppercase italic dark:text-white leading-none mb-1">{u.name}</div>
                          <div className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-12 py-10 text-[9px] font-black uppercase">
                       <span className={`px-4 py-2 rounded-xl ${u.status === 'Suspended' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>{u.status}</span>
                    </td>
                    <td className="px-12 py-10 text-center flex justify-center gap-4">
                       <button onClick={() => u.status === 'Suspended' ? liftSuspension(u.id) : suspendUser(u.id, '30 Days', 'Security Audit')} className="text-gray-400 hover:text-ino-yellow transition p-2">
                         <i className={`ph-bold ${u.status === 'Suspended' ? 'ph-lock-open' : 'ph-lock'} text-xl`}></i>
                       </button>
                       {u.role !== 'admin' && (
                         <button onClick={() => deleteUser(u.id)} className="text-gray-200 dark:text-zinc-700 hover:text-ino-red transition p-2"><i className="ph-bold ph-trash text-xl"></i></button>
                       )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'menu' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="bg-gray-50/50 dark:bg-zinc-800/50"><th className="px-12 py-8 text-[10px] font-black text-gray-400 uppercase">Schematic</th><th className="px-12 py-8 text-[10px] font-black text-gray-400 uppercase">Status</th><th className="px-12 py-8 text-[10px] font-black text-gray-400 uppercase text-center">Action</th></tr></thead>
              <tbody className="divide-y dark:divide-zinc-800">
                {foodItems.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800 transition">
                    <td className="px-12 py-8 flex items-center gap-6 font-black uppercase italic dark:text-white">
                      <img src={item.image} className="w-16 h-16 rounded-[22px] object-cover shadow-xl border border-white/10" alt={item.name} />
                      <div>
                        {item.name}
                        <div className="text-[8px] text-gray-400 not-italic tracking-widest mt-1">{item.category}</div>
                      </div>
                    </td>
                    <td className="px-12 py-8">
                       <button onClick={() => toggleAvailability(item.id)} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase border ${item.isAvailable ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                         {item.isAvailable ? 'Active' : 'Depleted'}
                       </button>
                    </td>
                    <td className="px-12 py-8 text-center">
                       <button onClick={() => setEditingItem(item)} className="text-gray-400 hover:text-ino-yellow transition p-2"><i className="ph-bold ph-pencil-simple text-xl"></i></button>
                       <button onClick={() => deleteFoodItem(item.id)} className="text-gray-400 hover:text-ino-red transition p-2"><i className="ph-bold ph-trash text-xl"></i></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* FULL-DETAIL ORDER MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[200] flex items-center justify-center p-6 animate-fade-in">
          <div className="bg-white dark:bg-zinc-900 rounded-[60px] max-w-6xl w-full max-h-[95vh] overflow-hidden shadow-2xl border dark:border-zinc-800 flex flex-col">
            
            <div className="p-10 border-b dark:border-zinc-800 flex justify-between items-center bg-gray-50/50 dark:bg-zinc-950/50">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-ino-red rounded-3xl flex items-center justify-center text-white text-3xl shadow-xl shadow-red-500/20">
                  <i className="ph-bold ph-truck"></i>
                </div>
                <div>
                  <h2 className="text-3xl font-black uppercase tracking-tighter italic leading-none text-gray-950 dark:text-white">DEPLOYMENT <span className="text-ino-red">MANIFEST</span></h2>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mt-2">Node Relay: #{selectedOrder.id} • {selectedOrder.timestamp}</p>
                </div>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="w-14 h-14 bg-white dark:bg-zinc-800 rounded-full flex items-center justify-center text-gray-400 hover:text-ino-red transition-all border dark:border-zinc-700 shadow-sm">
                <i className="ph-bold ph-x text-2xl"></i>
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-12 no-scrollbar">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                
                {/* Logistics Info */}
                <div className="space-y-10">
                  <div className="bg-gray-50 dark:bg-zinc-800/30 p-8 rounded-[40px] border dark:border-zinc-800 shadow-inner">
                    <span className="text-[9px] font-black uppercase text-ino-red tracking-widest block mb-6 italic">Customer Intelligence</span>
                    <div className="flex items-center gap-5">
                       <div className="w-14 h-14 bg-white dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-gray-400 border dark:border-zinc-700">
                          <i className="ph-bold ph-user-focus text-2xl"></i>
                       </div>
                       <div>
                          <div className="text-xl font-black uppercase italic dark:text-white leading-none mb-1">{selectedOrder.userName}</div>
                          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                            {getOrderUser(selectedOrder.userId)?.email || 'Email Channel Unknown'}
                          </div>
                          <div className="text-[10px] font-black text-ino-red uppercase tracking-widest mt-1">
                            {getOrderUser(selectedOrder.userId)?.phone || 'Phone Link Offline'}
                          </div>
                       </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-zinc-800/30 p-8 rounded-[40px] border dark:border-zinc-800 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                       <i className="ph-bold ph-map-pin text-ino-red text-xl"></i>
                       <span className="text-[9px] font-black uppercase text-gray-400 tracking-widest italic">Deployment Node</span>
                    </div>
                    <div className="text-sm font-black dark:text-white uppercase italic leading-relaxed mb-6">
                      {selectedOrder.address || 'Standard Hub Node Alpha'}
                    </div>
                    <div className="h-44 w-full rounded-[24px] overflow-hidden border dark:border-zinc-700 relative">
                       <iframe 
                        className="w-full h-full grayscale invert dark:invert-0 opacity-40"
                        frameBorder="0" 
                        src={`https://maps.google.com/maps?q=${encodeURIComponent(selectedOrder.address || 'Addis Ababa')}&z=14&output=embed`}
                       ></iframe>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-zinc-950 p-10 rounded-[48px] border dark:border-zinc-800 shadow-inner flex flex-col h-full">
                   <div className="flex justify-between items-center mb-8 pb-4 border-b dark:border-zinc-800">
                      <span className="text-[10px] font-black uppercase tracking-widest italic text-gray-400">Inventory Payload</span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-ino-red italic">{selectedOrder.items.length} Units</span>
                   </div>
                   
                   <div className="space-y-6 flex-grow overflow-y-auto no-scrollbar">
                      {selectedOrder.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-start gap-4">
                           <div className="flex gap-4">
                              <div className="w-10 h-10 bg-gray-50 dark:bg-zinc-900 rounded-xl flex items-center justify-center text-[10px] font-black text-gray-400 border dark:border-zinc-800 shrink-0">
                                {item.quantity}x
                              </div>
                              <div>
                                 <div className="text-xs font-black uppercase italic dark:text-white leading-none mb-1">{item.name}</div>
                                 <div className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Size: {item.selectedSize}</div>
                                 {item.excludedIngredients && item.excludedIngredients.length > 0 && (
                                   <div className="flex flex-wrap gap-1 mt-2">
                                      {item.excludedIngredients.map(ex => (
                                        <span key={ex} className="text-[7px] bg-red-50 dark:bg-red-950/20 text-red-500 px-1.5 py-0.5 rounded-md border border-red-100 dark:border-red-900/10 font-black uppercase italic">
                                          NO {ex}
                                        </span>
                                      ))}
                                   </div>
                                 )}
                              </div>
                           </div>
                           <span className="text-xs font-black dark:text-white italic">${(item.selectedPrice * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                   </div>

                   <div className="mt-12 pt-8 border-t dark:border-zinc-800 space-y-4">
                      <div className="flex justify-between text-[10px] font-black uppercase text-gray-400 tracking-widest">
                        <span>Payload Value</span>
                        <span className="dark:text-white">${(selectedOrder.totalPrice - 2.99).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-end pt-6 border-t dark:border-zinc-800">
                        <span className="text-xl font-black uppercase italic dark:text-white tracking-tighter leading-none">Gross Total</span>
                        <span className="text-5xl font-black text-ino-red tracking-tighter italic leading-none">${selectedOrder.totalPrice.toFixed(2)}</span>
                      </div>
                   </div>
                </div>

              </div>
            </div>

            <div className="p-10 border-t dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 flex flex-wrap gap-4 justify-between items-center">
               <div className="flex gap-4">
                  <button 
                    onClick={() => { updateOrderStatus(selectedOrder.id, 'Approved'); setSelectedOrder(null); }}
                    className="bg-emerald-600 text-white px-10 py-5 rounded-3xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-emerald-500/20 hover:bg-emerald-700 transition"
                  >
                    Authorize Pipeline
                  </button>
                  <button 
                    onClick={() => { updateOrderStatus(selectedOrder.id, 'Cancelled'); setSelectedOrder(null); }}
                    className="bg-red-600 text-white px-10 py-5 rounded-3xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-red-500/20 hover:bg-red-700 transition"
                  >
                    Decommission Order
                  </button>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* ADMIN ENLISTMENT MODAL */}
      {showAdminModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[100] flex items-center justify-center p-6 animate-fade-in">
          <div className="bg-white dark:bg-zinc-900 rounded-[60px] p-16 max-w-xl w-full shadow-2xl border dark:border-zinc-800 relative overflow-hidden">
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-10 italic dark:text-white">Enlist Admin Operative</h2>
            <form onSubmit={handleCreateAdmin} className="space-y-6">
              <input required className="w-full bg-gray-50 dark:bg-zinc-800 border-0 px-8 py-5 rounded-[22px] font-black uppercase text-xs outline-none focus:ring-2 focus:ring-ino-red dark:text-white" placeholder="Identity Name" value={adminFormData.name} onChange={e => setAdminFormData({...adminFormData, name: e.target.value})} />
              <input required type="email" className="w-full bg-gray-50 dark:bg-zinc-800 border-0 px-8 py-5 rounded-[22px] font-black text-xs outline-none focus:ring-2 focus:ring-ino-red dark:text-white" placeholder="Relay Email" value={adminFormData.email} onChange={e => setAdminFormData({...adminFormData, email: e.target.value})} />
              <input required type="password" title="Passkey" className="w-full bg-gray-50 dark:bg-zinc-800 border-0 px-8 py-5 rounded-[22px] font-black text-xs outline-none focus:ring-2 focus:ring-ino-red dark:text-white" placeholder="Secure Pass-Key" value={adminFormData.password} onChange={e => setAdminFormData({...adminFormData, password: e.target.value})} />
              <div className="flex gap-6 pt-8">
                <button type="button" onClick={() => setShowAdminModal(false)} className="flex-grow bg-gray-100 dark:bg-zinc-800 py-6 rounded-[22px] font-black uppercase text-[10px] tracking-widest transition hover:bg-gray-200">Abort</button>
                <button type="submit" className="flex-grow bg-ino-red text-white py-6 rounded-[22px] font-black uppercase text-[10px] tracking-widest shadow-xl transition hover:bg-red-700">Commit Registry</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NEW ITEM MODAL */}
      {showItemModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[100] flex items-center justify-center p-6 animate-fade-in">
          <div className="bg-white dark:bg-zinc-900 rounded-[60px] p-16 max-w-xl w-full shadow-2xl border dark:border-zinc-800 relative overflow-hidden">
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-10 italic dark:text-white">Forge Manifest Item</h2>
            <form onSubmit={handleCreateItem} className="space-y-6">
              <input required className="w-full bg-gray-50 dark:bg-zinc-800 border-0 px-8 py-5 rounded-[22px] font-black uppercase text-xs outline-none focus:ring-2 focus:ring-ino-red dark:text-white" placeholder="Item Name" value={itemFormData.name} onChange={e => setItemFormData({...itemFormData, name: e.target.value})} />
              <div className="grid grid-cols-2 gap-6">
                <input required type="number" step="0.01" className="w-full bg-gray-50 dark:bg-zinc-800 border-0 px-8 py-5 rounded-[22px] font-black text-xs outline-none focus:ring-2 focus:ring-ino-red dark:text-white" placeholder="Price ($)" value={itemFormData.price} onChange={e => setItemFormData({...itemFormData, price: parseFloat(e.target.value)})} />
                <select className="w-full bg-gray-50 dark:bg-zinc-800 border-0 px-8 py-5 rounded-[22px] font-black uppercase text-xs outline-none focus:ring-2 focus:ring-ino-red dark:text-white" value={itemFormData.category} onChange={e => setItemFormData({...itemFormData, category: e.target.value as FoodCategory})}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <input required className="w-full bg-gray-50 dark:bg-zinc-800 border-0 px-8 py-5 rounded-[22px] font-bold text-xs outline-none focus:ring-2 focus:ring-ino-red dark:text-white" placeholder="Visual Schematic (Image URL)" value={itemFormData.image} onChange={e => setItemFormData({...itemFormData, image: e.target.value})} />
              <div className="flex gap-6 pt-8">
                <button type="button" onClick={() => setShowItemModal(false)} className="flex-grow bg-gray-100 dark:bg-zinc-800 py-6 rounded-[22px] font-black uppercase text-[10px] tracking-widest transition hover:bg-gray-200">Abort</button>
                <button type="submit" className="flex-grow bg-ino-red text-white py-6 rounded-[22px] font-black uppercase text-[10px] tracking-widest shadow-xl transition hover:bg-red-700">Commit Forge</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MENU ITEM MODAL */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[100] flex items-center justify-center p-6 animate-fade-in">
          <div className="bg-white dark:bg-zinc-900 rounded-[60px] p-16 max-w-xl w-full shadow-2xl border dark:border-zinc-800 relative overflow-hidden">
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-10 italic dark:text-white leading-none">Recalibrate Schematic</h2>
            <form onSubmit={handleUpdateItemSubmit} className="space-y-6">
              <input required className="w-full bg-gray-50 dark:bg-zinc-800 border-0 px-8 py-5 rounded-[22px] font-black uppercase text-xs outline-none focus:ring-2 focus:ring-ino-red text-black dark:text-white" value={editingItem.name} onChange={e => setEditingItem({...editingItem, name: e.target.value})} />
              <div className="grid grid-cols-2 gap-6">
                <input required type="number" step="0.01" className="w-full bg-gray-50 dark:bg-zinc-800 border-0 px-8 py-5 rounded-[22px] font-black text-xs outline-none focus:ring-2 focus:ring-ino-red text-black dark:text-white" value={editingItem.price} onChange={e => setEditingItem({...editingItem, price: parseFloat(e.target.value)})} />
                <select className="w-full bg-gray-50 dark:bg-zinc-800 border-0 px-8 py-5 rounded-[22px] font-black uppercase text-xs outline-none focus:ring-2 focus:ring-ino-red text-black dark:text-white" value={editingItem.category} onChange={e => setEditingItem({...editingItem, category: e.target.value as FoodCategory})}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex gap-6 pt-8">
                <button type="button" onClick={() => setEditingItem(null)} className="flex-grow bg-gray-100 dark:bg-zinc-800 py-6 rounded-[22px] font-black uppercase text-[10px] tracking-widest transition hover:bg-gray-200 text-gray-400">Abort</button>
                <button type="submit" className="flex-grow bg-ino-yellow text-red-900 py-6 rounded-[22px] font-black uppercase text-[10px] tracking-widest shadow-xl shadow-yellow-500/10 transition hover:bg-yellow-400">Commit Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
