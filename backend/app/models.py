from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(String(50), default="student") # student, faculty, admin
    department = Column(String(100), default="Computer Science & Engineering")
    student_id_code = Column(String(50), nullable=True)
    is_demo_user = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    student_profile = relationship("StudentProfile", back_populates="user", uselist=False)
    jobshield_analyses = relationship("JobShieldAnalysis", back_populates="user")

class StudentProfile(Base):
    __tablename__ = "student_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    target_role = Column(String(100), default="Data Analyst")
    attendance_rate = Column(Float, default=81.5)
    assessment_avg = Column(Float, default=68.4)
    assignment_completion = Column(Float, default=75.0)
    risk_level = Column(String(50), default="Moderate") # Low, Moderate, High
    risk_factors = Column(Text, default="[]") # JSON string list
    faculty_review_status = Column(String(100), default="Pending Review") # Pending Review, Reviewed - Intervention Scheduled, Action Taken
    faculty_note = Column(Text, nullable=True)
    confirmed_skills = Column(Text, default="[]") # JSON string array

    user = relationship("User", back_populates="student_profile")
    academic_records = relationship("AcademicRecord", back_populates="student")
    misconception_submissions = relationship("MisconceptionSubmission", back_populates="student")
    roadmap_items = relationship("CareerRoadmapItem", back_populates="student")

class AcademicRecord(Base):
    __tablename__ = "academic_records"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("student_profiles.id"), nullable=False)
    course_code = Column(String(50), nullable=False)
    course_name = Column(String(255), nullable=False)
    attendance_percentage = Column(Float, nullable=False)
    assessment_score = Column(Float, nullable=False)
    assignment_completion_rate = Column(Float, nullable=False)
    term = Column(String(50), default="Semester 5")
    updated_at = Column(DateTime, default=datetime.utcnow)

    student = relationship("StudentProfile", back_populates="academic_records")

class MisconceptionSubmission(Base):
    __tablename__ = "misconception_submissions"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("student_profiles.id"), nullable=False)
    topic = Column(String(100), nullable=False)
    question_prompt = Column(Text, nullable=False)
    expected_rubric = Column(Text, nullable=False)
    student_answer = Column(Text, nullable=False)
    misconception_found = Column(String(255), nullable=True)
    missing_concepts = Column(Text, default="[]") # JSON array
    explanation = Column(Text, nullable=False)
    evidence_snippet = Column(Text, nullable=True)
    clarity_score = Column(Float, default=60.0)
    follow_up_answer = Column(Text, nullable=True)
    progress_score = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    student = relationship("StudentProfile", back_populates="misconception_submissions")

class CareerRoadmapItem(Base):
    __tablename__ = "career_roadmap_items"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("student_profiles.id"), nullable=False)
    target_role = Column(String(100), nullable=False)
    phase = Column(String(100), nullable=False) # Phase 1: Core Fundamentals, Phase 2: Practical Projects, Phase 3: Career Ready
    topic = Column(String(100), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    recommended_action = Column(Text, nullable=False)
    is_completed = Column(Boolean, default=False)
    priority = Column(Integer, default=1)

    student = relationship("StudentProfile", back_populates="roadmap_items")

class JobShieldAnalysis(Base):
    __tablename__ = "jobshield_analyses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    job_title = Column(String(255), nullable=False)
    company_name = Column(String(255), default="Unverified Entity")
    raw_text = Column(Text, nullable=False)
    concern_level = Column(String(50), nullable=False) # Low Concern, Review Recommended, High Concern
    risk_score = Column(Float, nullable=False) # 0 to 100
    warning_signals = Column(Text, default="[]") # JSON list of signal dicts
    verification_steps = Column(Text, default="[]") # JSON list of strings
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="jobshield_analyses")
