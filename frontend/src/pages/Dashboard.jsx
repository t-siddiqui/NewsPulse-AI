import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Bot, X, MessageSquare } from 'lucide-react';
import DashboardTopbar from '../components/DashboardTopbar';
import DashboardSidebar from '../components/DashboardSidebar';
import PredictionForm from '../components/PredictionForm';
import ResultCard from '../components/ResultCard';
import RecentPredictions from '../components/RecentPredictions';
import AnalyticsCharts from '../components/AnalyticsCharts';
import NewsFeed from '../components/NewsFeed';

const API_BASE_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/predict` : 'http://localhost:5000/api/predict';

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  // Chat State
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  // Analytics State
  const [analytics, setAnalytics] = useState(null);
  
  // History State
  const [historyData, setHistoryData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchHistory();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, page]);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/history`, {
        params: { page, limit: 5, search, sort: 'desc' }
      });
      setHistoryData(response.data.data || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching history:', error);
      toast.error('Failed to fetch prediction history');
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/analytics`);
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const handlePredict = async (payload) => {
    setLoading(true);
    setResult(null);
    try {
      const response = await axios.post(API_BASE_URL, payload);
      setResult(response.data);
      toast.success('Analysis complete!');
      
      // Refresh data
      setPage(1);
      fetchHistory();
      fetchAnalytics();
    } catch (error) {
      console.error('Prediction failed:', error);
      toast.error('Failed to analyze news. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = { role: 'user', content: chatInput };
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const baseApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await axios.post(`${baseApiUrl}/chat`, {
        message: chatInput,
        history: chatMessages
      });
      setChatMessages(prev => [...prev, { role: 'assistant', content: response.data.reply }]);
    } catch (error) {
      console.error('Chat error:', error);
      toast.error('Failed to get response from AI.');
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans flex flex-col relative overflow-hidden">
      
      {/* Subtle Background Glows */}
      <div className="absolute top-[20%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-fuchsia-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <DashboardTopbar onMenuToggle={() => setIsMobileSidebarOpen(true)} />
      
      <div className="flex flex-1 overflow-hidden z-10">
        
        {/* Mobile Sidebar Overlay */}
        {isMobileSidebarOpen && (
          <div className="fixed inset-0 z-40 md:hidden flex">
            <div className="fixed inset-0 bg-[#020617]/80 backdrop-blur-sm" onClick={() => setIsMobileSidebarOpen(false)}></div>
            <div className="relative z-50">
              <DashboardSidebar activeTab={activeTab} onTabChange={(tab) => { setActiveTab(tab); setIsMobileSidebarOpen(false); }} />
            </div>
          </div>
        )}

        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <DashboardSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
        
        {/* Main Content Area */}
        <main className="flex-1 w-full md:ml-64 p-4 md:p-6 overflow-y-auto h-[calc(100vh-64px)]">
          
          <div className="mb-6 md:mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">Intelligence Dashboard</h2>
            <p className="text-slate-400 text-xs md:text-sm mt-1">Real-time semantic analysis and threat detection metrics.</p>
          </div>

          {/* Main Content Area Conditional Rendering */}
          {(activeTab === 'Dashboard' || activeTab === 'Analyze Tools') && (
            <>
              {/* Top Row: Input & Result */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
                <PredictionForm onPredict={handlePredict} loading={loading} />
                <ResultCard result={result} loading={loading} />
              </div>

              {/* Bottom Row: History & Charts */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6 pb-12">
                <div className="xl:col-span-1 min-h-[400px]">
                  <RecentPredictions 
                    historyData={historyData}
                    search={search}
                    onSearch={setSearch}
                    page={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                  />
                </div>
                
                <div className="xl:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                   <AnalyticsCharts analytics={analytics} />
                </div>
              </div>
            </>
          )}

          {activeTab === 'Prediction History' && (
            <div className="h-full pb-12">
              <RecentPredictions 
                historyData={historyData}
                search={search}
                onSearch={setSearch}
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          )}

          {activeTab === 'System Analytics' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 pb-12">
               <AnalyticsCharts analytics={analytics} />
            </div>
          )}

          {activeTab === 'Discover' && (
            <NewsFeed />
          )}

          {activeTab === 'About Us' && (
            <div className="pb-12 max-w-3xl mx-auto w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 bg-gradient-to-br from-indigo-500/10 to-fuchsia-500/10 border border-indigo-500/20 rounded-2xl p-8 text-center">
                  <div className="w-14 h-14 bg-indigo-500/20 border border-indigo-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">🧠</span>
                  </div>
                  <h2 className="text-2xl font-black text-white mb-1">NewsPulse</h2>
                  <p className="text-indigo-400 text-sm font-medium mb-4">AI-Powered Fake News Detection Platform</p>
                  <p className="text-slate-300 text-sm leading-relaxed max-w-xl mx-auto">
                    NewsPulse was built to tackle one of the most pressing challenges of our digital age — the rapid spread of misinformation. 
                    We help individuals and organizations instantly verify the credibility of news articles.
                  </p>
                </div>

                <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6">
                  <h3 className="text-white font-bold text-base mb-4 flex items-center gap-2">🎯 Our Mission</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    To democratize access to truth. We believe every person deserves accurate information and the tools to identify when they are being misled. 
                    Fake news destroys trust, incites fear, and causes real-world harm — we are here to fight that.
                  </p>
                </div>

                <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6">
                  <h3 className="text-white font-bold text-base mb-4 flex items-center gap-2">👥 Built By</h3>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-xl font-bold text-indigo-300">T</div>
                    <div>
                      <div className="text-white font-bold text-sm">Talat Siddiqui</div>
                      <div className="text-slate-400 text-xs">Full-Stack Developer & AI Integrations</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Support Us' && (
            <div className="pb-12 max-w-3xl mx-auto w-full">
              <div className="mb-8 bg-gradient-to-br from-fuchsia-500/10 to-indigo-500/10 border border-fuchsia-500/20 rounded-2xl p-8 text-center">
                <div className="text-5xl mb-4">💜</div>
                <h2 className="text-2xl font-black text-white mb-3">Support NewsPulse</h2>
                <p className="text-slate-400 text-sm max-w-lg mx-auto leading-relaxed">
                  NewsPulse is a free project built with passion. If this platform helped you or you believe in our mission of fighting fake news, consider supporting us directly.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Direct Contribution */}
                <div className="bg-slate-800/40 border border-yellow-500/20 rounded-2xl p-6 text-center hover:border-yellow-500/40 hover:bg-yellow-500/5 transition-all">
                  <div className="text-4xl mb-3">💸</div>
                  <h3 className="text-white font-bold mb-2">Send a Contribution</h3>
                  <p className="text-slate-400 text-xs mb-3 leading-relaxed">Every rupee helps us keep this platform alive. Send directly to our UPI.</p>
                  <div className="bg-slate-900/60 border border-yellow-500/20 rounded-xl p-3 mb-3">
                    <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">UPI ID</p>
                    <p className="text-yellow-300 font-bold text-sm">talatsiddiqui028@oksbi</p>
                  </div>
                  <button onClick={() => { navigator.clipboard.writeText('talatsiddiqui028@oksbi'); }} className="text-xs font-bold bg-yellow-500 text-slate-900 px-4 py-2 rounded-lg hover:bg-yellow-400 transition-colors w-full">
                    Copy UPI ID 📋
                  </button>
                </div>

                {/* GitHub Star */}
                <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 text-center hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all">
                  <div className="text-4xl mb-3">⭐</div>
                  <h3 className="text-white font-bold mb-2">Star on GitHub</h3>
                  <p className="text-slate-400 text-xs mb-4 leading-relaxed">Give us a star! It helps others discover the project and motivates us to keep building.</p>
                  <a href="https://github.com" target="_blank" rel="noreferrer" className="inline-block text-xs font-bold bg-slate-700 text-white px-4 py-2 rounded-lg hover:bg-slate-600 transition-colors border border-slate-600 w-full">
                    Star on GitHub ⭐
                  </a>
                </div>

                {/* Spread */}
                <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 text-center hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all">
                  <div className="text-4xl mb-3">📣</div>
                  <h3 className="text-white font-bold mb-2">Spread the Word</h3>
                  <p className="text-slate-400 text-xs mb-4 leading-relaxed">Share NewsPulse with your friends and family. Fighting fake news starts with awareness.</p>
                  <button onClick={() => { navigator.clipboard.writeText(window.location.origin); }} className="text-xs font-bold bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-500 transition-colors w-full">Copy Link 🔗</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Contact Us' && (
            <div className="pb-12 max-w-2xl mx-auto w-full">
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-black text-white mb-2">Get In Touch</h2>
                <p className="text-slate-400 text-sm">Have a question, feedback, or want to collaborate? We'd love to hear from you.</p>
              </div>
              
              <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 mb-6">
                <div className="grid grid-cols-1 gap-4 mb-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-400 mb-1.5 block">Your Name</label>
                      <input type="text" placeholder="Your name" className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 outline-none transition-colors" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-400 mb-1.5 block">Email Address</label>
                      <input type="email" placeholder="you@example.com" className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 outline-none transition-colors" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 mb-1.5 block">Subject</label>
                    <input type="text" placeholder="e.g., Feature Request, Bug Report, Collaboration" className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 outline-none transition-colors" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 mb-1.5 block">Message</label>
                    <textarea rows="5" placeholder="Tell us what's on your mind..." className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 outline-none transition-colors resize-none" />
                  </div>
                </div>
                <button className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-xl transition-colors shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                  Send Message ✉️
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center text-lg shrink-0">📧</div>
                  <div>
                    <div className="text-xs text-slate-500 font-bold">Email</div>
                    <div className="text-sm text-white font-medium">talatsiddiqui028@gmail.com</div>
                  </div>
                </div>
                <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-fuchsia-500/20 rounded-lg flex items-center justify-center text-lg shrink-0">🐙</div>
                  <div>
                    <div className="text-xs text-slate-500 font-bold">GitHub</div>
                    <a href="https://github.com" target="_blank" rel="noreferrer" className="text-sm text-fuchsia-400 font-medium hover:underline">github.com/talat</a>
                  </div>
                </div>
              </div>
            </div>
          )}


        </main>
      </div>
      
      {/* Global Chatbot Widget */}
      <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 shadow-2xl border border-slate-700/50 overflow-hidden ${isChatOpen ? 'w-[320px] rounded-2xl bg-slate-900' : 'w-14 h-14 rounded-full bg-indigo-500'}`}>
        
        {/* Minimized State */}
        {!isChatOpen && (
          <button 
            onClick={() => setIsChatOpen(true)}
            className="w-full h-full flex items-center justify-center hover:bg-indigo-600 transition-colors shadow-lg shadow-indigo-500/20"
          >
            <MessageSquare className="w-6 h-6 text-white" />
          </button>
        )}

        {/* Maximized State */}
        {isChatOpen && (
          <div className="flex flex-col h-[400px]">
            {/* Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-500/20 border border-indigo-500/50 rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(99,102,241,0.2)]">
                  <Bot className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white leading-none">NewsPulse AI</div>
                  <div className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Online
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsChatOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-800 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-slate-400 hover:text-white" />
              </button>
            </div>
            
            {/* Body */}
            <div className="flex-1 p-4 bg-slate-800/30 overflow-y-auto flex flex-col gap-4">
              <div className="bg-slate-800 px-4 py-3 rounded-2xl rounded-tl-sm text-sm text-slate-300 shadow-sm border border-slate-700 w-[85%]">
                👋 Hi! I'm NewsPulse AI. Fake news is one of the biggest threats today — I'm here to help you spot it, understand it, and fight it. What would you like to know?
              </div>
              
              {chatMessages.length === 0 && (
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => setChatInput('Why is fake news dangerous?')} className="text-xs border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5 rounded-full text-indigo-300 hover:bg-indigo-500/20 hover:text-indigo-200 transition-colors">Why is fake news dangerous?</button>
                    <button onClick={() => setChatInput('How can I spot fake news?')} className="text-xs border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5 rounded-full text-indigo-300 hover:bg-indigo-500/20 hover:text-indigo-200 transition-colors">How can I spot fake news?</button>
                  </div>
              )}

              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`px-4 py-3 rounded-2xl text-sm shadow-sm border max-w-[85%] ${
                    msg.role === 'user' 
                    ? 'bg-indigo-600 text-white border-indigo-500 rounded-tr-sm self-end' 
                    : 'bg-slate-800 text-slate-300 border-slate-700 rounded-tl-sm'
                }`}>
                  {msg.content}
                </div>
              ))}

              {isChatLoading && (
                  <div className="bg-slate-800 px-4 py-3 rounded-2xl rounded-tl-sm text-sm text-slate-300 shadow-sm border border-slate-700 w-16 flex justify-center">
                    <span className="flex space-x-1">
                      <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></span>
                      <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-75"></span>
                      <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-150"></span>
                    </span>
                  </div>
              )}
            </div>
            
            {/* Footer Input */}
            <form onSubmit={handleSendMessage} className="p-3 bg-slate-900 border-t border-slate-800 shrink-0">
              <div className="relative flex items-center">
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask a question..." 
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-full py-2.5 pl-4 pr-12 text-sm outline-none focus:border-indigo-500 placeholder-slate-500 transition-colors" 
                />
                <button type="submit" disabled={isChatLoading} className="absolute right-1 w-8 h-8 bg-indigo-500 hover:bg-indigo-600 rounded-full flex items-center justify-center text-white transition-colors disabled:opacity-50">
                  <svg className="w-4 h-4 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

    </div>
  );
};

export default Dashboard;
