from typing import List, Tuple, Dict
from app.models import StudentProfile, AcademicRecord

def evaluate_academic_risk(
    attendance_rate: float,
    assessment_avg: float,
    assignment_completion: float,
    attendance_threshold: float = 80.0,
    score_threshold: float = 70.0
) -> Tuple[str, List[str]]:
    """
    Transparent rule-based risk classification engine.
    Calculates risk level based on configurable thresholds.
    """
    factors = []
    
    if attendance_rate < attendance_threshold:
        factors.append(f"Attendance ({attendance_rate:.1f}%) is below requirement threshold ({attendance_threshold:.1f}%)")
    if attendance_rate < 70.0:
        factors.append("Critically low overall attendance rate (< 70%)")
        
    if assessment_avg < score_threshold:
        factors.append(f"Assessment average ({assessment_avg:.1f}%) is below academic standard ({score_threshold:.1f}%)")
    if assessment_avg < 60.0:
        factors.append("Assessment average is in failing/at-risk tier (< 60%)")
        
    if assignment_completion < 75.0:
        factors.append(f"Assignment completion rate ({assignment_completion:.1f}%) indicates submission gaps")

    # Risk level decision tree
    if len(factors) >= 3 or attendance_rate < 65.0 or assessment_avg < 55.0:
        risk_level = "High"
    elif len(factors) >= 1:
        risk_level = "Moderate"
    else:
        risk_level = "Low"
        factors.append("All academic performance metrics meet or exceed established thresholds")

    return risk_level, factors

def get_suggested_support_actions(risk_level: str, factors: List[str]) -> List[str]:
    """Provides evidence-based suggested intervention actions for faculty review."""
    actions = []
    if "Attendance" in str(factors):
        actions.append("Schedule 1-on-1 Academic Counseling regarding class attendance")
    if "Assessment" in str(factors):
        actions.append("Assign Peer Tutor for Subject Remediation & Practice Sessions")
    if "Assignment" in str(factors):
        actions.append("Provide Structured Assignment Milestone Reminders & Extension Guidance")
    
    if not actions:
        if risk_level == "High":
            actions.append("Immediate Faculty Advisory & Academic Success Plan")
        else:
            actions.append("Maintain standard academic monitoring and encourage career planning")
            
    return actions
