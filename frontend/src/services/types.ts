export type Role = 'student' | 'faculty' | 'admin';

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: Role;
  department: string;
  student_id_code?: string;
  is_demo_user: boolean;
}

export interface AcademicRecord {
  id: number;
  course_code: string;
  course_name: string;
  attendance_percentage: number;
  assessment_score: number;
  assignment_completion_rate: number;
  term: string;
}

export interface StudentProfile {
  id: number;
  user_id: number;
  user: User;
  target_role: string;
  attendance_rate: number;
  assessment_avg: number;
  assignment_completion: number;
  risk_level: 'Low' | 'Moderate' | 'High';
  risk_factors: string[];
  faculty_review_status: string;
  faculty_note?: string;
  confirmed_skills: string[];
  academic_records: AcademicRecord[];
}

export interface AcademicOverview {
  total_students: number;
  high_risk_count: number;
  moderate_risk_count: number;
  low_risk_count: number;
  avg_attendance: number;
  avg_assessment: number;
  recommended_actions: string[];
}

export interface SampleCase {
  id: string;
  title: string;
  category: string;
  prompt: string;
  rubric: string;
  student_answer: string;
}

export interface MisconceptionResult {
  id?: number;
  topic: string;
  misconception_found?: string;
  missing_concepts: string[];
  explanation: string;
  evidence_snippet?: string;
  clarity_score: number;
  practice_recommendation: string;
}

export interface FollowupResult {
  submission_id: number;
  initial_clarity_score: number;
  new_clarity_score: number;
  improvement_delta: number;
  progress_summary: string;
  is_resolved: boolean;
}

export interface SkillGapItem {
  skill_name: string;
  status: 'Matched' | 'Gap - Critical' | 'Gap - Recommended';
  importance_reason: string;
}

export interface CareerRoadmapItem {
  id: number;
  phase: string;
  topic: string;
  title: string;
  description: string;
  recommended_action: string;
  is_completed: boolean;
  priority: number;
}

export interface CareerGapAnalysis {
  target_role: string;
  match_score_percentage: number;
  matched_skills: string[];
  missing_skills: SkillGapItem[];
  roadmap: CareerRoadmapItem[];
}

export interface WarningSignal {
  category: string;
  title: string;
  description: string;
  risk_level: 'High' | 'Medium' | 'Low';
  evidence_quote: string;
}

export interface JobShieldResult {
  id?: number;
  job_title: string;
  company_name: string;
  concern_level: 'Low Concern' | 'Review Recommended' | 'High Concern';
  risk_score: number;
  warning_signals: WarningSignal[];
  verification_steps: string[];
  disclaimer: string;
}

export interface SampleScam {
  id: string;
  title: string;
  type: string;
  sample_text: string;
}

export interface JourneyStep {
  step_number: number;
  module: string;
  title: string;
  summary: string;
  status: string;
  details: Record<string, any>;
}

export interface NaveenJourney {
  student_name: string;
  target_role: string;
  overall_status: string;
  steps: JourneyStep[];
}
