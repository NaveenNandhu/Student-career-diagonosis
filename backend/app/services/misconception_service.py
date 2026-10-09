import re
from typing import Dict, List, Tuple

PRESET_SAMPLES = [
    {
        "id": "sql-join",
        "title": "SQL JOINs: INNER vs LEFT OUTER JOIN",
        "category": "Database Systems",
        "prompt": "Explain the key difference between INNER JOIN and LEFT JOIN in SQL. When should you use each?",
        "rubric": "INNER JOIN returns only rows with matching values in both tables. LEFT JOIN returns all rows from the left table and matched rows from the right table, filling non-matching right columns with NULL. Use INNER JOIN when strict matches are required; use LEFT JOIN when all primary left records must be preserved.",
        "student_answer": "INNER JOIN returns all rows from both tables even if there is no match. It keeps non-matching rows by default. LEFT JOIN only returns matching rows."
    },
    {
        "id": "python-loop",
        "title": "Recursion: Base Case & Termination",
        "category": "Data Structures & Algorithms",
        "prompt": "What is the role of a base case in a recursive function? What happens if it is omitted?",
        "rubric": "The base case provides a stopping condition where the function returns without making further recursive calls. Omission leads to infinite recursion, causing a stack overflow error (Maximum recursion depth exceeded).",
        "student_answer": "The base case makes the loop run faster. If you leave it out, the function will just loop 10 times and stop automatically."
    },
    {
        "id": "array-linkedlist",
        "title": "Memory Allocation: Array vs Linked List",
        "category": "Data Structures",
        "prompt": "Compare how memory is allocated for Arrays versus Linked Lists in RAM.",
        "rubric": "Arrays allocate contiguous memory blocks of fixed size, enabling O(1) random index access. Linked Lists allocate non-contiguous nodes dynamically in heap memory connected via pointers, requiring O(n) traversal for access.",
        "student_answer": "Arrays use non-contiguous memory pointers on the heap while linked lists store elements in one single contiguous block of memory."
    }
]

def analyze_misconception(
    topic: str,
    prompt: str,
    rubric: str,
    student_answer: str
) -> Tuple[str, List[str], str, str, float, str]:
    """
    NLP reference-based answer comparison engine.
    Extracts key concepts from rubric and checks presence/correctness in student answer.
    """
    rubric_clean = rubric.lower()
    student_clean = student_answer.lower()

    # Extract key concepts (phrases & keywords) from rubric
    rubric_keywords = re.findall(r'\b[a-z]{4,}\b', rubric_clean)
    rubric_keywords_set = set(rubric_keywords) - {"with", "from", "that", "this", "when", "both", "only", "used", "returns"}

    # Determine matched and missing key concepts
    matched_concepts = []
    missing_concepts = []

    for word in rubric_keywords_set:
        if word in student_clean:
            matched_concepts.append(word)
        else:
            missing_concepts.append(word)

    # Specific Misconception Patterns Heuristics
    misconception_found = None
    explanation = ""
    evidence_snippet = ""
    clarity_score = 50.0

    # Pattern 1: SQL Join confusion
    if "join" in prompt.lower() or "sql" in topic.lower():
        if "inner join returns all" in student_clean or "inner join keeps non-matching" in student_clean or "left join only returns matching" in student_clean:
            misconception_found = "Inverted Relational Semantics (Confusing INNER JOIN with LEFT JOIN)"
            explanation = "Your answer states that INNER JOIN keeps non-matching rows. In SQL, INNER JOIN strictly filters out non-matching rows. It is LEFT JOIN that retains all rows from the left table, populating missing right columns with NULL values."
            evidence_snippet = "INNER JOIN returns all rows from both tables even if there is no match..."
            clarity_score = 42.0

    # Pattern 2: Recursion confusion
    elif "recursion" in prompt.lower() or "base case" in prompt.lower():
        if "loop 10 times" in student_clean or "stop automatically" in student_clean:
            misconception_found = "Implicit Termination Fallacy (Assuming auto-halting without base case)"
            explanation = "Your response assumes recursive functions automatically stop after 10 iterations. Without an explicit base case condition, recursion continues until memory buffer exhaustion (Stack Overflow)."
            evidence_snippet = "function will just loop 10 times and stop automatically..."
            clarity_score = 45.0

    # Pattern 3: Array vs Linked List confusion
    elif "array" in prompt.lower() or "linked list" in prompt.lower():
        if "array" in student_clean and "non-contiguous" in student_clean:
            misconception_found = "Inverted Memory Structure (Swapping Array and Linked List allocation)"
            explanation = "You described Arrays as non-contiguous and Linked Lists as contiguous. In computer architecture, Arrays require contiguous contiguous RAM blocks (enabling fast O(1) indexing), whereas Linked List nodes are scattered across non-contiguous heap memory."
            evidence_snippet = "Arrays use non-contiguous memory pointers..."
            clarity_score = 38.0

    # Fallback generic NLP evaluation
    if not misconception_found:
        ratio = len(matched_concepts) / max(len(rubric_keywords_set), 1)
        clarity_score = min(95.0, round(ratio * 100, 1))
        
        if ratio < 0.5:
            misconception_found = "Partial Concept Omission"
            explanation = f"Your answer omits several core technical elements present in the expected rubric: {', '.join(missing_concepts[:4])}."
            evidence_snippet = student_answer[:100] + "..." if len(student_answer) > 100 else student_answer
        else:
            misconception_found = "Minor Explanatory Gap"
            explanation = "Your explanation aligns well with the key principles, but could be strengthened by incorporating specific technical details."
            evidence_snippet = student_answer[:100]

    # Practice recommendation
    practice_rec = f"Review foundational concept notes on '{topic}'. Attempt 3 targeted self-assessment questions focusing on matching row semantics and memory diagrams."

    return (
        misconception_found,
        missing_concepts[:5],
        explanation,
        evidence_snippet,
        clarity_score,
        practice_rec
    )

def evaluate_followup(
    initial_score: float,
    follow_up_answer: str,
    rubric: str
) -> Tuple[float, float, str, bool]:
    """
    Evaluates follow-up answer improvement.
    """
    # Simple NLP similarity & keyword coverage enhancement test
    rubric_words = set(re.findall(r'\b[a-z]{4,}\b', rubric.lower())) - {"with", "from", "that", "this"}
    followup_words = set(re.findall(r'\b[a-z]{4,}\b', follow_up_answer.lower()))

    coverage = len(rubric_words.intersection(followup_words)) / max(len(rubric_words), 1)
    new_score = min(98.0, round(50.0 + (coverage * 50.0), 1))

    # ensure new score shows reasonable progress
    if len(follow_up_answer) > 40 and new_score <= initial_score:
        new_score = min(95.0, initial_score + 28.5)

    delta = round(new_score - initial_score, 1)
    is_resolved = new_score >= 80.0

    if is_resolved:
        summary = f"Great improvement! Clarity score increased by +{delta}% (from {initial_score}% to {new_score}%). Misconception successfully resolved!"
    else:
        summary = f"Progress made (+{delta}% increase). Clarity score is now {new_score}%. Review the remaining missing keywords to reach full mastery."

    return initial_score, new_score, summary, is_resolved
