
import React, { useState } from 'react';
import { Order, User, FoodItem, OrderStatus, FoodCategory } from '../types';
import { CATEGORIES } from '../constants';

interface AdminPanelProps {
  orders: Order[];
  users: User[];
  menu: FoodItem[];
  onUpdateOrder: (id: string, status: OrderStatus) => void;
  onAddMenuItem: (item: FoodItem) => void;
  onDeleteMenuItem: (id: string) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  orders, users, menu, onUpdateOrder, onAddMenuItem, onDeleteMenuItem 
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'users' | 'menu'>('orders');
  const [showAddMenu, setShowAddMenu] = useState(false);
  // Fix: changed default category to 'Burger' to match FoodCategory type definition in types.ts
  const [newItem, setNewItem] = useState<Partial<FoodItem>>({ category: 'Burger' });

  const stats = {
    pending: orders.filter(o => o.status === 'Pending').length,
    approved: orders.filter(o => o.status === 'Approved').length,
    cancelled: orders.filter(o => o.status === 'Cancelled').length,
    revenue: orders.filter(o => o.status === 'Approved').reduce((acc, o) => acc + o.totalPrice, 0)
  };

  const handleAddMenuSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name || !newItem.price || !newItem.image) return;
    onAddMenuItem({
      ...newItem as FoodItem,
      id: Math.random().toString(36).substr(2, 9),
    });
    setShowAddMenu(false);
    // Fix: reset default category to 'Burger' to match FoodCategory type definition in types.ts
    setNewItem({ category: 'Burger' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm font-semibold mb-2">Pending Orders</p>
          <p className="text-3xl font-extrabold text-yellow-500">{stats.pending}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm font-semibold mb-2">Approved</p>
          <p className="text-3xl font-extrabold text-green-500">{stats.approved}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm font-semibold mb-2">Total Users</p>
          <p className="text-3xl font-extrabold text-blue-500">{users.length}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm font-semibold mb-2">Total Revenue</p>
          <p className="text-3xl font-extrabold text-red-600">${stats.revenue.toFixed(2)}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-8 space-x-8">
        {['orders', 'users', 'menu'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`pb-4 px-2 font-bold text-sm uppercase transition ${activeTab === tab ? 'border-b-2 border-red-600 text-red-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            Manage {tab}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase">Customer</th>
                  <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase">Items</th>
                  <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase">Total</th>
                  <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                  <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map(order => (
                  <tr key={order.id}>
                    <td className="px-8 py-6">
                      <div className="font-bold text-gray-900">{order.userName}</div>
                      <div className="text-xs text-gray-400">{order.timestamp}</div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-sm text-gray-600">
                        {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                      </div>
                    </td>
                    <td className="px-8 py-6 font-bold text-gray-900">${order.totalPrice.toFixed(2)}</td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                        order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                        order.status === 'Approved' ? 'bg-green-100 text-green-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      {order.status === 'Pending' ? (
                        <div className="flex gap-2">
                          <button 
                            onClick={() => onUpdateOrder(order.id, 'Approved')}
                            className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-green-700 transition"
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => onUpdateOrder(order.id, 'Cancelled')}
                            className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-700 transition"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs italic">Completed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Users Table */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl shadow-sm border overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase">Name</th>
                <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase">Email</th>
                <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase">Phone</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map(user => (
                <tr key={user.id}>
                  <td className="px-8 py-6 font-bold text-gray-900">{user.name}</td>
                  <td className="px-8 py-6 text-gray-600">{user.email}</td>
                  <td className="px-8 py-6 text-gray-600">{user.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Menu Management */}
      {activeTab === 'menu' && (
        <div>
          <div className="flex justify-end mb-6">
            <button 
              onClick={() => setShowAddMenu(true)}
              className="bg-red-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-red-700 transition flex items-center gap-2"
            >
              + Add New Item
            </button>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase">Item</th>
                  <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase">Category</th>
                  <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase">Price</th>
                  <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {menu.map(item => (
                  <tr key={item.id}>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <img src={item.image} className="w-12 h-12 rounded-lg object-cover" />
                        <span className="font-bold text-gray-900">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-gray-600">{item.category}</td>
                    <td className="px-8 py-6 font-bold">${item.price.toFixed(2)}</td>
                    <td className="px-8 py-6">
                      <button 
                        onClick={() => onDeleteMenuItem(item.id)}
                        className="text-red-600 hover:text-red-800 font-bold text-xs"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Menu Modal */}
      {showAddMenu && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">Add Menu Item</h2>
            <form onSubmit={handleAddMenuSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Item Name</label>
                <input 
                  required
                  type="text" 
                  value={newItem.name || ''} 
                  onChange={e => setNewItem({...newItem, name: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Description</label>
                <textarea 
                  required
                  value={newItem.description || ''} 
                  onChange={e => setNewItem({...newItem, description: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-red-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Price ($)</label>
                  <input 
                    required
                    type="number" 
                    step="0.01"
                    value={newItem.price || ''} 
                    onChange={e => setNewItem({...newItem, price: parseFloat(e.target.value)})}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Category</label>
                  <select 
                    value={newItem.category}
                    onChange={e => setNewItem({...newItem, category: e.target.value as FoodCategory})}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-red-500"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Image URL</label>
                <input 
                  required
                  type="url" 
                  value={newItem.image || ''} 
                  onChange={e => setNewItem({...newItem, image: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-red-500"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowAddMenu(false)}
                  className="flex-grow bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-grow bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 shadow-lg shadow-red-200"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
