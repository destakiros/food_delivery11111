import React from 'react';

export const SupportPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 animate-fade-in">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-black text-gray-900 dark:text-white mb-4 uppercase tracking-tighter italic">
          Help <span className="text-[#D62828]">&</span> Support
        </h1>
        <p className="text-gray-500 font-medium">How can our kitchen team assist you today?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <div className="bg-white dark:bg-zinc-900 p-10 rounded-[40px] border border-gray-100 dark:border-zinc-800 shadow-xl group hover:border-[#D62828] transition duration-500">
          <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 text-[#D62828] rounded-2xl flex items-center justify-center mb-6 font-black text-xl">@</div>
          <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-4">Direct Contact</h3>
          <p className="text-gray-500 text-sm leading-relaxed mb-6">
            For urgent order issues, billing questions, or feedback, please reach out to our support lead.
          </p>
          <a 
            href="mailto:dgbdka1@gmail.com" 
            className="text-[#D62828] font-black lowercase tracking-widest text-xs underline decoration-2 underline-offset-4"
          >
            dgbdka1@gmail.com
          </a>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-10 rounded-[40px] border border-gray-100 dark:border-zinc-800 shadow-xl group hover:border-[#FFCA3A] transition duration-500">
          <div className="w-12 h-12 bg-yellow-50 dark:bg-yellow-900/20 text-[#FFCA3A] rounded-2xl flex items-center justify-center mb-6 font-black text-xl">?</div>
          <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-4">Quick FAQ</h3>
          <p className="text-gray-500 text-sm leading-relaxed mb-6">
            Check our common questions regarding delivery times, food safety, and refunds.
          </p>
          <button className="text-gray-900 dark:text-white font-black uppercase tracking-widest text-xs underline decoration-2 underline-offset-4">
            View FAQ Center
          </button>
        </div>
      </div>

      <div className="bg-gray-950 text-white p-12 rounded-[50px] shadow-2xl relative overflow-hidden border border-white/5">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-x-1/2 -translate-y-1/2"></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-black uppercase tracking-tighter mb-8 italic">Send us a <span className="text-[#FFCA3A]">Message</span></h2>
          <form className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Your Name</label>
                <input className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-[#D62828]" placeholder="JOHN DOE" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Order ID (Optional)</label>
                <input className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-[#D62828]" placeholder="ORD-XXXXXX" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Your Inquiry</label>
              <textarea className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-[#D62828] h-32 resize-none" placeholder="HOW CAN WE HELP?" />
            </div>
            <button type="button" className="bg-[#D62828] text-white px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl hover:bg-red-700 transition">
              Deliver Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};