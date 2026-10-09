import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles, ShieldCheck, GraduationCap, Lock, Eye, EyeOff, Mail
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('naveen@sasurie.edu.in');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { loginAs } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Smooth authenticating delay
    await loginAs(email);
    setIsSubmitting(false);

    // Automatic role-based routing
    if (email.includes('faculty') || email.includes('aris') || email.includes('admin')) {
      navigate('/faculty');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-3 sm:p-6 font-sans">
      <div className="max-w-4xl w-full bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden grid grid-cols-1 md:grid-cols-2 my-auto transition-all duration-300">
        {/* Left Side: Enterprise Platform Branding */}
        <div className="bg-navy-800 p-6 sm:p-8 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-12 -bottom-12 w-48 h-48 rounded-full bg-orange-500/10 blur-2xl pointer-events-none" />
          
          <div>
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-brand-orange flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h1 className="text-sm sm:text-base font-bold tracking-tight">Student Success</h1>
                <p className="text-[11px] sm:text-xs text-orange-300 font-medium">& Career Intelligence</p>
              </div>
            </div>

            <div className="inline-block px-3 py-1 rounded-full bg-slate-700/60 text-orange-300 text-[10px] sm:text-[11px] font-semibold mb-4 sm:mb-6 border border-slate-600/50">
              Sasurie College of Engineering • Single Sign-On
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-tight mb-3">
              Academic Support.<br />Misconception Hunter.<br />Career Compass.
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              Unified institutional portal for students, faculty, and administrators. Enter your credentials below to automatically access your role workspace.
            </p>

            <div className="space-y-2.5 text-xs text-slate-300 border-t border-slate-700/60 pt-4">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-orange-400 shrink-0" />
                <span>Academic Intelligence & Threshold Monitoring</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-orange-400 shrink-0" />
                <span>AI Misconception Diagnostics & Remediation</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-orange-400 shrink-0" />
                <span>AI JobShield Fraud & Scam Defense</span>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 mt-6 sm:mt-8 border-t border-slate-700/50 pt-3 flex items-center justify-between">
            <span>Enterprise Portal v2.4</span>
            <span className="text-emerald-400 font-medium">SSL Encrypted</span>
          </div>
        </div>

        {/* Right Side: Single Unified Sign-In Form with Vertically Centered Responsive Layout */}
        <div className="p-6 sm:p-8 md:p-10 flex flex-col justify-center bg-white">
          <div className="my-auto py-2 sm:py-4">
            <div className="mb-5 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-bold text-navy-800">Account Sign In</h3>
              <p className="text-xs text-slate-500 mt-1">
                Enter your institutional credentials to access your workspace.
              </p>
            </div>

            {/* Single Unified Credentials Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email Address</label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-11 pl-10 pr-4 text-xs font-medium border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/60 focus:border-orange-500 bg-slate-50/50 focus:bg-white transition-all text-slate-800"
                    placeholder="name@sasurie.edu.in"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Password</label>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-11 pl-10 pr-11 text-xs font-medium border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/60 focus:border-orange-500 bg-slate-50/50 focus:bg-white transition-all text-slate-800"
                    placeholder="Enter password..."
                    required
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowPassword((prev) => !prev);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-10 text-slate-400 hover:text-navy-800 p-1 rounded-lg transition-colors cursor-pointer flex items-center justify-center"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4 text-orange-600" /> : <Eye className="w-4 h-4 text-slate-400" />}
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 text-xs py-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600 select-none">
                  <input type="checkbox" defaultChecked className="w-4 h-4 accent-orange-500 rounded border-slate-300 cursor-pointer" />
                  <span>Remember login on this device</span>
                </label>
                <span className="text-orange-600 font-semibold cursor-pointer hover:underline">Forgot password?</span>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 bg-navy-800 hover:bg-navy-900 text-white font-bold text-xs rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer"
                icon={isSubmitting ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Lock className="w-4 h-4" />}
              >
                {isSubmitting ? 'Authenticating Account...' : 'Sign In to Portal'}
              </Button>
            </form>
          </div>

          <p className="text-[11px] text-slate-400 text-center border-t border-slate-100 pt-3 mt-auto">
            Protected by 256-Bit SSL Encryption • Role-Based Access Control (RBAC) Active
          </p>
        </div>
      </div>
    </div>
  );
};
