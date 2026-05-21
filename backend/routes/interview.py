from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

router = APIRouter()

INTERVIEW_QUESTIONS = {
    "Frontend Developer": [
        "Tell me about yourself and your experience with frontend development.",
        "Explain the difference between React state and props.",
        "How do you optimize a slow-loading web application?",
        "What is the virtual DOM and how does React use it?",
        "Describe a challenging project you built and how you solved the problems.",
    ],
    "Python Backend Developer": [
        "Tell me about yourself and your Python experience.",
        "What is the difference between REST API and GraphQL?",
        "How do you handle database optimization in Python applications?",
        "Explain the concept of middleware in FastAPI or Django.",
        "Describe a backend system you built from scratch.",
    ],
    "Data Science": [
        "Tell me about yourself and your data science background.",
        "Explain the difference between supervised and unsupervised learning.",
        "How do you handle missing data in a dataset?",
        "What is overfitting and how do you prevent it?",
        "Walk me through a data science project you completed.",
    ],
    "Full Stack Developer": [
        "Tell me about yourself and your full stack experience.",
        "How do you decide when to use SQL vs NoSQL databases?",
        "Explain the concept of RESTful API design.",
        "How do you handle authentication and authorization in web apps?",
        "Describe the most complex full stack application you built.",
    ],
    "ML Engineer": [
        "Tell me about yourself and your machine learning background.",
        "What is the difference between batch and online learning?",
        "How do you deploy a machine learning model to production?",
        "Explain the bias-variance tradeoff.",
        "Describe an ML model you built and deployed.",
    ],
    "DevOps Engineer": [
        "Tell me about yourself and your DevOps experience.",
        "Explain the concept of CI/CD pipelines.",
        "How do you monitor applications in production?",
        "What is containerization and how does Docker work?",
        "Describe a production incident you handled and resolved.",
    ],
    "General": [
        "Tell me about yourself and your technical background.",
        "What is your greatest strength as a developer?",
        "Describe a situation where you had to learn a new technology quickly.",
        "How do you handle disagreements with teammates?",
        "Where do you see yourself in 3 years?",
    ]
}

ANSWER_TIPS = {
    0: "Use the STAR method — Situation, Task, Action, Result. Keep it under 2 minutes.",
    1: "Be specific and technical. Show depth of knowledge. Use examples from projects.",
    2: "Mention specific tools, metrics and outcomes. Numbers make answers stronger.",
    3: "Show that you understand core concepts deeply. Relate to real experience.",
    4: "This is your chance to shine. Be specific, show impact, mention challenges overcome.",
}

def evaluate_answer(question: str, answer: str, question_index: int) -> dict:
    answer_lower = answer.lower()
    score = 5
    feedback = []
    improvements = []

    # Length check
    word_count = len(answer.split())
    if word_count < 20:
        score -= 2
        feedback.append("Answer is too short")
        improvements.append("Expand your answer with more details and examples. Aim for 100-200 words.")
    elif word_count > 300:
        score -= 1
        feedback.append("Answer is slightly long")
        improvements.append("Try to be more concise. Focus on the most important points.")
    else:
        score += 1
        feedback.append("Good answer length")

    # STAR method check for behavioral questions
    star_keywords = ["situation", "task", "action", "result", "when", "example", "project", "built", "worked"]
    star_found = sum(1 for k in star_keywords if k in answer_lower)
    if star_found >= 3:
        score += 1
        feedback.append("Good use of examples")
    else:
        improvements.append("Use the STAR method: describe the Situation, Task, Action you took, and Result achieved.")

    # Technical keywords check
    tech_keywords = ["developed", "built", "implemented", "designed", "optimized",
                     "improved", "created", "managed", "led", "increased", "reduced"]
    tech_found = sum(1 for k in tech_keywords if k in answer_lower)
    if tech_found >= 2:
        score += 1
        feedback.append("Good use of action verbs")
    else:
        improvements.append("Use strong action verbs: developed, implemented, optimized, improved.")

    # Numbers/metrics check
    has_numbers = any(char.isdigit() for char in answer)
    if has_numbers:
        score += 1
        feedback.append("Great — includes specific metrics")
    else:
        improvements.append("Add specific numbers or metrics to strengthen your answer. E.g., '30% faster', '1000 users', '3 months'.")

    # Confidence check
    weak_words = ["i think", "maybe", "i guess", "i don't know", "not sure", "kind of"]
    weak_found = sum(1 for w in weak_words if w in answer_lower)
    if weak_found > 0:
        score -= 1
        improvements.append("Avoid uncertain phrases like 'I think', 'maybe', 'I guess'. Speak with confidence.")
    else:
        feedback.append("Confident tone")

    # Final score
    score = max(1, min(10, score))

    if score >= 8:
        grade = "Excellent"
        grade_color = "green"
    elif score >= 6:
        grade = "Good"
        grade_color = "yellow"
    elif score >= 4:
        grade = "Average"
        grade_color = "orange"
    else:
        grade = "Needs Work"
        grade_color = "red"

    return {
        "score": score,
        "grade": grade,
        "grade_color": grade_color,
        "feedback": feedback,
        "improvements": improvements,
        "tip": ANSWER_TIPS.get(question_index, "Be specific and use real examples from your experience.")
    }

class StartInterview(BaseModel):
    role: str

class SubmitAnswer(BaseModel):
    role: str
    question: str
    answer: str
    question_index: int

@router.post("/start")
def start_interview(data: StartInterview):
    questions = INTERVIEW_QUESTIONS.get(
        data.role,
        INTERVIEW_QUESTIONS["General"]
    )
    return {
        "status": "success",
        "role": data.role,
        "questions": questions,
        "total_questions": len(questions),
        "tip": "Take a deep breath. Answer clearly and confidently. Use real examples."
    }

@router.post("/evaluate")
def evaluate_interview_answer(data: SubmitAnswer):
    evaluation = evaluate_answer(
        data.question,
        data.answer,
        data.question_index
    )
    return {
        "status": "success",
        "question": data.question,
        "evaluation": evaluation
    }

@router.get("/roles")
def get_roles():
    return {
        "status": "success",
        "roles": list(INTERVIEW_QUESTIONS.keys())
    }