import React from 'react';

const decodeHtml = (html) => {
  if (!html) return '';
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
};

const HistoryList = ({ history }) => {
  if (!history || history.length === 0) {
    return <p className="text-sm text-slate-400 p-4">No prediction history available.</p>;
  }

  return (
    <div className="space-y-3">
      {history.map((item, index) => {
        const isFake = item.prediction === 'FAKE';
        
        return (
          <div key={item._id} className={`bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex items-center justify-between border-l-4 ${isFake ? 'border-l-rose-500' : 'border-l-emerald-500'}`}>
            
            <div className="flex-1">
              <p className="text-xs text-slate-400 mb-1">
                VeriNews / Predictions / {isFake ? 'Fake' : 'Real'}
              </p>
              <h4 className="text-sm font-bold text-slate-800 line-clamp-1">
                {decodeHtml(item.text)}
              </h4>
            </div>

            <div className="flex items-center gap-8 ml-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 w-20">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg>
                {item.confidence}%
              </div>

              <div className="hidden md:flex -space-x-2">
                <img src={`https://i.pravatar.cc/150?img=${(index * 2) % 70 + 10}`} className="w-6 h-6 rounded-full border-2 border-white" />
                <img src={`https://i.pravatar.cc/150?img=${(index * 2 + 1) % 70 + 10}`} className="w-6 h-6 rounded-full border-2 border-white" />
                <img src={`https://i.pravatar.cc/150?img=${(index * 2 + 2) % 70 + 10}`} className="w-6 h-6 rounded-full border-2 border-white" />
              </div>

              <div className="text-xs text-slate-400 font-medium w-16 text-right">
                {new Date(item.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>

              <button className="text-slate-300 hover:text-slate-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path></svg>
              </button>
            </div>

          </div>
        );
      })}
    </div>
  );
};

export default HistoryList;
