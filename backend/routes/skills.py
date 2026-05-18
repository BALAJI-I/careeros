from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from database import resumes_collection
from bson import ObjectId
from datetime import datetime

router = APIRouter()

SKILLS_DB = [
    # Programming Languages
    "python", "javascript", "java", "c++", "c#", "ruby", "php",
    "swift", "kotlin", "typescript", "golang", "rust", "scala",
    # Web
    "react", "angular", "vue", "nodejs", "html", "css", "tailwind",
    "bootstrap", "jquery", "nextjs", "express",
    # Backend
    "fastapi", "django", "flask", "spring", "laravel",
    # Database
    "mongodb", "mysql", "postgresql", "sqlite", "redis", "firebase",
    # DevOps
    "docker", "kubernetes", "git", "github", "aws", "azure", "gcp",
    "linux", "bash",
    # AI/ML
    "machine learning", "deep learning", "tensorflow", "pytorch",
    "scikit-learn", "pandas", "numpy", "nlp",
    # Soft Skills
    "communication", "leadership", "teamwork",
    "problem solving", "agile", "scrum",
]

class ResumeText(BaseModel):
    text: str
    resume_id: str = None

@router.post("/extract")
def extract_skills(data: ResumeText):
    if not data.text:
        raise HTTPException(status_code=400, detail="No text provided")

    text_lower = data.text.lower()

    found_skills = []
    for skill in SKILLS_DB:
        if skill.lower() in text_lower:
            found_skills.append(skill)

    found_skills = list(set(found_skills))

    # Save skills to MongoDB if resume_id provided
    if data.resume_id:
        try:
            resumes_collection.update_one(
                {"_id": ObjectId(data.resume_id)},
                {"$set": {
                    "skills": found_skills,
                    "total_skills": len(found_skills),
                    "updated_at": datetime.now()
                }}
            )
        except Exception as e:
            print(f"Error saving skills: {e}")

    return {
        "status": "success",
        "skills_found": found_skills,
        "total_skills": len(found_skills),
        "message": f"Found {len(found_skills)} skills in your resume"
    }