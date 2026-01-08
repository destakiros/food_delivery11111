
import React, { createContext, useContext, useState, useCallback } from 'react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface ToastContextType {
  showToast: (message: string, type: Toast['type']) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: Toast['type']) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);

    // Native Browser Notification fallback
    if (Notification.permission === 'granted') {
      new Notification("In N Out Logistics", {
        body: message,
      });
    }
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return 'ph-check-circle';
      case 'error': return 'ph-warning-octagon';
      case 'warning': return 'ph-warning';
      default: return 'ph-info';
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-10 right-10 z-[300] flex flex-col gap-4 pointer-events-none">
        {toasts.map(toast => (
          <div 
            key={toast.id}
            className={`pointer-events-auto min-w-[320px] bg-white dark:bg-zinc-900 px-8 py-6 rounded-[32px] shadow-2xl border-2 flex items-center gap-5 animate-fade-in transition-all ${
              toast.type === 'success' ? 'border-emerald-500/20 text-emerald-600' :
              toast.type === 'error' ? 'border-ino-red/20 text-ino-red' :
              toast.type === 'warning' ? 'border-ino-yellow/20 text-yellow-600' :
              'border-blue-500/20 text-blue-600'
            }`}
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${
              toast.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-950/30' :
              toast.type === 'error' ? 'bg-red-50 dark:bg-red-950/30' :
              toast.type === 'warning' ? 'bg-yellow-50 dark:bg-yellow-950/30' :
              'bg-blue-50 dark:bg-blue-950/30'
            }`}>
              <i className={`ph-fill ${getIcon(toast.type)}`}></i>
            </div>
            <div className="flex-grow">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-1">{toast.type} relay</p>
              <p className="text-xs font-black uppercase italic leading-tight">{toast.message}</p>
            </div>
            <button 
              onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
              className="text-gray-300 hover:text-gray-900 dark:hover:text-white transition"
            >
              <i className="ph ph-x"></i>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};
