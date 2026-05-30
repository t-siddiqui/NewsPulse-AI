import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Brain, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const baseApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      await axios.post(`${baseApiUrl}/auth/forgot-password`, { email });
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col font-sans relative overflow-hidden text-slate-100">
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/10 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-fuchsia-600/10 rounded-full blur-[120px] -z-10 animate-pulse delay-1000" />

      <header className="px-8 py-6 w-full max-w-7xl mx-auto z-10">
        <Link to="/" className="flex items-center gap-3 w-max">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            News<span className="text-indigo-400">Pulse</span>
          </h1>
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-8 relative z-10">
        <div className="w-full max-w-sm">

          {!sent ? (
            <>
              <div className="text-center mb-8">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-7 h-7 text-indigo-400" />
                </div>
                <h2 className="text-2xl font-black text-white mb-2">Forgot Password?</h2>
                <p className="text-slate-400 text-sm">
                  Enter your email and we'll send you a secure link to reset your password.
                </p>
              </div>

              <div className="bg-slate-800/40 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.5)] border border-slate-700/50 backdrop-blur-xl">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 ml-1">Email Address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-4 w-4 text-slate-500" />
                      </div>
                      <input
                        type="email"
                        placeholder="hello@example.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-sm text-white focus:bg-slate-800 focus:border-indigo-500 outline-none transition-all placeholder-slate-600"
                      />
                    </div>
                  </div>

                  {error && (
                    <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-indigo-500 hover:bg-indigo-600 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-[0_0_15px_rgba(79,70,229,0.3)] transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : 'Send Reset Link'}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <Link to="/auth" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-indigo-400 transition-colors">
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
                  </Link>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-slate-800/40 rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.5)] border border-slate-700/50 backdrop-blur-xl text-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-7 h-7 text-emerald-400" />
              </div>
              <h2 className="text-xl font-black text-white mb-2">Check Your Email</h2>
              <p className="text-slate-400 text-sm mb-1">We sent a password reset link to</p>
              <p className="text-indigo-400 font-bold text-sm mb-6">{email}</p>
              <p className="text-slate-500 text-xs mb-6">The link expires in 30 minutes. Check your spam folder if you don't see it.</p>
              <Link to="/auth" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-indigo-400 transition-colors">
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ForgotPasswordPage;
