from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

router = APIRouter()

# Sample job listings database
JOBS_DB = [
    {
        "id": 1,
        "title": "Frontend Developer",
        "company": "TechCorp India",
        "location": "Bangalore",
        "required_skills": ["react", "javascript", "html", "css", "git"],
        "nice_to_have": ["typescript", "nextjs", "tailwind"],
        "experience": "0-2 years",
        "salary": "4-8 LPA"
    },
    {
        "id": 2,
        "title": "Python Backend Developer",
        "company": "StartupX",
        "location": "Chennai",
        "required_skills": ["python", "fastapi", "mongodb", "git"],
        "nice_to_have": ["docker", "aws", "redis"],
        "experience": "0-2 years",
        "salary": "4-8 LPA"
    },
    {
        "id": 3,
        "title": "Data Science Intern",
        "company": "Analytics Co",
        "location": "Hyderabad",
        "required_skills": ["python", "pandas", "numpy", "machine learning"],
        "nice_to_have": ["tensorflow", "pytorch", "scikit-learn"],
        "experience": "Fresher",
        "salary": "3-6 LPA"
    },
    {
        "id": 4,
        "title": "Full Stack Developer",
        "company": "ProductHive",
        "location": "Remote",
        "required_skills": ["react", "nodejs", "mongodb", "javascript", "git"],
        "nice_to_have": ["aws", "docker", "typescript"],
        "experience": "1-3 years",
        "salary": "6-12 LPA"
    },
    {
        "id": 5,
        "title": "ML Engineer",
        "company": "AI Ventures",
        "location": "Pune",
        "required_skills": ["python", "machine learning", "tensorflow", "numpy", "pandas"],
        "nice_to_have": ["pytorch", "aws", "docker"],
        "experience": "0-2 years",
        "salary": "6-10 LPA"
    },
    {
        "id": 6,
        "title": "DevOps Engineer",
        "company": "CloudBase",
        "location": "Bangalore",
        "required_skills": ["linux", "git", "docker", "aws", "bash"],
        "nice_to_have": ["kubernetes", "azure", "gcp"],
        "experience": "1-3 years",
        "salary": "6-12 LPA"
    },
]

class SkillsInput(BaseModel):
    skills: List[str]

@router.post("/match")
def match_jobs(data: SkillsInput):
    user_skills = [s.lower() for s in data.skills]
    results = []

    for job in JOBS_DB:
        required = job["required_skills"]
        nice_to_have = job["nice_to_have"]

        # Calculate match %
        matched = [s for s in required if s in user_skills]
        missing = [s for s in required if s not in user_skills]
        match_percent = round((len(matched) / len(required)) * 100)

        # Decision engine
        if match_percent >= 70:
            decision = "Apply Now"
            decision_color = "green"
            decision_emoji = "🚀"
        elif match_percent >= 50:
            decision = "Apply + Learn"
            decision_color = "yellow"
            decision_emoji = "📚"
        else:
            decision = "Prepare First"
            decision_color = "red"
            decision_emoji = "🎯"

        results.append({
            "job_id": job["id"],
            "title": job["title"],
            "company": job["company"],
            "location": job["location"],
            "experience": job["experience"],
            "salary": job["salary"],
            "match_percent": match_percent,
            "matched_skills": matched,
            "missing_skills": missing,
            "decision": decision,
            "decision_color": decision_color,
            "decision_emoji": decision_emoji,
        })

    # Sort by match % highest first
    results.sort(key=lambda x: x["match_percent"], reverse=True)

    return {
        "status": "success",
        "total_jobs": len(results),
        "jobs": results
    }

@router.get("/list")
def list_jobs():
    return {
        "status": "success",
        "total_jobs": len(JOBS_DB),
        "jobs": JOBS_DB
    }