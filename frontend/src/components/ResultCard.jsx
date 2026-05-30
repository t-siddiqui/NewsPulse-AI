import React from 'react';
import { AlertOctagon, CheckCircle2, Info, Lightbulb, TrendingUp } from 'lucide-react';

const ResultCard = ({ result, loading }) => {
  if (loading) {
    return (
      <div className="bg-slate-800/40 rounded-2xl p-6 shadow-sm border border-slate-700/50 flex items-center justify-center h-full min-h-[400px] backdrop-blur-md">
        <div className="flex flex-col items-center gap-4 text-indigo-400">
          <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
          <span className="font-bold">Analyzing Content...</span>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="bg-slate-800/40 rounded-2xl p-6 shadow-sm border border-slate-700/50 flex flex-col items-center justify-center h-full min-h-[400px] backdrop-blur-md">
        <div className="text-center max-w-sm">
          <TrendingUp className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">Awaiting Analysis</h3>
          <p className="text-sm text-slate-400">Paste an article and click Start Scan to see the detailed prediction result here.</p>
        </div>
      </div>
    );
  }

  const isFake = result.prediction === 'FAKE';
  const confScore = result.confidence;
  const colorClass = isFake ? 'red' : 'emerald';
  const colorHex = isFake ? '#f87171' : '#34d399';

  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (confScore / 100) * circumference;

  return (
    <div className="bg-slate-800/40 rounded-2xl p-6 shadow-sm border border-slate-700/50 flex flex-col h-full relative overflow-hidden backdrop-blur-md">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-700/50">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <div className="w-6 h-6 bg-indigo-500/20 border border-indigo-500/30 rounded flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-indigo-400" />
          </div>
          Prediction Result
        </h3>
        <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-xs font-bold flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" /> Completed
        </span>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6">
        
        {/* Left/Middle Column: Verdict & Charts */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            {isFake ? <AlertOctagon className="w-8 h-8 text-red-400" /> : <CheckCircle2 className="w-8 h-8 text-emerald-400" />}
            <h2 className={`text-3xl font-black tracking-tight ${isFake ? 'text-red-400' : 'text-emerald-400'}`}>
              {result.prediction} NEWS
            </h2>
          </div>
          <p className="text-sm text-slate-400 mb-8 max-w-xs">
            {isFake ? 'This news is likely to be false or misleading.' : 'This news appears to be factual and reliable.'}
          </p>

          <div className="flex items-center justify-between mt-auto">
            <div className="flex-1 mr-8">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-bold text-white">Confidence Score</span>
                <Info className="w-4 h-4 text-slate-500" />
              </div>
              <div className={`text-3xl font-black mb-3 ${isFake ? 'text-red-400' : 'text-emerald-400'}`}>
                {confScore}%
              </div>
              {/* Linear Progress */}
              <div className="w-full bg-slate-900/50 border border-slate-700/50 h-2.5 rounded-full overflow-hidden mb-2">
                <div 
                  className={`h-full rounded-full ${isFake ? 'bg-red-400' : 'bg-emerald-400'}`}
                  style={{ width: `${confScore}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[10px] font-bold text-slate-500">
                <span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span>
              </div>
            </div>

            {/* Circular Progress */}
            <div className="relative w-32 h-32 flex-shrink-0 flex items-center justify-center">
              <svg className="transform -rotate-90 w-32 h-32">
                <circle cx="64" cy="64" r="54" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-700/50" />
                <circle cx="64" cy="64" r="54" stroke={colorHex} strokeWidth="12" fill="transparent" 
                  strokeDasharray={circumference} 
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-white leading-none">{confScore}%</span>
                <span className="text-xs font-bold text-slate-400">Confidence</span>
              </div>
            </div>
          </div>
        </div>

        {/* Vertical Divider */}
        <div className="hidden lg:block w-px bg-slate-700/50"></div>

        {/* Right Column: Words & How it works */}
        <div className="w-full lg:w-64 flex flex-col">
          <div className="mb-6">
            <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
              Top Influencing Words
            </h4>
            <div className="flex flex-wrap gap-2">
              {result.highlights && result.highlights.slice(0, 10).map((word, i) => (
                <span key={i} className={`text-xs px-2.5 py-1 border rounded-md font-bold ${isFake ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'}`}>
                  {word}
                </span>
              ))}
            </div>
          </div>
          
        </div>
      </div>

      {/* Bottom Section: Explainable AI */}
      <div className={`mt-6 p-4 rounded-xl border ${isFake ? 'bg-red-500/5 border-red-500/20' : 'bg-emerald-500/5 border-emerald-500/20'}`}>
        <h4 className={`text-sm font-bold flex items-center gap-2 mb-2 ${isFake ? 'text-red-400' : 'text-emerald-400'}`}>
          <Lightbulb className="w-4 h-4" fill="currentColor" />
          Explainable AI Insights
        </h4>
        <ul className={`text-xs leading-relaxed list-disc list-inside space-y-1 ${isFake ? 'text-red-400/80' : 'text-emerald-400/80'}`}>
          {result.reasons && result.reasons.length > 0 ? (
            result.reasons.map((reason, i) => <li key={i}>{reason}</li>)
          ) : (
            <li>{isFake 
              ? 'The content contains misleading language and unverified claims.'
              : 'The content exhibits neutral terminology and objective framing.'}
            </li>
          )}
        </ul>
      </div>

    </div>
  );
};

export default ResultCard;
