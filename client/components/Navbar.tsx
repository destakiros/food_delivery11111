
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
    <nav className="bg-white dark:bg-zinc-900 shadow-sm sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-[1800px] mx-auto px-6 lg:px-12">
        <div className="flex justify-between h-24">
          <div className="flex items-center gap-12">
            <button onClick={onNavToLanding} className="flex items-center gap-3 group">
              <div className="w-12 h-12 bg-ino-red rounded-[18px] flex items-center justify-center text-ino-yellow font-black text-2xl border-2 border-ino-yellow shadow-xl group-hover:rotate-12 transition duration-500">
                <i className="ph-fill ph-rocket"></i>
              </div>
              <span className="text-2xl font-black text-ino-red tracking-tighter uppercase italic leading-none flex flex-col">
                IN-N-OUT <span className="text-gray-900 dark:text-white text-xs tracking-[0.4em] not-italic font-black -mt-1">LOGISTICS</span>
              </span>
            </button>
            <div className="hidden lg:flex gap-8">
              <button onClick={onNavToMenu} className="text-[10px] font-black text-gray-400 dark:text-gray-500 hover:text-ino-red uppercase tracking-[0.3em] transition">Kitchen Manifest</button>
              <button onClick={onNavToSupport} className="text-[10px] font-black text-gray-400 dark:text-gray-500 hover:text-ino-red uppercase tracking-[0.3em] transition">Support relay</button>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-8">
            <label className="ui-switch hidden sm:block">
              <input type="checkbox" checked={isDarkMode} onChange={() => setIsDarkMode(!isDarkMode)} />
              <div className="slider"><div className="circle"></div></div>
            </label>

            <div className="relative">
              <button onClick={toggleNotify} className="p-3 text-gray-400 hover:text-ino-red transition relative">
                <i className={`ph-bold ph-bell text-2xl ${unreadCount > 0 ? 'animate-pulse text-ino-red' : ''}`}></i>
                {unreadCount > 0 && <span className="absolute top-2.5 right-2.5 bg-ino-yellow w-3 h-3 rounded-full border-2 border-white dark:border-zinc-900 shadow-sm"></span>}
              </button>
              {isNotifyOpen && (
                <div className="absolute right-0 mt-5 w-96 bg-white dark:bg-zinc-800 rounded-[32px] shadow-2xl border dark:border-zinc-700 overflow-hidden animate-fade-in z-50">
                  <div className="p-6 border-b dark:border-zinc-700 bg-gray-50/50 dark:bg-zinc-900/50 flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-widest dark:text-white italic">Protocol Updates</span>
                    <button onClick={() => setIsNotifyOpen(false)} className="text-gray-400 hover:text-ino-red"><i className="ph-bold ph-x"></i></button>
                  </div>
                  <div className="max-h-80 overflow-y-auto no-scrollbar">
                    {currentUser?.notifications.length ? currentUser.notifications.map(n => (
                      <div key={n.id} className="p-6 border-b dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700 transition">
                        <p className="text-xs font-bold text-gray-800 dark:text-gray-200 leading-relaxed mb-1">{n.message}</p>
                        <span className="text-[9px] font-black text-gray-300 uppercase tracking-tighter">{n.timestamp}</span>
                      </div>
                    )) : <div className="p-16 text-center text-gray-300 italic text-[10px] uppercase font-black">No Active Relays Found</div>}
                  </div>
                  <button onClick={() => { onNavToOrders?.(); setIsNotifyOpen(false); }} className="w-full p-4 text-[9px] font-black text-ino-red uppercase bg-gray-50 dark:bg-zinc-900 tracking-[0.3em] hover:bg-red-50 transition">View Full History</button>
                </div>
              )}
            </div>

            <button onClick={onNavToTray} className="p-3 text-gray-400 hover:text-ino-red transition relative">
              <i className="ph-bold ph-tray text-2xl"></i>
              {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-ino-red text-white text-[9px] px-2 py-0.5 rounded-full font-black shadow-lg shadow-red-500/20">{cartCount}</span>}
            </button>

            {currentUser ? (
              <div className="flex items-center gap-4 ml-4 pl-4 border-l dark:border-zinc-800">
                <button onClick={onNavToProfile} className="flex flex-col items-end group text-right hidden sm:flex">
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1 group-hover:text-ino-red transition">Operative</span>
                  <span className="text-xs font-black uppercase italic dark:text-white transition group-hover:text-ino-red">{currentUser.name.split(' ')[0]}</span>
                </button>
                <div className="flex gap-2">
                  {currentUser.role === 'admin' && (
                    <button onClick={onNavToAdmin} className="w-12 h-12 rounded-2xl bg-ino-red/10 flex items-center justify-center text-ino-red hover:bg-ino-red hover:text-white transition shadow-sm">
                      <i className="ph-bold ph-shield-chevron text-xl"></i>
                    </button>
                  )}
                  <button onClick={onLogout} className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-zinc-800 flex items-center justify-center text-gray-400 hover:text-ino-red transition border dark:border-zinc-700 shadow-sm">
                    <i className="ph-bold ph-power text-xl"></i>
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={onNavToAuth} className="bg-ino-red text-white px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-red-700 transition shadow-2xl shadow-red-500/20 active:scale-95">Station Login</button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
