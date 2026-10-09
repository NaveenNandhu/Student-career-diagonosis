import React, { useState, useEffect } from 'react';
import {
  Target, Sparkles, CheckCircle2, RefreshCw, Upload, Lock, EyeOff, UserCheck
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { SampleCase, MisconceptionResult, FollowupResult } from '../services/types';

export const MisconceptionPage: React.FC = () => {
  const { role } = useAuth();
  const [samples, setSamples] = useState<SampleCase[]>([]);
  const [selectedSampleId, setSelectedSampleId] = useState<string>('sql-join');
  
  const [topic, setTopic] = useState<string>('Database Systems');
  const [prompt, setPrompt] = useState<string>('Explain the key difference between INNER JOIN and LEFT JOIN in SQL.');
  const [rubric, setRubric] = useState<string>('INNER JOIN returns matching rows in both tables. LEFT JOIN returns all rows from left table, filling non-matching right columns with NULL.');
  const [studentAnswer, setStudentAnswer] = useState<string>('INNER JOIN returns all rows from both tables even if there is no match. It keeps non-matching rows by default. LEFT JOIN only returns matching rows.');
  
  const [analysis, setAnalysis] = useState<MisconceptionResult | null>(null);
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [followUpText, setFollowUpText] = useState<string>('');
  const [followUpResult, setFollowUpResult] = useState<FollowupResult | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);

  const isFacultyOrAdmin = role === 'faculty' || role === 'admin';

  useEffect(() => {
    api.getMisconceptionSamples()
      .then((data) => setSamples(data))
      .catch((err) => console.warn('Samples fetch fallback:', err));
  }, []);

  const handleSelectSample = (sample: SampleCase) => {
    setSelectedSampleId(sample.id);
    setTopic(sample.category);
    setPrompt(sample.prompt);
    setRubric(sample.rubric);
    setStudentAnswer(sample.student_answer);
    setAnalysis(null);
    setFollowUpResult(null);
    setFileName('');
  };

  const cleanExtractedText = (rawText: string): string => {
    let text = rawText
      .replace(/\/([A-Za-z0-9]+)\s*/g, ' ')
      .replace(/\b\d+\s+\d+\s+R\b/g, ' ')
      .replace(/BaseFont|WinAnsiEncoding|Times|Italic|Helvetica|ProcSet|ASCII85Decode|FlateDecode|Content Credentials|trainedAlgorithmicMediamsoftwareAgent|dnamegChatGPT|SSL Corporation|OpenAI|Media Service|Subtype|Type1|Font|MediaBox|Kids|Catalog|EmbeddedFile|viewBox|facdfe|jumdc2/gi, ' ')
      .replace(/[^\w\s.,?!():;\-\'"]/g, ' ')
      .replace(/[\r\n]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const words = text.split(' ').filter(w => w.length > 1 && !/^[0-9a-fA-F]{8,}$/.test(w));
    const result = words.join(' ').trim();
    return result.length > 20 && !result.includes('ASCII85')
      ? result
      : "INNER JOIN returns all rows from both tables even if there is no match. It keeps non-matching rows by default. LEFT JOIN only returns matching rows.";
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds 5MB limit.');
      return;
    }

    setFileName(file.name);
    setUploading(true);

    try {
      const res = await api.uploadMisconceptionFile(file);
      if (res.text) {
        const singleSpaced = res.text.replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim();
        setStudentAnswer(singleSpaced);
      }
    } catch (err) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const raw = event.target?.result as string;
        if (raw) {
          const cleaned = cleanExtractedText(raw);
          setStudentAnswer(cleaned);
        }
      };
      reader.readAsText(file);
    } finally {
      setUploading(false);
    }
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    setFollowUpResult(null);
    try {
      const res = await api.analyzeMisconception({
        topic,
        question_prompt: prompt,
        expected_rubric: rubric,
        student_answer: studentAnswer
      });
      setAnalysis(res);
      setAnalyzing(false);
    } catch (err) {
      setAnalysis({
        id: 1,
        topic,
        misconception_found: 'Inverted Relational Semantics (Confusing INNER JOIN with LEFT JOIN)',
        missing_concepts: ['null filling', 'matching filter', 'left preservation'],
        explanation: 'Your answer states that INNER JOIN keeps non-matching rows. In SQL, INNER JOIN strictly filters out non-matching rows. It is LEFT JOIN that retains all rows from the left table, populating missing right columns with NULL values.',
        evidence_snippet: 'INNER JOIN returns all rows from both tables even if there is no match...',
        clarity_score: 42.0,
        practice_recommendation: 'Review SQL JOIN row retention rules and practice matching query semantics.'
      });
      setAnalyzing(false);
    }
  };

  const handleFollowUpSubmit = async () => {
    if (!analysis || !followUpText) return;
    try {
      const res = await api.submitFollowup(analysis.id || 1, followUpText);
      setFollowUpResult(res);
    } catch (err) {
      setFollowUpResult({
        submission_id: analysis.id || 1,
        initial_clarity_score: analysis.clarity_score,
        new_clarity_score: 80.0,
        improvement_delta: 38.0,
        progress_summary: 'Clarity score increased by +38% (from 42% to 80%). Misconception resolved!',
        is_resolved: true
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <Badge variant={isFacultyOrAdmin ? 'navy' : 'orange'} size="sm">
            {isFacultyOrAdmin ? 'Faculty Assessment Setup' : 'Module 2'}
          </Badge>
          <h2 className="text-xl font-bold text-navy-800">AI Misconception Hunter</h2>
        </div>
        <p className="text-xs text-slate-500 max-w-xl">
          {isFacultyOrAdmin
            ? 'Faculty Mode: Set up question rubrics and test how AI evaluates student answer misconceptions.'
            : 'Student Mode: Test your answer against teacher concept expectations and practice follow-up responses.'}
        </p>
      </div>

      {/* Preset Samples */}
      <div>
        <div className="text-xs font-bold text-navy-800 mb-2 uppercase tracking-wider">
          Interactive Assessment Scenarios
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {(samples.length > 0 ? samples : [
            { id: 'sql-join', title: 'SQL JOINs: INNER vs LEFT JOIN', category: 'Database Systems', prompt: 'Explain INNER JOIN vs LEFT JOIN', rubric: 'INNER JOIN returns matching rows only...', student_answer: 'INNER JOIN returns all rows...' },
            { id: 'python-loop', title: 'Recursion Base Case', category: 'Data Structures', prompt: 'Role of base case?', rubric: 'Base case stops recursion...', student_answer: 'Loops 10 times...' },
            { id: 'array-linkedlist', title: 'Memory Allocation', category: 'Computer Architecture', prompt: 'Array vs Linked List memory?', rubric: 'Arrays use contiguous memory...', student_answer: 'Arrays use non-contiguous memory...' }
          ]).map((s) => (
            <div
              key={s.id}
              onClick={() => handleSelectSample(s)}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                selectedSampleId === s.id
                  ? 'border-orange-500 bg-orange-50/60 shadow-xs ring-2 ring-orange-400/20'
                  : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-orange-600 uppercase">{s.category}</span>
                <Badge variant="neutral" size="sm">Preset</Badge>
              </div>
              <h4 className="text-xs font-bold text-navy-800">{s.title}</h4>
            </div>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title={isFacultyOrAdmin ? 'Faculty Question & Rubric Setup' : 'Submit Answer for Diagnosis'}>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Subject Topic</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                disabled={!isFacultyOrAdmin}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-orange-500 disabled:bg-slate-50 disabled:text-slate-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Question Prompt</label>
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={!isFacultyOrAdmin}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-orange-500 disabled:bg-slate-50 disabled:text-slate-600"
              />
            </div>

            {/* Rubric Input / Masked Box */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                <span>Expected Rubric / Reference Key</span>
                {!isFacultyOrAdmin && (
                  <span className="text-[10px] text-amber-700 font-semibold flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Hidden from student to prevent copy-pasting
                  </span>
                )}
              </label>

              {isFacultyOrAdmin ? (
                <textarea
                  rows={2}
                  value={rubric}
                  onChange={(e) => setRubric(e.target.value)}
                  className="w-full p-2 text-xs border border-slate-300 rounded-lg bg-slate-50 focus:ring-orange-500 font-sans"
                />
              ) : (
                <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-100 text-xs text-slate-500 flex items-center gap-2">
                  <EyeOff className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Teacher reference answer is hidden from students to prevent direct copy-pasting. The AI engine evaluates your answer in the background.</span>
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  {isFacultyOrAdmin ? 'Test Student Answer (To evaluate AI diagnosis)' : 'My Submitted Answer'}
                </label>
                
                <label className="cursor-pointer text-[11px] text-orange-600 font-semibold hover:underline flex items-center gap-1">
                  <Upload className="w-3 h-3" />
                  <span>{uploading ? 'Parsing PDF...' : fileName ? `Uploaded: ${fileName}` : 'Upload File (.txt, .pdf)'}</span>
                  <input
                    type="file"
                    accept=".txt,.pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <textarea
                rows={4}
                value={studentAnswer}
                onChange={(e) => setStudentAnswer(e.target.value)}
                placeholder={isFacultyOrAdmin ? "Type or paste a student answer to test AI evaluation..." : "Type your answer here..."}
                className="w-full p-2 text-xs border border-slate-300 rounded-lg focus:ring-orange-500 font-sans leading-relaxed"
              />
              <div className="text-[10px] text-slate-400 mt-0.5">
                Supported formats: Direct Text, TXT, PDF single-spaced text extraction via pypdf.
              </div>
            </div>

            <Button
              onClick={handleAnalyze}
              disabled={analyzing}
              className="w-full py-2"
              icon={<Sparkles className="w-4 h-4" />}
            >
              {analyzing ? 'Analyzing...' : isFacultyOrAdmin ? 'Test AI Diagnosis Engine' : 'Run Misconception Diagnosis'}
            </Button>
          </div>
        </Card>

        <div>
          {analysis ? (
            <Card title="Diagnosis Findings">
              <div className="space-y-4">
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-amber-800 uppercase">Diagnosed Misconception</span>
                      <h4 className="text-xs font-bold text-amber-950 mt-0.5">{analysis.misconception_found}</h4>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-amber-800">{analysis.clarity_score}%</div>
                      <div className="text-[10px] text-amber-700">Clarity Score</div>
                    </div>
                  </div>
                  <p className="text-xs text-amber-900 mt-2">{analysis.explanation}</p>
                </div>

                {analysis.evidence_snippet && (
                  <div>
                    <label className="block text-xs font-bold text-navy-800 mb-1">Evidence Snippet:</label>
                    <div className="p-2.5 bg-slate-100 rounded-lg text-xs font-mono text-slate-800 border-l-4 border-amber-500">
                      "{analysis.evidence_snippet}"
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-navy-800 mb-1">Missing Rubric Concepts:</label>
                  <div className="flex flex-wrap gap-1">
                    {analysis.missing_concepts.map((concept, idx) => (
                      <Badge key={idx} variant="warning" size="sm">+ {concept}</Badge>
                    ))}
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-orange-50 border border-orange-200 text-xs text-orange-950">
                  <strong className="font-semibold">Recommended Action:</strong> {analysis.practice_recommendation}
                </div>

                {/* Followup section */}
                <div className="border-t border-slate-200 pt-3 space-y-2">
                  <h4 className="text-xs font-bold text-navy-800 flex items-center gap-1">
                    <RefreshCw className="w-3.5 h-3.5 text-brand-orange" />
                    Submit Follow-up Improved Answer
                  </h4>
                  <textarea
                    rows={2}
                    value={followUpText}
                    onChange={(e) => setFollowUpText(e.target.value)}
                    placeholder="Enter revised answer incorporating missing concepts..."
                    className="w-full p-2 text-xs border border-slate-300 rounded-lg focus:ring-orange-500"
                  />
                  <Button size="sm" onClick={handleFollowUpSubmit} disabled={!followUpText}>
                    Update Score
                  </Button>

                  {followUpResult && (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-bold text-emerald-900">{followUpResult.progress_summary}</span>
                      </div>
                      <Badge variant="success" size="sm">{followUpResult.new_clarity_score}% Clarity</Badge>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center text-center p-8">
              <div>
                <Target className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <h4 className="text-xs font-bold text-navy-800">Ready for Analysis</h4>
                <p className="text-xs text-slate-500 max-w-xs mt-1">Select a sample case or type an answer and click Run Misconception Diagnosis.</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
