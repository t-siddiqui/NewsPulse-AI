import React from 'react';
import { Home, FileText, Target, Activity, LayoutGrid, BookOpen, Search, Settings, Plus } from 'lucide-react';

const Sidebar = () => {
  return (
    <aside className="w-[240px] h-screen fixed left-0 top-0 bg-white border-r border-slate-100 flex flex-col py-6 px-4 z-10">
      {/* Logo */}
      <div className="flex items-center gap-3 px-2 mb-10">
        <div className="w-8 h-8 rounded-lg bg-projector-blue/10 flex items-center justify-center">
          <div className="w-4 h-4 bg-projector-blue rounded-full"></div>
        </div>
        <h1 className="font-bold text-xl tracking-tight">PROJECTOR</h1>
      </div>

      {/* Main Nav */}
      <nav className="flex flex-col gap-1 mb-8">
        <a href="#" className="flex items-center gap-3 px-4 py-3 bg-projector-dark text-white rounded-xl font-medium shadow-sm shadow-projector-dark/20">
          <Home size={18} /> Home
        </a>
        <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 rounded-xl font-medium transition-colors">
          <FileText size={18} /> History
        </a>
        <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 rounded-xl font-medium transition-colors">
          <Target size={18} /> API Access
        </a>
        <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 rounded-xl font-medium transition-colors">
          <Activity size={18} /> Activity
        </a>
      </nav>

      {/* Secondary Nav */}
      <div className="flex flex-col gap-1 mb-auto">
        <div className="flex items-center justify-between px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
          <span>Spaces</span>
          <Plus size={14} className="cursor-pointer hover:text-slate-600" />
        </div>
        
        <div className="flex items-center justify-between px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider mt-4">
          <span>Publications</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
        </div>
        
        <div className="flex flex-col gap-1 mt-2">
          <span className="px-8 py-2 text-sm font-medium text-slate-700 relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            Dribbble
          </span>
          <span className="px-8 py-2 text-sm font-medium text-projector-blue bg-projector-blue/5 rounded-lg relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-projector-blue"></span>
            Behance
          </span>
          <span className="px-8 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50 rounded-lg">Articles</span>
          <span className="px-8 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50 rounded-lg flex items-center justify-between">
            Social
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </span>
        </div>
      </div>

      <button className="mt-6 w-full py-3 bg-projector-blue hover:bg-projector-blue/90 text-white rounded-xl font-medium shadow-md shadow-projector-blue/30 transition-all flex items-center justify-center gap-2">
        <Plus size={18} /> New Space
      </button>
    </aside>
  );
};

export default Sidebar;
