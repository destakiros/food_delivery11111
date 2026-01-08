
import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  currentUser: User | null;
  onLogout: () => void;
  onNavToAuth: () => void;
  onNavToLanding: () => void;
  onNavToMenu: () => void;
  onNavToAdmin?: () => void;
  onNavToOrders?: () => void;
  onNavToTray?: () => void;
  onNavToSupport?: () => void;
  // Fixed: Added onNavToProfile prop
  onNavToProfile?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  currentUser, onLogout, onNavToAuth, onNavToLanding, 
  onNavToMenu, onNavToAdmin, onNavToOrders, onNavToTray, onNavToSupport, onNavToProfile
}) => {
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);
  const { cart } = useCart();
  const { markNotificationsRead } = useAuth();
  
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const unreadCount = currentUser?.notifications.filter(n => !n.read).length || 0;

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleNotify = () => {
    if (!isNotifyOpen && unreadCount > 0) markNotificationsRead();
    setIsNotifyOpen(!isNotifyOpen);
  };

  return (
    <nav className="bg-white dark:bg-zinc-900 shadow-sm sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center gap-6">
            <button onClick={onNavToLanding} className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-ino-red rounded-full flex items-center justify-center text-ino-yellow font-bold text-lg border-2 border-ino-yellow shadow-md group-hover:rotate-12 transition">
                <i className="ph-fill ph-hamburger"></i>
              </div>
              <span className="text-xl font-black text-ino-red tracking-tighter uppercase italic">IN-N-OUT <span className="text-gray-900 dark:text-white">EATS</span></span>
            </button>
            <div className="hidden md:flex gap-6">
              <button onClick={onNavToMenu} className="text-[10px] font-black text-gray-400 dark:text-gray-500 hover:text-ino-red uppercase tracking-widest transition">Menu</button>
              <button onClick={onNavToSupport} className="text-[10px] font-black text-gray-400 dark:text-gray-500 hover:text-ino-red uppercase tracking-widest transition">Support</button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="ui-switch">
              <input type="checkbox" checked={isDarkMode} onChange={() => setIsDarkMode(!isDarkMode)} />
              <div className="slider"><div className="circle"></div></div>
            </label>

            <div className="relative">
              <button onClick={toggleNotify} className="p-2 text-gray-400 hover:text-ino-red transition relative">
                <i className={`ph-bold ph-bell text-2xl ${unreadCount > 0 ? 'animate-pulse text-ino-red' : ''}`}></i>
                {unreadCount > 0 && <span className="absolute top-1 right-1 bg-ino-yellow w-2 h-2 rounded-full border border-white"></span>}
              </button>
              {isNotifyOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-zinc-800 rounded-3xl shadow-2xl border dark:border-zinc-700 overflow-hidden animate-fade-in">
                  <div className="p-4 border-b dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900/50 flex justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest">Message Hub</span>
                    <button onClick={() => setIsNotifyOpen(false)}><i className="ph ph-x"></i></button>
                  </div>
                  <div className="max-h-60 overflow-y-auto no-scrollbar">
                    {currentUser?.notifications.length ? currentUser.notifications.map(n => (
                      <div key={n.id} className="p-4 border-b dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700 transition">
                        <p className="text-[11px] font-bold text-gray-800 dark:text-gray-200 leading-tight mb-1">{n.message}</p>
                        <span className="text-[8px] font-black text-gray-400 uppercase">{n.timestamp}</span>
                      </div>
                    )) : <div className="p-10 text-center text-gray-300 italic text-xs">No notifications.</div>}
                  </div>
                </div>
              )}
            </div>

            <button onClick={onNavToTray} className="p-2 text-gray-400 hover:text-ino-red transition relative">
              <i className="ph-bold ph-shopping-bag text-2xl"></i>
              {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-ino-red text-white text-[9px] px-1.5 py-0.5 rounded-full font-black">{cartCount}</span>}
            </button>

            {currentUser ? (
              <div className="flex items-center gap-4 ml-2">
                <button onClick={onNavToProfile} className="hidden md:block text-xs font-black uppercase italic dark:text-white hover:text-ino-red transition">{currentUser.name.split(' ')[0]}</button>
                <button onClick={onLogout} className="w-10 h-10 rounded-2xl bg-gray-50 dark:bg-zinc-800 flex items-center justify-center text-gray-400 hover:text-ino-red transition"><i className="ph-bold ph-sign-out text-xl"></i></button>
              </div>
            ) : (
              <button onClick={onNavToAuth} className="bg-ino-red text-white px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition">Sign In</button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;