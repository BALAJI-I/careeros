from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
from database import jobs_collection
from bson import ObjectId
from datetime import datetime

router = APIRouter()

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
    {
        "id": 7,
        "title": "React Native Developer",
        "company": "MobileFirst",
        "location": "Mumbai",
        "required_skills": ["react", "javascript", "git"],
        "nice_to_have": ["typescript", "redux", "nodejs"],
        "experience": "0-2 years",
        "salary": "5-9 LPA"
    },
    {
        "id": 8,
        "title": "Data Analyst",
        "company": "DataMinds",
        "location": "Chennai",
        "required_skills": ["python", "pandas", "numpy", "mysql"],
        "nice_to_have": ["tableau", "power bi", "mongodb"],
        "experience": "Fresher",
        "salary": "3-6 LPA"
    },
    {
        "id": 9,
        "title": "Backend Developer",
        "company": "FinTech Solutions",
        "location": "Hyderabad",
        "required_skills": ["python", "django", "mysql", "git"],
        "nice_to_have": ["redis", "docker", "aws"],
        "experience": "1-3 years",
        "salary": "6-10 LPA"
    },
    {
        "id": 10,
        "title": "AI Research Intern",
        "company": "DeepThink Labs",
        "location": "Bangalore",
        "required_skills": ["python", "deep learning", "pytorch", "numpy"],
        "nice_to_have": ["tensorflow", "scikit-learn", "pandas"],
        "experience": "Fresher",
        "salary": "4-7 LPA"
    },
    {
        "id": 11,
        "title": "Cloud Engineer",
        "company": "CloudNine",
        "location": "Remote",
        "required_skills": ["aws", "linux", "python", "git"],
        "nice_to_have": ["docker", "kubernetes", "azure"],
        "experience": "1-3 years",
        "salary": "8-14 LPA"
    },
    {
        "id": 12,
        "title": "Java Developer",
        "company": "Enterprise Systems",
        "location": "Pune",
        "required_skills": ["java", "mysql", "git"],
        "nice_to_have": ["spring", "docker", "mongodb"],
        "experience": "0-2 years",
        "salary": "4-8 LPA"
    },
    {
        "id": 13,
        "title": "NLP Engineer",
        "company": "LinguaTech",
        "location": "Bangalore",
        "required_skills": ["python", "nlp", "machine learning", "pandas"],
        "nice_to_have": ["tensorflow", "pytorch", "scikit-learn"],
        "experience": "0-2 years",
        "salary": "6-12 LPA"
    },
    {
        "id": 14,
        "title": "Database Administrator",
        "company": "DataVault",
        "location": "Chennai",
        "required_skills": ["mysql", "mongodb", "python", "linux"],
        "nice_to_have": ["postgresql", "redis", "aws"],
        "experience": "1-3 years",
        "salary": "5-9 LPA"
    },
    {
        "id": 15,
        "title": "Software Engineer",
        "company": "Infosys",
        "location": "Bangalore",
        "required_skills": ["python", "java", "git", "mysql"],
        "nice_to_have": ["aws", "docker", "react"],
        "experience": "Fresher",
        "salary": "3.6-6 LPA"
    },
    {
        "id": 16,
        "title": "UI/UX Developer",
        "company": "DesignCraft",
        "location": "Mumbai",
        "required_skills": ["html", "css", "javascript", "react"],
        "nice_to_have": ["figma", "tailwind", "typescript"],
        "experience": "0-2 years",
        "salary": "4-8 LPA"
    },
    {
        "id": 17,
        "title": "Blockchain Developer",
        "company": "CryptoBase",
        "location": "Remote",
        "required_skills": ["python", "javascript", "git"],
        "nice_to_have": ["nodejs", "mongodb", "aws"],
        "experience": "1-3 years",
        "salary": "8-16 LPA"
    },
    {
        "id": 18,
        "title": "Data Engineer",
        "company": "PipelineX",
        "location": "Hyderabad",
        "required_skills": ["python", "pandas", "mysql", "mongodb"],
        "nice_to_have": ["aws", "docker", "scala"],
        "experience": "1-3 years",
        "salary": "7-12 LPA"
    },
    {
        "id": 19,
        "title": "Security Engineer",
        "company": "CyberShield",
        "location": "Bangalore",
        "required_skills": ["linux", "python", "git", "bash"],
        "nice_to_have": ["aws", "docker", "kubernetes"],
        "experience": "1-3 years",
        "salary": "8-14 LPA"
    },
    {
        "id": 20,
        "title": "Django Developer",
        "company": "WebCraft",
        "location": "Chennai",
        "required_skills": ["python", "django", "mysql", "html", "css"],
        "nice_to_have": ["react", "redis", "aws"],
        "experience": "0-2 years",
        "salary": "4-8 LPA"
    },
]

class SkillsInput(BaseModel):
    skills: List[str]
    resume_id: str = None

@router.post("/match")
def match_jobs(data: SkillsInput):
    user_skills = [s.lower() for s in data.skills]
    results = []

    for job in JOBS_DB:
        required = job["required_skills"]
        matched = [s for s in required if s in user_skills]
        missing = [s for s in required if s not in user_skills]
        match_percent = round((len(matched) / len(required)) * 100)

        if match_percent >= 70:
            decision = "Apply Now"
            decision_emoji = "🚀"
        elif match_percent >= 50:
            decision = "Apply + Learn"
            decision_emoji = "📚"
        else:
            decision = "Prepare First"
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
            "decision_emoji": decision_emoji,
        })

    results.sort(key=lambda x: x["match_percent"], reverse=True)

    # Save to MongoDB — no duplicates
    if data.resume_id:
        try:
            existing_job = jobs_collection.find_one(
                {"resume_id": data.resume_id}
            )
            if not existing_job:
                jobs_collection.insert_one({
                    "resume_id": data.resume_id,
                    "total_jobs": len(results),
                    "apply_now": len([r for r in results if r["decision"] == "Apply Now"]),
                    "apply_learn": len([r for r in results if r["decision"] == "Apply + Learn"]),
                    "prepare_first": len([r for r in results if r["decision"] == "Prepare First"]),
                    "top_matches": results[:5],
                    "created_at": datetime.now()
                })
        except Exception as e:
            print(f"Error saving job matches: {e}")

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