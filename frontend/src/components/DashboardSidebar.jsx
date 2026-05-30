import React from 'react';
import { Home, Search, Clock, BarChart2, Users, Heart, Mail, ShieldCheck, Newspaper } from 'lucide-react';

const DashboardSidebar = ({ activeTab, onTabChange }) => {
  const menuItems = [
    { icon: Home, label: 'Dashboard' },
    { icon: Search, label: 'Analyze Tools' },
    { icon: Clock, label: 'Prediction History' },
    { icon: BarChart2, label: 'System Analytics' },
    { icon: Newspaper, label: 'Discover' },
    { icon: Users, label: 'About Us' },
    { icon: Heart, label: 'Support Us' },
    { icon: Mail, label: 'Contact Us' },
  ];

  return (
    <aside className="w-64 bg-slate-900/30 border-r border-slate-800/50 h-[calc(100vh-64px)] flex flex-col fixed left-0 top-16 backdrop-blur-xl">
      
      {/* Navigation Links */}
      <nav className="p-4 space-y-1">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div 
              key={index}
              onClick={() => onTabChange(item.label)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-colors ${
                activeTab === item.label
                  ? 'bg-indigo-500/20 text-indigo-400 font-bold border border-indigo-500/30' 
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-white font-medium border border-transparent'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm">{item.label}</span>
            </div>
          );
        })}
      </nav>

      <div className="flex-1"></div>

      {/* Info Card */}
      <div className="px-4 mb-8">
        <div className="bg-gradient-to-b from-slate-800/80 to-slate-900/80 border border-slate-700/50 rounded-2xl p-5 text-center relative overflow-hidden">
          <div className="w-16 h-16 bg-slate-800 border border-slate-700 rounded-xl shadow-inner mx-auto flex items-center justify-center mb-3 relative z-10">
            <ShieldCheck className="w-8 h-8 text-fuchsia-400" />
          </div>
          <h4 className="font-bold text-white text-sm mb-2 relative z-10">Enterprise<br/>Protection</h4>
          <p className="text-xs text-slate-400 leading-relaxed relative z-10">Real-time semantic analysis active.</p>
        </div>
      </div>

    </aside>
  );
};

export default DashboardSidebar;
