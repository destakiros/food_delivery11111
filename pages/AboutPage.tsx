
import React from 'react';

export const AboutPage: React.FC = () => {
  const team = [
    { name: 'Abel Wasihun', id: '0270/22' },
    { name: 'Abel Fitsum', id: '0269/22' },
    { name: 'Biniyam Tesfaye', id: '0068/22' },
    { name: 'Eyob Tesfaye', id: '0421/22' },
    { name: 'Desta Kiros', id: '0035/23' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-24 animate-fade-in">
      <div className="text-center mb-24">
        <div className="relative inline-block mb-10 group">
          <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-3xl scale-150 group-hover:bg-ino-red/10 transition-colors duration-700"></div>
          <div className="relative bg-white dark:bg-zinc-900 p-8 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-none border border-gray-100 dark:border-zinc-800 transition-transform duration-500 hover:scale-105">
            <img 
              src="https://upload.wikimedia.org/wikipedia/en/thumb/8/8b/Admas_University_College_logo.png/220px-Admas_University_College_logo.png" 
              className="h-32 w-32 md:h-44 md:w-44 object-contain" 
              alt="Admas University Logo" 
            />
          </div>
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-gray-950 dark:text-white uppercase tracking-tighter italic leading-none mb-4 text-center">
          ADMAS <span className="text-ino-red">UNIVERSITY</span>
        </h1>
        <div className="flex items-center justify-center gap-4">
           <span className="h-px w-12 bg-gray-200 dark:bg-zinc-800"></span>
           <p className="text-gray-400 font-black uppercase tracking-[0.5em] text-[10px] md:text-xs italic text-center">
             Department of Computer Science
           </p>
           <span className="h-px w-12 bg-gray-200 dark:bg-zinc-800"></span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-24">
        <div className="space-y-8 lg:sticky lg:top-32">
          <div className="inline-block px-5 py-2 rounded-full bg-ino-red/10 text-ino-red text-[10px] font-black uppercase tracking-widest border border-ino-red/10">
            Final Project Manifest • CS-401
          </div>
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-gray-900 dark:text-white leading-[0.9] italic">
            In N Out Online <br/>
            <span className="text-ino-red">Food Delivery System</span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 leading-relaxed font-medium text-sm md:text-base">
            Developed as a comprehensive academic project for Admas University, this application 
            demonstrates a modern approach to food logistics.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-8 bg-gray-50 dark:bg-zinc-900 rounded-[40px] border dark:border-zinc-800 shadow-sm">
              <span className="text-[9px] font-black uppercase text-gray-400 block mb-3 tracking-widest">Lead Advisor</span>
              <p className="font-black text-gray-900 dark:text-white uppercase italic text-lg tracking-tight">DANIEL K.</p>
            </div>
            <div className="p-8 bg-gray-50 dark:bg-zinc-900 rounded-[40px] border dark:border-zinc-800 shadow-sm">
              <span className="text-[9px] font-black uppercase text-gray-400 block mb-3 tracking-widest">Academic Status</span>
              <p className="font-black text-emerald-600 uppercase italic text-lg tracking-tight">PROJECT VERIFIED</p>
            </div>
          </div>
          
          <p className="text-[10px] font-black uppercase text-gray-300 dark:text-zinc-700 tracking-[0.4em] italic pl-2">
            SUBMISSION DATE: 03/05/2018 (E.C.)
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900/50 p-10 md:p-14 rounded-[60px] shadow-2xl border dark:border-zinc-800 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-ino-red/5 rounded-full blur-[100px]"></div>
          
          <div className="flex items-center gap-5 mb-12">
            <div className="w-16 h-16 bg-ino-red rounded-3xl flex items-center justify-center text-white text-3xl shadow-xl shadow-red-500/20 animate-pulse">
              <i className="ph-bold ph-users-three"></i>
            </div>
            <div>
              <h3 className="text-2xl font-black uppercase tracking-tighter italic text-gray-900 dark:text-white leading-none">The Project Team</h3>
              <span className="text-ino-red text-[9px] font-black uppercase tracking-widest mt-1 block">Full Stack Operatives</span>
            </div>
          </div>

          <div className="space-y-4">
            {team.map((member, i) => (
              <div 
                key={i} 
                className="group/item flex justify-between items-center p-6 rounded-[28px] bg-gray-50 dark:bg-zinc-800/50 hover:bg-ino-red hover:text-white dark:hover:bg-ino-red transition-all duration-500 border dark:border-zinc-800 hover:border-transparent"
              >
                <div className="flex items-center gap-4">
                  <span className="text-gray-300 font-black italic text-xs group-hover/item:text-white/40">0{i+1}</span>
                  <span className="font-black uppercase text-sm tracking-tight">{member.name}</span>
                </div>
                <span className="text-[10px] font-black bg-white dark:bg-zinc-900 text-ino-red dark:text-ino-red group-hover/item:bg-white/20 group-hover/item:text-white px-4 py-2 rounded-xl border border-gray-100 dark:border-zinc-700 uppercase tracking-widest">
                  {member.id}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
