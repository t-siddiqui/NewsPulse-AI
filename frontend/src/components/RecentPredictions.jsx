import React, { useState } from 'react';
import { ShieldAlert, ShieldCheck, Clock, Search, ChevronLeft, ChevronRight, Link as LinkIcon, FileText } from 'lucide-react';

const decodeHtml = (html) => {
  if (!html) return '';
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
};

const RecentPredictions = ({ historyData, onSearch, search, page, totalPages, onPageChange }) => {
  return (
    <div className="bg-slate-800/40 rounded-2xl shadow-sm border border-slate-700/50 p-6 flex flex-col backdrop-blur-md h-full">
      
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-indigo-400" />
          Prediction History
        </h3>
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search URLs or text..."
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg py-2 pl-9 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
      </div>

      {/* Table Content */}
      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-700/50 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <th className="pb-3 font-medium">Source / Text</th>
              <th className="pb-3 font-medium text-center">Prediction</th>
              <th className="pb-3 font-medium text-right">Confidence</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/30">
            {(!historyData || historyData.length === 0) ? (
              <tr>
                <td colSpan="3" className="text-center py-8 text-slate-500 text-sm">
                  No predictions found.
                </td>
              </tr>
            ) : (
              historyData.map((item, index) => {
                const isFake = item.prediction === 'FAKE';
                const hasUrl = !!item.url;
                const displayText = hasUrl ? item.url : decodeHtml(item.text);

                return (
                  <tr key={item._id || index} className="hover:bg-slate-700/20 transition-colors group">
                    <td className="py-4 pr-4">
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center border ${isFake ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'}`}>
                          {hasUrl ? <LinkIcon className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                        </div>
                        <div className="min-w-0 max-w-[200px] sm:max-w-[300px]">
                          <div className="text-sm font-semibold text-slate-200 truncate" title={displayText}>
                            {displayText}
                          </div>
                          <div className="text-[10px] text-slate-500 mt-0.5">
                            {new Date(item.timestamp).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${isFake ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'}`}>
                        {isFake ? <ShieldAlert className="w-3 h-3" /> : <ShieldCheck className="w-3 h-3" />}
                        {item.prediction}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <span className={`font-bold ${isFake ? 'text-red-400' : 'text-emerald-400'}`}>
                        {item.confidence}%
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 pt-4 border-t border-slate-700/50 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Page {page} of {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(Math.max(1, page - 1))}
              disabled={page === 1}
              className="p-1.5 rounded bg-slate-700/30 text-slate-300 hover:bg-slate-600/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => onPageChange(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded bg-slate-700/30 text-slate-300 hover:bg-slate-600/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default RecentPredictions;
