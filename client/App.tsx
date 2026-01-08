
import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { OrderProvider } from './context/OrderContext';
import { ToastProvider, useToast } from './context/ToastContext';
import { MenuProvider } from './context/MenuContext';
import Navbar from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { MenuPage } from './pages/MenuPage';
import { TrayPage } from './pages/TrayPage';
import { SupportPage } from './pages/SupportPage';
import { AboutPage } from './pages/AboutPage';
import { ProfilePage } from './pages/ProfilePage';
import { OrderTrackerPage } from './pages/OrderTrackerPage';
import { LoadingSpinner } from './components/LoadingSpinner';
import Auth from './components/Auth';
import { AdminDashboard } from './pages/admin/Dashboard';
import { AppView, Order } from './types';

const Router: React.FC = () => {
  const { currentUser, login, register, logout } = useAuth();
  const { showToast } = useToast();
  const [view, setView] = useState<AppView>('home');
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  const navigate = (v: AppView, params?: any) => {
    setIsLoading(true);
    setAuthError('');
    if (v === 'tracker' && params?.order) {
      setActiveOrder(params.order);
    }
    // Simulate high-end system transition
    setTimeout(() => {
      setView(v);
      setIsLoading(false);
      window.scrollTo(0, 0);
    }, 600);
  };

  const handleLogin = (email: string, pass: string) => {
    setIsLoading(true);
    setAuthError('');
    
    setTimeout(() => {
      if (login(email, pass)) {
        showToast("Access Granted: Welcome back, Operative.", "success");
        navigate(email === 'admin@gmail.com' ? 'admin' : 'menu');
      } else {
        setIsLoading(false);
        const errorMsg = "Credentials mismatch. Access denied to Hub Terminal.";
        setAuthError(errorMsg);
        showToast(errorMsg, "error");
      }
    }, 1000);
  };

  const handleRegister = (name: string, email: string, phone: string, pass: string) => {
    setIsLoading(true);
    setTimeout(() => {
      register(name, email, phone, pass);
      showToast("Registry Committed: New identity established.", "success");
      navigate('menu');
    }, 1000);
  };

  const handleLogout = () => {
    logout();
    showToast("Session Terminated: Goodbye.", "info");
    navigate('home');
  };

  const renderView = () => {
    if (view === 'admin' && currentUser?.role === 'admin') return <AdminDashboard onBack={() => navigate('home')} />;
    if (view === 'menu') return <MenuPage onNavToLogin={() => navigate('login')} onTrackOrder={(order) => navigate('tracker', { order })} initialHistory={false} />;
    if (view === 'orders') return <MenuPage onNavToLogin={() => navigate('login')} onTrackOrder={(order) => navigate('tracker', { order })} initialHistory={true} />;
    if (view === 'tray') return <TrayPage onExploreMenu={() => navigate('menu')} onNavToLogin={() => navigate('login')} onOrderSuccess={() => navigate('orders')} />;
    if (view === 'support') return <SupportPage />;
    if (view === 'about') return <AboutPage />;
    if (view === 'tracker' && activeOrder) return <OrderTrackerPage order={activeOrder} onBack={() => navigate('orders')} />;
    if (view === 'profile' && currentUser) return <ProfilePage onBack={() => navigate('home')} />;
    if (view === 'login') return <Auth mode="login" setMode={(m) => setView(m as any)} onLogin={handleLogin} onRegister={() => {}} onBack={() => navigate('home')} loginError={authError} />;
    if (view === 'register') return <Auth mode="register" setMode={(m) => setView(m as any)} onLogin={() => {}} onRegister={handleRegister} onBack={() => navigate('home')} loginError={authError} />;
    return <HomePage onStart={() => navigate('menu')} onViewTray={() => navigate('tray')} />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfcfc] dark:bg-zinc-950 transition-colors duration-300 overflow-x-hidden">
      {isLoading && <LoadingSpinner />}
      
      <Navbar 
        currentUser={currentUser} 
        onLogout={handleLogout} 
        onNavToAuth={() => navigate('login')} 
        onNavToLanding={() => navigate('home')}
        onNavToMenu={() => navigate('menu')}
        onNavToAdmin={() => navigate('admin')}
        onNavToOrders={() => navigate('orders')}
        onNavToTray={() => navigate('tray')}
        onNavToSupport={() => navigate('support')}
        onNavToProfile={() => navigate('profile')}
      />
      
      <main className="flex-grow transition-opacity duration-300">
        <div className={isLoading ? 'opacity-0' : 'opacity-100'}>
          {renderView()}
        </div>
      </main>

      <footer className="bg-gray-950 text-white py-20 border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-4 mb-8 cursor-pointer group" onClick={() => navigate('about')}>
            <div className="w-12 h-12 bg-ino-red rounded-[18px] flex items-center justify-center text-ino-yellow font-black text-2xl border-2 border-ino-yellow/40 shadow-xl group-hover:rotate-12 transition duration-500">
               <i className="ph-fill ph-rocket"></i>
            </div>
            <div className="text-3xl font-black text-ino-red tracking-tighter uppercase italic">IN <span className="text-ino-yellow">N</span> OUT</div>
          </div>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.5em] mb-12 italic">Precision Logistics • Superior Taste • Hub Alpha-01</p>
          <div className="flex flex-wrap justify-center gap-12 mb-16 text-[10px] font-black uppercase tracking-[0.3em] text-white/30">
            <button onClick={() => navigate('home')} className="hover:text-ino-red transition">Terminal Home</button>
            <button onClick={() => navigate('menu')} className="hover:text-ino-red transition">Kitchen Manifest</button>
            <button onClick={() => navigate('about')} className="hover:text-ino-red transition">Project Specs</button>
            <button onClick={() => navigate('support')} className="hover:text-ino-red transition">Relay Support</button>
          </div>
          <p className="text-gray-800 text-[9px] font-black uppercase tracking-widest leading-loose">
            © 2025 In-N-Out Logistics Portal. Developed at Admas University • CS Dep.<br/>
            All assets are mock-simulations for academic evaluation.
          </p>
          <button onClick={() => navigate('login')} className="mt-16 text-[9px] text-white/5 hover:text-ino-red/40 uppercase tracking-[0.8em] font-black transition">Root Access</button>
        </div>
      </footer>
    </div>
  );
};

const App: React.FC = () => (
  <AuthProvider>
    <ToastProvider>
      <OrderProvider>
        <MenuProvider>
          <CartProvider>
            <Router />
          </CartProvider>
        </MenuProvider>
      </OrderProvider>
    </ToastProvider>
  </AuthProvider>
);

export default App;
