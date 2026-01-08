
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Order } from '../types';
import { useToast } from '../context/ToastContext';

interface OrderTrackerPageProps {
  order: Order;
  onBack: () => void;
}

export const OrderTrackerPage: React.FC<OrderTrackerPageProps> = ({ order, onBack }) => {
  const { showToast } = useToast();
  const [eta, setEta] = useState(25);
  const [aiReport, setAiReport] = useState('Initializing signal connection...');
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Simulated ETA decrement
  useEffect(() => {
    const timer = setInterval(() => {
      setEta(prev => (prev > 1 ? prev - 1 : 1));
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const getAiReport = async () => {
    setIsAiLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `You are a professional logistics dispatcher for "In-N-Out Eats". 
        The current order #${order.id} for user ${order.userName} is in status "${order.status}". 
        The ETA is roughly ${eta} minutes.
        Provide a very short, professional, tech-focused dispatch report for the user. 
        Keep it under 30 words. Use logistics terminology.`,
      });
      setAiReport(response.text || 'Logistics signal stable. Proceeding as planned.');
    } catch (e) {
      setAiReport('Logistics link offline. Operational status: STABLE.');
    } finally {
      setIsAiLoading(false);
    }
  };

  useEffect(() => {
    getAiReport();
  }, [order.status]);

  const steps = [
    { label: 'Confirmed', status: 'Approved' },
    { label: 'Preparing', status: 'Preparing' },
    { label: 'In Transit', status: 'Out for Delivery' },
    { label: 'Arrival', status: 'Delivered' }
  ];

  const currentStepIndex = steps.findIndex(s => s.status === order.status);
  const progressPercent = order.status === 'Delivered' ? 100 : (currentStepIndex + 1) * 25;

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-12 animate-fade-in min-h-screen">
      <div className="flex items-center gap-8 mb-12">
        <button onClick={onBack} className="w-14 h-14 bg-white dark:bg-zinc-900 rounded-[22px] shadow-xl flex items-center justify-center hover:bg-ino-red hover:text-white transition duration-500">
          <i className="ph-bold ph-arrow-left text-xl"></i>
        </button>
        <div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic leading-none">LOGISTICS <span className="text-ino-red">TRACKER</span></h1>
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.4em] mt-2">Active Tracking Node: #{order.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
        {/* Left Column: Map & Status */}
        <div className="xl:col-span-2 space-y-8">
          <div className="bg-white dark:bg-zinc-900 rounded-[50px] overflow-hidden shadow-2xl border dark:border-zinc-800 h-[600px] relative group">
            {/* Map Simulation - Using a styled iframe for professional look */}
            <iframe 
              className="w-full h-full grayscale-[0.3] brightness-[0.8] contrast-[1.2] invert dark:invert-0"
              frameBorder="0" 
              scrolling="no" 
              marginHeight={0} 
              marginWidth={0} 
              src={`https://maps.google.com/maps?q=9.0227,38.7460&z=14&output=embed&t=m`}
            ></iframe>
            
            {/* Map Overlay UI */}
            <div className="absolute inset-0 pointer-events-none p-10 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className="bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl p-6 rounded-[32px] border dark:border-white/10 shadow-2xl pointer-events-auto flex items-center gap-6">
                   <div className="w-16 h-16 bg-ino-red rounded-2xl flex items-center justify-center text-white text-3xl animate-pulse">
                     <i className="ph-bold ph-moped"></i>
                   </div>
                   <div>
                     <span className="text-[9px] font-black uppercase text-ino-red tracking-widest block mb-1">Signal Strength</span>
                     <div className="flex gap-1">
                        {[1,2,3,4,5].map(i => <div key={i} className={`w-1.5 h-4 rounded-full ${i < 5 ? 'bg-ino-red' : 'bg-gray-200'}`}></div>)}
                     </div>
                   </div>
                </div>
                
                <div className="bg-black/95 text-white p-6 rounded-[32px] border border-white/10 shadow-2xl pointer-events-auto">
                   <span className="text-[9px] font-black uppercase tracking-[0.4em] opacity-40 block mb-2">Estimated Arrival</span>
                   <div className="text-4xl font-black italic tracking-tighter leading-none">{eta} <span className="text-xs uppercase not-italic opacity-40">Min</span></div>
                </div>
              </div>

              <div className="flex justify-center">
                 <div className="bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl p-8 rounded-[40px] border dark:border-white/10 shadow-2xl pointer-events-auto w-full max-w-2xl">
                    <div className="flex justify-between items-center mb-6">
                       <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Logistics Pipeline</span>
                       <span className="text-[10px] font-black uppercase text-ino-red italic">Live Stream • Stable</span>
                    </div>
                    <div className="relative h-2 w-full bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                       <div className="absolute left-0 top-0 h-full bg-ino-red transition-all duration-1000 ease-in-out" style={{ width: `${progressPercent}%` }}></div>
                    </div>
                    <div className="flex justify-between mt-4">
                       {steps.map((s, i) => (
                         <div key={i} className={`flex flex-col items-center ${i <= currentStepIndex ? 'text-ino-red' : 'text-gray-300'}`}>
                            <div className={`w-3 h-3 rounded-full mb-2 ${i <= currentStepIndex ? 'bg-ino-red shadow-[0_0_15px_rgba(214,40,40,0.5)]' : 'bg-gray-200'}`}></div>
                            <span className="text-[8px] font-black uppercase tracking-widest">{s.label}</span>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: AI Dispatch & Order Details */}
        <div className="space-y-8">
           <div className="bg-zinc-950 text-white p-10 rounded-[50px] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-ino-red/10 rounded-full blur-[60px]"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-ino-red rounded-xl flex items-center justify-center text-2xl">
                    <i className="ph-fill ph-headset"></i>
                  </div>
                  <div>
                    <h3 className="text-xl font-black uppercase tracking-tighter italic leading-none">AI Dispatch</h3>
                    <span className="text-[9px] font-black uppercase tracking-widest text-ino-red">Logistics Relay Center</span>
                  </div>
                </div>
                
                <div className="bg-white/5 p-6 rounded-[32px] border border-white/5 mb-8">
                  {isAiLoading ? (
                    <div className="flex gap-2 p-4">
                      <div className="w-2 h-2 bg-ino-red rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-ino-red rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-2 h-2 bg-ino-red rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    </div>
                  ) : (
                    <p className="text-xs font-bold leading-relaxed italic text-gray-300">"{aiReport}"</p>
                  )}
                </div>

                <button 
                  onClick={getAiReport} 
                  className="w-full bg-white/5 hover:bg-white/10 text-white py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest border border-white/10 transition"
                >
                  Refresh Signal
                </button>
              </div>
           </div>

           <div className="bg-white dark:bg-zinc-900 p-10 rounded-[50px] border dark:border-zinc-800 shadow-xl">
              <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-widest italic mb-8">Payload Summary</h3>
              <div className="space-y-4 mb-10">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs font-black uppercase italic">
                    <span className="text-gray-400">{item.quantity}x {item.name}</span>
                    <span className="dark:text-white">${(item.selectedPrice * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t dark:border-zinc-800 pt-8 flex justify-between items-center">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Surcharge Incl.</span>
                <span className="text-3xl font-black text-ino-red italic tracking-tighter">${order.totalPrice.toFixed(2)}</span>
              </div>
           </div>

           <div className="p-8 bg-gray-50 dark:bg-zinc-800/50 rounded-[40px] border dark:border-zinc-800 text-center">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 italic">Support Channel</p>
              <p className="text-xs font-black dark:text-white uppercase">+251-911-000-000</p>
           </div>
        </div>
      </div>
    </div>
  );
};
