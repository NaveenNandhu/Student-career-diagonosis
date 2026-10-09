from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import StudentProfile, MisconceptionSubmission, CareerRoadmapItem, JobShieldAnalysis
from app.schemas import NaveenJourneyResponse, JourneyStep

router = APIRouter(prefix="/journey", tags=["Integrated Student Journey"])

@router.get("/naveen", response_model=NaveenJourneyResponse)
def get_naveen_integrated_journey(db: Session = Depends(get_db)):
    """
    Returns the complete 5-step integrated student journey for fictional student Naveen:
    1. Assess: Academic Intelligence review flag.
    2. Diagnose: SQL INNER JOIN misconception diagnosis.
    3. Learn & Prepare: Career Compass Data Analyst roadmap & practice project.
    4. Apply Safely: JobShield high concern scam detection on registration fee offer.
    5. Integrated Activity Timeline.
    """
    steps = [
        JourneyStep(
            step_number=1,
            module="Academic Intelligence",
            title="Academic Early Review Warning",
            summary="Attendance dropped to 81.5% and Database Systems midterm score dropped to 68.4%. Triggered faculty review indicator.",
            status="Reviewed - Action Plan",
            details={
                "course": "CS302 Database Management Systems",
                "attendance": "81.5%",
                "score": "68.4%",
                "faculty_action": "Assigned peer review tutoring & targeted concept check"
            }
        ),
        JourneyStep(
            step_number=2,
            module="AI Misconception Hunter",
            title="Misconception Diagnosed: SQL JOIN Semantics",
            summary="Diagnosed confusion between INNER JOIN and LEFT JOIN in SQL query design. Confused row-filtering behavior.",
            status="Resolved (+38% Progress)",
            details={
                "topic": "SQL JOINs: INNER vs LEFT OUTER JOIN",
                "initial_clarity": "42%",
                "misconception": "Inverted Relational Semantics",
                "followup_result": "Resolved (80% clarity achieved after practice)"
            }
        ),
        JourneyStep(
            step_number=3,
            module="AI Career Compass",
            title="Target Career Skill Mapping (Data Analyst)",
            summary="Extracted confirmed skills (Python, Statistics, Excel). Identified critical SQL gap & generated 3-phase learning roadmap.",
            status="In Progress (72% Match)",
            details={
                "target_role": "Data Analyst",
                "match_score": "72%",
                "roadmap_phase": "Phase 1: Core Fundamentals",
                "active_task": "Master Advanced SQL Queries & Aggregations"
            }
        ),
        JourneyStep(
            step_number=4,
            module="AI JobShield",
            title="Internship Offer Safety Verification",
            summary="Scanned remote Data Analyst internship message asking for $50 registration fee via GPay with instant selection.",
            status="Scam Flagged (High Concern - 95.0 Risk Score)",
            details={
                "company": "Global Tech Solutions (Unverified)",
                "concern_level": "High Concern",
                "risk_score": 95.0,
                "primary_warning": "Upfront Financial Demand ($50 fee) & Instant Selection without interview"
            }
        ),
        JourneyStep(
            step_number=5,
            module="Integrated Student Journey",
            title="Safe Career Application Ready",
            summary="Student completed SQL concept practice, updated career portfolio, avoided fraudulent internship scam, and applied safely to verified listing.",
            status="Active & Safe",
            details={
                "verified_application": "Applied to Acme Analytics Corp (Verified Portal)",
                "next_milestone": "Submit End-to-End E-Commerce Sales Insights GitHub Project"
            }
        )
    ]

    return NaveenJourneyResponse(
        student_name="Naveen (Demo Student)",
        target_role="Data Analyst",
        overall_status="On Track - Safe Career Preparation",
        steps=steps
    )
