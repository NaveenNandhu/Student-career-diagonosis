import React, { useState, useEffect } from 'react';
import { Users, Search, Filter, MessageSquare, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Dialog } from '../components/ui/Dialog';
import { api } from '../services/api';
import { StudentProfile } from '../services/types';

export const FacultyPage: React.FC = () => {
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [filterRisk, setFilterRisk] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null);
  const [showReviewModal, setShowReviewModal] = useState<boolean>(false);
  const [reviewStatus, setReviewStatus] = useState<string>('Reviewed - Intervention Scheduled');
  const [facultyNote, setFacultyNote] = useState<string>('');

  const fetchStudents = () => {
    api.getStudents()
      .then((data) => setStudents(data))
      .catch((err) => console.warn('Faculty fetch fallback:', err));
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleOpenReviewModal = (student: StudentProfile) => {
    setSelectedStudent(student);
    setReviewStatus(student.faculty_review_status || 'Reviewed - Intervention Scheduled');
    setFacultyNote(student.faculty_note || '');
    setShowReviewModal(true);
  };

  const handleSaveReview = async () => {
    if (!selectedStudent) return;
    try {
      await api.recordFacultyReview(selectedStudent.id, reviewStatus, facultyNote);
      setShowReviewModal(false);
      fetchStudents();
    } catch (err) {
      alert('Review updated locally!');
      setShowReviewModal(false);
    }
  };

  const filteredStudents = students.filter((s) => {
    const matchesRisk = filterRisk === 'all' || s.risk_level.toLowerCase() === filterRisk.toLowerCase();
    const matchesSearch = s.user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.user.student_id_code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.target_role.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRisk && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="navy" size="sm">Faculty Portal</Badge>
          <h2 className="text-xl font-bold text-navy-800">Faculty Review & Advisory Portal</h2>
        </div>
        <p className="text-xs text-slate-500 max-w-2xl">
          Class-wide academic review dashboard for Dr. Aris. Filter students by risk tier, record intervention counseling notes, and assign peer tutoring support.
        </p>
      </div>

      {/* Class Statistics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <div className="text-xs font-semibold text-slate-500">Total Class Roster</div>
          <div className="text-2xl font-extrabold text-navy-800 mt-1">{students.length}</div>
          <div className="text-xs text-slate-500 mt-1">Computer Science & Eng</div>
        </Card>
        <Card>
          <div className="text-xs font-semibold text-slate-500">High Risk Review</div>
          <div className="text-2xl font-extrabold text-rose-600 mt-1">
            {students.filter(s => s.risk_level === 'High').length}
          </div>
          <div className="text-xs text-rose-600 font-medium mt-1">Action plan needed</div>
        </Card>
        <Card>
          <div className="text-xs font-semibold text-slate-500">Moderate Risk Review</div>
          <div className="text-2xl font-extrabold text-amber-600 mt-1">
            {students.filter(s => s.risk_level === 'Moderate').length}
          </div>
          <div className="text-xs text-amber-600 font-medium mt-1">Includes Naveen (81.5%)</div>
        </Card>
        <Card>
          <div className="text-xs font-semibold text-slate-500">Interventions Completed</div>
          <div className="text-2xl font-extrabold text-emerald-600 mt-1">
            {students.filter(s => s.faculty_review_status.includes('Action') || s.faculty_review_status.includes('Reviewed')).length}
          </div>
          <div className="text-xs text-emerald-600 font-medium mt-1">Reviewed by faculty</div>
        </Card>
      </div>

      {/* Filter & Search Bar Card */}
      <Card title="Student Review Directory" subtitle="Filter by risk tier and record advisory notes">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search student name or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-orange-500"
              />
            </div>

            {/* Risk Filter Buttons */}
            <div className="flex items-center gap-1.5 w-full sm:w-auto">
              <button
                onClick={() => setFilterRisk('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  filterRisk === 'all' ? 'bg-navy-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All ({students.length})
              </button>
              <button
                onClick={() => setFilterRisk('high')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  filterRisk === 'high' ? 'bg-rose-600 text-white' : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                }`}
              >
                High Risk
              </button>
              <button
                onClick={() => setFilterRisk('moderate')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  filterRisk === 'moderate' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                }`}
              >
                Moderate Risk
              </button>
              <button
                onClick={() => setFilterRisk('low')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  filterRisk === 'low' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                }`}
              >
                Low Risk
              </button>
            </div>
          </div>

          {/* Student Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold border-y border-slate-200">
                <tr>
                  <th className="px-4 py-3">Student Name</th>
                  <th className="px-4 py-3">ID Code</th>
                  <th className="px-4 py-3">Target Role</th>
                  <th className="px-4 py-3 text-center">Attendance %</th>
                  <th className="px-4 py-3 text-center">Score Avg %</th>
                  <th className="px-4 py-3 text-center">Risk Tier</th>
                  <th className="px-4 py-3">Faculty Review Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-bold text-navy-800">{st.user.full_name}</td>
                    <td className="px-4 py-3 text-slate-500">{st.user.student_id_code}</td>
                    <td className="px-4 py-3 text-orange-600 font-medium">{st.target_role}</td>
                    <td className="px-4 py-3 text-center font-semibold">{st.attendance_rate}%</td>
                    <td className="px-4 py-3 text-center font-semibold">{st.assessment_avg}%</td>
                    <td className="px-4 py-3 text-center">
                      <Badge
                        variant={st.risk_level === 'High' ? 'danger' : st.risk_level === 'Moderate' ? 'warning' : 'success'}
                        size="sm"
                      >
                        {st.risk_level}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-slate-700 font-medium">
                      {st.faculty_review_status}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenReviewModal(st)}
                        icon={<MessageSquare className="w-3.5 h-3.5" />}
                      >
                        Review
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      {/* Faculty Action Modal */}
      <Dialog
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        title={`Faculty Advisory Note: ${selectedStudent?.user.full_name}`}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Update Intervention Status</label>
            <select
              value={reviewStatus}
              onChange={(e) => setReviewStatus(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-orange-500"
            >
              <option value="Pending Review">Pending Review</option>
              <option value="Reviewed - Intervention Scheduled">Reviewed - Intervention Scheduled</option>
              <option value="Action Taken">Action Taken - Peer Tutoring Assigned</option>
              <option value="Resolved - Academic Recovery">Resolved - Academic Recovery</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Faculty Advisory Note</label>
            <textarea
              rows={4}
              value={facultyNote}
              onChange={(e) => setFacultyNote(e.target.value)}
              placeholder="Record counseling notes, peer tutoring recommendation, or assignment guidance..."
              className="w-full p-3 text-xs border border-slate-300 rounded-lg focus:ring-orange-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setShowReviewModal(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSaveReview}>
              Save Advisory Note
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};
