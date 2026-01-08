
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
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);

    // Native Browser Notification
    if (Notification.permission === 'granted') {
      new Notification("In N Out Update", {
        body: message,
        icon: 'https://cdn-icons-png.flaticon.com/512/1037/1037762.png'
      });
    }
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-20 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
        {toasts.map(toast => (
          <div 
            key={toast.id}
            className={`pointer-events-auto px-6 py-4 rounded-2xl shadow-2xl border flex items-center gap-3 animate-slide-in-right transform transition-all duration-300 ${
              toast.type === 'success' ? 'bg-green-600 border-green-500 text-white' :
              toast.type === 'error' ? 'bg-red-600 border-red-500 text-white' :
              toast.type === 'warning' ? 'bg-yellow-500 border-yellow-400 text-white' :
              'bg-blue-600 border-blue-500 text-white'
            }`}
          >
            <span className="font-bold">{toast.message}</span>
            <button 
              onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
              className="ml-4 opacity-70 hover:opacity-100"
            >
              ✕
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
