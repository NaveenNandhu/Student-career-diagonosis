import json
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import StudentProfile, AcademicRecord, User
from app.schemas import (
    StudentProfileSchema, AcademicOverviewResponse, 
    ThresholdConfig, FacultyReviewRequest
)
from app.services.academic_service import evaluate_academic_risk, get_suggested_support_actions

router = APIRouter(prefix="/academic", tags=["Academic Intelligence"])

@router.get("/overview", response_model=AcademicOverviewResponse)
def get_academic_overview(
    attendance_threshold: float = Query(80.0, ge=50.0, le=100.0),
    assessment_threshold: float = Query(70.0, ge=50.0, le=100.0),
    db: Session = Depends(get_db)
):
    """
    Returns aggregated academic metrics across all students, recalculating risk
    dynamically using the provided configurable threshold parameters.
    """
    students = db.query(StudentProfile).all()
    if not students:
        return AcademicOverviewResponse(
            total_students=0, high_risk_count=0, moderate_risk_count=0, low_risk_count=0,
            avg_attendance=0.0, avg_assessment=0.0, recommended_actions=[]
        )

    high_cnt = 0
    mod_cnt = 0
    low_cnt = 0
    tot_att = 0.0
    tot_score = 0.0

    for s in students:
        tot_att += s.attendance_rate
        tot_score += s.assessment_avg
        
        # Dynamic re-eval based on threshold sliders
        risk_lvl, _ = evaluate_academic_risk(
            s.attendance_rate, s.assessment_avg, s.assignment_completion,
            attendance_threshold, assessment_threshold
        )
        if risk_lvl == "High":
            high_cnt += 1
        elif risk_lvl == "Moderate":
            mod_cnt += 1
        else:
            low_cnt += 1

    actions = [
        f"Schedule peer tutoring for {high_cnt} high-risk students in Database Systems",
        "Conduct faculty counseling for students with attendance below threshold",
        "Review module 2 assessment results for class-wide misconceptions"
    ]

    return AcademicOverviewResponse(
        total_students=len(students),
        high_risk_count=high_cnt,
        moderate_risk_count=mod_cnt,
        low_risk_count=low_cnt,
        avg_attendance=round(tot_att / len(students), 1),
        avg_assessment=round(tot_score / len(students), 1),
        recommended_actions=actions
    )

@router.get("/students", response_model=List[StudentProfileSchema])
def list_students(
    attendance_threshold: float = Query(80.0),
    assessment_threshold: float = Query(70.0),
    db: Session = Depends(get_db)
):
    """Lists student profiles with dynamically calculated risk factors."""
    students = db.query(StudentProfile).all()
    results = []

    for s in students:
        risk_lvl, factors = evaluate_academic_risk(
            s.attendance_rate, s.assessment_avg, s.assignment_completion,
            attendance_threshold, assessment_threshold
        )
        
        # Format Pydantic response
        s_dict = {
            "id": s.id,
            "user_id": s.user_id,
            "user": s.user,
            "target_role": s.target_role,
            "attendance_rate": s.attendance_rate,
            "assessment_avg": s.assessment_avg,
            "assignment_completion": s.assignment_completion,
            "risk_level": risk_lvl,
            "risk_factors": factors,
            "faculty_review_status": s.faculty_review_status,
            "faculty_note": s.faculty_note,
            "confirmed_skills": json.loads(s.confirmed_skills or "[]"),
            "academic_records": s.academic_records
        }
        results.append(StudentProfileSchema.model_validate(s_dict))

    return results

@router.get("/students/{student_id}", response_model=StudentProfileSchema)
def get_student_detail(student_id: int, db: Session = Depends(get_db)):
    """Retrieves specific student academic profile by ID."""
    s = db.query(StudentProfile).filter(StudentProfile.id == student_id).first()
    if not s:
        raise HTTPException(status_code=404, detail="Student profile not found")

    risk_lvl, factors = evaluate_academic_risk(s.attendance_rate, s.assessment_avg, s.assignment_completion)
    
    s_dict = {
        "id": s.id,
        "user_id": s.user_id,
        "user": s.user,
        "target_role": s.target_role,
        "attendance_rate": s.attendance_rate,
        "assessment_avg": s.assessment_avg,
        "assignment_completion": s.assignment_completion,
        "risk_level": risk_lvl,
        "risk_factors": factors,
        "faculty_review_status": s.faculty_review_status,
        "faculty_note": s.faculty_note,
        "confirmed_skills": json.loads(s.confirmed_skills or "[]"),
        "academic_records": s.academic_records
    }
    return StudentProfileSchema.model_validate(s_dict)

@router.post("/students/{student_id}/review")
def record_faculty_review(student_id: int, payload: FacultyReviewRequest, db: Session = Depends(get_db)):
    """Records faculty review status and intervention note."""
    s = db.query(StudentProfile).filter(StudentProfile.id == student_id).first()
    if not s:
        raise HTTPException(status_code=404, detail="Student profile not found")

    s.faculty_review_status = payload.review_status
    if payload.note:
        s.faculty_note = payload.note

    db.commit()
    db.refresh(s)

    return {
        "message": f"Review recorded for student ID {student_id}",
        "faculty_review_status": s.faculty_review_status,
        "faculty_note": s.faculty_note
    }
