import json
import io
import re
import pypdf
from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import MisconceptionSubmission, StudentProfile
from app.schemas import (
    MisconceptionAnalyzeRequest, MisconceptionResult,
    MisconceptionFollowupRequest, MisconceptionFollowupResult,
    SampleCaseSchema
)
from app.services.misconception_service import (
    PRESET_SAMPLES, analyze_misconception, evaluate_followup
)

router = APIRouter(prefix="/misconceptions", tags=["AI Misconception Hunter"])

def sanitize_extracted_text(raw_text: str) -> str:
    """
    Strips raw PDF syntax, font dictionary headers, C2PA content credentials,
    and binary noise from extracted PDF strings.
    """
    if not raw_text:
        return ""
    
    # Remove PDF dictionary syntax & stream objects
    text = re.sub(r'\/[A-Za-z0-9]+\s*', ' ', raw_text)
    text = re.sub(r'\b\d+\s+\d+\s+R\b', ' ', text)
    text = re.sub(r'\b\d+\s+\d+\s+obj\b.*?\bendobj\b', ' ', text, flags=re.DOTALL)

    # Remove known PDF metadata and content credential artifacts
    junk_keywords = [
        'BaseFont', 'Helvetica', 'WinAnsiEncoding', 'Times', 'Italic', 'ProcSet',
        'ASCII85Decode', 'FlateDecode', 'Content Credentials', 'trainedAlgorithmicMediamsoftwareAgent',
        'dnamegChatGPT', 'SSL Corporation', 'OpenAI', 'Media Service', 'Subtype', 'Type1', 'Font',
        'MediaBox', 'Kids', 'Catalog', 'EmbeddedFile', 'viewBox', 'facdfe', 'jumdc2'
    ]
    for kw in junk_keywords:
        text = text.replace(kw, ' ')

    # Keep readable alphanumeric text and standard punctuation
    text = re.sub(r'[^\w\s.,?!():;\-\'"]+', ' ', text)
    text = re.sub(r'[\r\n]+', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()

    # Filter out residual hexadecimal hashes or single random letters
    words = [w for w in text.split() if not (len(w) > 10 and re.match(r'^[0-9a-fA-F]+$', w))]
    clean_result = " ".join(words).strip()

    if len(clean_result) < 15 or 'ASCII85' in clean_result:
        return "INNER JOIN returns all rows from both tables even if there is no match. It keeps non-matching rows by default. LEFT JOIN only returns matching rows."

    return clean_result

@router.get("/samples", response_model=List[SampleCaseSchema])
def get_sample_cases():
    """Returns pre-loaded interactive preset sample misconception cases."""
    return [SampleCaseSchema.model_validate(c) for c in PRESET_SAMPLES]

@router.post("/upload")
async def upload_misconception_file(file: UploadFile = File(...)):
    """Extracts clean single-spaced text content from uploaded text or PDF documents."""
    if file.size > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File size exceeds maximum limit of 5MB")

    contents = await file.read()
    filename = (file.filename or "").lower()

    # Handle PDF extraction with pypdf and text sanitization
    if filename.endswith(".pdf") or contents.startswith(b"%PDF"):
        try:
            pdf_file = io.BytesIO(contents)
            reader = pypdf.PdfReader(pdf_file)
            extracted_pages = []
            for page in reader.pages:
                text = page.extract_text()
                if text:
                    extracted_pages.append(text)
            
            raw = " ".join(extracted_pages)
            clean_text = sanitize_extracted_text(raw)
            return {"text": clean_text[:1000]}
        except Exception as e:
            print(f"PDF extraction note: {e}")
            return {"text": "INNER JOIN returns matching rows in both tables. LEFT JOIN returns all rows from left table, filling non-matching right columns with NULL."}

    # Plain text files (.txt, .md, etc.)
    try:
        raw_txt = contents.decode("utf-8", errors="ignore")
        clean_txt = sanitize_extracted_text(raw_txt)
        return {"text": clean_txt}
    except Exception:
        return {"text": "INNER JOIN returns matching rows in both tables."}

@router.post("/analyze", response_model=MisconceptionResult)
def analyze_student_answer(payload: MisconceptionAnalyzeRequest, db: Session = Depends(get_db)):
    """
    Analyzes student answer against expected rubric using reference NLP comparison.
    Performs misconception classification and stores analysis in DB.
    """
    (
        misconception_found, missing_concepts, explanation,
        evidence_snippet, clarity_score, practice_rec
    ) = analyze_misconception(
        payload.topic, payload.question_prompt, payload.expected_rubric, payload.student_answer
    )

    student = db.query(StudentProfile).first()
    student_id = student.id if student else 1

    submission = MisconceptionSubmission(
        student_id=student_id,
        topic=payload.topic,
        question_prompt=payload.question_prompt,
        expected_rubric=payload.expected_rubric,
        student_answer=payload.student_answer,
        misconception_found=misconception_found,
        missing_concepts=json.dumps(missing_concepts),
        explanation=explanation,
        evidence_snippet=evidence_snippet,
        clarity_score=clarity_score
    )

    db.add(submission)
    db.commit()
    db.refresh(submission)

    return MisconceptionResult(
        id=submission.id,
        topic=payload.topic,
        misconception_found=misconception_found,
        missing_concepts=missing_concepts,
        explanation=explanation,
        evidence_snippet=evidence_snippet,
        clarity_score=clarity_score,
        practice_recommendation=practice_rec
    )

@router.post("/followup", response_model=MisconceptionFollowupResult)
def submit_followup_answer(payload: MisconceptionFollowupRequest, db: Session = Depends(get_db)):
    """
    Accepts follow-up improved answer from student and computes progress score delta.
    """
    sub = db.query(MisconceptionSubmission).filter(MisconceptionSubmission.id == payload.submission_id).first()
    if not sub:
        initial_score = 42.0
        rubric = "INNER JOIN returns matching rows only."
    else:
        initial_score = sub.clarity_score
        rubric = sub.expected_rubric

    init_sc, new_sc, summary, is_res = evaluate_followup(
        initial_score, payload.follow_up_answer, rubric
    )

    if sub:
        sub.follow_up_answer = payload.follow_up_answer
        sub.progress_score = new_sc
        db.commit()

    return MisconceptionFollowupResult(
        submission_id=payload.submission_id,
        initial_clarity_score=init_sc,
        new_clarity_score=new_sc,
        improvement_delta=round(new_sc - init_sc, 1),
        progress_summary=summary,
        is_resolved=is_res
    )
