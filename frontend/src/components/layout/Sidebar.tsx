import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, GraduationCap, Target, Compass,
  ShieldCheck, Route, Users, Sparkles, X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { role } = useAuth();

  // Prevent background scrolling on mobile when sidebar drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Academic Intelligence', path: '/academic', icon: GraduationCap },
    { label: 'AI Misconception Hunter', path: '/misconceptions', icon: Target },
    { label: 'AI Career Compass', path: '/career', icon: Compass, roleRestrict: 'student' },
    { label: 'AI JobShield', path: '/jobshield', icon: ShieldCheck, badge: 'Protected' },
    { label: 'Integrated Student Journey', path: '/journey', icon: Route, badge: 'Workflow', roleRestrict: 'student' },
    { label: 'Faculty Review Portal', path: '/faculty', icon: Users, roleRestrict: 'faculty' },
  ];

  const filteredNavItems = navItems.filter((item) => {
    if (!item.roleRestrict) return true;
    if (item.roleRestrict === 'faculty') return role === 'faculty' || role === 'admin';
    if (item.roleRestrict === 'student') return role === 'student';
    return true;
  });

  return (
    <>
      {/* Mobile Backdrop with Smooth Fade & Blur */}
      <div
        className={`fixed inset-0 z-40 bg-navy-950/70 backdrop-blur-sm lg:hidden transition-opacity duration-300 ease-in-out ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar Drawer with Cubic-Bezier Smooth Slide Animation */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-72 sm:w-64 bg-navy-800 text-white transition-transform duration-300 ease-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        } flex flex-col border-r border-navy-900/60 select-none`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-slate-700/60 bg-navy-900/30">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-orange flex items-center justify-center text-white shadow-md transform transition-transform hover:scale-105">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-white leading-tight">Student Success</h1>
              <p className="text-[10px] text-orange-300 font-medium">& Career Intelligence</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors lg:hidden cursor-pointer"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Institution Badge Banner */}
        <div className="px-4 py-3 bg-navy-900/80 mx-3 mt-3.5 rounded-xl border border-slate-700/60 flex items-center justify-between text-xs shadow-inner">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-orange-400 font-bold">Sasurie College of Eng.</div>
            <div className="text-slate-300 text-[11px] font-medium">Enterprise Realtime Portal</div>
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-sm" title="Realtime System Active" />
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto custom-scrollbar">
          <div className="px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Core Product Modules
          </div>
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 group ${
                    isActive
                      ? 'bg-brand-orange text-white font-semibold shadow-md translate-x-1'
                      : 'text-slate-300 hover:bg-slate-700/60 hover:text-white hover:translate-x-1'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
                  <span className="tracking-tight">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded-md bg-orange-400/20 text-orange-300 border border-orange-400/30">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User Info Footer */}
        <div className="p-4 border-t border-slate-700/60 bg-navy-900/60">
          <div className="text-[11px] text-slate-400 font-medium">Platform Role & Status</div>
          <div className="text-xs font-semibold text-slate-200 mt-1 flex items-center justify-between">
            <span className="truncate">Role: <strong className="text-orange-400 capitalize">{role}</strong></span>
            <span className="text-[10px] px-2 py-0.5 bg-emerald-950 text-emerald-300 font-semibold rounded-md border border-emerald-800 shrink-0">
              Session Live
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
