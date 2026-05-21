from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class RejectionInput(BaseModel):
    email_text: str
    job_title: str = ""
    company: str = ""

@router.post("/analyze")
def analyze_rejection(data: RejectionInput):
    text = data.email_text.lower()
    reasons = []
    fixes = []
    score = 0

    # Detect rejection type
    if "not moving forward" in text or "not selected" in text or "unsuccessful" in text:
        rejection_type = "Direct Rejection"
        rejection_emoji = "❌"
    elif "keep your resume on file" in text or "future opportunities" in text:
        rejection_type = "Soft Rejection"
        rejection_emoji = "📁"
    elif "position has been filled" in text or "already filled" in text:
        rejection_type = "Position Filled"
        rejection_emoji = "🔒"
    elif "overqualified" in text:
        rejection_type = "Overqualified"
        rejection_emoji = "📈"
    elif "experience" in text and ("required" in text or "minimum" in text):
        rejection_type = "Experience Gap"
        rejection_emoji = "📊"
    elif "no response" in text or text.strip() == "":
        rejection_type = "No Response (Ghosted)"
        rejection_emoji = "👻"
    else:
        rejection_type = "General Rejection"
        rejection_emoji = "📩"

    # Analyze reasons
    if "experience" in text or "years" in text:
        reasons.append("Insufficient experience for the role")
        fixes.append({
            "issue": "Experience Gap",
            "fix": "Apply to roles matching your current experience level. For senior roles, build experience through freelance projects or internships first.",
            "priority": "high"
        })
        score += 2

    if "skill" in text or "qualification" in text or "requirement" in text:
        reasons.append("Missing required skills or qualifications")
        fixes.append({
            "issue": "Skill Mismatch",
            "fix": "Review the job description carefully. Identify missing skills and add them to your learning plan. Use CareerOS Learning Resources to fill the gaps.",
            "priority": "high"
        })
        score += 2

    if "culture" in text or "fit" in text:
        reasons.append("Cultural fit concerns")
        fixes.append({
            "issue": "Culture Fit",
            "fix": "Research the company culture deeply before applying. Tailor your cover letter to reflect their values. Prepare culture-fit answers for interviews.",
            "priority": "medium"
        })
        score += 1

    if "resume" in text or "cv" in text or "application" in text:
        reasons.append("Resume or application quality issues")
        fixes.append({
            "issue": "Resume Quality",
            "fix": "Use CareerOS Resume Tips to improve your resume score. Make sure your resume is ATS-friendly and includes strong action verbs with measurable achievements.",
            "priority": "high"
        })
        score += 2

    if "interview" in text or "performance" in text:
        reasons.append("Interview performance below expectations")
        fixes.append({
            "issue": "Interview Performance",
            "fix": "Practice with CareerOS Interview Simulator. Focus on STAR method answers. Research common questions for your target role.",
            "priority": "high"
        })
        score += 2

    if "position" in text and "filled" in text:
        reasons.append("Position was already filled internally")
        fixes.append({
            "issue": "Timing Issue",
            "fix": "This rejection is NOT about you. The position was filled before your application was reviewed. Keep applying — timing matters in job hunting.",
            "priority": "low"
        })
        score += 0

    if "salary" in text or "compensation" in text or "expectation" in text:
        reasons.append("Salary expectations mismatch")
        fixes.append({
            "issue": "Salary Mismatch",
            "fix": "Research market rates for the role on Glassdoor and LinkedIn. Be flexible in negotiations especially for your first job.",
            "priority": "medium"
        })
        score += 1

    # Default if no specific reason found
    if not reasons:
        reasons.append("Specific reason not mentioned in email")
        fixes.append({
            "issue": "Unknown Reason",
            "fix": "Reply politely to ask for feedback. Most recruiters appreciate this and sometimes provide valuable insights.",
            "priority": "medium"
        })
        fixes.append({
            "issue": "General Improvement",
            "fix": "Review your resume, strengthen your skills, and practice interview questions. Use CareerOS daily tasks to stay on track.",
            "priority": "medium"
        })

    # Calculate recovery score (how quickly can bounce back)
    if score <= 1:
        recovery = "Fast"
        recovery_color = "green"
        recovery_message = "This rejection is mostly circumstantial. Keep applying!"
    elif score <= 3:
        recovery = "Moderate"
        recovery_color = "yellow"
        recovery_message = "Fix 1-2 things and you'll see better results quickly."
    else:
        recovery = "Needs Work"
        recovery_color = "red"
        recovery_message = "Focus on skill building and resume improvement first."

    # Next steps
    next_steps = [
        "Don't reply emotionally — take 24 hours before responding",
        "Save this rejection in your tracker to identify patterns",
        "Apply to 3 more jobs today to maintain momentum",
        "Review your resume using CareerOS Resume Tips",
        "Complete today's daily tasks to stay consistent",
    ]

    if "interview" in text:
        next_steps.insert(0, "Practice 5 interview questions today")

    if "skill" in text or "qualification" in text:
        next_steps.insert(0, "Check CareerOS Learning Resources for missing skills")

    return {
        "status": "success",
        "rejection_type": rejection_type,
        "rejection_emoji": rejection_emoji,
        "reasons": reasons,
        "fixes": fixes,
        "recovery": recovery,
        "recovery_color": recovery_color,
        "recovery_message": recovery_message,
        "next_steps": next_steps[:5],
        "motivation": "Every rejection is data. Use it to improve and come back stronger. 78% of successful hires faced multiple rejections first. 🚀"
    }