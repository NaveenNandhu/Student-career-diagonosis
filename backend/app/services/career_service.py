import re
from typing import List, Dict, Tuple

# Pre-defined career role profiles with required and recommended skills
ROLE_PROFILES = {
    "Data Analyst": {
        "title": "Data Analyst",
        "description": "Transforms raw data into actionable business insights using SQL, Python, Excel, and visualization tools.",
        "required_skills": ["SQL", "Python", "Data Visualization", "Excel", "Statistics"],
        "recommended_skills": ["Power BI", "Tableau", "Pandas", "ETL", "Communication"],
        "roadmap_templates": [
            {
                "phase": "Phase 1: Core Fundamentals",
                "topic": "SQL & Relational Databases",
                "title": "Master Advanced SQL Queries & Aggregations",
                "description": "Learn complex INNER/LEFT JOINs, window functions (ROW_NUMBER, RANK), CTEs, and GROUP BY aggregations.",
                "action": "Complete 15 SQL query challenges on LeetCode / HackerRank and submit a query optimization report."
            },
            {
                "phase": "Phase 1: Core Fundamentals",
                "topic": "Python for Data Analysis",
                "title": "Data Wrangling with Pandas & NumPy",
                "description": "Clean messy datasets, handle missing values, reshape dataframes, and perform statistical aggregations.",
                "action": "Load a 50k-row CSV dataset, perform exploratory data analysis (EDA), and export a clean dataset."
            },
            {
                "phase": "Phase 2: Practical Projects",
                "topic": "Business Intelligence & Visualization",
                "title": "Interactive Dashboard Creation in Power BI / Tableau",
                "description": "Design user-centered metrics dashboards with dynamic filters, KPIs, and trend visual charts.",
                "action": "Build a Student Attendance & Grade Performance Dashboard and publish to Web."
            },
            {
                "phase": "Phase 2: Practical Projects",
                "topic": "Applied Data Project",
                "title": "End-to-End E-Commerce Sales Insights Project",
                "description": "Synthesize SQL data extraction, Python EDA, and dashboard storytelling into a complete portfolio repository.",
                "action": "Write a GitHub README detailing methodology, key insights, and business recommendations."
            },
            {
                "phase": "Phase 3: Career Ready",
                "topic": "Portfolio & Mock Interviews",
                "title": "Resume Polish & Case Study Presentation",
                "description": "Format projects using STAR method (Situation, Task, Action, Result) and practice SQL live coding.",
                "action": "Conduct 2 mock technical interviews and optimize GitHub profile."
            }
        ]
    },
    "Frontend Developer": {
        "title": "Frontend Developer",
        "description": "Builds responsive, interactive web applications using React, TypeScript, Tailwind CSS, and modern web standards.",
        "required_skills": ["JavaScript", "TypeScript", "React", "HTML5/CSS3", "Tailwind CSS"],
        "recommended_skills": ["Next.js", "Git", "REST APIs", "State Management", "Testing"],
        "roadmap_templates": [
            {
                "phase": "Phase 1: Core Fundamentals",
                "topic": "Modern JavaScript & TypeScript",
                "title": "ES6+ Features & Static Type Checking",
                "description": "Master async/await, closures, generics, and strict TypeScript interface definitions.",
                "action": "Convert a plain JS utility script to strict TypeScript with 100% type coverage."
            },
            {
                "phase": "Phase 2: Practical Projects",
                "topic": "React Application Architecture",
                "title": "Component Design & Hooks State Engine",
                "description": "Build reusable components, manage side-effects cleanly, and handle global context.",
                "action": "Build an interactive SaaS dashboard shell with dark/light mode and data table filtering."
            },
            {
                "phase": "Phase 3: Career Ready",
                "topic": "Performance & Deployment",
                "title": "Web Vitals & Lighthouse Optimization",
                "description": "Optimize bundle size, code splitting, image assets, and deploy to Vercel/Netlify.",
                "action": "Achieve 90+ Lighthouse Performance score on built web application."
            }
        ]
    },
    "Python Developer": {
        "title": "Python Backend Developer",
        "description": "Architects scalable APIs, database integrations, and microservices using Python, FastAPI, SQL, and Docker.",
        "required_skills": ["Python", "FastAPI", "SQL", "REST APIs", "Git"],
        "recommended_skills": ["PostgreSQL", "Docker", "SQLAlchemy", "Unit Testing", "Redis"],
        "roadmap_templates": [
            {
                "phase": "Phase 1: Core Fundamentals",
                "topic": "Async Python & FastAPI",
                "title": "REST API Architecture & Pydantic Validation",
                "description": "Build RESTful endpoints, validate schemas, handle errors, and configure CORS middleware.",
                "action": "Develop a full CRUD API with JWT authentication and OpenAPI Swagger docs."
            },
            {
                "phase": "Phase 2: Practical Projects",
                "topic": "Database ORM & Migrations",
                "title": "SQLAlchemy Models & PostgreSQL Integration",
                "description": "Design relational schemas, manage foreign keys, and run Alembic database migrations.",
                "action": "Implement a relational data layer with parameterized queries and index optimization."
            },
            {
                "phase": "Phase 3: Career Ready",
                "topic": "Testing & Containerization",
                "title": "Pytest Suite & Docker Container Deployment",
                "description": "Write automated unit tests, mock external calls, build multi-stage Dockerfiles.",
                "action": "Reach 85%+ test coverage and run backend in isolated Docker container."
            }
        ]
    },
    "Data Scientist": {
        "title": "Data Scientist / AI Engineer",
        "description": "Builds predictive models, neural networks, and automated machine learning pipelines using Python, Scikit-Learn, PyTorch, and SQL.",
        "required_skills": ["Python", "Machine Learning", "SQL", "Statistics", "Scikit-Learn"],
        "recommended_skills": ["PyTorch", "Deep Learning", "Pandas", "NLP", "Docker"],
        "roadmap_templates": [
            {
                "phase": "Phase 1: Statistical & ML Foundations",
                "topic": "Supervised Learning Models",
                "title": "Regression & Classification Models with Scikit-Learn",
                "description": "Train Decision Trees, Random Forests, Logistic Regression, and evaluate metrics (Precision, Recall, F1, ROC-AUC).",
                "action": "Train a model on a 100k dataset and achieve >85% accuracy on test split."
            },
            {
                "phase": "Phase 2: Deep Learning & AI",
                "topic": "Neural Networks with PyTorch",
                "title": "Deep Neural Network Architecture & Model Training",
                "description": "Build custom PyTorch tensors, activation functions, backpropagation loops, and loss optimization.",
                "action": "Build a PyTorch computer vision or text classifier model and evaluate loss convergence."
            },
            {
                "phase": "Phase 3: Career Ready",
                "topic": "MLOps & Model Deployment",
                "title": "FastAPI Model Inference Endpoint",
                "description": "Containerize PyTorch/Scikit-Learn models into REST APIs for real-time predictions.",
                "action": "Deploy ML inference REST API endpoint and measure latency under 100ms."
            }
        ]
    },
    "Full Stack Developer": {
        "title": "Full Stack Web Developer",
        "description": "Delivers complete end-to-end web applications combining React frontends, Node/Python backends, and relational databases.",
        "required_skills": ["JavaScript", "React", "Node.js", "Python", "SQL"],
        "recommended_skills": ["TypeScript", "MongoDB", "Tailwind CSS", "Git", "REST APIs"],
        "roadmap_templates": [
            {
                "phase": "Phase 1: Core Web Stack",
                "topic": "Frontend Component UI & State",
                "title": "Interactive React UI with Tailwind CSS",
                "description": "Build modular React UI views, custom hooks, dynamic forms, and API integrations.",
                "action": "Create a multi-view client dashboard connecting to backend REST endpoints."
            },
            {
                "phase": "Phase 2: Backend & Database Engine",
                "topic": "Node/Python Backend APIs",
                "title": "Relational Data Layer & JWT Auth",
                "description": "Implement authentication middleware, hash passwords, and query SQL database records.",
                "action": "Build secure login & role-based route access controls."
            },
            {
                "phase": "Phase 3: Career Ready",
                "topic": "Deployment & DevOps",
                "title": "Full Stack Production Build",
                "description": "Deploy frontend SPA to Vercel and backend microservice to Render or AWS EC2.",
                "action": "Achieve live SSL production deployment with zero runtime errors."
            }
        ]
    },
    "Cybersecurity Analyst": {
        "title": "Cybersecurity Analyst",
        "description": "Monitors network traffic, assesses vulnerabilities, audits system security, and prevents cyber threats.",
        "required_skills": ["Networking", "Linux", "Python", "Security Fundamentals", "SQL"],
        "recommended_skills": ["Wireshark", "Penetration Testing", "Cryptography", "SIEM", "Git"],
        "roadmap_templates": [
            {
                "phase": "Phase 1: Systems & Network Fundamentals",
                "topic": "Linux Admin & Traffic Analysis",
                "title": "Linux Shell Scripting & Wireshark Packet Captures",
                "description": "Analyze TCP/IP headers, inspect HTTP request payloads, and write Bash audit scripts.",
                "action": "Identify 5 suspicious network traffic vectors in a sample PCAP file."
            },
            {
                "phase": "Phase 2: Web & System Security",
                "topic": "Vulnerability Assessment",
                "title": "OWASP Top 10 Mitigation & SQL Injection Audit",
                "description": "Test web applications for XSS, SQLi, and broken authentication vulnerabilities.",
                "action": "Conduct a security audit on a sample app and submit a vulnerability remediation report."
            },
            {
                "phase": "Phase 3: Career Ready",
                "topic": "Security Incident Response",
                "title": "SIEM Monitoring & Security Compliance",
                "description": "Configure log alerts, analyze incident logs, and draft incident response playbooks.",
                "action": "Simulate a security breach incident response and present findings."
            }
        ]
    }
}

SKILL_LEXICON = [
    "SQL", "Python", "Data Visualization", "Excel", "Statistics", "Power BI", "Tableau", 
    "Pandas", "NumPy", "ETL", "Communication", "JavaScript", "TypeScript", "React", 
    "HTML5/CSS3", "Tailwind CSS", "Next.js", "Git", "REST APIs", "State Management", 
    "Testing", "FastAPI", "PostgreSQL", "Docker", "SQLAlchemy", "Unit Testing", "Redis", 
    "C++", "Java", "Machine Learning", "Data Mining", "Git/GitHub", "Scikit-Learn", 
    "PyTorch", "Deep Learning", "NLP", "Node.js", "MongoDB", "Networking", "Linux", 
    "Security Fundamentals", "Wireshark", "Penetration Testing", "Cryptography", "SIEM"
]

def extract_skills_from_text(raw_text: str) -> List[str]:
    """
    Transparent skill extraction algorithm.
    Scans text against normalized tech lexicon.
    """
    text_upper = raw_text.upper()
    text_lower = raw_text.lower()
    found_skills = set()

    for skill in SKILL_LEXICON:
        # Custom regex match to avoid false substring matches
        pattern = r'\b' + re.escape(skill.lower()) + r'\b'
        if re.search(pattern, text_lower) or skill.upper() in text_upper:
            found_skills.add(skill)

    # Specific common synonyms
    if "postgres" in text_lower:
        found_skills.add("PostgreSQL")
    if "recharts" in text_lower or "chart" in text_lower:
        found_skills.add("Data Visualization")

    return list(found_skills)

def analyze_skill_gaps(
    target_role: str,
    confirmed_skills: List[str]
) -> Tuple[float, List[str], List[Dict], List[Dict]]:
    """
    Compares student's confirmed skills against target role requirements.
    Calculates match score %, matched skills, missing gaps with justifications,
    and returns customized roadmap templates.
    """
    role_info = ROLE_PROFILES.get(target_role, ROLE_PROFILES["Data Analyst"])
    req_skills = set(role_info["required_skills"])
    rec_skills = set(role_info["recommended_skills"])
    all_role_skills = req_skills.union(rec_skills)

    student_skills_set = set(confirmed_skills)

    matched = list(req_skills.intersection(student_skills_set).union(rec_skills.intersection(student_skills_set)))
    
    missing_gaps = []

    # Required skill gaps (Critical)
    for skill in req_skills:
        if skill not in student_skills_set:
            missing_gaps.append({
                "skill_name": skill,
                "status": "Gap - Critical",
                "importance_reason": f"Core requirement for {target_role}. Required for technical screening and daily tasks."
            })

    # Recommended skill gaps (Recommended)
    for skill in rec_skills:
        if skill not in student_skills_set:
            missing_gaps.append({
                "skill_name": skill,
                "status": "Gap - Recommended",
                "importance_reason": f"Secondary skill that sets candidates apart during portfolio review for {target_role}."
            })

    # Calculate match percentage
    total_req_count = len(req_skills)
    matched_req_count = len(req_skills.intersection(student_skills_set))
    
    match_score = round((matched_req_count / max(total_req_count, 1)) * 100, 1)

    roadmap = role_info["roadmap_templates"]

    return match_score, matched, missing_gaps, roadmap
