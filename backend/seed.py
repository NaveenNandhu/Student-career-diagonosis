import json
from app.database import engine, Base, SessionLocal
from app.models import (
    User, StudentProfile, AcademicRecord, 
    MisconceptionSubmission, CareerRoadmapItem, JobShieldAnalysis
)

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Check if database is already seeded
    if db.query(User).filter(User.email == "naveen@sasurie.edu.in").first():
        print("Database already contains demo data.")
        db.close()
        return

    print("Seeding database with plausible fictional demo data...")

    # 1. Users
    student_user = User(
        email="naveen@sasurie.edu.in",
        hashed_password="hashed_demo_password_123",
        full_name="Naveen (Student)",
        role="student",
        department="Computer Science & Engineering",
        student_id_code="SCE-2026-CS042",
        is_demo_user=True
    )
    faculty_user = User(
        email="faculty@sasurie.edu.in",
        hashed_password="hashed_demo_password_123",
        full_name="Dr. Aris (Faculty Mentor)",
        role="faculty",
        department="Computer Science & Engineering",
        student_id_code="FAC-8802",
        is_demo_user=True
    )
    admin_user = User(
        email="admin@sasurie.edu.in",
        hashed_password="hashed_demo_password_123",
        full_name="System Admin",
        role="admin",
        department="Academic Operations",
        student_id_code="ADM-0001",
        is_demo_user=True
    )
    db.add_all([student_user, faculty_user, admin_user])
    db.commit()

    # 2. Student Profile
    profile = StudentProfile(
        user_id=student_user.id,
        target_role="Data Analyst",
        attendance_rate=81.5,
        assessment_avg=68.4,
        assignment_completion=75.0,
        risk_level="Moderate",
        risk_factors=json.dumps([
            "Attendance (81.5%) is close to minimum threshold (80.0%)",
            "Assessment average (68.4%) is below academic standard (70.0%)"
        ]),
        faculty_review_status="Reviewed - Intervention Scheduled",
        faculty_note="Recommended peer tutoring for Database Systems SQL modules and weekly assignment tracking.",
        confirmed_skills=json.dumps(["Python", "Statistics", "Excel", "Communication"])
    )
    db.add(profile)
    db.commit()

    # Add 2 other demo student profiles for Faculty View
    s2_user = User(
        email="priya@sasurie.edu.in",
        hashed_password="hashed_password",
        full_name="Priya Sharma",
        role="student",
        department="Computer Science & Engineering",
        student_id_code="SCE-2026-CS018",
        is_demo_user=True
    )
    s3_user = User(
        email="rahul@sasurie.edu.in",
        hashed_password="hashed_password",
        full_name="Rahul V",
        role="student",
        department="Computer Science & Engineering",
        student_id_code="SCE-2026-CS055",
        is_demo_user=True
    )
    db.add_all([s2_user, s3_user])
    db.commit()

    p2 = StudentProfile(
        user_id=s2_user.id,
        target_role="Frontend Developer",
        attendance_rate=94.2,
        assessment_avg=88.5,
        assignment_completion=96.0,
        risk_level="Low",
        risk_factors=json.dumps(["All academic performance metrics meet or exceed established thresholds"]),
        faculty_review_status="Pending Review",
        confirmed_skills=json.dumps(["JavaScript", "React", "HTML5/CSS3", "Git"])
    )
    p3 = StudentProfile(
        user_id=s3_user.id,
        target_role="Python Developer",
        attendance_rate=64.0,
        assessment_avg=56.2,
        assignment_completion=60.0,
        risk_level="High",
        risk_factors=json.dumps([
            "Critically low overall attendance rate (< 70%)",
            "Assessment average is in failing/at-risk tier (< 60%)",
            "Assignment completion rate (60.0%) indicates submission gaps"
        ]),
        faculty_review_status="Action Taken",
        faculty_note="Assigned mandatory faculty mentoring sessions and attendance tracking.",
        confirmed_skills=json.dumps(["Python", "C++"])
    )
    db.add_all([p2, p3])
    db.commit()

    # 3. Academic Records for Naveen
    rec1 = AcademicRecord(
        student_id=profile.id,
        course_code="CS302",
        course_name="Database Management Systems",
        attendance_percentage=78.0,
        assessment_score=64.0,
        assignment_completion_rate=70.0,
        term="Semester 5"
    )
    rec2 = AcademicRecord(
        student_id=profile.id,
        course_code="CS304",
        course_name="Data Structures & Algorithms",
        attendance_percentage=84.0,
        assessment_score=72.5,
        assignment_completion_rate=80.0,
        term="Semester 5"
    )
    rec3 = AcademicRecord(
        student_id=profile.id,
        course_code="MA301",
        course_name="Applied Statistics & Probability",
        attendance_percentage=82.5,
        assessment_score=68.7,
        assignment_completion_rate=75.0,
        term="Semester 5"
    )
    db.add_all([rec1, rec2, rec3])
    db.commit()

    # 4. Misconception Submission
    sub = MisconceptionSubmission(
        student_id=profile.id,
        topic="SQL JOINs: INNER vs LEFT OUTER JOIN",
        question_prompt="Explain the key difference between INNER JOIN and LEFT JOIN in SQL. When should you use each?",
        expected_rubric="INNER JOIN returns only rows with matching values in both tables. LEFT JOIN returns all rows from the left table and matched rows from the right table, filling non-matching right columns with NULL.",
        student_answer="INNER JOIN returns all rows from both tables even if there is no match. It keeps non-matching rows by default. LEFT JOIN only returns matching rows.",
        misconception_found="Inverted Relational Semantics (Confusing INNER JOIN with LEFT JOIN)",
        missing_concepts=json.dumps(["null filling", "matching filter", "left preservation"]),
        explanation="Your answer states that INNER JOIN keeps non-matching rows. In SQL, INNER JOIN strictly filters out non-matching rows. It is LEFT JOIN that retains all rows from the left table, populating missing right columns with NULL values.",
        evidence_snippet="INNER JOIN returns all rows from both tables even if there is no match...",
        clarity_score=42.0,
        follow_up_answer="INNER JOIN returns matching rows present in both tables. LEFT JOIN retains all records from the left table and fills non-matching right columns with NULL values.",
        progress_score=80.0
    )
    db.add(sub)
    db.commit()

    # 5. Career Roadmap Items for Naveen
    item1 = CareerRoadmapItem(
        student_id=profile.id,
        target_role="Data Analyst",
        phase="Phase 1: Core Fundamentals",
        topic="SQL & Relational Databases",
        title="Master Advanced SQL Queries & Aggregations",
        description="Learn complex INNER/LEFT JOINs, window functions (ROW_NUMBER, RANK), CTEs, and GROUP BY aggregations.",
        recommended_action="Complete 15 SQL query challenges on LeetCode / HackerRank and submit a query optimization report.",
        is_completed=True,
        priority=1
    )
    item2 = CareerRoadmapItem(
        student_id=profile.id,
        target_role="Data Analyst",
        phase="Phase 1: Core Fundamentals",
        topic="Python for Data Analysis",
        title="Data Wrangling with Pandas & NumPy",
        description="Clean messy datasets, handle missing values, reshape dataframes, and perform statistical aggregations.",
        recommended_action="Load a 50k-row CSV dataset, perform exploratory data analysis (EDA), and export a clean dataset.",
        is_completed=False,
        priority=2
    )
    item3 = CareerRoadmapItem(
        student_id=profile.id,
        target_role="Data Analyst",
        phase="Phase 2: Practical Projects",
        topic="Business Intelligence & Visualization",
        title="Interactive Dashboard Creation in Power BI / Tableau",
        description="Design user-centered metrics dashboards with dynamic filters, KPIs, and trend visual charts.",
        recommended_action="Build a Student Attendance & Grade Performance Dashboard and publish to Web.",
        is_completed=False,
        priority=3
    )
    item4 = CareerRoadmapItem(
        student_id=profile.id,
        target_role="Data Analyst",
        phase="Phase 2: Practical Projects",
        topic="Applied Data Project",
        title="End-to-End E-Commerce Sales Insights Project",
        description="Synthesize SQL data extraction, Python EDA, and dashboard storytelling into a complete portfolio repository.",
        recommended_action="Write a GitHub README detailing methodology, key insights, and business recommendations.",
        is_completed=False,
        priority=4
    )
    db.add_all([item1, item2, item3, item4])
    db.commit()

    # 6. JobShield Analysis
    js = JobShieldAnalysis(
        user_id=student_user.id,
        job_title="Remote Data Analyst Intern",
        company_name="Global Tech Solutions (Unverified)",
        raw_text="Congratulations! You have been selected for the Data Analyst Remote Internship at Global Tech Solutions. No technical interview required! To confirm your seat and receive your training laptop kit, please pay a refundable registration fee of $50 via GPay within 24 hours.",
        concern_level="High Concern",
        risk_score=95.0,
        warning_signals=json.dumps([
            {
                "category": "Upfront Financial Demand",
                "title": "Demands Upfront Money or Fees",
                "description": "Legitimate employers NEVER ask job candidates or interns to pay registration, equipment, or processing fees.",
                "risk_level": "High",
                "evidence_quote": "Found fee indicators: 'registration fee', 'pay $'"
            },
            {
                "category": "Pressure & Fast-Track Tactics",
                "title": "No Interview or Artificial Urgency",
                "description": "Scammers rush candidates into paying before they have time to independently research the employer.",
                "risk_level": "High",
                "evidence_quote": "Rush tactics detected: 'no interview', 'within 24 hours'"
            }
        ]),
        verification_steps=json.dumps([
            "1. Check Official Website: Search for company independently.",
            "2. Verify Recruiter on LinkedIn: Confirm corporate identity.",
            "3. Financial Safety Rule: NEVER transfer money for a job offer.",
            "4. Identity Protection: Refuse to share banking info upfront."
        ])
    )
    db.add(js)
    db.commit()

    db.close()
    print("Database successfully seeded!")

if __name__ == "__main__":
    seed_database()
