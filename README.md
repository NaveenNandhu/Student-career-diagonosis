# Student Success & Career Intelligence Platform

> **Tagline:** Learn Better. Build Your Future. Apply Safely.  
> **Hackathon:** CRYPTORA '26 Hackathon, Sasurie College of Engineering.  
> **Goal:** An integrated student-support SaaS platform connecting academic intelligence, misconception diagnosis, career roadmapping, and job-scam safety.

---

## 🌟 Core Product Modules

1. **Academic Intelligence & Early Review (`/academic`)**
   - Transparent rule-based academic monitoring with configurable demonstration threshold sliders (Attendance % and Score %).
   - Identifies exact triggering data factors behind risk levels without automated labels or penalties.
   - Provides evidence-based suggested faculty support actions and historical trend charts.
   - Faculty action drawer allowing Dr. Aris to record intervention counseling notes and mark items reviewed.

2. **AI Misconception Hunter (`/misconceptions`)**
   - Reference-based NLP answer comparison against expected teacher rubrics and key concept lists.
   - Pre-loaded interactive preset sample cases covering SQL JOINs, Python recursion, and Data Structure memory allocation.
   - Identifies missing concepts, extracts inconsistent evidence quotes, and classifies misconceptions.
   - Interactive follow-up answer submission with before/after clarity score improvement comparison (+delta %).

3. **AI Career Compass (`/career`)**
   - Plain text and supported file upload resume skill extraction.
   - Interactive skill confirmation badges allowing students to confirm, add custom skills, or remove false positives.
   - Target career profile matching (Data Analyst, Frontend Developer, Python Backend Developer).
   - Skill gap matrix highlighting Critical vs Recommended missing skills with industry justifications.
   - Prioritized 3-phase learning roadmap with interactive task checkboxes that dynamically update the candidate readiness score.

4. **AI JobShield Scam Defense (`/jobshield`)**
   - Analyzes job offers, recruiter emails, and WhatsApp messages across **6 core danger vectors**:
     1. Upfront Payment / Registration Fee demands.
     2. Pressure Tactics & Urgent Instant Selection without interview.
     3. Vague Employer Webmail Identity (@gmail, @yahoo).
     4. Off-Platform / Unofficial Chat-Only Hiring (Telegram/WhatsApp).
     5. Unrealistic Compensation Claims ($500/day for entry-level data entry).
     6. Premature Request for Sensitive Financial/ID Data.
   - Cautious risk classification (Low Concern, Review Recommended, High Concern).
   - Step-by-step interactive 5-step candidate verification checklist.
   - Complete privacy isolation from academic records.

5. **Integrated Student Journey (`/journey`)**
   - Complete 5-step end-to-end story walkthrough for fictional student **Naveen**:
     `Assess → Diagnose → Learn → Prepare → Apply Safely`.

6. **Faculty Advisory Portal (`/faculty`)**
   - Class-wide risk distribution summary for Dr. Aris.
   - Filterable student table (All, High Risk, Moderate Risk, Low Risk).
   - Advisory note recording and status updates.

---

## 🛠️ Stack & Architecture

- **Frontend:** React 18 + TypeScript + Vite + Tailwind CSS + Lucide React + Recharts + React Router v6.
- **Backend:** Python + FastAPI + SQLAlchemy ORM + Pydantic v2.
- **Database:** SQLite zero-config default (`sql_app.db`), with PostgreSQL `DATABASE_URL` compatibility.
- **Testing:** `pytest` (backend) + `tsc` TypeScript compiler check (frontend).

---

## 🚀 Local Quick Start Guide

### Prerequisites
- **Node.js:** v18.0 or higher (v22.15 tested)
- **Python:** v3.10 or higher (v3.13 tested)

### 1. Repository Setup & Environment File
```bash
git clone <repository-url>
cd AI-CA-HACK

# Copy environment variables template
cp .env.example .env
cp backend/.env.example backend/.env
```

### 2. Backend Installation & Database Seeding
```bash
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Run database migrations and seed demo dataset
python seed.py

# Run automated backend unit tests (All 11 tests pass)
python -m pytest

# Start FastAPI server
python -m uvicorn app.main:app --reload --port 8000
```
Backend API interactive Swagger docs available at: `http://localhost:8000/docs`

### 3. Frontend Installation & Startup
Open a new terminal window:
```bash
cd frontend

# Install npm dependencies
npm install

# Run TypeScript build check
npm run build

# Start Vite dev server
npm run dev
```
Frontend Web App live at: `http://localhost:5173/`

---

## 🔑 Demo Access Credentials

The application includes an instant **One-Click Demo Access** feature on the login screen (`/login`):

| Persona / Role | Email | Features / Context |
| :--- | :--- | :--- |
| **Student (Naveen)** *(Recommended)* | `naveen@sasurie.edu.in` | Target: Data Analyst • Academic review • Misconception diagnosis • Career roadmap • JobShield scam alert |
| **Faculty Mentor (Dr. Aris)** | `faculty@sasurie.edu.in` | Class overview • Filterable student roster • Advisory note recording |
| **System Admin** | `admin@sasurie.edu.in` | Full system access & operation overview |

*Note: Any password string (e.g. `demo`) will authenticate demo accounts.*

---

## 🔒 Security & Privacy Features

1. **Rule Transparency:** All academic risk indicators and scam detection warnings use transparent, explainable heuristic logic.
2. **Privacy Isolation:** JobShield operates independently without sharing student academic records with recruiters or external servers.
3. **Non-Punitive Design:** Academic flags trigger faculty support actions rather than automated grade penalties.
4. **Input Sanitization & Safe Uploads:** Text uploads validate file size (5MB limit) and type safely.

---

## 📊 Automated Test Results

- **Backend Pytest Suite:** `11 passed in 0.85s`
- **Frontend Build Check:** `tsc && vite build` completed with zero errors.

---

## 📄 License & Attribution

Designed and built for **CRYPTORA '26 Hackathon**, Sasurie College of Engineering. All student figures and scam text samples are illustrative fictional demo data.
