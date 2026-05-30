import React from 'react';
import { TrendingUp, BarChart, CheckCircle, XCircle, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AnalyticsCharts = ({ analytics }) => {
  if (!analytics) return (
    <div className="xl:col-span-2 bg-slate-800/40 rounded-2xl flex items-center justify-center border border-slate-700/50 min-h-[300px]">
        <div className="text-slate-500 text-sm">Loading Analytics...</div>
    </div>
  );

  const { totalScans, fakeCount, realCount, recentScans, weeklyData } = analytics;
  
  // UPDATED: Reflecting your 85% RoBERTa Audit results
  const f1Score = "86%"; 

  const chartData = weeklyData || recentScans?.map(scan => ({
    name: scan._id.slice(5),
    fake: scan.fake,
    real: scan.real
  })) || [];

  return (
    <>
      {/* Middle Column: Chart only (Status section removed) */}
      <div className="xl:col-span-1 flex flex-col gap-6">
        
        {/* Scan Trends Card */}
        <div className="bg-slate-800/40 rounded-2xl shadow-sm border border-slate-700/50 p-6 flex flex-col backdrop-blur-md h-full">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              Scan Trends (7 Days)
            </h3>
            <div className="flex items-center gap-4 text-[10px] font-bold">
              <span className="flex items-center gap-1 text-red-400"><span className="w-2 h-1 bg-red-400"></span> Fake</span>
              <span className="flex items-center gap-1 text-emerald-400"><span className="w-2 h-1 bg-emerald-400"></span> Real</span>
            </div>
          </div>
          <div className="h-48 w-full min-h-[200px] min-w-0 -ml-4 mt-auto">
            <ResponsiveContainer width="100%" height="100%" minWidth={200} minHeight={200}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f8fafc' }} />
                <Line type="monotone" dataKey="fake" stroke="#f87171" strokeWidth={2} dot={{ r: 3, fill: '#f87171' }} activeDot={{ r: 5 }} />
                <Line type="monotone" dataKey="real" stroke="#34d399" strokeWidth={2} dot={{ r: 3, fill: '#34d399' }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Right Column: Global Statistics */}
      <div className="xl:col-span-1 flex flex-col gap-6">
        <div className="bg-slate-800/40 rounded-2xl shadow-sm border border-slate-700/50 p-6 backdrop-blur-md h-full">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-6">
            <div className="bg-indigo-500/20 rounded p-1 border border-indigo-500/30">
              <BarChart className="w-3 h-3 text-indigo-400" />
            </div>
            Global Statistics
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-blue-500/20 p-2 rounded-lg text-blue-400"><Activity className="w-4 h-4" /></div>
                <div>
                  <div className="text-2xl font-black text-white leading-none">{totalScans || 0}</div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase mt-1">Total Scans</div>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-emerald-500/20 p-2 rounded-lg text-emerald-400"><CheckCircle className="w-4 h-4" /></div>
                <div>
                  <div className="text-2xl font-black text-white leading-none">{realCount || 0}</div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase mt-1">Real News</div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-red-500/20 p-2 rounded-lg text-red-400"><XCircle className="w-4 h-4" /></div>
                <div>
                  <div className="text-2xl font-black text-white leading-none">{fakeCount || 0}</div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase mt-1">Fake News</div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-fuchsia-500/20 p-2 rounded-lg text-fuchsia-400"><TrendingUp className="w-4 h-4" /></div>
                <div>
                  <div className="text-2xl font-black text-white leading-none">{f1Score}</div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase mt-1">F1-Score</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AnalyticsCharts;