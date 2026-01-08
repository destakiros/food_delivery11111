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
      {/* University Branding Header */}
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
        {/* Project Context & Mission */}
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
            demonstrates a modern approach to food logistics. By integrating secure authentication, 
            real-time order management, and an intuitive administrative portal, we bridge the gap 
            between hunger and instant fulfillment.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-8 bg-gray-50 dark:bg-zinc-900 rounded-[40px] border dark:border-zinc-800 shadow-sm transition-transform hover:-translate-y-1">
              <span className="text-[9px] font-black uppercase text-gray-400 block mb-3 tracking-widest">Lead Advisor</span>
              <p className="font-black text-gray-900 dark:text-white uppercase italic text-lg tracking-tight">DANIEL K.</p>
            </div>
            <div className="p-8 bg-gray-50 dark:bg-zinc-900 rounded-[40px] border dark:border-zinc-800 shadow-sm transition-transform hover:-translate-y-1">
              <span className="text-[9px] font-black uppercase text-gray-400 block mb-3 tracking-widest">Academic Status</span>
              <p className="font-black text-emerald-600 uppercase italic text-lg tracking-tight">PROJECT VERIFIED</p>
            </div>
          </div>
          
          <p className="text-[10px] font-black uppercase text-gray-300 dark:text-zinc-700 tracking-[0.4em] italic pl-2">
            SUBMISSION DATE: 03/05/2018 (E.C.)
          </p>
        </div>

        {/* Project Team Card */}
        <div className="bg-white dark:bg-zinc-900/50 p-10 md:p-14 rounded-[60px] shadow-2xl border dark:border-zinc-800 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-ino-red/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-ino-yellow/5 transition-colors duration-1000"></div>
          
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
                className="group/item flex justify-between items-center p-6 rounded-[28px] bg-gray-50 dark:bg-zinc-800/50 hover:bg-ino-red hover:text-white dark:hover:bg-ino-red transition-all duration-500 transform hover:-translate-x-2 border dark:border-zinc-800 hover:border-transparent"
              >
                <div className="flex items-center gap-4">
                  <span className="text-gray-300 font-black italic text-xs group-hover/item:text-white/40">0{i+1}</span>
                  <span className="font-black uppercase text-sm tracking-tight">{member.name}</span>
                </div>
                <span className="text-[10px] font-black bg-white dark:bg-zinc-900 text-ino-red dark:text-ino-red group-hover/item:bg-white/20 group-hover/item:text-white px-4 py-2 rounded-xl border border-gray-100 dark:border-zinc-700 uppercase tracking-widest transition-colors">
                  {member.id}
                </span>
              </div>
            ))}
          </div>
          
          <div className="mt-12 p-8 bg-blue-50 dark:bg-blue-900/10 rounded-[32px] border border-blue-100 dark:border-blue-900/30 flex items-center gap-6">
             <div className="flex-shrink-0 w-12 h-12 rounded-full overflow-hidden bg-white p-2 border border-blue-100">
                <img src="https://upload.wikimedia.org/wikipedia/en/thumb/8/8b/Admas_University_College_logo.png/220px-Admas_University_College_logo.png" className="w-full h-full object-contain" alt="Small AU Logo" />
             </div>
             <p className="text-[10px] font-bold text-blue-800 dark:text-blue-300 uppercase leading-relaxed tracking-wide italic">
               This project represents the practical synthesis of our Computer Science curriculum at Admas University.
             </p>
          </div>
        </div>
      </div>

      {/* Philosophy Section */}
      <div className="bg-gray-950 text-white p-16 md:p-24 rounded-[80px] text-center relative overflow-hidden border border-white/5 shadow-[0_50px_100px_rgba(0,0,0,0.5)]">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]"></div>
        </div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <i className="ph-fill ph-quotes text-6xl text-ino-red mb-8 opacity-40"></i>
          <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-8 italic leading-[1.1]">
            "Engineering the <span className="text-ino-yellow">Future</span> of Digital Logistics."
          </h3>
          <p className="text-gray-400 text-sm md:text-lg leading-relaxed font-medium mb-12 italic">
            In-N-Out Logistics is more than an app; it's a testament to our dedication to software excellence. 
            We strive to deliver quality code, robust security, and an unforgettable user experience for our fellow Admas University community.
          </p>
          <div className="flex justify-center gap-4">
             <span className="h-1.5 w-1.5 rounded-full bg-ino-red"></span>
             <span className="h-1.5 w-1.5 rounded-full bg-ino-yellow"></span>
             <span className="h-1.5 w-1.5 rounded-full bg-ino-red"></span>
          </div>
        </div>
      </div>
      
      <div className="mt-20 text-center">
        <p className="text-[9px] font-black text-gray-300 dark:text-zinc-800 uppercase tracking-[0.8em] italic">
          ADMAS UNIVERSITY • FACULTY OF INFORMATICS • CLASS OF 2025
        </p>
      </div>
    </div>
  );
};