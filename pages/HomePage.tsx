
import React from 'react';

interface HomePageProps {
  onStart: () => void;
  onViewTray?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onStart, onViewTray }) => (
  <div className="relative bg-white dark:bg-zinc-950 overflow-hidden min-h-screen flex flex-col items-center justify-center animate-fade-in">
    <div className="absolute inset-0 z-0 overflow-hidden">
      <img 
        src="https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&q=80&w=2000" 
        className="w-full h-full object-cover scale-110 animate-pulse-slow brightness-[0.55] contrast-[1.1] grayscale-[0.2]" 
        alt="Kitchen Showreel" 
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-white dark:to-zinc-950"></div>
      <div className="absolute top-[20%] left-[10%] w-96 h-96 bg-ino-red/20 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-ino-yellow/10 rounded-full blur-[120px] animate-pulse-slow"></div>
    </div>

    <div className="max-w-7xl mx-auto px-6 text-center relative z-10 py-24 md:py-32">
      <div className="inline-flex items-center gap-4 px-8 py-3.5 rounded-full bg-white/10 backdrop-blur-2xl border border-white/20 mb-12 animate-bounce-subtle shadow-2xl">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-ino-red animate-ping"></span>
          <span className="h-2.5 w-2.5 rounded-full bg-ino-yellow animate-pulse"></span>
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.6em] text-white">
          In-N-Out Terminal Beta-V4
        </span>
      </div>
      
      <h1 className="text-6xl md:text-[11rem] font-black text-white leading-none tracking-tighter uppercase mb-10 drop-shadow-[0_35px_35px_rgba(0,0,0,0.6)] italic">
        QUALITY <br/>
        <span className="text-ino-yellow underline decoration-ino-red decoration-[15px] underline-offset-[20px]">FIRST.</span>
      </h1>
      
      <p className="text-lg md:text-2xl text-white/95 mb-16 font-black max-w-4xl mx-auto uppercase tracking-[0.2em] italic drop-shadow-2xl opacity-90">
        FRESH BURGERS • STONE PIZZAS • ARTISAN SHAKES
      </p>

      <div className="flex flex-wrap justify-center gap-10 md:gap-20 mb-20 animate-fade-in delay-200">
        {[
          { img: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&q=80&w=400", label: "Gourmet Burgers" },
          { img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=400", label: "Stone Oven Pizza" },
          { img: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=400", label: "Artisan Drinks" }
        ].map((item, idx) => (
          <div key={idx} className="group flex flex-col items-center">
            <div className="w-24 h-24 md:w-36 md:h-36 rounded-3xl overflow-hidden border-4 border-ino-yellow/30 shadow-2xl transform transition-all duration-500 group-hover:scale-110 group-hover:border-ino-red group-hover:-rotate-3 relative">
              <img src={item.img} alt={item.label} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125" />
              <div className="absolute inset-0 bg-ino-red/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <span className="mt-6 text-[10px] font-black text-white/80 uppercase tracking-widest group-hover:text-ino-yellow transition-colors italic">{item.label}</span>
          </div>
        ))}
      </div>
      
      <div className="flex flex-col sm:flex-row gap-10 justify-center items-center">
        <button 
          onClick={onStart} 
          className="group relative bg-ino-red text-white text-lg px-20 py-8 rounded-[40px] font-black tracking-[0.3em] hover:bg-red-700 transition-all shadow-2xl shadow-red-500/40 uppercase transform hover:-translate-y-2 active:scale-95 flex items-center gap-4"
        >
          Initialize Manifest
          <i className="ph-bold ph-rocket-launch transition-transform group-hover:translate-x-2"></i>
        </button>
        
        <button 
          onClick={onViewTray} 
          className="px-12 py-8 rounded-[40px] font-black tracking-[0.3em] text-white bg-white/5 backdrop-blur-3xl border-2 border-white/20 hover:border-ino-yellow/50 transition-all uppercase text-md hover:bg-white/10 active:scale-95 group"
        >
          <span className="flex items-center gap-3">
            <i className="ph-bold ph-tray group-hover:scale-110 transition-transform"></i>
            Check Inventory
          </span>
        </button>
      </div>
    </div>
    
    <div className="absolute bottom-10 text-center w-full">
       <p className="text-[9px] font-black text-gray-400 dark:text-zinc-700 uppercase tracking-[0.8em] italic">
         In-N-Out Logistics Portal • Admas University Prototype V4.0
       </p>
    </div>
  </div>
);
