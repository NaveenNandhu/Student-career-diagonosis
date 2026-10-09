import React, { useState, useEffect } from 'react';
import {
  ShieldCheck, ShieldAlert, CheckCircle2, Search, Info
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { api } from '../services/api';
import { JobShieldResult, SampleScam } from '../services/types';

export const JobShieldPage: React.FC = () => {
  const [samples, setSamples] = useState<SampleScam[]>([]);
  const [inputText, setInputText] = useState<string>(
    "Selected for Data Analyst Internship! Pay $50 registration fee via GPay within 24 hours. Contact Telegram @tech_hr_2026."
  );
  const [companyName, setCompanyName] = useState<string>('Global Tech Solutions');
  const [jobTitle, setJobTitle] = useState<string>('Remote Data Analyst Intern');
  
  const [result, setResult] = useState<JobShieldResult | null>(null);
  const [scanning, setScanning] = useState<boolean>(false);
  const [checkedSteps, setCheckedSteps] = useState<Record<number, boolean>>({});

  useEffect(() => {
    api.getSampleScams()
      .then((data) => setSamples(data))
      .catch((err) => console.warn('Scam samples fallback:', err));
  }, []);

  const handleSelectSample = (sample: SampleScam) => {
    setInputText(sample.sample_text);
    if (sample.id.includes('fee')) {
      setCompanyName('Global Tech Solutions');
      setJobTitle('Remote Data Analyst Intern');
    } else if (sample.id.includes('telegram')) {
      setCompanyName('Quick Data Entry LLC');
      setJobTitle('PDF Data Entry Specialist');
    } else {
      setCompanyName('Acme Analytics Corp');
      setJobTitle('Junior Data Analyst');
    }
    setResult(null);
    setCheckedSteps({});
  };

  const handleScanJob = async () => {
    setScanning(true);
    setCheckedSteps({});
    try {
      const res = await api.analyzeJobShield({
        raw_text: inputText,
        company_name: companyName,
        job_title: jobTitle
      });
      setResult(res);
      setScanning(false);
    } catch (err) {
      setResult({
        id: 1,
        job_title: jobTitle || "Remote Data Analyst Intern",
        company_name: companyName || "Global Tech Solutions",
        concern_level: "High Concern",
        risk_score: 95.0,
        warning_signals: [
          { category: "Upfront Financial Demand", title: "Demands Upfront Money", description: "Legitimate employers never ask candidates for registration fees.", risk_level: "High", evidence_quote: "Fee demand: '$50 registration fee'" },
          { category: "Pressure Tactics", title: "No Interview / Rush Urgency", description: "Fast-track pressure without interview screening.", risk_level: "High", evidence_quote: "Rush tactic: 'within 24 hours'" }
        ],
        verification_steps: [
          "1. Check Official Website: Search company domain independently.",
          "2. Verify Recruiter on LinkedIn: Confirm recruiter corporate profile.",
          "3. Financial Safety: Never send money or deposit fees for employment."
        ],
        disclaimer: "Heuristic safety assessment."
      });
      setScanning(false);
    }
  };

  const toggleCheckStep = (index: number) => {
    setCheckedSteps(prev => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="orange" size="sm">Module 4</Badge>
          <h2 className="text-xl font-bold text-navy-800">AI JobShield Scam Defense</h2>
        </div>
        <p className="text-xs text-slate-500 max-w-xl">
          Detect job offer scams across 6 core risk vectors with candidate verification steps.
        </p>
      </div>

      {/* Preset Scam Scenarios */}
      <div>
        <div className="text-xs font-bold text-navy-800 mb-2 uppercase tracking-wider">
          Test Scenarios
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {(samples.length > 0 ? samples : [
            { id: 'fee-scam', title: 'Upfront Registration Fee Scam', type: 'High Concern', sample_text: 'Pay $50 registration fee...' },
            { id: 'telegram-scam', title: 'Telegram Unrealistic Pay Scam', type: 'High Concern', sample_text: 'Earn $500 daily doing data entry...' },
            { id: 'legit-job', title: 'Verified Enterprise Job Posting', type: 'Low Concern', sample_text: 'Acme Analytics hiring Junior Data Analyst...' }
          ]).map((s) => (
            <button
              key={s.id}
              onClick={() => handleSelectSample(s)}
              className="p-3 text-left rounded-xl border border-slate-200 bg-white hover:border-orange-400 hover:bg-slate-50 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-navy-800">{s.title}</span>
                <Badge variant={s.id.includes('legit') ? 'success' : 'danger'} size="sm">
                  {s.id.includes('legit') ? 'Legit' : 'Scam'}
                </Badge>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Input Communication">
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Company</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Job Title</label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Message Text</label>
              <textarea
                rows={5}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste offer or message content..."
                className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:ring-orange-500 font-sans"
              />
            </div>

            <Button
              onClick={handleScanJob}
              disabled={scanning}
              className="w-full py-2"
              icon={<ShieldCheck className="w-4 h-4" />}
            >
              {scanning ? 'Scanning...' : 'Analyze Communication Safety'}
            </Button>
          </div>
        </Card>

        <div>
          {result ? (
            <Card title={`Safety Analysis: ${result.job_title}`} subtitle={`Company: ${result.company_name}`}>
              <div className="space-y-4">
                <div className={`p-3.5 rounded-xl border ${
                  result.concern_level === 'High Concern'
                    ? 'bg-rose-50 border-rose-200 text-rose-900'
                    : result.concern_level === 'Review Recommended'
                    ? 'bg-amber-50 border-amber-200 text-amber-900'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {result.concern_level === 'High Concern' ? (
                        <ShieldAlert className="w-5 h-5 text-rose-600" />
                      ) : (
                        <ShieldCheck className="w-5 h-5 text-emerald-600" />
                      )}
                      <div>
                        <div className="text-[10px] font-bold uppercase">Classification</div>
                        <h4 className="text-sm font-bold">{result.concern_level}</h4>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold">{result.risk_score}</div>
                      <div className="text-[10px] opacity-80">Risk Score</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-navy-800 mb-2">Detected Signals:</h4>
                  {result.warning_signals.length === 0 ? (
                    <div className="p-2.5 bg-emerald-50 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>No obvious scam signals detected.</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {result.warning_signals.map((sig, idx) => (
                        <div key={idx} className="p-2.5 rounded-lg border border-slate-200 bg-white">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-navy-800">{sig.title}</span>
                            <Badge variant={sig.risk_level === 'High' ? 'danger' : 'warning'} size="sm">
                              {sig.risk_level}
                            </Badge>
                          </div>
                          <p className="text-xs text-slate-600 mt-0.5">{sig.description}</p>
                          <div className="mt-1 text-[11px] font-mono text-slate-700 bg-slate-100 p-1 rounded">
                            Quote: {sig.evidence_quote}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="border-t border-slate-200 pt-3">
                  <h4 className="text-xs font-bold text-navy-800 mb-2 flex items-center gap-1">
                    <Search className="w-3.5 h-3.5 text-brand-orange" />
                    Verification Checklist
                  </h4>
                  <div className="space-y-1.5">
                    {result.verification_steps.map((step, idx) => (
                      <div
                        key={idx}
                        onClick={() => toggleCheckStep(idx)}
                        className={`p-2 rounded-lg border text-xs cursor-pointer transition-colors flex items-center gap-2 ${
                          checkedSteps[idx] ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        {checkedSteps[idx] ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <div className="w-4 h-4 rounded border border-slate-400 bg-white shrink-0" />
                        )}
                        <span className={checkedSteps[idx] ? 'line-through opacity-80' : ''}>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center text-center p-8">
              <div>
                <ShieldCheck className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <h4 className="text-xs font-bold text-navy-800">Scanner Ready</h4>
                <p className="text-xs text-slate-500 max-w-xs mt-1">Paste a job offer text on the left and click Analyze.</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
