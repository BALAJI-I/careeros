from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from database import users_collection, resumes_collection, jobs_collection, tasks_collection
from auth import create_token
from dotenv import load_dotenv
import os
from datetime import datetime

load_dotenv(os.path.join(os.path.dirname(__file__), "../../.env"))

router = APIRouter()

ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "admin@careeros.com")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "careeros@admin2026")

class AdminLogin(BaseModel):
    email: str
    password: str

@router.post("/login")
def admin_login(data: AdminLogin):
    if data.email != ADMIN_EMAIL or data.password != ADMIN_PASSWORD:
        raise HTTPException(
            status_code=401,
            detail="Invalid admin credentials"
        )
    token = create_token({
        "email": data.email,
        "role": "admin"
    })
    return {
        "status": "success",
        "token": token,
        "role": "admin"
    }

@router.get("/stats")
def get_stats():
    try:
        # Total users
        total_users = users_collection.count_documents({})

        # Total resumes
        total_resumes = resumes_collection.count_documents({})

        # Total tasks completed
        all_users = list(users_collection.find({}, {"total_tasks_completed": 1}))
        total_tasks = sum(u.get("total_tasks_completed", 0) for u in all_users)

        # Top skills across all resumes
        all_resumes = list(resumes_collection.find({}, {"skills": 1}))
        skill_count = {}
        for resume in all_resumes:
            for skill in resume.get("skills", []):
                skill_count[skill] = skill_count.get(skill, 0) + 1
        top_skills = sorted(skill_count.items(), key=lambda x: x[1], reverse=True)[:10]

        # Job match stats
        all_jobs = list(jobs_collection.find({}, {
            "apply_now": 1,
            "apply_learn": 1,
            "prepare_first": 1
        }))
        total_apply_now = sum(j.get("apply_now", 0) for j in all_jobs)
        total_apply_learn = sum(j.get("apply_learn", 0) for j in all_jobs)
        total_prepare = sum(j.get("prepare_first", 0) for j in all_jobs)

        return {
            "status": "success",
            "stats": {
                "total_users": total_users,
                "total_resumes": total_resumes,
                "total_tasks_completed": total_tasks,
                "top_skills": [
                    {"skill": s, "count": c} for s, c in top_skills
                ],
                "job_decisions": {
                    "apply_now": total_apply_now,
                    "apply_learn": total_apply_learn,
                    "prepare_first": total_prepare
                }
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/users")
def get_all_users():
    try:
        users = list(users_collection.find(
            {},
            {"password": 0}
        ).sort("created_at", -1))
        for u in users:
            u["_id"] = str(u["_id"])
            u["created_at"] = str(u.get("created_at", ""))
        return {
            "status": "success",
            "total": len(users),
            "users": users
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/resumes")
def get_all_resumes():
    try:
        resumes = list(resumes_collection.find(
            {},
            {"text": 0}
        ).sort("uploaded_at", -1))
        for r in resumes:
            r["_id"] = str(r["_id"])
            r["uploaded_at"] = str(r.get("uploaded_at", ""))
        return {
            "status": "success",
            "total": len(resumes),
            "resumes": resumes
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))