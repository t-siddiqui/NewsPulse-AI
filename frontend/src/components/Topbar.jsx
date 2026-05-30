import React from 'react';
import { Search, Settings, Bell } from 'lucide-react';

const Topbar = () => {
  return (
    <header className="h-[80px] bg-white flex items-center justify-between px-8 z-10 sticky top-0">
      <div className="relative w-[400px]">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text" 
          placeholder="Search..." 
          className="w-full h-11 pl-12 pr-4 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-projector-blue/20 outline-none"
        />
      </div>

      <div className="flex items-center gap-8">
        <div className="flex items-center gap-4">
          <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-50 text-slate-500 transition-colors">
            <Settings size={20} />
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-50 text-slate-500 transition-colors relative">
            <Bell size={20} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full"></span>
          </button>
        </div>

        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
          <div className="text-right">
            <p className="text-sm font-bold text-slate-800">Rafael Davis</p>
          </div>
          <img src="https://i.pravatar.cc/150?img=11" alt="Profile" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
        </div>
      </div>
    </header>
  );
};

export default Topbar;
