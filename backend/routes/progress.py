from fastapi import APIRouter, HTTPException
from database import users_collection, tasks_collection, resumes_collection, jobs_collection
from bson import ObjectId
from datetime import datetime, date, timedelta

router = APIRouter()

@router.get("/{user_id}")
def get_progress(user_id: str):
    try:
        # Get user data
        user = users_collection.find_one({"_id": ObjectId(user_id)})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        # Get resume data
        resume = resumes_collection.find_one({"user_id": user_id})

        # Get job match data
        job_match = jobs_collection.find_one({"resume_id": str(resume["_id"]) if resume else None})

        # Get tasks history (last 7 days)
        tasks_history = list(tasks_collection.find(
            {"user_id": user_id}
        ).sort("date", -1).limit(7))

        # Calculate completion rate
        total_days = len(tasks_history)
        completed_days = sum(
            1 for day in tasks_history
            if all(t["completed"] for t in day["tasks"])
        )

        # Get today's tasks
        today = str(date.today())
        today_tasks = tasks_collection.find_one({
            "user_id": user_id,
            "date": today
        })

        today_completed = 0
        if today_tasks:
            today_completed = sum(
                1 for t in today_tasks["tasks"] if t["completed"]
            )

        return {
            "status": "success",
            "user": {
                "name": user["name"],
                "email": user["email"],
                "streak": user.get("streak", 0),
                "total_tasks_completed": user.get("total_tasks_completed", 0),
                "member_since": str(user.get("created_at", datetime.now()))[:10]
            },
            "resume": {
                "uploaded": resume is not None,
                "filename": resume["filename"] if resume else None,
                "total_skills": len(resume.get("skills", [])) if resume else 0,
            },
            "jobs": {
                "total_matched": job_match["total_jobs"] if job_match else 0,
                "apply_now": job_match["apply_now"] if job_match else 0,
                "apply_learn": job_match["apply_learn"] if job_match else 0,
                "prepare_first": job_match["prepare_first"] if job_match else 0,
            },
            "tasks": {
                "today_completed": today_completed,
                "today_total": 3,
                "total_days_tracked": total_days,
                "completed_days": completed_days,
                "completion_rate": round((completed_days / total_days * 100) if total_days > 0 else 0),
            }
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))