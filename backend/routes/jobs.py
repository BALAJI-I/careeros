from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
from database import jobs_collection, users_collection
from bson import ObjectId
from datetime import datetime
import requests
import os
from dotenv import load_dotenv

# .env already loaded by main.py
RAPIDAPI_KEY = os.getenv("RAPIDAPI_KEY")
print(f"Jobs.py - RAPIDAPI_KEY: {'Found ✅' if RAPIDAPI_KEY else 'NOT FOUND ❌'}")

router = APIRouter()

JOBS_DB = [
    {
        "id": 1,
        "title": "Frontend Developer",
        "company": "Swiggy",
        "location": "Bangalore",
        "required_skills": ["react", "javascript", "html", "css", "git"],
        "nice_to_have": ["typescript", "nextjs", "tailwind"],
        "experience": "0-2 years",
        "salary": "4-8 LPA",
        "apply_links": {
            "careers": "https://careers.swiggy.com",
            "linkedin": "https://www.linkedin.com/jobs/search/?keywords=Frontend+Developer+Swiggy&location=Bangalore",
            "naukri": "https://www.naukri.com/swiggy-jobs-in-bangalore"
        }
    },
    {
        "id": 2,
        "title": "Python Backend Developer",
        "company": "Zerodha",
        "location": "Bangalore",
        "required_skills": ["python", "fastapi", "mongodb", "git"],
        "nice_to_have": ["docker", "aws", "redis"],
        "experience": "0-2 years",
        "salary": "6-12 LPA",
        "apply_links": {
            "careers": "https://zerodha.com/careers",
            "linkedin": "https://www.linkedin.com/jobs/search/?keywords=Python+Developer+Zerodha&location=Bangalore",
            "naukri": "https://www.naukri.com/zerodha-jobs"
        }
    },
    {
        "id": 3,
        "title": "Data Science Intern",
        "company": "Flipkart",
        "location": "Bangalore",
        "required_skills": ["python", "pandas", "numpy", "machine learning"],
        "nice_to_have": ["tensorflow", "pytorch", "scikit-learn"],
        "experience": "Fresher",
        "salary": "3-6 LPA",
        "apply_links": {
            "careers": "https://www.flipkartcareers.com",
            "linkedin": "https://www.linkedin.com/jobs/search/?keywords=Data+Science+Intern+Flipkart",
            "internshala": "https://internshala.com/internships/data-science-internship-in-bangalore"
        }
    },
    {
        "id": 4,
        "title": "Full Stack Developer",
        "company": "Razorpay",
        "location": "Bangalore",
        "required_skills": ["react", "nodejs", "mongodb", "javascript", "git"],
        "nice_to_have": ["aws", "docker", "typescript"],
        "experience": "1-3 years",
        "salary": "10-18 LPA",
        "apply_links": {
            "careers": "https://razorpay.com/jobs",
            "linkedin": "https://www.linkedin.com/jobs/search/?keywords=Full+Stack+Developer+Razorpay",
            "naukri": "https://www.naukri.com/razorpay-jobs"
        }
    },
    {
        "id": 5,
        "title": "ML Engineer",
        "company": "Meesho",
        "location": "Bangalore",
        "required_skills": ["python", "machine learning", "tensorflow", "numpy", "pandas"],
        "nice_to_have": ["pytorch", "aws", "docker"],
        "experience": "0-2 years",
        "salary": "8-15 LPA",
        "apply_links": {
            "careers": "https://meesho.io/careers",
            "linkedin": "https://www.linkedin.com/jobs/search/?keywords=ML+Engineer+Meesho",
            "naukri": "https://www.naukri.com/meesho-jobs"
        }
    },
    {
        "id": 6,
        "title": "DevOps Engineer",
        "company": "CRED",
        "location": "Bangalore",
        "required_skills": ["linux", "git", "docker", "aws", "bash"],
        "nice_to_have": ["kubernetes", "azure", "gcp"],
        "experience": "1-3 years",
        "salary": "10-18 LPA",
        "apply_links": {
            "careers": "https://careers.cred.club",
            "linkedin": "https://www.linkedin.com/jobs/search/?keywords=DevOps+Engineer+CRED",
            "naukri": "https://www.naukri.com/cred-jobs"
        }
    },
    {
        "id": 7,
        "title": "React Native Developer",
        "company": "PhonePe",
        "location": "Bangalore",
        "required_skills": ["react", "javascript", "git"],
        "nice_to_have": ["typescript", "redux", "nodejs"],
        "experience": "0-2 years",
        "salary": "8-14 LPA",
        "apply_links": {
            "careers": "https://careers.phonepe.com",
            "linkedin": "https://www.linkedin.com/jobs/search/?keywords=React+Native+Developer+PhonePe",
            "naukri": "https://www.naukri.com/phonepe-jobs"
        }
    },
    {
        "id": 8,
        "title": "Data Analyst",
        "company": "Ola",
        "location": "Bangalore",
        "required_skills": ["python", "pandas", "numpy", "mysql"],
        "nice_to_have": ["tableau", "power bi", "mongodb"],
        "experience": "Fresher",
        "salary": "4-8 LPA",
        "apply_links": {
            "careers": "https://www.olacabs.com/careers",
            "linkedin": "https://www.linkedin.com/jobs/search/?keywords=Data+Analyst+Ola",
            "naukri": "https://www.naukri.com/ola-jobs"
        }
    },
    {
        "id": 9,
        "title": "Backend Developer",
        "company": "Paytm",
        "location": "Noida",
        "required_skills": ["python", "django", "mysql", "git"],
        "nice_to_have": ["redis", "docker", "aws"],
        "experience": "1-3 years",
        "salary": "6-12 LPA",
        "apply_links": {
            "careers": "https://paytm.com/about-us/careers",
            "linkedin": "https://www.linkedin.com/jobs/search/?keywords=Backend+Developer+Paytm",
            "naukri": "https://www.naukri.com/paytm-jobs"
        }
    },
    {
        "id": 10,
        "title": "AI Research Intern",
        "company": "Samsung R&D",
        "location": "Bangalore",
        "required_skills": ["python", "deep learning", "pytorch", "numpy"],
        "nice_to_have": ["tensorflow", "scikit-learn", "pandas"],
        "experience": "Fresher",
        "salary": "4-8 LPA",
        "apply_links": {
            "careers": "https://research.samsung.com/careers",
            "linkedin": "https://www.linkedin.com/jobs/search/?keywords=AI+Research+Intern+Samsung&location=Bangalore",
            "internshala": "https://internshala.com/internships/ai-internship-in-bangalore"
        }
    },
    {
        "id": 11,
        "title": "Cloud Engineer",
        "company": "Infosys",
        "location": "Bangalore",
        "required_skills": ["aws", "linux", "python", "git"],
        "nice_to_have": ["docker", "kubernetes", "azure"],
        "experience": "1-3 years",
        "salary": "6-12 LPA",
        "apply_links": {
            "careers": "https://www.infosys.com/careers",
            "linkedin": "https://www.linkedin.com/jobs/search/?keywords=Cloud+Engineer+Infosys",
            "naukri": "https://www.naukri.com/infosys-jobs"
        }
    },
    {
        "id": 12,
        "title": "Java Developer",
        "company": "TCS",
        "location": "Chennai",
        "required_skills": ["java", "mysql", "git"],
        "nice_to_have": ["spring", "docker", "mongodb"],
        "experience": "0-2 years",
        "salary": "3.5-7 LPA",
        "apply_links": {
            "careers": "https://www.tcs.com/careers",
            "linkedin": "https://www.linkedin.com/jobs/search/?keywords=Java+Developer+TCS&location=Chennai",
            "naukri": "https://www.naukri.com/tcs-jobs-in-chennai"
        }
    },
    {
        "id": 13,
        "title": "NLP Engineer",
        "company": "Freshworks",
        "location": "Chennai",
        "required_skills": ["python", "nlp", "machine learning", "pandas"],
        "nice_to_have": ["tensorflow", "pytorch", "scikit-learn"],
        "experience": "0-2 years",
        "salary": "8-14 LPA",
        "apply_links": {
            "careers": "https://www.freshworks.com/company/careers",
            "linkedin": "https://www.linkedin.com/jobs/search/?keywords=NLP+Engineer+Freshworks",
            "naukri": "https://www.naukri.com/freshworks-jobs"
        }
    },
    {
        "id": 14,
        "title": "Database Administrator",
        "company": "Wipro",
        "location": "Hyderabad",
        "required_skills": ["mysql", "mongodb", "python", "linux"],
        "nice_to_have": ["postgresql", "redis", "aws"],
        "experience": "1-3 years",
        "salary": "5-9 LPA",
        "apply_links": {
            "careers": "https://careers.wipro.com",
            "linkedin": "https://www.linkedin.com/jobs/search/?keywords=Database+Administrator+Wipro",
            "naukri": "https://www.naukri.com/wipro-jobs-in-hyderabad"
        }
    },
    {
        "id": 15,
        "title": "Software Engineer",
        "company": "Zoho",
        "location": "Chennai",
        "required_skills": ["python", "java", "git", "mysql"],
        "nice_to_have": ["aws", "docker", "react"],
        "experience": "Fresher",
        "salary": "4-8 LPA",
        "apply_links": {
            "careers": "https://careers.zohocorp.com",
            "linkedin": "https://www.linkedin.com/jobs/search/?keywords=Software+Engineer+Zoho&location=Chennai",
            "naukri": "https://www.naukri.com/zoho-jobs"
        }
    },
    {
        "id": 16,
        "title": "UI/UX Developer",
        "company": "Myntra",
        "location": "Bangalore",
        "required_skills": ["html", "css", "javascript", "react"],
        "nice_to_have": ["figma", "tailwind", "typescript"],
        "experience": "0-2 years",
        "salary": "6-10 LPA",
        "apply_links": {
            "careers": "https://careers.myntra.com",
            "linkedin": "https://www.linkedin.com/jobs/search/?keywords=UI+UX+Developer+Myntra",
            "naukri": "https://www.naukri.com/myntra-jobs"
        }
    },
    {
        "id": 17,
        "title": "Blockchain Developer",
        "company": "CoinDCX",
        "location": "Mumbai",
        "required_skills": ["python", "javascript", "git"],
        "nice_to_have": ["nodejs", "mongodb", "aws"],
        "experience": "1-3 years",
        "salary": "10-18 LPA",
        "apply_links": {
            "careers": "https://coindcx.com/careers",
            "linkedin": "https://www.linkedin.com/jobs/search/?keywords=Blockchain+Developer+CoinDCX",
            "naukri": "https://www.naukri.com/coindcx-jobs"
        }
    },
    {
        "id": 18,
        "title": "Data Engineer",
        "company": "Zomato",
        "location": "Gurgaon",
        "required_skills": ["python", "pandas", "mysql", "mongodb"],
        "nice_to_have": ["aws", "docker", "scala"],
        "experience": "1-3 years",
        "salary": "8-14 LPA",
        "apply_links": {
            "careers": "https://www.zomato.com/careers",
            "linkedin": "https://www.linkedin.com/jobs/search/?keywords=Data+Engineer+Zomato",
            "naukri": "https://www.naukri.com/zomato-jobs"
        }
    },
    {
        "id": 19,
        "title": "Security Engineer",
        "company": "Juspay",
        "location": "Bangalore",
        "required_skills": ["linux", "python", "git", "bash"],
        "nice_to_have": ["aws", "docker", "kubernetes"],
        "experience": "1-3 years",
        "salary": "10-16 LPA",
        "apply_links": {
            "careers": "https://juspay.in/careers",
            "linkedin": "https://www.linkedin.com/jobs/search/?keywords=Security+Engineer+Juspay",
            "naukri": "https://www.naukri.com/juspay-jobs"
        }
    },
    {
        "id": 20,
        "title": "Django Developer",
        "company": "Urban Company",
        "location": "Gurgaon",
        "required_skills": ["python", "django", "mysql", "html", "css"],
        "nice_to_have": ["react", "redis", "aws"],
        "experience": "0-2 years",
        "salary": "6-10 LPA",
        "apply_links": {
            "careers": "https://www.urbancompany.com/careers",
            "linkedin": "https://www.linkedin.com/jobs/search/?keywords=Django+Developer+Urban+Company",
            "naukri": "https://www.naukri.com/urban-company-jobs"
        }
    },
]

def fetch_live_jobs(skills: List[str]) -> List[dict]:
    print(f"Fetching live jobs for skills: {skills[:3]}")
    print(f"API Key status: {'Found ✅' if RAPIDAPI_KEY else 'Missing ❌'}")
    if not RAPIDAPI_KEY:
        return []
    try:
        priority_skills = [
            "python", "javascript", "react", "java", "nodejs",
            "machine learning", "data science", "aws", "docker",
            "django", "fastapi", "mongodb", "sql", "typescript",
            "tensorflow", "pytorch", "pandas", "numpy", "git"
        ]
        matched_priority = [s for s in skills if s in priority_skills]
        # Use broader search terms
        broad_skills = {
            "fastapi": "python",
            "django": "python",
            "flask": "python",
            "pytorch": "machine learning",
            "tensorflow": "machine learning",
            "scikit-learn": "data science",
            "numpy": "data science",
            "pandas": "data science",
            "nodejs": "javascript",
            "nextjs": "react",
            "mongodb": "backend",
            "postgresql": "backend",
            "mysql": "backend",
            "teamwork": "software engineer",
            "communication": "software engineer",
            "leadership": "software engineer",
            "agile": "software engineer",
            "scrum": "software engineer",
        }

        # Map niche skills to broader terms
        mapped_skills = []
        for skill in skills[:5]:
            mapped = broad_skills.get(skill, skill)
            if mapped not in mapped_skills:
                mapped_skills.append(mapped)

        # Pick top 2 mapped skills
        query_skills = mapped_skills[:2] if mapped_skills else ["software developer"]
        query = " ".join(query_skills) + " jobs India"
        print(f"Search query: {query}")

        url = "https://jsearch.p.rapidapi.com/search"
        headers = {
            "X-RapidAPI-Key": RAPIDAPI_KEY,
            "X-RapidAPI-Host": "jsearch.p.rapidapi.com"
        }
        params = {
            "query": query,
            "location": "India",
            "num_pages": "1",
            "date_posted": "month"
        }
        response = requests.get(
            url, headers=headers, params=params, timeout=10
        )
        data = response.json()
        print(f"Live jobs fetched: {len(data.get('data', []))}")

        live_jobs = []
        for job in data.get("data", [])[:10]:
            description = job.get("job_description", "").lower()
            required_skills = [s for s in skills if s.lower() in description]
            title = job.get("job_title", "Unknown")
            company = job.get("employer_name", "Unknown")
            title_encoded = title.replace(" ", "+")
            company_encoded = company.replace(" ", "+")
            title_dash = title.replace(" ", "-").lower()

            live_jobs.append({
                "id": f"live_{job.get('job_id', '')}",
                "title": title,
                "company": company,
                "location": f"{job.get('job_city', '')} {job.get('job_country', 'India')}".strip(),
                "experience": "Not specified",
                "salary": job.get("job_salary", "Not disclosed") or "Not disclosed",
                "required_skills": required_skills or query_skills,
                "nice_to_have": [],
                "is_live": True,
                "apply_links": {
                    "linkedin": f"https://www.linkedin.com/jobs/search/?keywords={title_encoded}+{company_encoded}&location=India",
                    "naukri": f"https://www.naukri.com/{title_dash}-jobs?q={title_encoded}&l=India",
                    "internshala": f"https://internshala.com/jobs/keyword-{title_dash}"
                }
            })
        return live_jobs
    except Exception as e:
        print(f"Live jobs error: {e}")
        return []

class SkillsInput(BaseModel):
    skills: List[str]
    resume_id: str = None

class ApplyJobRequest(BaseModel):
    user_id: str
    job_id: str
    job_title: str
    company: str
    platform: str

@router.post("/match")
def match_jobs(data: SkillsInput):
    user_skills = [s.lower() for s in data.skills]
    results = []

    # Process hardcoded jobs
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
        elif match_percent > 0:
            decision = "Prepare First"
            decision_emoji = "🎯"
        else:
            decision = "Explore Role"
            decision_emoji = "🔎"

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
            "apply_links": job["apply_links"],
            "is_live": False
        })

    # Fetch live jobs
    live_jobs = fetch_live_jobs(user_skills)
    for job in live_jobs:
        required = job["required_skills"]
        if not required:
            required = user_skills[:3]
        matched = [s for s in required if s in user_skills]
        missing = [s for s in required if s not in user_skills]
        match_percent = round(
            (len(matched) / len(required)) * 100
        ) if required else 0

        if match_percent >= 70:
            decision = "Apply Now"
            decision_emoji = "🚀"
        elif match_percent >= 50:
            decision = "Apply + Learn"
            decision_emoji = "📚"
        elif match_percent > 0:
            decision = "Prepare First"
            decision_emoji = "🎯"
        else:
            decision = "Explore Role"
            decision_emoji = "🔎"

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
            "apply_links": job["apply_links"],
            "is_live": True
        })

    # Sort by match %
    results.sort(key=lambda x: x["match_percent"], reverse=True)

    # Save to MongoDB no duplicates
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
        "live_jobs": len(live_jobs),
        "jobs": results
    }

@router.post("/apply")
def track_application(data: ApplyJobRequest):
    try:
        existing = jobs_collection.find_one({
            "user_id": data.user_id,
            "job_id": data.job_id,
            "type": "application"
        })
        if existing:
            return {"status": "already_applied", "message": "Already tracked"}

        jobs_collection.insert_one({
            "type": "application",
            "user_id": data.user_id,
            "job_id": data.job_id,
            "job_title": data.job_title,
            "company": data.company,
            "platform": data.platform,
            "applied_at": datetime.now()
        })

        users_collection.update_one(
            {"_id": ObjectId(data.user_id)},
            {"$inc": {"total_applications": 1}}
        )

        return {"status": "success", "message": "Application tracked!"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@router.get("/applied/{user_id}")
def get_applied_jobs(user_id: str):
    applied = list(jobs_collection.find(
        {"user_id": user_id, "type": "application"},
        {"_id": 0}
    ).sort("applied_at", -1))
    return {
        "status": "success",
        "total": len(applied),
        "applications": applied
    }

@router.get("/list")
def list_jobs():
    return {
        "status": "success",
        "total_jobs": len(JOBS_DB),
        "jobs": JOBS_DB
    }