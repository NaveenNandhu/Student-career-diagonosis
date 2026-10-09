from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import List, Optional
from datetime import datetime

# --- AUTH SCHEMAS ---
class LoginRequest(BaseModel):
    email: str
    password: str

class UserSchema(BaseModel):
    id: int
    email: str
    full_name: str
    role: str
    department: str
    student_id_code: Optional[str] = None
    is_demo_user: bool

    model_config = ConfigDict(from_attributes=True)

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserSchema

# --- ACADEMIC SCHEMAS ---
class ThresholdConfig(BaseModel):
    attendance_threshold: float = 80.0
    assessment_threshold: float = 70.0

class AcademicRecordSchema(BaseModel):
    id: int
    course_code: str
    course_name: str
    attendance_percentage: float
    assessment_score: float
    assignment_completion_rate: float
    term: str

    model_config = ConfigDict(from_attributes=True)

class StudentProfileSchema(BaseModel):
    id: int
    user_id: int
    user: UserSchema
    target_role: str
    attendance_rate: float
    assessment_avg: float
    assignment_completion: float
    risk_level: str
    risk_factors: List[str]
    faculty_review_status: str
    faculty_note: Optional[str] = None
    confirmed_skills: List[str]
    academic_records: List[AcademicRecordSchema] = []

    model_config = ConfigDict(from_attributes=True)

class FacultyReviewRequest(BaseModel):
    review_status: str
    note: Optional[str] = None

class AcademicOverviewResponse(BaseModel):
    total_students: int
    high_risk_count: int
    moderate_risk_count: int
    low_risk_count: int
    avg_attendance: float
    avg_assessment: float
    recommended_actions: List[str]

# --- MISCONCEPTION SCHEMAS ---
class MisconceptionAnalyzeRequest(BaseModel):
    topic: str
    question_prompt: str
    expected_rubric: str
    student_answer: str

class MisconceptionResult(BaseModel):
    id: Optional[int] = None
    topic: str
    misconception_found: Optional[str] = None
    missing_concepts: List[str]
    explanation: str
    evidence_snippet: Optional[str] = None
    clarity_score: float
    practice_recommendation: str

class MisconceptionFollowupRequest(BaseModel):
    submission_id: int
    follow_up_answer: str

class MisconceptionFollowupResult(BaseModel):
    submission_id: int
    initial_clarity_score: float
    new_clarity_score: float
    improvement_delta: float
    progress_summary: str
    is_resolved: bool

class SampleCaseSchema(BaseModel):
    id: str
    title: str
    category: str
    prompt: str
    rubric: str
    student_answer: str

# --- CAREER COMPASS SCHEMAS ---
class SkillExtractRequest(BaseModel):
    resume_text: str

class SkillExtractResponse(BaseModel):
    extracted_skills: List[str]
    raw_detected_count: int
    resume_text: Optional[str] = ""

class SkillGapItem(BaseModel):
    skill_name: str
    status: str # "Matched", "Gap - Critical", "Gap - Recommended"
    importance_reason: str

class CareerRoadmapItemSchema(BaseModel):
    id: int
    phase: str
    topic: str
    title: str
    description: str
    recommended_action: str
    is_completed: bool
    priority: int

    model_config = ConfigDict(from_attributes=True)

class CareerGapAnalysisRequest(BaseModel):
    target_role: str
    confirmed_skills: List[str]

class CareerGapAnalysisResponse(BaseModel):
    target_role: str
    match_score_percentage: float
    matched_skills: List[str]
    missing_skills: List[SkillGapItem]
    roadmap: List[CareerRoadmapItemSchema]

class ToggleTaskRequest(BaseModel):
    task_id: int
    is_completed: bool

# --- JOBSHIELD SCHEMAS ---
class JobShieldAnalyzeRequest(BaseModel):
    raw_text: str
    company_name: Optional[str] = "Unverified Entity"
    job_title: Optional[str] = "Suspicious Communication"

class WarningSignal(BaseModel):
    category: str
    title: str
    description: str
    risk_level: str # "High", "Medium", "Low"
    evidence_quote: str

class JobShieldAnalysisResult(BaseModel):
    id: Optional[int] = None
    job_title: str
    company_name: str
    concern_level: str # "Low Concern", "Review Recommended", "High Concern"
    risk_score: float
    warning_signals: List[WarningSignal]
    verification_steps: List[str]
    disclaimer: str

class SampleScamSchema(BaseModel):
    id: str
    title: str
    type: str
    sample_text: str

# --- JOURNEY SCHEMAS ---
class JourneyStep(BaseModel):
    step_number: int
    module: str
    title: str
    summary: str
    status: str
    details: dict

class NaveenJourneyResponse(BaseModel):
    student_name: str
    target_role: str
    overall_status: str
    steps: List[JourneyStep]
