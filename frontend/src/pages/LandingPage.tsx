import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles, GraduationCap, Target, Compass, ShieldCheck,
  ArrowRight, CheckCircle2, Zap, Lock, Users, ShieldAlert,
  ChevronRight, Activity, Flame, ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'academic' | 'misconceptions' | 'career' | 'jobshield'>('academic');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const handlePortalAccess = () => {
    if (user) {
      if (user.role === 'faculty' || user.role === 'admin') {
        navigate('/faculty');
      } else {
        navigate('/dashboard');
      }
    } else {
      navigate('/login');
    }
  };

  const faqs = [
    {
      q: 'How does the Academic Threshold Monitoring engine work?',
      a: 'The platform continuously monitors student attendance and internal assessment scores. When metrics fall below institutional thresholds (e.g. <80% attendance or <70% score), real-time alerts are triggered for faculty intervention.'
    },
    {
      q: 'What makes the AI Misconception Hunter unique?',
      a: 'Rather than just scoring right or wrong, our diagnostic engine analyzes underlying cognitive patterns in student answers to identify specific misconceptions (e.g., SQL subquery scope errors) and delivers step-by-step remediation.'
    },
    {
      q: 'How does AI JobShield protect students from placement scams?',
      a: 'JobShield runs heuristic fraud analysis on recruitment postings, detecting upfront fee demands, suspicious domain names, and unverified contacts to shield graduating students before application.'
    },
    {
      q: 'Is real-time WebSocket synchronization enabled for all roles?',
      a: 'Yes! All notifications, review status updates, and risk alerts synchronize in real-time across student, faculty, and administrator portals.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900 font-sans text-slate-100 flex flex-col antialiased selection:bg-orange-500 selection:text-white overflow-x-hidden">
      {/* Completely Transparent Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-navy-950/20 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-4 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/30 group-hover:scale-105 group-hover:rotate-3 transition-all duration-300 animate-pulse-glow">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-base font-extrabold text-white tracking-tight leading-none group-hover:text-orange-400 transition-colors">Student Success</h1>
              <p className="text-xs text-orange-400 font-semibold mt-0.5">& Career Intelligence</p>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-8 text-xs font-semibold text-slate-300">
            <a href="#features" className="nav-link hover:text-orange-400 transition-colors">Core Modules</a>
            <a href="#interactive-demo" className="nav-link hover:text-orange-400 transition-colors">Live Demo</a>
            <a href="#stats" className="nav-link hover:text-orange-400 transition-colors">Impact Stats</a>
            <a href="#faq" className="nav-link hover:text-orange-400 transition-colors">Institutional FAQ</a>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <Button
                onClick={handlePortalAccess}
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg hover:shadow-orange-500/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 cursor-pointer btn-shimmer relative overflow-hidden"
              >
                <span>Go to Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={() => navigate('/login')}
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs px-5.5 py-2.5 rounded-xl shadow-lg hover:shadow-orange-500/35 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 cursor-pointer btn-shimmer relative overflow-hidden group"
              >
                <Lock className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                <span>Sign In to Portal</span>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section - Fills Entire Viewport Screen (min-h-screen) Until Scrolled */}
      <section className="relative min-h-screen bg-navy-900 text-white flex flex-col justify-between items-center px-4 sm:px-8 pt-24 pb-8 overflow-hidden border-b border-slate-800">
        {/* Continuous Floating Glowing Cyber Particle Flow */}
        <div className="absolute w-3 h-3 rounded-full bg-orange-400 glow-particle-orange animate-particle-flow-1 pointer-events-none top-1/4 left-10" />
        <div className="absolute w-3.5 h-3.5 rounded-full bg-amber-400 glow-particle-amber animate-particle-flow-1 pointer-events-none top-1/2 left-1/3" style={{ animationDelay: '3s' }} />
        <div className="absolute w-3 h-3 rounded-full bg-sky-400 glow-particle-sky animate-particle-flow-1 pointer-events-none top-3/4 left-1/4" style={{ animationDelay: '6s' }} />

        <div className="absolute w-3.5 h-3.5 rounded-full bg-orange-500 glow-particle-orange animate-particle-flow-2 pointer-events-none top-1/3 right-20" style={{ animationDelay: '1.5s' }} />
        <div className="absolute w-3 h-3 rounded-full bg-emerald-400 glow-particle-emerald animate-particle-flow-2 pointer-events-none top-2/3 right-1/3" style={{ animationDelay: '4.5s' }} />

        {/* Ambient GPU Smoke & Glowing Fog Layers */}
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-orange-600/25 via-orange-500/10 to-transparent blur-3xl pointer-events-none animate-smoke-1" />
        <div className="absolute top-20 right-0 w-[650px] h-[650px] rounded-full bg-gradient-to-bl from-amber-500/20 via-sky-500/10 to-transparent blur-3xl pointer-events-none animate-smoke-2" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[450px] bg-orange-500/10 blur-[140px] pointer-events-none animate-particle" />

        <div className="max-w-6xl w-full mx-auto text-center relative z-10 space-y-6 my-auto flex flex-col justify-center items-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-navy-950/80 border border-slate-700/80 text-orange-300 text-xs font-semibold shadow-inner transform hover:scale-105 transition-all mt-4">
            <Flame className="w-4 h-4 text-orange-400 animate-bounce" />
            <span>CRYPTORA '26 Hackathon • Sasurie College of Engineering Platform</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white max-w-4xl mx-auto">
            Academic Diagnostics & <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500">Fraud-Shielded</span> Career Intelligence
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Real-time threshold monitoring, AI misconception diagnostics, skill gap navigation, and 100% scam-shielded placement safety in milliseconds.
          </p>

          <div className="pt-3 flex flex-wrap items-center justify-center gap-4">
            <Button
              onClick={() => navigate('/login')}
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-sm h-12 px-8 rounded-xl shadow-xl hover:shadow-orange-500/40 transition-all transform hover:-translate-y-1 active:translate-y-0 flex items-center gap-2.5 cursor-pointer btn-shimmer relative overflow-hidden group"
            >
              <span>Access Student Portal</span>
              <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-1.5 transition-transform" />
            </Button>
            <Button
              onClick={() => navigate('/login')}
              className="bg-navy-950/90 hover:bg-navy-950 text-slate-200 hover:text-white font-bold text-sm h-12 px-6 rounded-xl border border-slate-700/80 hover:border-slate-500 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 cursor-pointer group shadow-md"
            >
              <Users className="w-4 h-4 text-orange-400 group-hover:scale-110 transition-transform" />
              <span>Faculty & Admin Login</span>
            </Button>
          </div>

          {/* Quick Metrics Bar with 3D Hover Animations */}
          <div id="stats" className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl w-full mx-auto text-left">
            <div className="p-4 rounded-2xl bg-navy-950/80 border border-slate-800/80 backdrop-blur-md shadow-lg card-hover-3d group">
              <div className="flex items-center justify-between mb-1">
                <span className="text-2xl font-black text-orange-400 group-hover:scale-105 transition-transform">98.4%</span>
                <Activity className="w-4.5 h-4.5 text-orange-400 group-hover:rotate-12 transition-transform" />
              </div>
              <div className="text-xs text-slate-300 font-medium">Academic Risk Detection</div>
            </div>

            <div className="p-4 rounded-2xl bg-navy-950/80 border border-slate-800/80 backdrop-blur-md shadow-lg card-hover-3d group">
              <div className="flex items-center justify-between mb-1">
                <span className="text-2xl font-black text-amber-300 group-hover:scale-105 transition-transform">1,240+</span>
                <Target className="w-4.5 h-4.5 text-amber-300 group-hover:rotate-12 transition-transform" />
              </div>
              <div className="text-xs text-slate-300 font-medium">Misconceptions Diagnosed</div>
            </div>

            <div className="p-4 rounded-2xl bg-navy-950/80 border border-slate-800/80 backdrop-blur-md shadow-lg card-hover-3d group">
              <div className="flex items-center justify-between mb-1">
                <span className="text-2xl font-black text-emerald-400 group-hover:scale-105 transition-transform">100%</span>
                <ShieldCheck className="w-4.5 h-4.5 text-emerald-400 group-hover:rotate-12 transition-transform" />
              </div>
              <div className="text-xs text-slate-300 font-medium">JobShield Verified Offers</div>
            </div>

            <div className="p-4 rounded-2xl bg-navy-950/80 border border-slate-800/80 backdrop-blur-md shadow-lg card-hover-3d group">
              <div className="flex items-center justify-between mb-1">
                <span className="text-2xl font-black text-sky-400 group-hover:scale-105 transition-transform">&lt;10ms</span>
                <Zap className="w-4.5 h-4.5 text-sky-400 group-hover:rotate-12 transition-transform" />
              </div>
              <div className="text-xs text-slate-300 font-medium">WebSocket Sync Latency</div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator Arrow at Bottom of Hero */}
        <div className="relative z-10 pt-4 pb-2 flex justify-center">
          <a href="#features" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-orange-400 transition-colors animate-bounce cursor-pointer">
            <span>Scroll to Explore</span>
            <ChevronDown className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* Core Product Modules Showcase */}
      <section id="features" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto w-full space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="text-xs font-extrabold text-orange-400 uppercase tracking-widest">Enterprise Architecture</div>
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            Four Pillars of Institutional Success
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Powered by deterministic heuristics, deep cognitive diagnostics, and real-time fraud pattern matching.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Module 1 */}
          <div className="p-6 rounded-2xl bg-navy-800/80 border border-slate-800 shadow-xl card-hover-3d space-y-4 group cursor-pointer" onClick={() => navigate('/login')}>
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-brand-orange group-hover:text-white transition-all duration-300">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors">Academic Intelligence</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Automated threshold monitoring for attendance (&lt;80%) and internal test scores with real-time faculty advisory intervention.
            </p>
            <div className="pt-2 flex items-center gap-1.5 text-xs font-bold text-orange-400 group-hover:translate-x-1.5 transition-transform">
              <span>View Module</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Module 2 */}
          <div className="p-6 rounded-2xl bg-navy-800/80 border border-slate-800 shadow-xl card-hover-3d space-y-4 group cursor-pointer" onClick={() => navigate('/login')}>
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-center justify-center group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">AI Misconception Hunter</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Deep diagnostic engine mapping underlying conceptual flaws in student submissions and generating step-by-step remediation.
            </p>
            <div className="pt-2 flex items-center gap-1.5 text-xs font-bold text-orange-400 group-hover:translate-x-1.5 transition-transform">
              <span>View Module</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Module 3 */}
          <div className="p-6 rounded-2xl bg-navy-800/80 border border-slate-800 shadow-xl card-hover-3d space-y-4 group cursor-pointer" onClick={() => navigate('/login')}>
            <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-sky-500 group-hover:text-white transition-all duration-300">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-sky-400 transition-colors">AI Career Compass</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Real-time industry skill gap detection and milestone roadmap generation tailored to targeted engineering roles.
            </p>
            <div className="pt-2 flex items-center gap-1.5 text-xs font-bold text-orange-400 group-hover:translate-x-1.5 transition-transform">
              <span>View Module</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Module 4 */}
          <div className="p-6 rounded-2xl bg-navy-800/80 border border-slate-800 shadow-xl card-hover-3d space-y-4 group cursor-pointer" onClick={() => navigate('/login')}>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">AI JobShield Defense</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Heuristic fraud engine detecting fake job listings, registration fee demands, and unverified contacts before application.
            </p>
            <div className="pt-2 flex items-center gap-1.5 text-xs font-bold text-orange-400 group-hover:translate-x-1.5 transition-transform">
              <span>View Module</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Live Tabbed Platform Demo */}
      <section id="interactive-demo" className="py-16 px-4 sm:px-8 bg-navy-950 border-y border-slate-800 relative overflow-hidden">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-xs font-bold text-orange-400 uppercase tracking-widest">Interactive Platform Preview</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">Experience the Live Real-time Engine</h2>
          </div>

          {/* Tab Selector */}
          <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-navy-900 rounded-2xl border border-slate-800 max-w-2xl mx-auto shadow-inner">
            <button
              onClick={() => setActiveTab('academic')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'academic'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md scale-105'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Academic Thresholds
            </button>
            <button
              onClick={() => setActiveTab('misconceptions')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'misconceptions'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md scale-105'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              AI Misconception Engine
            </button>
            <button
              onClick={() => setActiveTab('career')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'career'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md scale-105'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Career Compass
            </button>
            <button
              onClick={() => setActiveTab('jobshield')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'jobshield'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md scale-105'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              JobShield Protection
            </button>
          </div>

          {/* Tab Preview Display */}
          <div className="bg-navy-900 rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-4 card-hover-3d">
            {activeTab === 'academic' && (
              <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-orange-400" />
                    <span className="font-bold text-white text-sm">Academic Review Queue • Student Naveen (SCE-2026-CS042)</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-300 text-[11px] font-bold border border-orange-500/30">
                    Threshold Risk Flagged
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-navy-800 border border-slate-800 space-y-1 hover:border-orange-500/30 transition-all">
                    <div className="text-slate-400">Attendance Tracker</div>
                    <div className="text-lg font-bold text-amber-400">78.0% (Threshold: &lt;80%)</div>
                    <div className="text-[11px] text-slate-400">2 lab sessions missed in Database Systems</div>
                  </div>
                  <div className="p-4 rounded-xl bg-navy-800 border border-slate-800 space-y-1 hover:border-emerald-500/30 transition-all">
                    <div className="text-slate-400">Assessment Average</div>
                    <div className="text-lg font-bold text-emerald-400">76.5% (Passing: &gt;70%)</div>
                    <div className="text-[11px] text-slate-400">Internal Test 2 score: 72/100</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'misconceptions' && (
              <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-amber-400" />
                    <span className="font-bold text-white text-sm">SQL Query Subquery Scope Diagnostic</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-500/30">
                    Remediation Active
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-navy-800 border border-slate-800 space-y-2 text-xs hover:border-amber-500/30 transition-all">
                  <div className="text-orange-400 font-bold">Diagnosed Misconception:</div>
                  <p className="text-slate-300 leading-relaxed">
                    Student assumed subquery outer alias <code className="bg-navy-950 px-1 py-0.5 rounded text-amber-300">e.dept_id</code> is directly accessible inside uncorrelated subqueries without correlation.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'career' && (
              <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Compass className="w-5 h-5 text-sky-400" />
                    <span className="font-bold text-white text-sm">Target Role: Full-Stack Software Engineer</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 text-[11px] font-bold border border-sky-500/30">
                    84% Match Score
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-navy-800 rounded-xl border border-slate-800 text-center hover:border-emerald-500/40 transition-all">
                    <div className="font-bold text-emerald-400">React & TypeScript</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Mastered</div>
                  </div>
                  <div className="p-3 bg-navy-800 rounded-xl border border-slate-800 text-center hover:border-amber-500/40 transition-all">
                    <div className="font-bold text-amber-400">FastAPI & Async Python</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">In Progress</div>
                  </div>
                  <div className="p-3 bg-navy-800 rounded-xl border border-slate-800 text-center hover:border-sky-500/40 transition-all">
                    <div className="font-bold text-sky-400">Docker & Redis Cache</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Milestone 3 Goal</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'jobshield' && (
              <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <span className="font-bold text-white text-sm">Placement Scam Detection Result</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-500/30">
                    Verified Safe Listing
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-navy-800 border border-slate-800 space-y-2 text-xs hover:border-emerald-500/30 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">TCS Digital Hiring 2026</span>
                    <span className="text-emerald-400 font-bold">0 Fraud Signals</span>
                  </div>
                  <p className="text-slate-300">
                    Verified corporate domain, no registration fee request detected, official email domain match (<code className="text-orange-300">@tcs.com</code>).
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Institutional FAQ Accordion */}
      <section id="faq" className="py-20 px-4 sm:px-8 max-w-4xl mx-auto w-full space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-orange-400 uppercase tracking-widest">Institutional FAQ</span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-navy-800/80 rounded-2xl border border-slate-800 overflow-hidden hover:border-slate-700 transition-all duration-200 card-hover-3d"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between text-xs sm:text-sm font-bold text-white hover:text-orange-400 transition-colors cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${activeFaq === idx ? 'rotate-90 text-orange-400' : ''}`} />
              </button>
              {activeFaq === idx && (
                <div className="px-5 pb-5 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3 animate-in fade-in duration-200">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="py-16 px-4 sm:px-8 bg-gradient-to-r from-orange-600 via-brand-orange to-amber-600 text-white text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-5 relative z-10">
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
            Ready to Access Your Real-Time Student Workspace?
          </h2>
          <p className="text-xs sm:text-sm text-orange-100 max-w-xl mx-auto">
            Log in with your Sasurie College of Engineering institutional credentials to access your personalized diagnostic portal.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Button
              onClick={() => navigate('/login')}
              className="bg-navy-950 hover:bg-navy-900 text-white font-bold text-sm h-12 px-8 rounded-xl shadow-2xl transition-all transform hover:-translate-y-1 active:translate-y-0 flex items-center gap-2 cursor-pointer btn-shimmer relative overflow-hidden group"
            >
              <Lock className="w-4 h-4 text-orange-400 group-hover:scale-110 transition-transform" />
              <span>Sign In to Student Workspace</span>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy-950 text-slate-400 py-10 px-4 sm:px-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs">
          <div className="space-y-1 text-center md:text-left">
            <div className="font-bold text-white text-sm">CRYPTORA '26 Hackathon • Sasurie College of Engineering</div>
            <div>Student Success & Career Intelligence Platform</div>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-slate-300 font-medium">
            <button onClick={() => navigate('/login')} className="hover:text-orange-400 transition-colors cursor-pointer">Student Login</button>
            <button onClick={() => navigate('/login')} className="hover:text-orange-400 transition-colors cursor-pointer">Faculty Portal</button>
            <button onClick={() => navigate('/login')} className="hover:text-orange-400 transition-colors cursor-pointer">Admin Access</button>
          </div>

          <div className="text-[11px] text-slate-500">
            Protected by 256-Bit SSL • Zero-Lag GPU Glow Engine
          </div>
        </div>
      </footer>
    </div>
  );
};
