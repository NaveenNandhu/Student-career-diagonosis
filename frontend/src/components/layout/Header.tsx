import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Menu, Bell, Search, User as UserIcon, ShieldAlert,
  ChevronDown, LogOut, CheckCircle2, RefreshCw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { DemoModeBadge } from '../common/DemoModeBadge';
import { Role } from '../../services/types';

interface HeaderProps {
  onOpenSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSidebar }) => {
  const { user, role, switchRole, logout, unreadNotificationsCount, setUnreadNotificationsCount, realtimeConnected } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const notificationRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getPageTitle = (path: string) => {
    switch (path) {
      case '/dashboard':
        return 'Student Intelligence Dashboard';
      case '/academic':
        return 'Academic Intelligence & Early Review';
      case '/misconceptions':
        return 'AI Misconception Hunter';
      case '/career':
        return 'AI Career Compass & Roadmap';
      case '/jobshield':
        return 'AI JobShield Scam Defense';
      case '/journey':
        return 'Integrated Student Journey (Naveen)';
      case '/faculty':
        return 'Faculty Review & Advisory Portal';
      default:
        return 'Student Success & Career Intelligence';
    }
  };

  const sampleNotifications = [
    { id: 1, title: 'JobShield Alert', text: 'Scam flagged: Upfront registration fee demand detected.', time: '10m ago', urgent: true },
    { id: 2, title: 'Academic Review', text: 'Faculty feedback added for Database Systems CS302.', time: '1h ago', urgent: false },
    { id: 3, title: 'Career Roadmap', text: 'New SQL challenge assigned for Data Analyst milestone.', time: '2h ago', urgent: false },
  ];

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 px-4 lg:px-8 flex items-center justify-between shadow-2xs">
      {/* Left: Mobile Menu & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-base font-bold text-navy-800 tracking-tight">
            {getPageTitle(location.pathname)}
          </h2>
          <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-500">
            <span>Enterprise SaaS Platform</span>
            <span>•</span>
            <span className="text-brand-orange font-medium">Sasurie College of Engineering</span>
          </div>
        </div>
      </div>

      {/* Right: Search, Notifications, Demo Badge & Profile Menu */}
      <div className="flex items-center gap-3">
        <DemoModeBadge />
        
        {/* Real-time WebSocket Connection Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-semibold">
          <span className={`w-2 h-2 rounded-full ${realtimeConnected ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
          <span>{realtimeConnected ? 'Real-time Sync' : 'Connecting...'}</span>
        </div>

        {/* Global Search Bar */}
        <div className="hidden md:flex items-center relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search skills, courses, scam flags..."
            className="w-48 xl:w-64 pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:bg-white transition-all"
          />
        </div>

        {/* Notifications Icon & Popover */}
        <div ref={notificationRef} className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 relative transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in duration-150">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-navy-800">Notifications ({unreadNotificationsCount})</span>
                <button
                  onClick={() => setUnreadNotificationsCount(0)}
                  className="text-[11px] text-orange-600 hover:underline font-medium"
                >
                  Mark all read
                </button>
              </div>
              <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
                {sampleNotifications.map((n) => (
                  <div key={n.id} className="p-3 hover:bg-slate-50 text-xs">
                    <div className="flex items-center justify-between">
                      <span className={`font-semibold ${n.urgent ? 'text-rose-600' : 'text-slate-800'}`}>
                        {n.title}
                      </span>
                      <span className="text-[10px] text-slate-400">{n.time}</span>
                    </div>
                    <p className="text-slate-600 mt-1">{n.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile & Demo Switcher Dropdown */}
        <div ref={profileMenuRef} className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors border border-slate-200/80"
          >
            <div className="w-8 h-8 rounded-full bg-navy-800 text-white flex items-center justify-center text-xs font-bold shadow-2xs">
              {user?.full_name?.charAt(0) || 'N'}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-semibold text-slate-800 leading-tight">
                {user?.full_name || 'Naveen'}
              </div>
              <div className="text-[10px] text-slate-500 capitalize">
                Role: <span className="text-orange-600 font-semibold">{role}</span>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
              <div className="px-4 py-2 border-b border-slate-100">
                <div className="text-xs font-bold text-navy-800">{user?.full_name}</div>
                <div className="text-[11px] text-slate-500">{user?.email}</div>
                <div className="text-[10px] text-orange-600 font-medium mt-0.5">{user?.department}</div>
                <div className="text-[10px] text-slate-400 capitalize mt-0.5">Role: <strong className="text-navy-800">{role}</strong></div>
              </div>

              <button
                onClick={() => {
                  logout();
                  setShowProfileMenu(false);
                  navigate('/login');
                }}
                className="w-full text-left px-4 py-2.5 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-semibold transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
