import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Brain, Lock, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      return setError('Password must be at least 6 characters.');
    }
    if (password !== confirm) {
      return setError('Passwords do not match.');
    }
    if (!token) {
      return setError('Invalid or missing reset token. Please request a new link.');
    }

    setLoading(true);
    try {
      const baseApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      await axios.post(`${baseApiUrl}/auth/reset-password`, { token, newPassword: password });
      setDone(true);
      setTimeout(() => navigate('/auth'), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Reset failed. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col font-sans relative overflow-hidden text-slate-100">
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/10 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-fuchsia-600/10 rounded-full blur-[120px] -z-10" />

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

      <main className="flex-1 flex flex-col items-center justify-center p-8 z-10">
        <div className="w-full max-w-sm">
          {!done ? (
            <>
              <div className="text-center mb-8">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-7 h-7 text-indigo-400" />
                </div>
                <h2 className="text-2xl font-black text-white mb-2">Set New Password</h2>
                <p className="text-slate-400 text-sm">Choose a strong password for your account.</p>
              </div>

              <div className="bg-slate-800/40 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.5)] border border-slate-700/50 backdrop-blur-xl">
                {!token && (
                  <div className="flex items-center gap-2 mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <p className="text-xs text-red-400">Invalid reset link. Please request a new one.</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 ml-1">New Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-4 w-4 text-slate-500" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Min. 6 characters"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-10 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-sm text-white focus:border-indigo-500 outline-none transition-all placeholder-slate-600"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOff className="h-4 w-4 text-slate-500" /> : <Eye className="h-4 w-4 text-slate-500" />}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 ml-1">Confirm Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-4 w-4 text-slate-500" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Repeat password"
                        required
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-sm text-white focus:border-indigo-500 outline-none transition-all placeholder-slate-600"
                      />
                    </div>
                  </div>

                  {error && (
                    <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={loading || !token}
                    className="w-full py-3.5 bg-indigo-500 hover:bg-indigo-600 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-[0_0_15px_rgba(79,70,229,0.3)] transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : 'Reset Password'}
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="bg-slate-800/40 rounded-3xl p-8 border border-slate-700/50 text-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-7 h-7 text-emerald-400" />
              </div>
              <h2 className="text-xl font-black text-white mb-2">Password Reset!</h2>
              <p className="text-slate-400 text-sm mb-1">Your password has been updated successfully.</p>
              <p className="text-slate-500 text-xs">Redirecting to login in 3 seconds...</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ResetPasswordPage;
