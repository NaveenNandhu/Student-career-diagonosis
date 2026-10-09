import React, { useState, useEffect } from 'react';
import {
  GraduationCap, Sliders, BookOpen, TrendingUp, MessageSquare, ShieldCheck,
  Lightbulb, ArrowRight, CheckCircle2, AlertCircle
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from 'recharts';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Dialog } from '../components/ui/Dialog';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { StudentProfile, AcademicOverview } from '../services/types';

export const AcademicPage: React.FC = () => {
  const { role, user } = useAuth();
  const [attThreshold, setAttThreshold] = useState<number>(80);
  const [scoreThreshold, setScoreThreshold] = useState<number>(70);
  const [overview, setOverview] = useState<AcademicOverview | null>(null);
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null);
  
  const [showReviewModal, setShowReviewModal] = useState<boolean>(false);
  const [reviewStatus, setReviewStatus] = useState<string>('Reviewed - Intervention Scheduled');
  const [facultyNote, setFacultyNote] = useState<string>('');

  const fetchAcademicData = () => {
    if (role === 'faculty' || role === 'admin') {
      Promise.all([
        api.getAcademicOverview(attThreshold, scoreThreshold),
        api.getStudents(attThreshold, scoreThreshold)
      ])
        .then(([ov, st]) => {
          setOverview(ov);
          setStudents(st);
          if (st.length > 0 && !selectedStudent) {
            setSelectedStudent(st[0]);
          }
        })
        .catch((err) => console.warn('Academic API error:', err));
    } else {
      api.getStudentDetail(1)
        .then((st) => {
          setSelectedStudent(st);
          setStudents([st]);
        })
        .catch((err) => console.warn('Student detail error:', err));
    }
  };

  useEffect(() => {
    fetchAcademicData();
  }, [attThreshold, scoreThreshold, role]);

  const handleSaveFacultyReview = async () => {
    if (!selectedStudent) return;
    try {
      await api.recordFacultyReview(selectedStudent.id, reviewStatus, facultyNote);
      setShowReviewModal(false);
      fetchAcademicData();
    } catch (err) {
      setShowReviewModal(false);
    }
  };

  const performanceTrendData = [
    { month: 'Month 1', attendance: 88, assessment: 76, assignment: 85 },
    { month: 'Month 2', attendance: 85, assessment: 72, assignment: 80 },
    { month: 'Month 3', attendance: 81, assessment: 64, assignment: 70 },
    { month: 'Month 4', attendance: 83, assessment: 68, assignment: 75 },
  ];

  const currentStudent = selectedStudent || students[0];
  const isFacultyOrAdmin = role === 'faculty' || role === 'admin';

  // Helper to generate personalized suggestions for student
  const getPersonalizedSuggestions = (profile: StudentProfile) => {
    const suggestions = [];

    // Attendance suggestions
    if (profile.attendance_rate < 85.0) {
      const classesNeeded = Math.ceil((85.0 * 40 - profile.attendance_rate * 40) / 15);
      suggestions.push({
        type: 'attendance',
        title: 'Attendance Recovery Target',
        text: `Attend your next ${Math.max(4, classesNeeded)} consecutive lectures to push overall attendance above 85%.`,
        actionText: 'View Class Timetable',
        actionUrl: '#'
      });
    }

    // Assessment / Midterm suggestions
    if (profile.assessment_avg < 70.0) {
      suggestions.push({
        type: 'academic',
        title: 'Database Systems (CS302) Score Boost',
        text: 'Your midterm score is 64%. Diagnose SQL JOIN concept gaps in Module 2 to raise score by +12%.',
        actionText: 'Diagnose SQL Misconceptions',
        actionUrl: '/misconceptions'
      });
    }

    // Assignment suggestion
    if (profile.assignment_completion < 80.0) {
      suggestions.push({
        type: 'assignment',
        title: 'Assignment Milestone Reminder',
        text: 'Complete 2 pending lab assignments for CS304 Data Structures before the Friday deadline.',
        actionText: 'Submit Assignment',
        actionUrl: '#'
      });
    }

    return suggestions;
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="navy" size="sm">Module 1</Badge>
              <h2 className="text-xl font-bold text-navy-800">
                {isFacultyOrAdmin ? 'Academic Intelligence (Faculty View)' : 'My Academic Performance'}
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-xl">
              {isFacultyOrAdmin
                ? 'Class-wide performance monitoring and student risk indicators.'
                : 'Private academic performance record, faculty feedback, and AI improvement suggestions.'}
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 min-w-[300px]">
            <div className="flex items-center gap-2 text-xs font-bold text-navy-800 mb-2">
              <Sliders className="w-4 h-4 text-brand-orange" />
              <span>Threshold Controls</span>
            </div>

            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-xs text-slate-700 font-medium mb-1">
                  <span>Attendance:</span>
                  <span className="font-bold text-orange-600">{attThreshold}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="95"
                  step="1"
                  value={attThreshold}
                  onChange={(e) => setAttThreshold(Number(e.target.value))}
                  className="w-full accent-orange-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-700 font-medium mb-1">
                  <span>Assessment Score:</span>
                  <span className="font-bold text-orange-600">{scoreThreshold}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="90"
                  step="1"
                  value={scoreThreshold}
                  onChange={(e) => setScoreThreshold(Number(e.target.value))}
                  className="w-full accent-orange-500 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Aggregate Overview Metrics (Faculty/Admin Only) */}
      {isFacultyOrAdmin && overview && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <div className="text-xs font-semibold text-slate-500">Monitored Students</div>
            <div className="text-2xl font-bold text-navy-800 mt-1">{overview.total_students}</div>
            <div className="text-xs text-slate-500 mt-1">Class CSE Sem 5</div>
          </Card>

          <Card>
            <div className="text-xs font-semibold text-slate-500">High Risk Count</div>
            <div className="text-2xl font-bold text-rose-600 mt-1">{overview.high_risk_count}</div>
            <div className="text-xs text-rose-600 font-medium mt-1">Requires intervention</div>
          </Card>

          <Card>
            <div className="text-xs font-semibold text-slate-500">Moderate Risk Count</div>
            <div className="text-2xl font-bold text-amber-600 mt-1">{overview.moderate_risk_count}</div>
            <div className="text-xs text-amber-600 font-medium mt-1">Includes Naveen (81.5%)</div>
          </Card>

          <Card>
            <div className="text-xs font-semibold text-slate-500">Avg Attendance</div>
            <div className="text-2xl font-bold text-emerald-600 mt-1">{overview.avg_attendance}%</div>
            <div className="text-xs text-slate-500 mt-1">Threshold: {attThreshold}%</div>
          </Card>
        </div>
      )}

      {/* Main Student Performance Layout */}
      <div className={`grid grid-cols-1 ${isFacultyOrAdmin ? 'lg:grid-cols-3' : ''} gap-6`}>
        {/* Faculty View Only: Student Directory Selector */}
        {isFacultyOrAdmin && (
          <Card title="Student Directory">
            <div className="space-y-2">
              {students.map((st) => (
                <div
                  key={st.id}
                  onClick={() => setSelectedStudent(st)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    currentStudent?.id === st.id
                      ? 'border-orange-500 bg-orange-50/50 shadow-xs'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-xs text-navy-800">{st.user.full_name}</div>
                    <Badge
                      variant={st.risk_level === 'High' ? 'danger' : st.risk_level === 'Moderate' ? 'warning' : 'success'}
                      size="sm"
                    >
                      {st.risk_level}
                    </Badge>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
                    <span>{st.user.student_id_code}</span>
                    <span>Att: {st.attendance_rate}% • Score: {st.assessment_avg}%</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Selected Student / Personal View */}
        <div className={`${isFacultyOrAdmin ? 'lg:col-span-2' : 'w-full'} space-y-6`}>
          {currentStudent && (
            <>
              <Card
                title={isFacultyOrAdmin ? `Academic Status: ${currentStudent.user.full_name}` : `My Academic Summary (${currentStudent.user.full_name})`}
                subtitle={`ID: ${currentStudent.user.student_id_code} • Department: ${currentStudent.user.department}`}
                action={
                  isFacultyOrAdmin ? (
                    <Button
                      size="sm"
                      variant="outline"
                      icon={<MessageSquare className="w-4 h-4" />}
                      onClick={() => {
                        setFacultyNote(currentStudent.faculty_note || '');
                        setShowReviewModal(true);
                      }}
                    >
                      Record Review
                    </Button>
                  ) : (
                    <Badge variant="navy" size="sm">Private Student Record</Badge>
                  )
                }
              >
                {!isFacultyOrAdmin && (
                  <div className="mb-4 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Your academic records are private and visible only to you and authorized faculty.</span>
                  </div>
                )}

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-700">Risk Level:</span>
                      <Badge
                        variant={currentStudent.risk_level === 'High' ? 'danger' : currentStudent.risk_level === 'Moderate' ? 'warning' : 'success'}
                      >
                        {currentStudent.risk_level} Risk
                      </Badge>
                    </div>
                    <div className="text-xs text-slate-500">
                      Status: <strong className="text-navy-800">{currentStudent.faculty_review_status}</strong>
                    </div>
                  </div>

                  <div className="text-xs font-semibold text-navy-800 mb-1">Trigger Factors:</div>
                  <ul className="space-y-1 text-xs text-slate-600 list-disc list-inside">
                    {currentStudent.risk_factors.map((factor, idx) => (
                      <li key={idx}>{factor}</li>
                    ))}
                  </ul>

                  {currentStudent.faculty_note && (
                    <div className="mt-3 pt-2 border-t border-slate-200 text-xs text-orange-950">
                      <strong className="font-semibold">Faculty Note:</strong> {currentStudent.faculty_note}
                    </div>
                  )}
                </div>

                {/* Performance Trend Chart */}
                <div className="mb-6">
                  <h4 className="text-xs font-bold text-navy-800 mb-3 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-brand-orange" />
                    Performance Trend (Semester 5)
                  </h4>
                  <div className="h-52 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={performanceTrendData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                        <YAxis domain={[50, 100]} stroke="#64748b" fontSize={11} />
                        <Tooltip />
                        <Legend wrapperStyle={{ fontSize: '11px' }} />
                        <Line type="monotone" dataKey="attendance" name="Attendance %" stroke="#F97316" strokeWidth={2} />
                        <Line type="monotone" dataKey="assessment" name="Assessment %" stroke="#14213D" strokeWidth={2} />
                        <Line type="monotone" dataKey="assignment" name="Assignment %" stroke="#10B981" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Course Table */}
                <div>
                  <h4 className="text-xs font-bold text-navy-800 mb-2 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-navy-800" />
                    Course Breakdown
                  </h4>
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold border-y border-slate-200">
                      <tr>
                        <th className="px-3 py-2">Code</th>
                        <th className="px-3 py-2">Course</th>
                        <th className="px-3 py-2 text-center">Attendance %</th>
                        <th className="px-3 py-2 text-center">Midterm %</th>
                        <th className="px-3 py-2 text-center">Assignment %</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(currentStudent.academic_records || []).map((rec) => (
                        <tr key={rec.id} className="hover:bg-slate-50">
                          <td className="px-3 py-2 font-bold text-navy-800">{rec.course_code}</td>
                          <td className="px-3 py-2 text-slate-700">{rec.course_name}</td>
                          <td className="px-3 py-2 text-center">{rec.attendance_percentage}%</td>
                          <td className="px-3 py-2 text-center">{rec.assessment_score}%</td>
                          <td className="px-3 py-2 text-center">{rec.assignment_completion_rate}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              {/* Personalized Academic & Attendance Suggestions Card (For Students) */}
              {!isFacultyOrAdmin && (
                <Card
                  title="Personalized Academic Improvement Suggestions"
                  subtitle="Data-driven suggestions to boost your attendance & assessment percentages"
                >
                  <div className="space-y-3">
                    {getPersonalizedSuggestions(currentStudent).map((sug, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl border border-orange-200 bg-orange-50/60 flex items-start justify-between gap-4"
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-orange-100 text-orange-700 shrink-0 mt-0.5">
                            <Lightbulb className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-navy-800">{sug.title}</h4>
                            <p className="text-xs text-slate-600 mt-0.5">{sug.text}</p>
                          </div>
                        </div>

                        {sug.actionUrl.startsWith('/') ? (
                          <Link
                            to={sug.actionUrl}
                            className="text-xs font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1 shrink-0 mt-1"
                          >
                            <span>{sug.actionText}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        ) : (
                          <span className="text-xs font-semibold text-orange-600 shrink-0 mt-1">
                            {sug.actionText}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </>
          )}
        </div>
      </div>

      {/* Faculty Review Modal (Faculty/Admin Only) */}
      {isFacultyOrAdmin && (
        <Dialog
          isOpen={showReviewModal}
          onClose={() => setShowReviewModal(false)}
          title={`Faculty Review: ${currentStudent?.user.full_name}`}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Intervention Status</label>
              <select
                value={reviewStatus}
                onChange={(e) => setReviewStatus(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-orange-500"
              >
                <option value="Pending Review">Pending Review</option>
                <option value="Reviewed - Intervention Scheduled">Reviewed - Intervention Scheduled</option>
                <option value="Action Taken">Action Taken - Peer Tutoring</option>
                <option value="Resolved - Academic Recovery">Resolved - Academic Recovery</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Faculty Note</label>
              <textarea
                rows={3}
                value={facultyNote}
                onChange={(e) => setFacultyNote(e.target.value)}
                placeholder="Enter counseling summary or tutoring recommendation..."
                className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:ring-orange-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setShowReviewModal(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSaveFacultyReview}>
                Save Note
              </Button>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
};
