import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.services.academic_service import evaluate_academic_risk
from app.services.misconception_service import analyze_misconception, evaluate_followup
from app.services.career_service import extract_skills_from_text, analyze_skill_gaps
from app.services.jobshield_service import analyze_jobshield_text

client = TestClient(app)

# 1. Academic Risk Heuristics Tests
def test_evaluate_academic_risk_high():
    risk_level, factors = evaluate_academic_risk(62.0, 58.0, 60.0)
    assert risk_level == "High"
    assert len(factors) >= 2

def test_evaluate_academic_risk_low():
    risk_level, factors = evaluate_academic_risk(92.0, 88.0, 95.0)
    assert risk_level == "Low"

# 2. Misconception Engine Tests
def test_misconception_sql_join_detection():
    misconception, missing, exp, evidence, score, rec = analyze_misconception(
        topic="Database Systems",
        prompt="Explain INNER JOIN vs LEFT JOIN",
        rubric="INNER JOIN returns matching rows only. LEFT JOIN returns all left rows and fills NULL for missing right matches.",
        student_answer="INNER JOIN returns all rows from both tables even if there is no match. LEFT JOIN only returns matching rows."
    )
    assert "Inverted Relational Semantics" in misconception
    assert score <= 50.0

def test_misconception_followup_evaluation():
    init_sc, new_sc, summary, is_res = evaluate_followup(
        initial_score=42.0,
        follow_up_answer="INNER JOIN returns matching rows only from both tables. LEFT JOIN retains all rows from the left table and fills NULL for missing right rows.",
        rubric="INNER JOIN returns matching rows only. LEFT JOIN returns all left rows and fills NULL for missing right matches."
    )
    assert new_sc > init_sc
    assert is_res is True

# 3. Career Compass Skill Extraction Tests
def test_extract_skills_from_text():
    skills = extract_skills_from_text("Proficient in Python, SQL, PostgreSQL, and React with Pandas experience.")
    assert "Python" in skills
    assert "SQL" in skills
    assert "PostgreSQL" in skills
    assert "Pandas" in skills

def test_analyze_skill_gaps():
    match_score, matched, missing_gaps, roadmap = analyze_skill_gaps(
        target_role="Data Analyst",
        confirmed_skills=["Python", "Statistics"]
    )
    assert match_score < 100.0
    assert "SQL" in [g["skill_name"] for g in missing_gaps]

# 4. JobShield Scam Detection Tests
def test_jobshield_scam_detection():
    concern, risk_score, signals, steps = analyze_jobshield_text(
        raw_text="Selected for remote internship! Pay $50 registration fee via GPay within 24 hours. Contact on Telegram @scam_hr.",
        company_name="Fake Tech Inc",
        job_title="Remote Intern"
    )
    assert concern == "High Concern"
    assert risk_score >= 40.0
    assert len(signals) >= 2

# 5. API Integration Tests
def test_api_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_api_academic_overview():
    response = client.get("/api/v1/academic/overview")
    assert response.status_code == 200
    data = response.json()
    assert "total_students" in data
    assert data["total_students"] >= 1

def test_api_misconceptions_samples():
    response = client.get("/api/v1/misconceptions/samples")
    assert response.status_code == 200
    assert len(response.json()) >= 2

def test_api_journey_naveen():
    response = client.get("/api/v1/journey/naveen")
    assert response.status_code == 200
    data = response.json()
    assert data["student_name"] == "Naveen (Demo Student)"
    assert len(data["steps"]) == 5
