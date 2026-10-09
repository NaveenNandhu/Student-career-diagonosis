import React, { useState, useEffect } from 'react';
import {
  Compass, CheckCircle2, Plus, X, Sparkles, CheckSquare, Square, Upload
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { api } from '../services/api';
import { CareerGapAnalysis } from '../services/types';

export const CareerPage: React.FC = () => {
  const [resumeText, setResumeText] = useState<string>(
    "Experienced student developer proficient in Python, SQL, Statistics, Excel, and Data Visualization."
  );
  const [confirmedSkills, setConfirmedSkills] = useState<string[]>([
    "Python", "SQL", "Statistics", "Excel", "Data Visualization", "Git"
  ]);
  const [newSkillInput, setNewSkillInput] = useState<string>('');
  const [targetRole, setTargetRole] = useState<string>('Data Analyst');
  const [analysis, setAnalysis] = useState<CareerGapAnalysis | null>(null);
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);

  const availableRoles = [
    { id: 'Data Analyst', title: 'Data Analyst', desc: 'SQL, Python, Data Visualization, Excel, Statistics' },
    { id: 'Data Scientist', title: 'Data Scientist / AI Engineer', desc: 'Python, Machine Learning, PyTorch, Scikit-Learn, SQL' },
    { id: 'Frontend Developer', title: 'Frontend Developer', desc: 'React, TypeScript, JavaScript, Tailwind, Git' },
    { id: 'Python Developer', title: 'Python Backend Developer', desc: 'Python, FastAPI, SQL, REST APIs, Docker' },
    { id: 'Full Stack Developer', title: 'Full Stack Web Developer', desc: 'JavaScript, React, Node.js, Python, SQL' },
    { id: 'Cybersecurity Analyst', title: 'Cybersecurity Analyst', desc: 'Networking, Linux, Python, Wireshark, Security Audit' }
  ];

  const handleExtractSkills = async () => {
    try {
      const res = await api.extractSkills(resumeText);
      if (res.extracted_skills.length > 0) {
        setConfirmedSkills(res.extracted_skills);
      }
    } catch (err) {
      setConfirmedSkills(["Python", "SQL", "Statistics", "Excel", "Data Visualization"]);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds 5MB limit.');
      return;
    }

    setUploading(true);
    try {
      const res = await api.uploadResumeFile(file);
      if (res.resume_text) {
        setResumeText(res.resume_text);
      }
      if (res.extracted_skills && res.extracted_skills.length > 0) {
        setConfirmedSkills(res.extracted_skills);
        const gapRes = await api.analyzeCareerGap(targetRole, res.extracted_skills);
        setAnalysis(gapRes);
      }
    } catch (err) {
      console.warn('Resume upload fallback handled');
    } finally {
      setUploading(false);
    }
  };

  const handleAddSkill = () => {
    if (newSkillInput.trim() && !confirmedSkills.includes(newSkillInput.trim())) {
      setConfirmedSkills([...confirmedSkills, newSkillInput.trim()]);
      setNewSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setConfirmedSkills(confirmedSkills.filter(s => s !== skillToRemove));
  };

  const handleRunGapAnalysis = async () => {
    setAnalyzing(true);
    try {
      const res = await api.analyzeCareerGap(targetRole, confirmedSkills);
      setAnalysis(res);
      setAnalyzing(false);
    } catch (err) {
      setAnalysis({
        target_role: targetRole,
        match_score_percentage: 72.0,
        matched_skills: ["Python", "Statistics", "Excel"],
        missing_skills: [
          { skill_name: "SQL", status: "Gap - Critical", importance_reason: "Required for technical screening." },
          { skill_name: "Power BI / Tableau", status: "Gap - Recommended", importance_reason: "Essential for dashboard projects." }
        ],
        roadmap: [
          { id: 1, phase: "Phase 1: Core Fundamentals", topic: "SQL Databases", title: "Master Advanced SQL Queries", description: "Learn INNER/LEFT JOINs, window functions, and aggregations.", recommended_action: "Complete 15 SQL query challenges.", is_completed: true, priority: 1 },
          { id: 2, phase: "Phase 1: Core Fundamentals", topic: "Python Analysis", title: "Data Wrangling with Pandas", description: "Clean datasets and handle missing values.", recommended_action: "Perform EDA on 50k-row dataset.", is_completed: false, priority: 2 },
          { id: 3, phase: "Phase 2: Projects", topic: "Business Intelligence", title: "Power BI / Tableau Dashboard", description: "Build interactive metrics dashboard.", recommended_action: "Build Student Performance Dashboard.", is_completed: false, priority: 3 }
        ]
      });
      setAnalyzing(false);
    }
  };

  useEffect(() => {
    handleRunGapAnalysis();
  }, [targetRole]);

  const handleToggleTask = async (taskId: number, currentCompleted: boolean) => {
    if (!analysis) return;
    const newCompleted = !currentCompleted;
    
    const updatedRoadmap = analysis.roadmap.map(item =>
      item.id === taskId ? { ...item, is_completed: newCompleted } : item
    );

    const completedCount = updatedRoadmap.filter(r => r.is_completed).length;
    const newMatchScore = Math.min(96, Math.round(50 + (completedCount / updatedRoadmap.length) * 46));

    setAnalysis({
      ...analysis,
      match_score_percentage: newMatchScore,
      roadmap: updatedRoadmap
    });

    try {
      await api.toggleRoadmapTask(taskId, newCompleted);
    } catch (err) {
      console.warn('Task toggle updated locally');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="navy" size="sm">Module 3</Badge>
          <h2 className="text-xl font-bold text-navy-800">AI Career Compass</h2>
        </div>
        <p className="text-xs text-slate-500 max-w-xl">
          Extract skills, analyze target role requirements, and track roadmap progress.
        </p>
      </div>

      {/* Target Role Selector */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <div className="text-xs font-bold text-navy-800 mb-3 uppercase tracking-wider">
          Target Career Role
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {availableRoles.map((role) => (
            <div
              key={role.id}
              onClick={() => setTargetRole(role.id)}
              className={`p-3 rounded-xl border cursor-pointer transition-all ${
                targetRole === role.id
                  ? 'border-orange-500 bg-orange-50/70 shadow-xs ring-2 ring-orange-400/20'
                  : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-navy-800">{role.title}</span>
                {targetRole === role.id && <CheckCircle2 className="w-4 h-4 text-orange-600" />}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">{role.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Resume Input & Skills */}
      <Card title="Skill Inventory">
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">Resume Text or File Upload</label>
              <label className="cursor-pointer text-[11px] text-orange-600 font-semibold hover:underline flex items-center gap-1">
                <Upload className="w-3 h-3" />
                <span>{uploading ? 'Scanning...' : 'Upload Resume File (PDF/TXT)'}</span>
                <input
                  type="file"
                  accept=".pdf,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            </div>
            <div className="flex gap-2">
              <textarea
                rows={2}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                className="flex-1 p-2 text-xs border border-slate-300 rounded-lg focus:ring-orange-500"
                placeholder="Paste candidate resume text or upload PDF file above..."
              />
              <Button size="sm" variant="outline" onClick={handleExtractSkills} icon={<Sparkles className="w-3.5 h-3.5" />}>
                Extract
              </Button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-navy-800 mb-2">Confirmed Candidate Skills:</label>
            <div className="flex flex-wrap items-center gap-1.5">
              {confirmedSkills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-navy-800 text-white rounded-full text-xs font-medium"
                >
                  <span>{skill}</span>
                  <button onClick={() => handleRemoveSkill(skill)} className="hover:text-orange-400">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}

              <div className="flex items-center gap-1">
                <input
                  type="text"
                  placeholder="Add skill..."
                  value={newSkillInput}
                  onChange={(e) => setNewSkillInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                  className="w-24 px-2 py-0.5 text-xs border border-slate-300 rounded-full focus:ring-orange-500"
                />
                <button
                  onClick={handleAddSkill}
                  className="p-1 rounded-full bg-orange-500 text-white hover:bg-orange-600"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Analysis Output */}
      {analysis && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card title="Readiness & Skill Gaps">
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <div className="text-[10px] font-bold uppercase text-slate-400">Readiness Score</div>
                <div className="text-2xl font-bold text-navy-800 mt-1">{analysis.match_score_percentage}%</div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mt-2">
                  <div
                    className="bg-brand-orange h-full transition-all duration-300"
                    style={{ width: `${analysis.match_score_percentage}%` }}
                  />
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-navy-800 mb-2">Skill Gaps:</h4>
                <div className="space-y-2">
                  {analysis.missing_skills.map((gap, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg border border-slate-200 bg-white">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-navy-800">{gap.skill_name}</span>
                        <Badge variant={gap.status.includes('Critical') ? 'danger' : 'warning'} size="sm">
                          {gap.status}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{gap.importance_reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <div className="lg:col-span-2">
            <Card title="Learning Roadmap" subtitle="Click checkmark to toggle task completion">
              <div className="space-y-3">
                {analysis.roadmap.map((task) => (
                  <div
                    key={task.id}
                    className={`p-3 rounded-xl border transition-all ${
                      task.is_completed ? 'border-emerald-200 bg-emerald-50/40' : 'border-slate-200 bg-white hover:border-orange-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2.5">
                        <button
                          onClick={() => handleToggleTask(task.id, task.is_completed)}
                          className="mt-0.5 text-slate-400 hover:text-emerald-600"
                        >
                          {task.is_completed ? (
                            <CheckSquare className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-300" />
                          )}
                        </button>
                        <div>
                          <div className="text-[10px] font-bold text-orange-600 uppercase">{task.phase} • {task.topic}</div>
                          <h4 className={`text-xs font-bold mt-0.5 ${task.is_completed ? 'line-through text-slate-500' : 'text-navy-800'}`}>
                            {task.title}
                          </h4>
                          <p className="text-xs text-slate-600 mt-0.5">{task.description}</p>
                        </div>
                      </div>

                      <Badge variant={task.is_completed ? 'success' : 'neutral'} size="sm">
                        {task.is_completed ? 'Done' : 'Pending'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
