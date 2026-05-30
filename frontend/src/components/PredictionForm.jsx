import React, { useState, useRef } from 'react';
import { UploadCloud, CheckCircle2, AlertCircle, FileText, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const PredictionForm = ({ onPredict, loading }) => {
  const [input, setInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const fileInputRef = useRef(null);

  const isUrl = (str) => {
    try { new URL(str); return true; } catch (_) { return false; }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isUrl(input) && input.trim().length < 10) {
      toast.error('Please enter at least 10 characters or a valid URL.');
      return;
    }
    if (isUrl(input.trim())) {
      onPredict({ url: input.trim() });
    } else {
      onPredict({ text: input });
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ['application/pdf', 'text/plain'];
    if (!allowed.includes(file.type)) {
      toast.error('Only PDF or TXT files are supported.');
      return;
    }

    setUploading(true);
    setUploadedFile(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const baseApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await axios.post(`${baseApiUrl}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setInput(res.data.text);
      setUploadedFile({ name: res.data.filename, length: res.data.totalLength });
      toast.success(`Extracted ${res.data.totalLength.toLocaleString()} characters from ${res.data.filename}`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to read file');
    } finally {
      setUploading(false);
      // Reset input so same file can be re-selected
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const clearFile = () => {
    setUploadedFile(null);
    setInput('');
  };

  return (
    <div className="bg-slate-800/40 rounded-2xl p-6 shadow-sm border border-slate-700/50 flex flex-col h-full backdrop-blur-md">
      <h2 className="text-xl font-bold text-white mb-1">Analyze Content</h2>
      <p className="text-sm text-slate-400 mb-6">Paste your <strong className="text-slate-300">full news article</strong> text, a URL, or upload a PDF/TXT file</p>

      {/* Uploaded file badge */}
      {uploadedFile && (
        <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-lg bg-indigo-500/10 border border-indigo-500/30">
          <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
          <span className="text-xs text-indigo-300 font-medium flex-1 truncate">{uploadedFile.name}</span>
          <span className="text-xs text-slate-500">{(uploadedFile.length / 1000).toFixed(1)}k chars</span>
          <button onClick={clearFile} className="text-slate-500 hover:text-slate-300 transition-colors">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
        <div className="relative flex-1 mb-4">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value.slice(0, 5000))}
            placeholder="Paste the full news article text or a URL here for best results..."
            className="w-full h-full min-h-[160px] bg-slate-900/50 rounded-xl p-4 border border-slate-700/50 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none resize-none text-sm text-slate-200 pb-8 transition-all"
          />
          <div className="absolute bottom-3 right-4 text-xs font-medium text-slate-500">
            {input.length} / 5000
          </div>
        </div>

        {/* Short text warning */}
        {input.length > 10 && input.length < 80 && !input.startsWith('http') && (
          <div className="mb-3 flex items-start gap-2 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30">
            <AlertCircle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-300 leading-relaxed">
              <strong>Tip:</strong> For best accuracy, paste the <strong>complete article</strong> (at least a few sentences). Short phrases may give unreliable results.
            </p>
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          {/* Hidden real file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.txt"
            className="hidden"
            onChange={handleFileUpload}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-slate-600 text-slate-300 rounded-lg text-sm font-bold hover:bg-slate-700 transition-colors disabled:opacity-50"
          >
            {uploading ? (
              <div className="w-4 h-4 border-2 border-slate-400/30 border-t-slate-300 rounded-full animate-spin" />
            ) : (
              <UploadCloud className="w-4 h-4" />
            )}
            {uploading ? 'Reading...' : 'Upload File'}
          </button>
          <span className="text-xs text-slate-500 font-medium tracking-wide">PDF, TXT, or URL</span>
        </div>

        <button
          type="submit"
          disabled={loading || !input}
          className={`w-full py-3.5 rounded-xl text-base font-bold transition-all shadow-sm flex items-center justify-center gap-2 ${
            loading || !input
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              : 'bg-indigo-500 text-white hover:bg-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.4)]'
          }`}
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              Scanning...
            </>
          ) : 'Start Scan'}
        </button>

        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
          <AlertCircle className="w-4 h-4 text-indigo-400" />
          Paste full articles for best accuracy. Short claims may be unreliable.
        </div>
      </form>
    </div>
  );
};

export default PredictionForm;
