import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  GraduationCap, Target, Compass, ShieldAlert,
  ArrowRight, CheckCircle2, AlertTriangle, TrendingUp,
  Sparkles, ShieldCheck, X
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { PrivacyNotice } from '../components/common/PrivacyNotice';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { StudentProfile } from '../services/types';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [showAlertBanner, setShowAlertBanner] = useState<boolean>(true);

  useEffect(() => {
    api.getStudentDetail(1)
      .then((data) => setProfile(data))
      .catch((err) => console.warn('Dashboard fetch error:', err));
  }, []);

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-navy-800 rounded-2xl p-6 text-white relative overflow-hidden shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-orange-300 font-medium mb-1">
              <span>{currentDate}</span>
              <span>•</span>
              <span>{user?.role === 'faculty' ? 'Faculty Overview' : 'Student Overview'}</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              Welcome back, {user?.full_name || 'User'}
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              {user?.role === 'faculty'
                ? 'Department: CS & IT • Class Review Roster: 5 Students Pending Review'
                : 'Target Role: Data Analyst • Academic Review: Action Scheduled'}
            </p>
          </div>

          <Button
            onClick={() => navigate(user?.role === 'faculty' ? '/faculty' : '/journey')}
            className="bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-semibold px-4 py-2 shrink-0"
            icon={<Sparkles className="w-4 h-4" />}
          >
            {user?.role === 'faculty' ? 'Faculty Review Portal' : "Naveen's Journey"}
          </Button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:border-orange-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Attendance</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-navy-800 mt-2">
            {profile?.attendance_rate || 81.5}%
          </div>
          <div className="flex items-center gap-1 text-xs text-amber-700 mt-1 font-medium">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Near 80% threshold</span>
          </div>
        </Card>

        <Card className="hover:border-orange-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Assessment Average</span>
            <div className="p-2 rounded-lg bg-orange-50 text-orange-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-navy-800 mt-2">
            {profile?.assessment_avg || 68.4}%
          </div>
          <div className="text-xs text-slate-500 mt-1">CS302 DBMS needs review</div>
        </Card>

        <Card className="hover:border-orange-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Career Readiness</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <Compass className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-navy-800 mt-2">72%</div>
          <div className="text-xs text-emerald-600 mt-1 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Data Analyst Match</span>
          </div>
        </Card>

        <Card className="hover:border-orange-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">JobShield Alerts</span>
            <div className="p-2 rounded-lg bg-rose-50 text-rose-600">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-rose-600 mt-2">1 Flagged</div>
          <div className="text-xs text-rose-600 mt-1 font-medium">Upfront fee scam detected</div>
        </Card>
      </div>

      {/* Scam Alert Banner with Toggle Dismiss */}
      {showAlertBanner && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-rose-900">JobShield Security Alert Flagged</h4>
                <Badge variant="danger" size="sm">High Priority</Badge>
              </div>
              <p className="text-xs text-rose-700 mt-0.5">
                Communication from Global Tech Solutions requested a $50 registration fee. Verified scam pattern.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              size="sm"
              variant="danger"
              onClick={() => navigate('/jobshield')}
              className="shrink-0"
            >
              Analyze Scam Details
            </Button>
            <button
              onClick={() => setShowAlertBanner(false)}
              className="p-1 rounded-lg text-rose-600 hover:bg-rose-100/60 transition-colors"
              title="Dismiss Alert"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Next Steps */}
      <Card title="Recommended Next Steps">
        <div className="space-y-3">
          <div className="p-3 rounded-xl border border-slate-200 bg-white hover:border-orange-300 transition-colors flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-700 font-bold text-xs flex items-center justify-center shrink-0">
                1
              </div>
              <div>
                <div className="text-xs font-bold text-navy-800">Resolve SQL JOIN Misconception</div>
                <div className="text-xs text-slate-500">Review INNER JOIN vs LEFT JOIN row retention rules.</div>
              </div>
            </div>
            <Link to="/misconceptions" className="text-xs font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1 shrink-0">
              Practice <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-3 rounded-xl border border-slate-200 bg-white hover:border-orange-300 transition-colors flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-700 font-bold text-xs flex items-center justify-center shrink-0">
                2
              </div>
              <div>
                <div className="text-xs font-bold text-navy-800">Complete Pandas & NumPy Task</div>
                <div className="text-xs text-slate-500">Phase 1 Data Analyst roadmap milestone.</div>
              </div>
            </div>
            <Link to="/career" className="text-xs font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1 shrink-0">
              View Roadmap <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-3 rounded-xl border border-slate-200 bg-white hover:border-orange-300 transition-colors flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-700 font-bold text-xs flex items-center justify-center shrink-0">
                3
              </div>
              <div>
                <div className="text-xs font-bold text-navy-800">Review Faculty Note</div>
                <div className="text-xs text-slate-500">Dr. Aris recommended peer tutoring for CS302.</div>
              </div>
            </div>
            <Link to="/academic" className="text-xs font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1 shrink-0">
              Details <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </Card>

      {/* Modules Quick Launch Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link to="/academic" className="block group">
          <Card className="h-full group-hover:border-orange-400 transition-colors">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="p-2 rounded-lg bg-navy-800 text-white">
                <GraduationCap className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-navy-800">Academic Intelligence</h3>
            </div>
            <p className="text-xs text-slate-500 mb-3">Attendance tracking and early review indicators.</p>
            <span className="text-xs font-semibold text-orange-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Open <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Card>
        </Link>

        <Link to="/misconceptions" className="block group">
          <Card className="h-full group-hover:border-orange-400 transition-colors">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="p-2 rounded-lg bg-brand-orange text-white">
                <Target className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-navy-800">Misconception Hunter</h3>
            </div>
            <p className="text-xs text-slate-500 mb-3">Diagnose missing concepts against rubrics.</p>
            <span className="text-xs font-semibold text-orange-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Open <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Card>
        </Link>

        <Link to="/career" className="block group">
          <Card className="h-full group-hover:border-orange-400 transition-colors">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="p-2 rounded-lg bg-navy-800 text-white">
                <Compass className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-navy-800">Career Compass</h3>
            </div>
            <p className="text-xs text-slate-500 mb-3">Skill gap analysis and learning roadmaps.</p>
            <span className="text-xs font-semibold text-orange-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Open <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Card>
        </Link>

        <Link to="/jobshield" className="block group">
          <Card className="h-full group-hover:border-orange-400 transition-colors">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="p-2 rounded-lg bg-brand-orange text-white">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-navy-800">AI JobShield</h3>
            </div>
            <p className="text-xs text-slate-500 mb-3">Job scam detection across 6 danger vectors.</p>
            <span className="text-xs font-semibold text-orange-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Open <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Card>
        </Link>
      </div>

      <PrivacyNotice />
    </div>
  );
};
