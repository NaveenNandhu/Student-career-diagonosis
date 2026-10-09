import re
from typing import Dict, List, Tuple

SAMPLE_SCAMS = [
    {
        "id": "sample-fee-scam",
        "title": "Upfront Registration Fee & Urgent Hiring Scam",
        "type": "Fraudulent Internship Offer",
        "sample_text": "Congratulations! You have been selected for the Data Analyst Remote Internship at Global Tech Solutions. No technical interview required! To confirm your seat and receive your training laptop kit, please pay a refundable registration fee of $50 via GPay/PayPal within 24 hours. Contact Mr. Alex on Telegram @tech_hr_2026 for instant onboarding."
    },
    {
        "id": "sample-telegram-scam",
        "title": "Telegram Data Entry / Unrealistic Pay Scam",
        "type": "Unrealistic Compensation Scam",
        "sample_text": "Earn $500 daily doing simple PDF to Word data entry! Work 2 hours a day from home. Immediate placement. No experience needed. Contact recruiter directly on Telegram: @quick_cash_hr. Send your full bank account details and ID card copy to start today."
    },
    {
        "id": "sample-legit-job",
        "title": "Legitimate Enterprise Data Analyst Posting",
        "type": "Verified Employment Posting",
        "sample_text": "Acme Analytics Corp is hiring a Junior Data Analyst in Chennai / Remote. Requirements: Bachelor's degree in CS or equivalent, proficient in SQL, Python, and Tableau. Selection process: Technical screening round followed by live coding interview. Apply through our official careers portal at https://careers.acmeanalytics.example.com. We never ask for money or fees during recruitment."
    }
]

def analyze_jobshield_text(
    raw_text: str,
    company_name: str = "Unverified Entity",
    job_title: str = "Job Communication"
) -> Tuple[str, float, List[Dict], List[str]]:
    """
    Scam detection heuristic engine based on 6 core risk indicators.
    Returns: (concern_level, risk_score, warning_signals, verification_steps)
    """
    text_lower = raw_text.lower()
    signals = []
    total_weight = 0

    # Vector 1: Upfront Fee Demands (High Risk - Weight 45)
    fee_keywords = [
        "registration fee", "refundable fee", "security deposit", "processing fee",
        "training fee", "laptop fee", "pay $", "pay rs", "payment of", "gpay", "paypal"
    ]
    fee_matches = [kw for kw in fee_keywords if kw in text_lower]
    if fee_matches:
        signals.append({
            "category": "Upfront Financial Demand",
            "title": "Demands Upfront Money or Fees",
            "description": "Legitimate employers NEVER ask job candidates or interns to pay registration, equipment, or processing fees.",
            "risk_level": "High",
            "evidence_quote": f"Found fee indicators: '{', '.join(fee_matches[:3])}'"
        })
        total_weight += 45

    # Vector 2: High Pressure & Instant Hiring (Weight 25)
    urgency_keywords = [
        "no interview", "instant selection", "selected without", "within 24 hours",
        "urgent seat", "limited seats", "immediate placement", "no experience needed"
    ]
    urgency_matches = [kw for kw in urgency_keywords if kw in text_lower]
    if urgency_matches:
        signals.append({
            "category": "Pressure & Fast-Track Tactics",
            "title": "No Interview or Artificial Urgency",
            "description": "Scammers rush candidates into paying before they have time to independently research the employer.",
            "risk_level": "High" if len(urgency_matches) > 1 else "Medium",
            "evidence_quote": f"Rush tactics detected: '{', '.join(urgency_matches[:2])}'"
        })
        total_weight += 25

    # Vector 3: Vague / Free Email Address (Weight 20)
    free_mail_pattern = r'\b[a-zA-Z0-9._%+-]+@(gmail|yahoo|outlook|hotmail)\.com\b'
    if re.search(free_mail_pattern, text_lower):
        signals.append({
            "category": "Vague Employer Identity",
            "title": "Recruiter Using Free Email Domain",
            "description": "Enterprise HR recruiters send emails from corporate domains (e.g. @company.com), not free public webmail accounts.",
            "risk_level": "Medium",
            "evidence_quote": "Found recruiter email on a public domain (@gmail/@yahoo)."
        })
        total_weight += 20

    # Vector 4: Unofficial Communication Channels (Weight 20)
    chat_keywords = ["telegram", "whatsapp", "signal", "dm on instagram", "@quick_", "@tech_hr"]
    chat_matches = [kw for kw in chat_keywords if kw in text_lower]
    if chat_matches:
        signals.append({
            "category": "Off-Platform Communication",
            "title": "Exclusive Chat App Recruitment",
            "description": "Conducting hiring exclusively on Telegram or WhatsApp avoids corporate audit trails.",
            "risk_level": "Medium",
            "evidence_quote": f"Communication channel: '{', '.join(chat_matches[:2])}'"
        })
        total_weight += 20

    # Vector 5: Unrealistic Compensation (Weight 15)
    unrealistic_keywords = ["$500 daily", "$100/hr", "50000 per week", "earn quick", "2 hours a day"]
    unrealistic_matches = [kw for kw in unrealistic_keywords if kw in text_lower]
    if unrealistic_matches:
        signals.append({
            "category": "Suspicious Compensation",
            "title": "Unrealistic Pay for Minimal Work",
            "description": "Offers promising high daily payout for basic data entry or no experience are standard phishing hooks.",
            "risk_level": "Medium",
            "evidence_quote": f"Exaggerated pay claim: '{', '.join(unrealistic_matches[:2])}'"
        })
        total_weight += 15

    # Vector 6: Premature Sensitive Data Requests (Weight 25)
    data_keywords = ["bank account details", "id card copy", "credit card", "passport copy", "otp"]
    data_matches = [kw for kw in data_keywords if kw in text_lower]
    if data_matches:
        signals.append({
            "category": "Data Privacy Risk",
            "title": "Premature Request for Financial/ID Info",
            "description": "Requesting banking or identity documents prior to a formal verified job offer presents identity theft risks.",
            "risk_level": "High",
            "evidence_quote": f"Sensitive info requested: '{', '.join(data_matches[:2])}'"
        })
        total_weight += 25

    # Calculate overall risk score (capped at 98.0)
    risk_score = min(98.0, float(total_weight))

    # Determine Concern Level
    if risk_score >= 40.0:
        concern_level = "High Concern"
    elif risk_score >= 15.0:
        concern_level = "Review Recommended"
    else:
        concern_level = "Low Concern"
        risk_score = 5.0

    # Standard Verification Checklist
    verification_steps = [
        "1. Check Official Website: Search for the company independently in a search engine (do not use links provided in the email).",
        "2. Verify Recruiter on LinkedIn: Confirm the recruiter's full name and corporate role on LinkedIn.",
        "3. Cross-Reference Career Portal: Search the official company career portal to confirm the Job ID exists.",
        "4. Financial Safety Rule: NEVER transfer money, buy gift cards, or pay deposit fees for a job offer.",
        "5. Identity Protection: Refuse to share banking information or government identity cards before verifying official credentials."
    ]

    return concern_level, risk_score, signals, verification_steps
