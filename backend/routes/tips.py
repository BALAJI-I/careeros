from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

router = APIRouter()

class ResumeAnalysis(BaseModel):
    text: str
    skills: List[str]
    word_count: int

@router.post("/analyze")
def analyze_resume(data: ResumeAnalysis):
    text = data.text.lower()
    tips = []
    score = 10

    # Check word count
    if data.word_count < 200:
        tips.append({
            "type": "error",
            "category": "Length",
            "issue": "Resume is too short",
            "fix": "Add more details about your projects, experience and achievements. Aim for at least 300-400 words.",
            "priority": "high"
        })
        score -= 2
    elif data.word_count > 800:
        tips.append({
            "type": "warning",
            "category": "Length",
            "issue": "Resume is too long",
            "fix": "Keep your resume to 1 page. Remove irrelevant information and keep only the most important points.",
            "priority": "medium"
        })
        score -= 1

    # Check contact info
    if "@" not in text:
        tips.append({
            "type": "error",
            "category": "Contact Info",
            "issue": "No email address found",
            "fix": "Add your professional email address at the top of your resume.",
            "priority": "high"
        })
        score -= 2

    if "github" not in text:
        tips.append({
            "type": "warning",
            "category": "Online Presence",
            "issue": "No GitHub profile mentioned",
            "fix": "Add your GitHub profile URL. Recruiters always check GitHub for developers.",
            "priority": "high"
        })
        score -= 1

    if "linkedin" not in text:
        tips.append({
            "type": "warning",
            "category": "Online Presence",
            "issue": "No LinkedIn profile mentioned",
            "fix": "Add your LinkedIn profile URL to increase your credibility.",
            "priority": "medium"
        })
        score -= 1

    # Check for projects
    if "project" not in text:
        tips.append({
            "type": "error",
            "category": "Projects",
            "issue": "No projects section found",
            "fix": "Add at least 2-3 projects with tech stack, description and GitHub links. Projects are the most important section for freshers.",
            "priority": "high"
        })
        score -= 2

    # Check for action verbs
    action_verbs = ["built", "developed", "created", "designed", "implemented",
                    "improved", "increased", "reduced", "managed", "led",
                    "achieved", "delivered", "launched", "optimized"]
    found_verbs = [v for v in action_verbs if v in text]
    if len(found_verbs) < 3:
        tips.append({
            "type": "warning",
            "category": "Language",
            "issue": "Not enough action verbs",
            "fix": "Use strong action verbs like: Built, Developed, Implemented, Optimized, Delivered. Replace weak phrases like 'responsible for' with 'managed'.",
            "priority": "medium"
        })
        score -= 1

    # Check for numbers/metrics
    has_numbers = any(char.isdigit() for char in data.text)
    if not has_numbers:
        tips.append({
            "type": "warning",
            "category": "Impact",
            "issue": "No metrics or numbers found",
            "fix": "Add measurable achievements like: 'Reduced load time by 40%', 'Built app with 1000+ users', 'Improved performance by 30%'.",
            "priority": "high"
        })
        score -= 1

    # Check education
    if "b.tech" not in text and "b.e" not in text and "bachelor" not in text and "degree" not in text:
        tips.append({
            "type": "warning",
            "category": "Education",
            "issue": "Education section not clearly visible",
            "fix": "Make sure your education section clearly mentions your degree, college name, graduation year and CGPA.",
            "priority": "medium"
        })
        score -= 1

    # Check skills count
    if len(data.skills) < 5:
        tips.append({
            "type": "error",
            "category": "Skills",
            "issue": f"Only {len(data.skills)} skills detected",
            "fix": "Add more technical skills to your resume. Include programming languages, frameworks, tools and databases you know.",
            "priority": "high"
        })
        score -= 1
    elif len(data.skills) >= 15:
        tips.append({
            "type": "success",
            "category": "Skills",
            "issue": "Great skill set!",
            "fix": f"You have {len(data.skills)} skills detected. Keep updating your skills as you learn new technologies.",
            "priority": "low"
        })

    # Check for summary/objective
    if "summary" not in text and "objective" not in text and "profile" not in text:
        tips.append({
            "type": "warning",
            "category": "Summary",
            "issue": "No professional summary found",
            "fix": "Add a 2-3 line professional summary at the top. Example: 'Full Stack Developer with expertise in React and Python, passionate about building scalable web applications.'",
            "priority": "medium"
        })
        score -= 1

    # Positive tips
    if "internship" in text or "intern" in text:
        tips.append({
            "type": "success",
            "category": "Experience",
            "issue": "Internship experience found ✅",
            "fix": "Great! Make sure to highlight your internship achievements with specific metrics and technologies used.",
            "priority": "low"
        })

    if len(data.skills) >= 10:
        tips.append({
            "type": "success",
            "category": "Technical Skills",
            "issue": f"{len(data.skills)} technical skills detected ✅",
            "fix": "Strong technical profile! Make sure all listed skills are ones you can confidently discuss in an interview.",
            "priority": "low"
        })

    # Calculate final score
    score = max(1, min(10, score))

    # Score label
    if score >= 8:
        score_label = "Excellent"
        score_color = "green"
    elif score >= 6:
        score_label = "Good"
        score_color = "yellow"
    elif score >= 4:
        score_label = "Needs Work"
        score_color = "orange"
    else:
        score_label = "Poor"
        score_color = "red"

    # Sort by priority
    priority_order = {"high": 0, "medium": 1, "low": 2}
    tips.sort(key=lambda x: priority_order.get(x["priority"], 3))

    return {
        "status": "success",
        "score": score,
        "score_label": score_label,
        "score_color": score_color,
        "total_tips": len(tips),
        "high_priority": len([t for t in tips if t["priority"] == "high"]),
        "tips": tips
    }