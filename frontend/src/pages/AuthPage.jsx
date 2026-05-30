import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Brain, Lock, Mail, ChevronRight, Eye, EyeOff } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/auth` : 'http://localhost:5000/api/auth';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = isLogin ? '/login' : '/register';
      const response = await axios.post(`${API_BASE_URL}${endpoint}`, { email, password });
      
      const { token, user } = response.data;
      
      // Save to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Configure axios default headers for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      toast.success(isLogin ? 'Welcome back!' : 'Account created successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col font-sans relative overflow-hidden text-slate-100">
      
      {/* Decorative Backgrounds */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/10 rounded-full blur-[120px] -z-10 animate-pulse"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-fuchsia-600/10 rounded-full blur-[120px] -z-10 animate-pulse delay-1000"></div>

      {/* Header (Logo Only) */}
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

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-8 relative z-10">
        
        {/* Centered Welcome Text */}
        <div className="text-center mb-10">
          <h2 className="text-3xl lg:text-4xl font-black text-white mb-4 leading-tight">
            Welcome to <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-fuchsia-400">
              NewsPulse Intelligence
            </span>
          </h2>
          <p className="text-slate-400 max-w-md mx-auto text-base">
            Log in or create a new account to start detecting misinformation with enterprise AI.
          </p>
        </div>

        {/* Centered Form Card */}
        <div className="w-full max-w-sm">
          <div className="bg-slate-800/40 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.5)] border border-slate-700/50 backdrop-blur-xl">
              
              {/* Form Toggle */}
              <div className="flex bg-slate-900/50 p-1 rounded-xl mb-8 border border-slate-700/30">
                <button 
                  onClick={() => setIsLogin(true)}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${isLogin ? 'bg-indigo-500 shadow-sm text-white' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  Login
                </button>
                <button 
                  onClick={() => setIsLogin(false)}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${!isLogin ? 'bg-indigo-500 shadow-sm text-white' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  Sign Up
                </button>
              </div>

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
                      className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-sm text-white focus:bg-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder-slate-600" 
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 ml-1">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 text-slate-500" />
                    </div>
                    <input 
                      type={showPassword ? 'text' : 'password'} 
                      placeholder="••••••••" 
                      required 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-sm text-white focus:bg-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder-slate-600" 
                    />
                    <div 
                      className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-slate-500 hover:text-slate-300" />
                      ) : (
                        <Eye className="h-4 w-4 text-slate-500 hover:text-slate-300" />
                      )}
                    </div>
                  </div>
                </div>

                {isLogin && (
                  <div className="flex items-center justify-between pt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-indigo-500 focus:ring-indigo-500" defaultChecked />
                      <span className="text-xs font-medium text-slate-400">Remember me</span>
                    </label>
                    <Link to="/forgot-password" className="text-xs font-bold text-indigo-400 hover:text-indigo-300">Forgot password?</Link>
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-3.5 bg-indigo-500 hover:bg-indigo-600 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-[0_0_15px_rgba(79,70,229,0.3)] transition-all flex items-center justify-center gap-2 mt-4"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      {isLogin ? 'Secure Login' : 'Create Account'}
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>

              </form>

              <div className="mt-8 text-center text-sm font-medium text-slate-500">
                {isLogin ? "New to NewsPulse? " : "Already have an account? "}
                <button onClick={() => setIsLogin(!isLogin)} className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors">
                  {isLogin ? 'Sign Up' : 'Log In'}
                </button>
              </div>

            </div>
          </div>

      </main>

    </div>
  );
};

export default AuthPage;
