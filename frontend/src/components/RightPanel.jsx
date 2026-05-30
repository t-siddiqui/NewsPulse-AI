import React from 'react';
import { Database, Zap, ShieldCheck } from 'lucide-react';

const RightPanel = () => {
  return (
    <aside className="w-[320px] fixed right-0 top-0 h-screen bg-white border-l border-slate-100 flex flex-col py-6">
      
      {/* Top Links */}
      <div className="flex items-center justify-center gap-6 text-sm font-bold text-slate-500 px-6 mb-8">
        <span className="hover:text-slate-800 cursor-pointer">Architecture</span>
        <div className="flex items-center gap-2 hover:text-slate-800 cursor-pointer">
          Logs
          <span className="bg-blue-100 text-projector-blue px-1.5 rounded-md text-xs">10</span>
        </div>
        <button className="bg-slate-800 text-white px-4 py-2 rounded-xl">API Status</button>
      </div>

      <div className="px-6 flex-1 overflow-y-auto">
        {/* System Stats Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-lg text-slate-800">Model Stats</h3>
          <span className="text-xs font-bold px-2 py-1 bg-green-100 text-green-600 rounded-md flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            Online
          </span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
            <Zap className="w-5 h-5 text-amber-500 mb-2" />
            <p className="text-2xl font-black text-slate-800">92.4%</p>
            <p className="text-xs text-slate-400 font-bold uppercase mt-1">Accuracy</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
            <Database className="w-5 h-5 text-projector-blue mb-2" />
            <p className="text-2xl font-black text-slate-800">6.3k</p>
            <p className="text-xs text-slate-400 font-bold uppercase mt-1">Dataset Size</p>
          </div>
        </div>

        {/* Model Architecture Info */}
        <div className="space-y-4 mb-8">
          <h3 className="font-bold text-lg text-slate-800 mb-4">Architecture</h3>
          
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 relative">
            <p className="text-sm font-bold text-slate-700 mb-1">Feature Extraction</p>
            <p className="text-xs text-slate-500 leading-relaxed mb-3">TF-IDF Vectorizer converts text into numerical features based on term frequency.</p>
            <div className="flex justify-between items-center text-xs font-bold text-projector-blue">
              <span>Scikit-Learn</span>
              <span>Python</span>
            </div>
          </div>
          
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 ml-8 relative">
            <div className="absolute -left-12 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-2 border-slate-200 flex items-center justify-center text-projector-blue bg-white">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
            </div>
            <p className="text-sm font-bold text-slate-700 mb-1">Classification Model</p>
            <p className="text-xs text-slate-500 leading-relaxed mb-3">Logistic Regression calculates probabilities using the extracted features.</p>
            <div className="flex justify-between items-center text-xs font-bold text-emerald-500">
              <span>Saved as model.pkl</span>
            </div>
          </div>
        </div>
      </div>

      {/* Upgrade Banner -> Code / Repo Banner */}
      <div className="px-6 mt-auto pb-6">
        <div className="bg-gradient-to-br from-projector-dark to-slate-700 rounded-2xl p-6 text-center shadow-lg shadow-slate-900/20">
          <div className="w-12 h-12 mx-auto mb-4 bg-white/10 rounded-full flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-white font-bold text-sm mb-4 leading-relaxed">View Full Project Documentation & Source Code</h3>
          <button className="w-full bg-white text-projector-dark font-bold py-3 rounded-xl hover:bg-slate-50 transition-colors text-sm">
            View on GitHub
          </button>
        </div>
      </div>

    </aside>
  );
};

export default RightPanel;
