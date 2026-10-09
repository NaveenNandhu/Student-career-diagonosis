import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import JobShieldAnalysis, User
from app.schemas import (
    JobShieldAnalyzeRequest, JobShieldAnalysisResult,
    WarningSignal, SampleScamSchema
)
from app.services.jobshield_service import (
    analyze_jobshield_text, SAMPLE_SCAMS
)

router = APIRouter(prefix="/jobshield", tags=["AI JobShield"])

@router.get("/samples", response_model=List[SampleScamSchema])
def get_sample_scams():
    """Returns sample scam text cases for interactive testing."""
    return [SampleScamSchema.model_validate(s) for s in SAMPLE_SCAMS]

@router.post("/analyze", response_model=JobShieldAnalysisResult)
def analyze_job_communication(
    payload: JobShieldAnalyzeRequest,
    db: Session = Depends(get_db)
):
    """
    Scans job offer, recruiter message, or internship posting across 6 scam danger vectors.
    Returns risk classification, signal quotes, verification checklist, and heuristic disclaimer.
    """
    concern_level, risk_score, warning_signals, verification_steps = analyze_jobshield_text(
        payload.raw_text, payload.company_name or "Unverified Entity", payload.job_title or "Job Communication"
    )

    user = db.query(User).first()
    user_id = user.id if user else 1

    # Format warning signals for response
    signal_objects = [WarningSignal.model_validate(s) for s in warning_signals]

    analysis = JobShieldAnalysis(
        user_id=user_id,
        job_title=payload.job_title or "Job Communication",
        company_name=payload.company_name or "Unverified Entity",
        raw_text=payload.raw_text,
        concern_level=concern_level,
        risk_score=risk_score,
        warning_signals=json.dumps([s.model_dump() for s in signal_objects]),
        verification_steps=json.dumps(verification_steps)
    )

    db.add(analysis)
    db.commit()
    db.refresh(analysis)

    disclaimer = (
        "Heuristic Safety Notice: AI JobShield results are rule-based pattern assessments intended "
        "to assist candidate verification. They do not constitute absolute legal proof of fraud or legitimacy."
    )

    return JobShieldAnalysisResult(
        id=analysis.id,
        job_title=analysis.job_title,
        company_name=analysis.company_name,
        concern_level=concern_level,
        risk_score=risk_score,
        warning_signals=signal_objects,
        verification_steps=verification_steps,
        disclaimer=disclaimer
    )

@router.get("/history", response_model=List[JobShieldAnalysisResult])
def get_user_scan_history(db: Session = Depends(get_db)):
    """Retrieves user's saved JobShield analysis scan history."""
    analyses = db.query(JobShieldAnalysis).order_by(JobShieldAnalysis.created_at.desc()).all()
    results = []

    for a in analyses:
        signals_raw = json.loads(a.warning_signals or "[]")
        steps_raw = json.loads(a.verification_steps or "[]")
        
        signal_objs = [WarningSignal.model_validate(s) for s in signals_raw]

        results.append(JobShieldAnalysisResult(
            id=a.id,
            job_title=a.job_title,
            company_name=a.company_name,
            concern_level=a.concern_level,
            risk_score=a.risk_score,
            warning_signals=signal_objs,
            verification_steps=steps_raw,
            disclaimer="Heuristic pattern analysis assessment."
        ))

    return results
