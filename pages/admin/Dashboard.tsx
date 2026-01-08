
import React, { useState, useRef } from 'react';
import { useOrders } from '../../context/OrderContext';
import { useAuth } from '../../context/AuthContext';
import { useMenu } from '../../context/MenuContext';
import { useToast } from '../../context/ToastContext';
import { CATEGORIES } from '../../constants';
import { FoodItem, FoodCategory, OrderStatus, Order } from '../../types';

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
          showToast("Visual Schematic Updated: New preview encoded.", "success");
        } else {
          setItemFormData({ ...itemFormData, image: base64String });
          showToast("Visual Data Prepared for Forge.", "success");
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
    showToast("Manifest Updated: New unit forged.", "success");
  };

  const handleUpdateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      updateFoodItem(editingItem.id, editingItem);
      setEditingItem(null);
      showToast("Schematic Recalibrated: Global manifest synchronized.", "success");
    }
  };

  const getOrderUser = (userId: string) => users.find(u => u.id === userId);

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

      {/* Stats */}
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
                        <button onClick={() => setSelectedOrder(order)} className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-zinc-800 text-gray-400 hover:text-ino-red transition flex items-center justify-center border dark:border-zinc-700">
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
                        className={`text-[9px] font-black uppercase rounded-xl px-5 py-2.5 outline-none border-0 shadow-sm ${
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
          <div>
            <div className="p-8 border-b dark:border-zinc-800 flex justify-between bg-gray-50/50 dark:bg-zinc-800/50 items-center">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Operative Manifest</span>
              <button onClick={() => setShowAdminModal(true)} className="bg-ino-red text-white px-10 py-4 rounded-3xl text-[10px] font-black uppercase tracking-widest shadow-lg transition hover:bg-red-700 flex items-center gap-2">
                <i className="ph-bold ph-shield-plus"></i> Enlist Admin
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
                             <div className="font-black uppercase italic dark:text-white mb-1">{u.name}</div>
                             <div className="text-[9px] text-gray-400 font-bold uppercase">{u.email}</div>
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
                          <button onClick={() => liftSuspension(u.id)} className="text-emerald-500 hover:scale-110 transition"><i className="ph-bold ph-shield-check text-xl"></i></button>
                        ) : (
                          <button onClick={() => suspendUser(u.id, "30 Days", "Audit")} className="text-red-500 hover:scale-110 transition"><i className="ph-bold ph-shield-slash text-xl"></i></button>
                        )}
                        {u.role !== 'admin' && (
                          <button onClick={() => deleteUser(u.id)} className="text-gray-200 dark:text-zinc-700 hover:text-ino-red transition"><i className="ph-bold ph-trash text-xl"></i></button>
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
            <div className="p-8 border-b dark:border-zinc-800 flex justify-between bg-gray-50/50 dark:bg-zinc-800/50 items-center">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Inventory Manifest</span>
              <button onClick={() => setShowItemModal(true)} className="bg-ino-red text-white px-10 py-4 rounded-3xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-red-700">
                + Forge Item
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead><tr className="bg-gray-50/50 dark:bg-zinc-800/50"><th className="px-12 py-8 text-[10px] font-black text-gray-400 uppercase">Schematic</th><th className="px-12 py-8 text-[10px] font-black text-gray-400 uppercase">Status</th><th className="px-12 py-8 text-[10px] font-black text-gray-400 uppercase">Valuation</th><th className="px-12 py-8 text-[10px] font-black text-gray-400 uppercase text-center">Protocol</th></tr></thead>
                <tbody className="divide-y dark:divide-zinc-800">
                  {foodItems.map(item => (
                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800 transition">
                      <td className="px-12 py-8 flex items-center gap-6 font-black uppercase italic dark:text-white">
                        <img src={item.image} className="w-16 h-16 rounded-[22px] object-cover shadow-xl border border-white/10" alt={item.name} />
                        <div>{item.name} <div className="text-[8px] text-gray-400">{item.category}</div></div>
                      </td>
                      <td className="px-12 py-8">
                        <button onClick={() => toggleAvailability(item.id)} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase border transition-colors ${item.isAvailable ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                          {item.isAvailable ? 'In Manifest' : 'Depleted'}
                        </button>
                      </td>
                      <td className="px-12 py-8 font-black text-2xl italic dark:text-white">${item.price.toFixed(2)}</td>
                      <td className="px-12 py-8 text-center flex justify-center gap-3">
                        <button onClick={() => setEditingItem(item)} className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-zinc-800 text-gray-400 hover:text-ino-yellow transition flex items-center justify-center border dark:border-zinc-700">
                          <i className="ph-bold ph-pencil-simple text-xl"></i>
                        </button>
                        <button onClick={() => deleteFoodItem(item.id)} className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-zinc-800 text-gray-400 hover:text-ino-red transition flex items-center justify-center border dark:border-zinc-700">
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

      {/* Order Details Modal (Same as before) */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[200] flex items-center justify-center p-6 animate-fade-in">
          <div className="bg-white dark:bg-zinc-900 rounded-[60px] max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl border dark:border-zinc-800 flex flex-col">
            <div className="p-10 border-b dark:border-zinc-800 flex justify-between items-center bg-gray-50/50 dark:bg-zinc-950/50">
              <h2 className="text-3xl font-black uppercase tracking-tighter italic leading-none text-gray-950 dark:text-white">DEPLOYMENT <span className="text-ino-red">DETAILS</span></h2>
              <button onClick={() => setSelectedOrder(null)} className="w-14 h-14 bg-white dark:bg-zinc-800 rounded-full flex items-center justify-center text-gray-400 hover:text-ino-red transition-all shadow-sm">
                <i className="ph-bold ph-x text-2xl"></i>
              </button>
            </div>
            <div className="flex-grow overflow-y-auto p-12 no-scrollbar">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 text-black dark:text-white">
                  <div>
                    <h3 className="text-xs font-black uppercase text-ino-red mb-4">Customer Intelligence</h3>
                    <p className="text-xl font-bold uppercase italic">{selectedOrder.userName}</p>
                    <p className="text-sm opacity-50">{getOrderUser(selectedOrder.userId)?.email}</p>
                    <p className="text-sm opacity-50 mt-1">{getOrderUser(selectedOrder.userId)?.phone}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase text-gray-400 mb-4">Deployment Node</h3>
                    <p className="text-sm font-bold uppercase italic">{selectedOrder.address || 'Central Hub'}</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* REFINED Item Editing Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[100] flex items-center justify-center p-6 animate-fade-in">
          <div className="bg-white dark:bg-zinc-900 rounded-[60px] p-16 max-w-xl w-full shadow-2xl border dark:border-zinc-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-ino-yellow/5 rounded-full blur-[60px]"></div>
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-10 italic dark:text-white leading-none">Recalibrate Schematic</h2>
            
            <form onSubmit={handleUpdateItem} className="space-y-6">
              
              {/* Visual Asset Uplink */}
              <div className="space-y-2 mb-6">
                 <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Visual Manifest (Click to Upload)</label>
                 <div 
                   onClick={() => editFileInputRef.current?.click()}
                   className="w-full h-44 rounded-3xl border-2 border-dashed border-gray-100 dark:border-zinc-800 flex flex-col items-center justify-center cursor-pointer hover:border-ino-yellow transition overflow-hidden bg-gray-50 dark:bg-zinc-900/50 group relative"
                 >
                   <img src={editingItem.image} className="w-full h-full object-cover transition-opacity group-hover:opacity-40" alt="Preview" />
                   <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <i className="ph-bold ph-camera-rotate text-3xl text-ino-yellow mb-2"></i>
                      <span className="text-[9px] font-black uppercase text-ino-yellow tracking-widest">Update Visual Asset</span>
                   </div>
                 </div>
                 <input type="file" ref={editFileInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageFileChange(e, true)} />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Schematic Label</label>
                <input required className="w-full bg-gray-50 dark:bg-zinc-800 border-0 px-8 py-5 rounded-[22px] font-black uppercase text-xs outline-none focus:ring-2 focus:ring-ino-red text-black dark:text-white" value={editingItem.name} onChange={e => setEditingItem({...editingItem, name: e.target.value})} />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Valuation ($)</label>
                  <input required type="number" step="0.01" className="w-full bg-gray-50 dark:bg-zinc-800 border-0 px-8 py-5 rounded-[22px] font-black uppercase text-xs outline-none focus:ring-2 focus:ring-ino-red text-black dark:text-white" value={editingItem.price} onChange={e => setEditingItem({...editingItem, price: parseFloat(e.target.value)})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Manifest Category</label>
                  <select className="w-full bg-gray-50 dark:bg-zinc-800 border-0 px-8 py-5 rounded-[22px] font-black uppercase text-xs outline-none focus:ring-2 focus:ring-ino-red text-black dark:text-white" value={editingItem.category} onChange={e => setEditingItem({...editingItem, category: e.target.value as FoodCategory})}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Tactical Description</label>
                <textarea className="w-full bg-gray-50 dark:bg-zinc-800 border-0 px-8 py-5 rounded-[22px] font-bold text-xs outline-none focus:ring-2 focus:ring-ino-red text-black dark:text-white h-24 resize-none" value={editingItem.description} onChange={e => setEditingItem({...editingItem, description: e.target.value})} />
              </div>
              
              <div className="flex gap-6 pt-6">
                <button type="button" onClick={() => setEditingItem(null)} className="flex-grow bg-gray-100 dark:bg-zinc-800 py-6 rounded-[22px] font-black uppercase text-[10px] tracking-widest transition hover:bg-gray-200 text-gray-400">Abort Changes</button>
                <button type="submit" className="flex-grow bg-ino-yellow text-red-900 py-6 rounded-[22px] font-black uppercase text-[10px] tracking-widest shadow-xl shadow-yellow-500/10 transition hover:bg-yellow-400">Commit Recalibration</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modals for Recruitment and Forging (Same Logic) */}
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
                <button type="submit" className="flex-grow bg-ino-red text-white py-6 rounded-[22px] font-black uppercase text-[10px]">Commit Recruitment</button>
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
                <button type="submit" className="flex-grow bg-ino-red text-white py-6 rounded-[22px] font-black uppercase text-[10px]">Commit Forge</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
