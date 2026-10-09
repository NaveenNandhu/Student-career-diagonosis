import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Breadcrumbs } from './Breadcrumbs';
import { useAuth } from '../../context/AuthContext';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, role } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // If not authenticated, redirect to login page
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }
    // Automatically redirect if user is on a role-restricted path
    if ((role === 'faculty' || role === 'admin') && (location.pathname === '/career' || location.pathname === '/journey')) {
      navigate('/faculty', { replace: true });
    } else if (role === 'student' && location.pathname === '/faculty') {
      navigate('/dashboard', { replace: true });
    }
  }, [user, role, location.pathname, navigate]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans antialiased text-slate-800 selection:bg-orange-500 selection:text-white">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="lg:pl-64 flex flex-col flex-1 min-h-screen transition-all duration-300">
        <Header onOpenSidebar={() => setSidebarOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          <Breadcrumbs />
          {children}
        </main>

        <footer className="py-4 px-4 sm:px-6 lg:px-8 border-t border-slate-200 bg-white text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-center sm:text-left">
            © 2026 CRYPTORA '26 Hackathon • Sasurie College of Engineering. Built for Student Success.
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span>Deterministic Heuristics Engine v1.0</span>
            <span>•</span>
            <span className="text-emerald-600 font-medium">Realtime SSL Active</span>
          </div>
        </footer>
      </div>
    </div>
  );
};
