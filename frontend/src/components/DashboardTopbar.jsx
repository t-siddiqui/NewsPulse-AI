import React, { useState, useEffect } from 'react';
import { Brain, Moon, ChevronDown, User, LogOut, Menu } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const DashboardTopbar = ({ onMenuToggle }) => {
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    navigate('/');
  };

  return (
    <header className="h-16 bg-slate-900/50 border-b border-slate-800/50 flex items-center justify-between px-4 md:px-6 sticky top-0 z-50 backdrop-blur-xl">
      
      {/* Logo Area */}
      <div className="flex items-center gap-2 md:gap-3">
        <button 
          onClick={onMenuToggle}
          className="md:hidden p-1 mr-1 text-slate-400 hover:text-white transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        <Link to="/" className="flex items-center gap-2 md:gap-3">
        <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(79,70,229,0.2)]">
          <Brain className="w-5 h-5 text-indigo-400" />
        </div>
        <h1 className="text-lg md:text-xl font-bold tracking-tight text-white">
          News<span className="text-indigo-400">Pulse</span>
        </h1>
        </Link>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3 md:gap-6 relative">
        
        {/* Theme Indicator */}
        <div className="flex items-center gap-2">
          <Moon className="w-4 h-4 text-slate-400" />
          <span className="hidden sm:inline text-xs font-semibold text-slate-500 uppercase">Dark</span>
        </div>

        <div className="h-6 w-px bg-slate-800"></div>

        {/* User Profile */}
        <div 
          className="flex items-center gap-2 md:gap-3 cursor-pointer group"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center group-hover:border-indigo-500 transition-colors">
            <User className="w-4 h-4 text-slate-400 group-hover:text-indigo-400 transition-colors" />
          </div>
          <span className="hidden sm:inline text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
            {user ? user.email.split('@')[0] : 'Guest'}
          </span>
          <ChevronDown className="w-4 h-4 text-slate-500" />
        </div>

        {/* Dropdown Menu */}
        {showDropdown && (
          <div className="absolute top-12 right-0 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-xl overflow-hidden py-1 z-50">
            {user ? (
              <button 
                onClick={handleLogout}
                className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-slate-700/50 flex items-center gap-2 transition-colors"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            ) : (
              <Link 
                to="/auth"
                className="w-full px-4 py-2 text-left text-sm text-white hover:bg-slate-700/50 flex items-center gap-2 transition-colors"
              >
                <User className="w-4 h-4" /> Log In
              </Link>
            )}
          </div>
        )}

      </div>
    </header>
  );
};

export default DashboardTopbar;
