import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Brain, ShieldCheck, BarChart2, CheckCircle2, FileText, Eye, ArrowRight, Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

const LandingPage = () => {
  const [visits, setVisits] = useState(0);

  useEffect(() => {
    const currentVisits = parseInt(localStorage.getItem('site_visits') || '12458', 10);
    const newVisits = currentVisits + 1;
    localStorage.setItem('site_visits', newVisits.toString());
    setVisits(newVisits);
  }, []);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans flex flex-col relative overflow-hidden">
      
      {/* Animated Gradient Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/30 rounded-full blur-[120px] -z-10 animate-pulse"></div>
      <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-fuchsia-600/20 rounded-full blur-[120px] -z-10 animate-pulse delay-1000"></div>

      {/* Header */}
      <header className="px-8 py-6 max-w-7xl mx-auto w-full z-10 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            News<span className="text-indigo-400">Pulse</span>
          </h1>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-medium text-slate-300">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
          <a href="#testimonials" className="hover:text-white transition-colors">Testimonials</a>
        </div>
        <div className="flex gap-4">
          <Link to="/auth" className="px-5 py-2.5 text-sm font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg backdrop-blur-md transition-all">
            Log in
          </Link>
          <Link to="/auth" className="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-500 hover:bg-indigo-600 rounded-lg shadow-[0_0_15px_rgba(79,70,229,0.5)] transition-all">
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-32 px-8 max-w-5xl mx-auto w-full flex flex-col items-center text-center relative z-10">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="flex flex-col items-center"
        >
          <motion.div variants={fadeIn} className="mb-6 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-sm font-semibold backdrop-blur-md flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
            Powered by DistilBERT Transformers
          </motion.div>
          
          <motion.h2 variants={fadeIn} className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">
            Detect Misinformation with <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-fuchsia-400">
               Semantic AI Precision
            </span>
          </motion.h2>
          
          <motion.p variants={fadeIn} className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Instantly analyze news articles and URLs using our enterprise-grade Transformer models. Get explainable insights, confidence scores, and protect yourself from clickbait.
          </motion.p>
          
          <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4">
            <Link to="/auth" className="flex items-center justify-center gap-2 px-8 py-4 bg-indigo-500 hover:bg-indigo-600 text-white text-lg font-bold rounded-xl transition-all shadow-[0_0_30px_rgba(79,70,229,0.4)] hover:shadow-[0_0_40px_rgba(79,70,229,0.6)]">
              Start Scanning <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="#demo" className="flex items-center justify-center gap-2 px-8 py-4 bg-slate-800/50 hover:bg-slate-800 text-white border border-slate-700 text-lg font-bold rounded-xl backdrop-blur-md transition-all">
              View Demo
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats/Logos Mockup */}
      <section className="py-10 border-y border-slate-800/50 bg-slate-900/50 backdrop-blur-sm z-10">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-8 opacity-60">
          <div className="flex flex-col items-center gap-1">
            <span className="text-3xl font-black text-white">97%</span>
            <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Accuracy Rate</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-3xl font-black text-white">&lt;150ms</span>
            <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Inference Speed</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-3xl font-black text-white">100k+</span>
            <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Articles Analyzed</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-20">
            <h3 className="text-3xl md:text-5xl font-bold mb-6">Enterprise-Grade <span className="text-indigo-400">Capabilities</span></h3>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">Our SaaS platform provides unparalleled insights into the authenticity of online content.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <motion.div whileHover={{ y: -5 }} className="bg-slate-800/40 border border-slate-700/50 p-8 rounded-2xl backdrop-blur-sm">
              <div className="w-14 h-14 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-6">
                <Brain className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-bold text-white mb-3">Explainable AI</h4>
              <p className="text-slate-400 leading-relaxed">Don't just get a fake/real label. See exactly which words, emotional manipulation, and patterns triggered the prediction.</p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div whileHover={{ y: -5 }} className="bg-slate-800/40 border border-slate-700/50 p-8 rounded-2xl backdrop-blur-sm">
              <div className="w-14 h-14 rounded-xl bg-fuchsia-500/20 border border-fuchsia-500/30 flex items-center justify-center text-fuchsia-400 mb-6">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-bold text-white mb-3">Smart URL Scraper</h4>
              <p className="text-slate-400 leading-relaxed">Paste any news link. Our backend automatically bypasses clutter, extracts the main article text, and scans it in milliseconds.</p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div whileHover={{ y: -5 }} className="bg-slate-800/40 border border-slate-700/50 p-8 rounded-2xl backdrop-blur-sm">
              <div className="w-14 h-14 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-6">
                <BarChart2 className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-bold text-white mb-3">Comprehensive Analytics</h4>
              <p className="text-slate-400 leading-relaxed">Track your scanning history, view total fake vs. real ratios, and analyze weekly trends via an intuitive dashboard.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Mockup */}
      <section id="testimonials" className="py-24 bg-slate-900/50 border-y border-slate-800/50 relative z-10">
        <div className="max-w-7xl mx-auto px-8">
          <h3 className="text-3xl font-bold text-center mb-16">Trusted by Researchers & Fact-Checkers</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-slate-800/60 p-8 rounded-2xl border border-slate-700">
              <div className="flex items-center gap-1 mb-4 text-amber-400">
                <Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" />
              </div>
              <p className="text-lg text-slate-300 italic mb-6">"The explainable AI highlights changed everything for our editorial team. It doesn't just block fake news, it teaches us how to spot linguistic manipulation."</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center font-bold text-xl">JD</div>
                <div>
                  <h5 className="font-bold text-white">Jane Doe</h5>
                  <span className="text-sm text-slate-400">Senior Editor, Digital Truth</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/60 p-8 rounded-2xl border border-slate-700">
              <div className="flex items-center gap-1 mb-4 text-amber-400">
                <Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" />
              </div>
              <p className="text-lg text-slate-300 italic mb-6">"Pasting a URL and getting a semantic classification in under a second is magical. The DistilBERT integration is remarkably fast and accurate."</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-fuchsia-500 rounded-full flex items-center justify-center font-bold text-xl">AS</div>
                <div>
                  <h5 className="font-bold text-white">Alex Smith</h5>
                  <span className="text-sm text-slate-400">Data Scientist</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-[#020617] border-t border-slate-800 pt-16 pb-8 relative z-10">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start gap-3">
            <div className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-indigo-500" />
              <span className="text-lg font-bold">NewsPulse AI</span>
            </div>
            <span className="text-sm text-slate-500">© 2026 NewsPulse. Empowering truth with AI.</span>
            
            <div className="flex items-center gap-2 mt-2 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700">
              <Eye className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-bold text-slate-400">Platform Scans: <span className="text-indigo-400">{visits.toLocaleString()}</span></span>
            </div>
          </div>
          
          <div className="flex gap-8 text-sm font-semibold text-slate-400">
            <a href="#" className="hover:text-white transition-colors">Documentation</a>
            <a href="#" className="hover:text-white transition-colors">API Access</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
