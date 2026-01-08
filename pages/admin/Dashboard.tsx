
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
  const [showItemModal, setShowItemModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  // Form States
  const [itemFormData, setItemFormData] = useState<Partial<FoodItem>>({ 
    name: '', 
    price: 0, 
    category: 'Burger', 
    description: '',
    image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&q=80&w=800'
  });
  
  const [adminFormData, setAdminFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  const stats = {
    active: orders.filter(o => !['Delivered', 'Cancelled'].includes(o.status)).length,
    revenue: orders.filter(o => o.status === 'Delivered').reduce((acc, o) => acc + o.totalPrice, 0),
    users: users.length,
    admins: users.filter(u => u.role === 'admin').length,
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>, isEditing: boolean) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast("Payload Error: Image exceeds 2MB limit for storage.", "error");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (isEditing && editingItem) {
          setEditingItem({ ...editingItem, image: base64String });
        } else {
          setItemFormData({ ...itemFormData, image: base64String });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    addUser({ ...adminFormData, role: 'admin' });
    setShowAdminModal(false);
    setAdminFormData({ name: '', email: '', phone: '', password: '' });
    showToast("Authority Expanded: New Admin enlisted.", "success");
  };

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    addFoodItem(itemFormData as Omit<FoodItem, 'id'>);
    setShowItemModal(false);
    setItemFormData({ name: '', price: 0, category: 'Burger', description: '', image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&q=80&w=800' });
    showToast("Manifest Updated: Unit added.", "success");
  };

  const handleUpdateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      updateFoodItem(editingItem.id, editingItem);
      setEditingItem(null);
      showToast("Schematic Recalibrated.", "success");
    }
  };

  const getOrderUser = (userId: string): User | undefined => users.find(u => u.id === userId);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 min-h-screen animate-fade-in text-gray-900 dark:text-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-16">
        <div className="flex items-center gap-6">
          <button onClick={onBack} className="w-12 h-12 bg-gray-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center hover:bg-gray-200 transition">
            <i className="ph-bold ph-arrow-left"></i>
          </button>
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter italic leading-none">ADMIN <span className="text-ino-red">CONSOLE</span></h1>
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-2">Logistics Command Center Node Alpha</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
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

      {/* Tabs */}
      <div className="flex gap-10 border-b dark:border-zinc-800 mb-12 overflow-x-auto no-scrollbar">
        {['Logistics', 'Operatives', 'Manifest', 'Intelligence'].map((label, idx) => (
          <button 
            key={label} 
            onClick={() => setActiveTab(['orders', 'users', 'menu', 'analytics'][idx] as any)} 
            className={`pb-6 text-[10px] font-black uppercase tracking-widest relative transition-colors ${activeTab === ['orders', 'users', 'menu', 'analytics'][idx] ? 'text-ino-red' : 'text-gray-400 dark:text-zinc-600'}`}
          >
            {label} {activeTab === ['orders', 'users', 'menu', 'analytics'][idx] && <div className="absolute bottom-0 left-0 w-full h-1 bg-ino-red"></div>}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="bg-white dark:bg-zinc-900 rounded-[50px] border dark:border-zinc-800 shadow-2xl overflow-hidden mb-20">
        {activeTab === 'orders' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="bg-gray-50/50 dark:bg-zinc-800/50"><th className="px-12 py-8 text-[10px] font-black text-gray-400 uppercase">Deployment</th><th className="px-12 py-8 text-[10px] font-black text-gray-400 uppercase">Protocol Status</th><th className="px-12 py-8 text-[10px] font-black text-gray-400 uppercase text-center">Operation</th></tr></thead>
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
                          <div className="text-xs font-black text-ino-red">#{order.id}</div>
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
             {/* User management content... */}
             <table className="w-full text-left">
                <tbody className="divide-y dark:divide-zinc-800">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800 transition">
                      <td className="px-12 py-10 flex items-center gap-4">
                         <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${u.role === 'admin' ? 'bg-ino-red text-white' : 'bg-gray-100 dark:bg-zinc-800 text-gray-400'}`}>
                           <i className={`ph-bold ${u.role === 'admin' ? 'ph-crown' : 'ph-user'}`}></i>
                         </div>
                         <div>
                            <div className="font-black uppercase italic dark:text-white leading-none mb-1">{u.name}</div>
                            <div className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">{u.email}</div>
                         </div>
                      </td>
                      <td className="px-12 py-10 text-center">
                         <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase ${u.status === 'Suspended' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>{u.status}</span>
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
                <tbody className="divide-y dark:divide-zinc-800">
                  {foodItems.map(item => (
                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800 transition">
                      <td className="px-12 py-8 flex items-center gap-6 font-black uppercase italic dark:text-white">
                        <img src={item.image} className="w-16 h-16 rounded-[22px] object-cover shadow-xl border border-white/10" alt={item.name} />
                        {item.name}
                      </td>
                      <td className="px-12 py-8 font-black text-2xl italic dark:text-white">${item.price.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
             </table>
          </div>
        )}
      </div>

      {/* FULL-SPECTRUM ORDER DETAILS MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[200] flex items-center justify-center p-4 sm:p-6 animate-fade-in">
          <div className="bg-white dark:bg-zinc-900 rounded-[40px] sm:rounded-[60px] max-w-5xl w-full max-h-[95vh] overflow-hidden shadow-2xl border dark:border-zinc-800 flex flex-col">
            
            {/* Modal Header */}
            <div className="p-8 sm:p-10 border-b dark:border-zinc-800 flex justify-between items-center bg-gray-50/50 dark:bg-zinc-950/50">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-ino-red rounded-2xl sm:rounded-3xl flex items-center justify-center text-white text-3xl shadow-xl shadow-red-500/20">
                  <i className="ph-bold ph-package"></i>
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter italic leading-none text-gray-950 dark:text-white">DEPLOYMENT <span className="text-ino-red">DETAILS</span></h2>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.4em] mt-2">Relay ID: #{selectedOrder.id} • {selectedOrder.timestamp}</p>
                </div>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="w-12 h-12 sm:w-14 sm:h-14 bg-white dark:bg-zinc-800 rounded-full flex items-center justify-center text-gray-400 hover:text-ino-red transition-all shadow-sm border dark:border-zinc-700">
                <i className="ph-bold ph-x text-2xl"></i>
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-8 sm:p-12 no-scrollbar">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12">
                
                {/* Left Section: Context & Directives */}
                <div className="space-y-10">
                  {/* Customer Block */}
                  <div className="bg-gray-50 dark:bg-zinc-800/30 p-8 rounded-[40px] border dark:border-zinc-800 shadow-inner">
                    <div className="flex items-center gap-3 mb-6">
                       <i className="ph-bold ph-user-focus text-ino-red text-xl"></i>
                       <span className="text-[9px] font-black uppercase text-gray-400 tracking-widest italic">Customer Intelligence</span>
                    </div>
                    <div className="flex items-center gap-5">
                       <div className="w-14 h-14 bg-white dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-gray-400 border dark:border-zinc-700">
                          <i className="ph-bold ph-id-badge text-2xl"></i>
                       </div>
                       <div>
                          <div className="text-xl font-black uppercase italic dark:text-white leading-none mb-1">{selectedOrder.userName}</div>
                          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                            {getOrderUser(selectedOrder.userId)?.email || 'Relay Channel Unknown'}
                          </div>
                          <div className="text-[10px] font-black text-ino-red uppercase tracking-widest mt-1">
                            {getOrderUser(selectedOrder.userId)?.phone || 'No Linked Phone'}
                          </div>
                       </div>
                    </div>
                  </div>

                  {/* Destination Block */}
                  <div className="bg-white dark:bg-zinc-800/30 p-8 rounded-[40px] border dark:border-zinc-800 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                       <i className="ph-bold ph-map-pin text-ino-red text-xl"></i>
                       <span className="text-[9px] font-black uppercase text-gray-400 tracking-widest italic">Deployment Node</span>
                    </div>
                    <div className="text-sm font-black dark:text-white uppercase italic leading-relaxed mb-6">
                      {selectedOrder.address || 'Standard Hub Node Alpha'}
                    </div>
                    {/* Visual Map Grounding */}
                    <div className="h-40 w-full rounded-[24px] overflow-hidden border dark:border-zinc-700 group relative">
                       <iframe 
                        className="w-full h-full grayscale invert dark:invert-0 opacity-40 group-hover:opacity-60 transition-opacity"
                        frameBorder="0" 
                        src={`https://maps.google.com/maps?q=${encodeURIComponent(selectedOrder.address || 'Addis Ababa')}&z=13&output=embed`}
                       ></iframe>
                       <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
                    </div>
                  </div>

                  {/* Directives Block */}
                  <div className="bg-ino-yellow/5 border-2 border-dashed border-ino-yellow/20 p-8 rounded-[40px]">
                    <div className="flex items-center gap-3 mb-4">
                       <i className="ph-bold ph-lightning text-ino-yellow text-xl"></i>
                       <span className="text-[9px] font-black uppercase text-gray-400 tracking-widest italic">Strategic Directives</span>
                    </div>
                    <p className="text-xs font-bold dark:text-gray-300 italic leading-relaxed">
                      "{selectedOrder.instructions || 'Standard operation protocol. No special instructions recorded.'}"
                    </p>
                  </div>
                </div>

                {/* Right Section: Payload Manifest */}
                <div className="bg-white dark:bg-zinc-950 p-8 sm:p-10 rounded-[48px] border dark:border-zinc-800 shadow-inner flex flex-col h-full">
                   <div className="flex justify-between items-center mb-8 pb-4 border-b dark:border-zinc-800">
                      <span className="text-[10px] font-black uppercase tracking-widest italic text-gray-400">Inventory Payload</span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-ino-red italic">{selectedOrder.items.length} Units</span>
                   </div>
                   
                   <div className="space-y-6 flex-grow overflow-y-auto no-scrollbar">
                      {selectedOrder.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-start gap-4 group">
                           <div className="flex gap-4">
                              <div className="w-10 h-10 bg-gray-50 dark:bg-zinc-900 rounded-xl flex items-center justify-center text-[10px] font-black text-gray-400 border dark:border-zinc-800 shrink-0">
                                {item.quantity}x
                              </div>
                              <div>
                                 <div className="text-xs font-black uppercase italic dark:text-white leading-none mb-1 group-hover:text-ino-red transition-colors">{item.name}</div>
                                 <div className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Size: {item.selectedSize || 'Standard'}</div>
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
                        <span>Payload Subtotal</span>
                        <span className="dark:text-white">${(selectedOrder.totalPrice - 2.99).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-[10px] font-black uppercase text-emerald-500 tracking-widest">
                        <span>Logistic Surcharge</span>
                        <span>$2.99</span>
                      </div>
                      <div className="flex justify-between items-end pt-6 border-t dark:border-zinc-800">
                        <span className="text-xl font-black uppercase italic dark:text-white tracking-tighter leading-none">Gross Total</span>
                        <span className="text-5xl font-black text-ino-red tracking-tighter italic leading-none">${selectedOrder.totalPrice.toFixed(2)}</span>
                      </div>
                   </div>
                </div>

              </div>
            </div>

            {/* Modal Footer: Action Protocols */}
            <div className="p-8 sm:p-10 border-t dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 flex flex-wrap gap-6 justify-between items-center">
               <div className="flex gap-4">
                  <button 
                    onClick={() => { updateOrderStatus(selectedOrder.id, 'Approved'); setSelectedOrder(null); }}
                    className="bg-emerald-600 text-white px-10 py-5 rounded-3xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-emerald-500/20 hover:bg-emerald-700 transition transform hover:-translate-y-1 active:scale-95"
                  >
                    Authorize Pipeline
                  </button>
                  <button 
                    onClick={() => { updateOrderStatus(selectedOrder.id, 'Cancelled'); setSelectedOrder(null); }}
                    className="bg-red-600 text-white px-10 py-5 rounded-3xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-red-500/20 hover:bg-red-700 transition transform hover:-translate-y-1 active:scale-95"
                  >
                    Decommission Order
                  </button>
               </div>
               
               <div className="flex items-center gap-4 bg-white dark:bg-zinc-800 p-2 rounded-2xl border dark:border-zinc-700 shadow-sm">
                  <span className="text-[9px] font-black uppercase text-gray-400 italic ml-2">Rapid Status Recalibrate:</span>
                  <select 
                    value={selectedOrder.status}
                    onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value as OrderStatus)}
                    className="bg-transparent border-none text-[10px] font-black uppercase py-2 px-4 rounded-xl outline-none text-ino-red cursor-pointer"
                  >
                    {['Pending', 'Approved', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
               </div>
            </div>

          </div>
        </div>
      )}

      {/* Existing Edit Modals ... */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[100] flex items-center justify-center p-6 animate-fade-in">
          <div className="bg-white dark:bg-zinc-900 rounded-[60px] p-16 max-w-xl w-full shadow-2xl border dark:border-zinc-800 relative overflow-hidden">
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-10 italic dark:text-white leading-none">Recalibrate Schematic</h2>
            <form onSubmit={handleUpdateItem} className="space-y-6">
              <input className="w-full bg-gray-50 dark:bg-zinc-800 px-8 py-5 rounded-[22px] font-black uppercase text-xs" value={editingItem.name} onChange={e => setEditingItem({...editingItem, name: e.target.value})} />
              <div className="flex gap-6">
                <button type="button" onClick={() => setEditingItem(null)} className="flex-grow bg-gray-100 dark:bg-zinc-800 py-6 rounded-[22px] font-black uppercase text-[10px]">Abort</button>
                <button type="submit" className="flex-grow bg-ino-yellow text-red-900 py-6 rounded-[22px] font-black uppercase text-[10px]">Commit</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAdminModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[100] flex items-center justify-center p-6 animate-fade-in">
          <div className="bg-white dark:bg-zinc-900 rounded-[60px] p-16 max-w-xl w-full shadow-2xl border dark:border-zinc-800">
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-10 italic dark:text-white">Authority Protocol</h2>
            <form onSubmit={handleCreateAdmin} className="space-y-6">
              <input required className="w-full bg-gray-50 dark:bg-zinc-800 px-8 py-5 rounded-[22px] font-black uppercase text-xs" placeholder="Full Identity Name" value={adminFormData.name} onChange={e => setAdminFormData({...adminFormData, name: e.target.value})} />
              <input required type="email" className="w-full bg-gray-50 dark:bg-zinc-800 px-8 py-5 rounded-[22px] font-black text-xs" placeholder="Relay Channel (Email)" value={adminFormData.email} onChange={e => setAdminFormData({...adminFormData, email: e.target.value})} />
              <input required type="password" className="w-full bg-gray-50 dark:bg-zinc-800 px-8 py-5 rounded-[22px] font-black text-xs" placeholder="Secure Pass-Key" value={adminFormData.password} onChange={e => setAdminFormData({...adminFormData, password: e.target.value})} />
              <div className="flex gap-6 pt-8">
                <button type="button" onClick={() => setShowAdminModal(false)} className="flex-grow bg-gray-100 dark:bg-zinc-800 py-6 rounded-[22px] font-black uppercase text-[10px]">Abort</button>
                <button type="submit" className="flex-grow bg-ino-red text-white py-6 rounded-[22px] font-black uppercase text-[10px]">Commit recruitment</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showItemModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[100] flex items-center justify-center p-6 animate-fade-in">
          <div className="bg-white dark:bg-zinc-900 rounded-[60px] p-16 max-w-xl w-full shadow-2xl border dark:border-zinc-800">
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-10 italic dark:text-white">Forge Manifest Item</h2>
            <form onSubmit={handleCreateItem} className="space-y-6">
              <div 
                   onClick={() => fileInputRef.current?.click()}
                   className="w-full h-40 rounded-3xl border-2 border-dashed border-gray-100 dark:border-zinc-800 flex flex-col items-center justify-center cursor-pointer bg-gray-50 dark:bg-zinc-900/50"
                 >
                   {itemFormData.image ? <img src={itemFormData.image} className="w-full h-full object-cover rounded-3xl" alt="Preview" /> : <span className="text-[10px] font-black uppercase text-gray-400">Upload Visual Schematic</span>}
              </div>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageFileChange(e, false)} />
              <input required className="w-full bg-gray-50 dark:bg-zinc-800 px-8 py-5 rounded-[22px] font-black uppercase text-xs" placeholder="Item Name" value={itemFormData.name} onChange={e => setItemFormData({...itemFormData, name: e.target.value})} />
              <div className="grid grid-cols-2 gap-6">
                <input required type="number" step="0.01" className="w-full bg-gray-50 dark:bg-zinc-800 px-8 py-5 rounded-[22px] font-black text-xs" placeholder="Price ($)" value={itemFormData.price} onChange={e => setItemFormData({...itemFormData, price: parseFloat(e.target.value)})} />
                <select className="w-full bg-gray-50 dark:bg-zinc-800 px-8 py-5 rounded-[22px] font-black uppercase text-xs" value={itemFormData.category} onChange={e => setItemFormData({...itemFormData, category: e.target.value as FoodCategory})}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <textarea required className="w-full bg-gray-50 dark:bg-zinc-800 px-8 py-5 rounded-[22px] font-bold text-xs h-24 resize-none" placeholder="Description..." value={itemFormData.description} onChange={e => setItemFormData({...itemFormData, description: e.target.value})} />
              <div className="flex gap-6">
                <button type="button" onClick={() => setShowItemModal(false)} className="flex-grow bg-gray-100 dark:bg-zinc-800 py-6 rounded-[22px] font-black uppercase text-[10px]">Abort</button>
                <button type="submit" className="flex-grow bg-ino-red text-white py-6 rounded-[22px] font-black uppercase text-[10px]">Commit forge</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
