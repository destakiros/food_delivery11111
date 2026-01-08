import React from 'react';

export const LoadingSpinner: React.FC = () => (
  <div className="fixed inset-0 z-[200] bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md flex flex-col items-center justify-center">
    <div className="relative">
      <div className="w-24 h-24 border-4 border-gray-100 dark:border-zinc-800 rounded-full"></div>
      <div className="w-24 h-24 border-4 border-t-ino-red border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin absolute inset-0"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <i className="ph-fill ph-rocket text-ino-red text-2xl animate-pulse"></i>
      </div>
    </div>
    <div className="mt-8 text-center">
      <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-400 dark:text-zinc-500 animate-pulse">
        System Processing...
      </h3>
      <p className="text-[8px] font-black text-ino-red uppercase tracking-widest mt-2">
        Hub Alpha-01 Authorization in Progress
      </p>
    </div>
  </div>
);

export const ButtonSpinner: React.FC = () => (
  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
);