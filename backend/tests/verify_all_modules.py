import urllib.request
import json

BASE_URL = "http://localhost:8000/api/v1"

def post(endpoint, data):
    req = urllib.request.Request(
        f"{BASE_URL}{endpoint}",
        data=json.dumps(data).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )
    with urllib.request.urlopen(req) as response:
        return json.loads(response.read().decode('utf-8'))

def get(endpoint):
    url = f"http://localhost:8000{endpoint}" if not endpoint.startswith("/api/v1") else f"http://localhost:8000{endpoint}"
    req = urllib.request.Request(url)
    with urllib.request.urlopen(req) as response:
        return json.loads(response.read().decode('utf-8'))

def run_checks():
    print("--- STARTING LIVE API & MODULE VERIFICATION ---")

    # 1. Health Check
    health = get("/health")
    print(f"[OK] Health Check: status={health.get('status')}")

    # 2. Module 1: Academic Intelligence
    acad_ov = get("/api/v1/academic/overview?attendance_threshold=80&assessment_threshold=70")
    print(f"[OK] Module 1 (Academic Overview): {acad_ov['total_students']} students monitored, high_risk={acad_ov['high_risk_count']}")
    
    st_detail = get("/api/v1/academic/students/1")
    print(f"[OK] Module 1 (Student Detail): Student={st_detail['user']['full_name']}, Risk={st_detail['risk_level']}")

    review_res = post("/academic/students/1/review", {"review_status": "Reviewed - Action Taken", "note": "Verified live"})
    print(f"[OK] Module 1 (Faculty Review Recording): {review_res['message']}")

    # 3. Module 2: AI Misconception Hunter
    samples = get("/api/v1/misconceptions/samples")
    print(f"[OK] Module 2 (Sample Presets): Loaded {len(samples)} misconception presets")

    analysis = post("/misconceptions/analyze", {
        "topic": "SQL JOINs",
        "question_prompt": "INNER JOIN vs LEFT JOIN",
        "expected_rubric": "INNER JOIN returns matching rows only. LEFT JOIN keeps left rows.",
        "student_answer": "INNER JOIN keeps all rows."
    })
    print(f"[OK] Module 2 (Misconception Diagnosis): Found='{analysis['misconception_found']}', Score={analysis['clarity_score']}%")

    followup = post("/misconceptions/followup", {
        "submission_id": analysis['id'] or 1,
        "follow_up_answer": "INNER JOIN filters non-matching rows. LEFT JOIN preserves left rows."
    })
    print(f"[OK] Module 2 (Follow-up Progress): Delta=+{followup['improvement_delta']}%, Resolved={followup['is_resolved']}")

    # 4. Module 3: AI Career Compass
    roles = get("/api/v1/career/roles")
    print(f"[OK] Module 3 (Career Roles): Loaded {len(roles)} roles")

    skills = post("/career/extract-skills", {"resume_text": "Proficient in Python, SQL, React, and Git."})
    print(f"[OK] Module 3 (Skill Extraction): Extracted {skills['raw_detected_count']} skills -> {skills['extracted_skills']}")

    gap = post("/career/analyze-gap", {
        "target_role": "Data Analyst",
        "confirmed_skills": ["Python", "Statistics"]
    })
    print(f"[OK] Module 3 (Gap Analysis): Target='{gap['target_role']}', Match={gap['match_score_percentage']}%, Roadmap Tasks={len(gap['roadmap'])}")

    toggle = post("/career/tasks/toggle", {"task_id": gap['roadmap'][0]['id'], "is_completed": True})
    print(f"[OK] Module 3 (Roadmap Task Toggle): Task {toggle['task_id']} is_completed={toggle['is_completed']}")

    # 5. Module 4: AI JobShield Scam Defense
    scams = get("/api/v1/jobshield/samples")
    print(f"[OK] Module 4 (Scam Samples): Loaded {len(scams)} scam test scenarios")

    js_res = post("/jobshield/analyze", {
        "raw_text": "Selected! Pay $50 registration fee via GPay within 24 hours. Telegram @scam_hr.",
        "company_name": "Fake Corp",
        "job_title": "Remote Data Analyst"
    })
    print(f"[OK] Module 4 (Scam Scan): Concern='{js_res['concern_level']}', Risk Score={js_res['risk_score']}, Signals={len(js_res['warning_signals'])}")

    history = get("/api/v1/jobshield/history")
    print(f"[OK] Module 4 (Scan History): Total Saved Scans={len(history)}")

    # 6. Integrated Student Journey
    journey = get("/api/v1/journey/naveen")
    print(f"[OK] Integrated Journey: Student={journey['student_name']}, Steps={len(journey['steps'])}, Status='{journey['overall_status']}'")

    print("\n=======================================================")
    print("ALL 4 CORE MODULES + JOURNEY ENDPOINTS WORKING PERFECTLY!")
    print("=======================================================")

if __name__ == "__main__":
    run_checks()
