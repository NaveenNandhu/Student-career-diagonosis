import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Route, GraduationCap, Target, Compass, ShieldAlert,
  ArrowRight, CheckCircle2, Sparkles, User, FileText
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { api } from '../services/api';
import { NaveenJourney } from '../services/types';

export const JourneyPage: React.FC = () => {
  const navigate = useNavigate();
  const [journey, setJourney] = useState<NaveenJourney | null>(null);

  useEffect(() => {
    api.getNaveenJourney()
      .then((data) => setJourney(data))
      .catch((err) => console.warn('Journey fetch fallback:', err));
  }, []);

  const steps = journey?.steps || [
    {
      step_number: 1,
      module: 'Academic Intelligence',
      title: 'Academic Early Review Warning',
      summary: 'Attendance dropped to 81.5% and Database Systems midterm score dropped to 68.4%. Triggered faculty review indicator.',
      status: 'Reviewed - Action Plan',
      details: { course: 'CS302 Database Management Systems', attendance: '81.5%', score: '68.4%' }
    },
    {
      step_number: 2,
      module: 'AI Misconception Hunter',
      title: 'Misconception Diagnosed: SQL JOIN Semantics',
      summary: 'Diagnosed confusion between INNER JOIN and LEFT JOIN in SQL query design. Confused row-filtering behavior.',
      status: 'Resolved (+38% Progress)',
      details: { topic: 'SQL JOINs: INNER vs LEFT OUTER JOIN', initial_clarity: '42%', followup_result: 'Resolved (80% clarity)' }
    },
    {
      step_number: 3,
      module: 'AI Career Compass',
      title: 'Target Career Skill Mapping (Data Analyst)',
      summary: 'Extracted confirmed skills (Python, Statistics, Excel). Identified critical SQL gap & generated 3-phase learning roadmap.',
      status: 'In Progress (72% Match)',
      details: { target_role: 'Data Analyst', match_score: '72%', active_task: 'Master Advanced SQL Queries' }
    },
    {
      step_number: 4,
      module: 'AI JobShield',
      title: 'Internship Offer Safety Verification',
      summary: 'Scanned remote Data Analyst internship message asking for $50 registration fee via GPay with instant selection.',
      status: 'Scam Flagged (High Concern)',
      details: { company: 'Global Tech Solutions', concern_level: 'High Concern', risk_score: 95.0 }
    },
    {
      step_number: 5,
      module: 'Integrated Student Journey',
      title: 'Safe Career Application Ready',
      summary: 'Student completed SQL concept practice, updated career portfolio, avoided fraudulent internship scam, and applied safely to verified listing.',
      status: 'Active & Safe',
      details: { verified_application: 'Applied to Acme Analytics Corp', next_milestone: 'Submit E-Commerce Sales Insights Project' }
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-navy-800 rounded-2xl p-6 lg:p-8 text-white relative overflow-hidden shadow-md">
        <div className="absolute right-0 top-0 w-96 h-96 rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-orange-300 font-semibold mb-1">
              <Sparkles className="w-4 h-4" />
              <span>CRYPTORA '26 End-to-End Story Walkthrough</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight">
              The Naveen Journey: Assess → Diagnose → Learn → Prepare → Apply Safely
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Fictional student case study demonstrating how all 4 core modules connect seamlessly to guide a candidate from academic warning to safe tech career entry.
            </p>
          </div>
          <Badge variant="orange" size="md">Demonstration Persona Active</Badge>
        </div>
      </div>

      {/* Naveen Persona Summary Card */}
      <Card title="Student Profile: Naveen (Fictional Demo Persona)">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-500 block">Department & Term</span>
            <strong className="text-navy-800 font-bold">CSE • Semester 5</strong>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-500 block">Target Role</span>
            <strong className="text-orange-600 font-bold">Data Analyst</strong>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-500 block">Current Academic Risk</span>
            <strong className="text-amber-600 font-bold">Moderate (Reviewed)</strong>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-500 block">JobShield Status</span>
            <strong className="text-rose-600 font-bold">1 Scam Shielded</strong>
          </div>
        </div>
      </Card>

      {/* Interactive 5-Step Timeline */}
      <div className="space-y-6 relative before:absolute before:left-5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
        {steps.map((step, idx) => (
          <div key={idx} className="relative pl-12">
            {/* Timeline Circle Node */}
            <div className="absolute left-0 top-1 w-10 h-10 rounded-full bg-navy-800 text-white font-bold text-sm flex items-center justify-center border-4 border-slate-50 shadow-sm">
              {step.step_number}
            </div>

            <Card>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider">
                      Module {step.step_number}: {step.module}
                    </span>
                    <Badge
                      variant={step.status.includes('Scam') ? 'danger' : step.status.includes('Resolved') ? 'success' : 'warning'}
                      size="sm"
                    >
                      {step.status}
                    </Badge>
                  </div>
                  <h3 className="text-base font-bold text-navy-800 mt-0.5">{step.title}</h3>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    if (step.module.includes('Academic')) navigate('/academic');
                    else if (step.module.includes('Misconception')) navigate('/misconceptions');
                    else if (step.module.includes('Career')) navigate('/career');
                    else if (step.module.includes('JobShield')) navigate('/jobshield');
                  }}
                  icon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  Open {step.module.split(' ')[0]} Module
                </Button>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                {step.summary}
              </p>

              {/* Step Detail Cards */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {Object.entries(step.details).map(([key, val]) => (
                  <div key={key}>
                    <span className="text-slate-400 capitalize text-[10px] font-semibold block">
                      {key.replace('_', ' ')}
                    </span>
                    <span className="font-semibold text-slate-800">{String(val)}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};
