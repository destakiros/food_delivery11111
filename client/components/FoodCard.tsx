
import React, { useState } from 'react';
import { FoodItem } from '../types';

interface FoodCardProps {
  item: FoodItem;
  onAddClick: (item: FoodItem, size: string, price: number, exclusions: string[]) => void;
}

export const FoodCard: React.FC<FoodCardProps> = ({ item, onAddClick }) => {
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  const [excludedIngredients, setExcludedIngredients] = useState<string[]>([]);

  const toggleIngredient = (ing: string) => {
    setExcludedIngredients(prev => 
      prev.includes(ing) ? prev.filter(i => i !== ing) : [...prev, ing]
    );
  };

  const currentSize = item.sizes ? item.sizes[selectedSizeIndex] : null;
  const displayPrice = currentSize ? currentSize.price : item.price;
  const displaySizeName = currentSize ? currentSize.name : 'Single';

  const handleAdd = () => {
    onAddClick(item, displaySizeName, displayPrice, excludedIngredients);
    setIsCustomizing(false);
    setExcludedIngredients([]);
  };

  return (
    <div className="card-menu group">
      {/* Front Face: Visual */}
      <div 
        className="first-content shadow-2xl" 
        style={{ backgroundImage: `url('${item.image}')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-300"></div>
        <div className="absolute bottom-0 left-0 w-full p-8 text-center transition-transform group-hover:translate-y-full">
          <span className="text-[9px] font-black uppercase tracking-[0.4em] text-ino-yellow mb-2 block">
            {item.category}
          </span>
          <h3 className="font-black text-2xl text-white tracking-tighter uppercase italic drop-shadow-lg leading-tight mb-4">{item.name}</h3>
          <div className="flex justify-center">
             <span className="font-black text-lg text-white bg-ino-red/90 px-6 py-2 rounded-2xl shadow-2xl border border-white/10">
                ${displayPrice.toFixed(2)}
             </span>
          </div>
        </div>
      </div>

      {/* Back Face: Content & Customization */}
      <div className="second-content bg-zinc-950">
        {!isCustomizing ? (
          <div className="flex flex-col items-center animate-fade-in w-full text-center">
             <h3 className="text-ino-yellow font-black text-2xl mb-4 uppercase italic tracking-tighter leading-none">{item.name}</h3>
             <p className="text-gray-400 text-xs mb-10 leading-relaxed font-medium px-4 line-clamp-3 italic">{item.description}</p>
             <button 
               onClick={() => setIsCustomizing(true)}
               className="w-full py-5 bg-ino-red text-white rounded-[24px] font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-red-500/20 hover:bg-red-600 transition transform active:scale-95 flex items-center justify-center gap-3"
             >
               Configure Item <i className="ph-bold ph-gear-six"></i>
             </button>
          </div>
        ) : (
          <div className="w-full text-left animate-fade-in overflow-y-auto no-scrollbar max-h-full">
            <div className="flex justify-between items-center mb-6">
               <h4 className="text-white text-[10px] font-black uppercase tracking-[0.3em] italic">Payload Setup</h4>
               <button onClick={() => setIsCustomizing(false)} className="text-gray-500 hover:text-ino-red transition-colors p-2"><i className="ph-bold ph-arrow-left text-lg"></i></button>
            </div>

            {item.sizes && (
              <div className="mb-6">
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-3">Unit Size</p>
                <div className="flex flex-wrap gap-2">
                  {item.sizes.map((s, idx) => (
                    <button 
                      key={s.name}
                      onClick={() => setSelectedSizeIndex(idx)}
                      className={`px-4 py-2.5 rounded-xl text-[9px] font-black uppercase transition-all border ${selectedSizeIndex === idx ? 'bg-ino-yellow text-red-900 border-ino-yellow shadow-lg' : 'bg-zinc-800 text-gray-400 border-zinc-700 hover:border-zinc-500'}`}
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {item.ingredients && (
              <div className="mb-8">
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-3">Modify Ingredients</p>
                <div className="flex flex-wrap gap-2">
                  {item.ingredients.map(ing => (
                    <button 
                      key={ing}
                      onClick={() => toggleIngredient(ing)}
                      className={`px-3 py-2 rounded-xl text-[8px] font-bold uppercase transition-all flex items-center gap-2 ${excludedIngredients.includes(ing) ? 'bg-red-950 text-red-400 border border-red-900/30' : 'bg-emerald-950 text-emerald-400 border border-emerald-900/30'}`}
                    >
                      <i className={`ph-bold ph-${excludedIngredients.includes(ing) ? 'prohibit' : 'check'}-circle`}></i>
                      {ing}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button 
              onClick={handleAdd}
              className="w-full bg-ino-yellow text-red-900 py-5 rounded-[24px] font-black text-[11px] uppercase tracking-[0.2em] hover:bg-yellow-400 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-yellow-500/10 active:scale-95"
            >
              Commit to Tray • ${displayPrice.toFixed(2)}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
