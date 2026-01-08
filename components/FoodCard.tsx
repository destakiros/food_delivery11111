
import React, { useState } from 'react';
import { FoodItem } from '../types';

interface FoodCardProps {
  item: FoodItem;
  // onAddClick allows the parent component (MenuPage) to handle the add to cart logic,
  // enabling checks like whether the user is logged in before adding an item.
  onAddClick: (item: FoodItem, size: string, price: number, exclusions: string[]) => void;
}

export const FoodCard: React.FC<FoodCardProps> = ({ item, onAddClick }) => {
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [selectedSizeIdx, setSelectedSizeIdx] = useState(0);
  const [exclusions, setExclusions] = useState<string[]>([]);

  const toggleIng = (ing: string) => setExclusions(prev => prev.includes(ing) ? prev.filter(i => i !== ing) : [...prev, ing]);
  const currentSize = item.sizes ? item.sizes[selectedSizeIdx] : null;
  const price = currentSize ? currentSize.price : item.price;
  const sizeName = currentSize ? currentSize.name : 'Single';

  const handleAdd = () => {
    // Call the onAddClick prop instead of the internal addToCart from useCart
    onAddClick(item, sizeName, price, exclusions);
    setIsCustomizing(false);
    setExclusions([]);
  };

  return (
    <div className="card-menu group w-full h-[400px] relative overflow-hidden rounded-[32px] bg-white dark:bg-zinc-900 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
      {/* Front Face: Image Focused */}
      <div className="first-content absolute inset-0 w-full h-full z-10 transition-all duration-500 group-hover:opacity-0 group-hover:scale-110">
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-full h-full object-cover transition-transform duration-700" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full p-8 text-center">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-ino-yellow mb-2 block">{item.category}</span>
          <h3 className="font-black text-2xl text-white tracking-tighter uppercase italic drop-shadow-lg mb-4">{item.name}</h3>
          <span className="inline-block font-black text-lg text-white bg-ino-red/90 px-6 py-2 rounded-2xl shadow-2xl border border-white/10">
            ${price.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Back Face: Actions/Customization */}
      <div className="second-content absolute inset-0 w-full h-full bg-ino-dark dark:bg-zinc-950 p-8 flex flex-col justify-center items-center text-center opacity-0 translate-y-10 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0 z-20">
        {!isCustomizing ? (
          <div className="animate-fade-in w-full">
             <h3 className="text-ino-yellow font-black text-2xl mb-4 uppercase italic tracking-tighter">{item.name}</h3>
             <p className="text-gray-400 text-xs mb-10 leading-relaxed font-medium px-4 line-clamp-3">{item.description}</p>
             <button onClick={() => setIsCustomizing(true)} className="w-full bg-ino-red text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-red-500/30 hover:bg-red-600 transition transform active:scale-95 flex items-center justify-center gap-3">
               Configure Item <i className="ph-bold ph-gear"></i>
             </button>
          </div>
        ) : (
          <div className="w-full text-left animate-fade-in overflow-y-auto no-scrollbar max-h-full">
            <div className="flex justify-between items-center mb-6">
               <h4 className="text-white text-[10px] font-black uppercase tracking-[0.3em]">Payload Setup</h4>
               <button onClick={() => setIsCustomizing(false)} className="text-gray-500 hover:text-white transition"><i className="ph-bold ph-arrow-left"></i></button>
            </div>
            {item.sizes && (
              <div className="mb-6">
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-3">Unit Size</p>
                <div className="flex flex-wrap gap-2">
                  {item.sizes.map((s, idx) => (
                    <button key={s.name} onClick={() => setSelectedSizeIdx(idx)} className={`px-4 py-2.5 rounded-xl text-[9px] font-black uppercase border transition-all duration-300 ${selectedSizeIdx === idx ? 'bg-ino-yellow text-red-900 border-ino-yellow shadow-lg' : 'bg-zinc-800 text-gray-400 border-zinc-700 hover:border-zinc-500'}`}>{s.name}</button>
                  ))}
                </div>
              </div>
            )}
            {item.ingredients && (
              <div className="mb-8">
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-3">Modify Ingredients</p>
                <div className="flex flex-wrap gap-2">
                  {item.ingredients.map(ing => (
                    <button key={ing} onClick={() => toggleIng(ing)} className={`px-3 py-2 rounded-xl text-[8px] font-bold uppercase transition-all duration-300 flex items-center gap-2 ${exclusions.includes(ing) ? 'bg-red-950 text-red-400 border border-red-900/30 shadow-inner' : 'bg-emerald-950 text-emerald-400 border border-emerald-900/30'}`}>
                      <i className={`ph-bold ph-${exclusions.includes(ing) ? 'x' : 'check'}-circle`}></i>
                      {ing}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <button onClick={handleAdd} className="w-full bg-ino-yellow text-red-900 py-5 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-yellow-400 transition shadow-2xl shadow-yellow-500/10 active:scale-95">Commit to Tray • ${price.toFixed(2)}</button>
          </div>
        )}
      </div>
    </div>
  );
};
