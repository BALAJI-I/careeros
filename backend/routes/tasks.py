from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from database import tasks_collection, users_collection
from bson import ObjectId
from datetime import datetime, date

router = APIRouter()

# Task templates based on skill gaps
TASK_TEMPLATES = {
    "python": [
        "Complete 2 Python exercises on HackerRank",
        "Build a simple Python CLI project today",
        "Watch 1 Python tutorial and take notes",
        "Solve 3 Python problems on LeetCode",
    ],
    "javascript": [
        "Build a small JavaScript project today",
        "Complete 2 JavaScript challenges on Codewars",
        "Watch 1 JavaScript tutorial on YouTube",
        "Practice DOM manipulation for 1 hour",
    ],
    "react": [
        "Build a React component from scratch",
        "Read React documentation for 30 minutes",
        "Create a small React app with hooks",
        "Watch 1 React tutorial and implement it",
    ],
    "nodejs": [
        "Build a simple Node.js REST API",
        "Learn Express.js routing today",
        "Watch 1 Node.js tutorial on YouTube",
        "Practice async/await in Node.js",
    ],
    "mongodb": [
        "Practice MongoDB queries for 30 minutes",
        "Build a simple CRUD app with MongoDB",
        "Read MongoDB documentation on indexing",
        "Complete MongoDB University free course module",
    ],
    "machine learning": [
        "Complete 1 Kaggle notebook today",
        "Read 1 ML research paper summary",
        "Implement a simple ML model from scratch",
        "Watch 1 ML tutorial and take notes",
    ],
    "docker": [
        "Follow Docker getting started tutorial",
        "Containerize a simple Python app today",
        "Learn Docker Compose basics",
        "Watch 1 Docker tutorial on YouTube",
    ],
    "aws": [
        "Complete 1 AWS free tier tutorial",
        "Set up a simple S3 bucket today",
        "Read AWS documentation for 30 minutes",
        "Watch 1 AWS tutorial on YouTube",
    ],
    "sql": [
        "Practice 5 SQL queries on SQLZoo",
        "Build a simple database schema today",
        "Complete 1 SQL challenge on HackerRank",
        "Watch 1 SQL tutorial on YouTube",
    ],
    "git": [
        "Learn 3 new Git commands today",
        "Practice Git branching on learngitbranching.js.org",
        "Create a pull request on GitHub",
        "Read Git best practices article",
    ],
    "default": [
        "Update your resume with latest projects",
        "Apply to 3 jobs on LinkedIn today",
        "Connect with 5 professionals on LinkedIn",
        "Research 3 target companies today",
        "Practice 5 coding problems on LeetCode",
        "Write a cover letter for your dream job",
        "Update your GitHub profile README",
        "Watch 1 tech interview preparation video",
    ]
}

def generate_tasks(missing_skills: List[str]) -> List[dict]:
    import random
    tasks = []

    if missing_skills:
        # Pick tasks from missing skills
        for skill in missing_skills[:2]:
            skill_lower = skill.lower()
            if skill_lower in TASK_TEMPLATES:
                task_text = random.choice(TASK_TEMPLATES[skill_lower])
                tasks.append({
                    "task": task_text,
                    "skill": skill,
                    "type": "skill_gap",
                    "completed": False
                })

    # Always add 1 general task
    general_task = random.choice(TASK_TEMPLATES["default"])
    tasks.append({
        "task": general_task,
        "skill": "general",
        "type": "general",
        "completed": False
    })

    # Fill up to 3 tasks
    while len(tasks) < 3:
        general = random.choice(TASK_TEMPLATES["default"])
        tasks.append({
            "task": general,
            "skill": "general",
            "type": "general",
            "completed": False
        })

    return tasks[:3]

class TasksRequest(BaseModel):
    user_id: str
    missing_skills: List[str] = []

class CompleteTaskRequest(BaseModel):
    user_id: str
    task_index: int

@router.post("/generate")
def generate_daily_tasks(data: TasksRequest):

    today = str(date.today())

    # Check if tasks already generated today
    existing = tasks_collection.find_one({
        "user_id": data.user_id,
        "date": today
    })

    if existing:
        existing["_id"] = str(existing["_id"])
        return {
            "status": "success",
            "message": "Today's tasks",
            "tasks": existing["tasks"],
            "date": today,
            "task_id": existing["_id"],
            "completed_count": sum(1 for t in existing["tasks"] if t["completed"])
        }

    # Generate new tasks
    tasks = generate_tasks(data.missing_skills)

    # Save to MongoDB
    doc = {
        "user_id": data.user_id,
        "date": today,
        "tasks": tasks,
        "created_at": datetime.now()
    }
    result = tasks_collection.insert_one(doc)

    return {
        "status": "success",
        "message": "New tasks generated",
        "tasks": tasks,
        "date": today,
        "task_id": str(result.inserted_id),
        "completed_count": 0
    }

@router.post("/complete")
def complete_task(data: CompleteTaskRequest):

    today = str(date.today())

    # Find today's tasks
    doc = tasks_collection.find_one({
        "user_id": data.user_id,
        "date": today
    })

    if not doc:
        raise HTTPException(status_code=404, detail="No tasks found for today")

    # Mark task as completed
    tasks = doc["tasks"]
    if data.task_index >= len(tasks):
        raise HTTPException(status_code=400, detail="Invalid task index")

    tasks[data.task_index]["completed"] = True

    # Update in MongoDB
    tasks_collection.update_one(
        {"_id": doc["_id"]},
        {"$set": {"tasks": tasks}}
    )

    completed_count = sum(1 for t in tasks if t["completed"])

    # Update streak if all tasks done
    if completed_count == len(tasks):
        users_collection.update_one(
            {"_id": ObjectId(data.user_id)},
            {"$inc": {"streak": 1, "total_tasks_completed": len(tasks)}}
        )

    return {
        "status": "success",
        "tasks": tasks,
        "completed_count": completed_count,
        "all_done": completed_count == len(tasks)
    }

@router.get("/history/{user_id}")
def get_task_history(user_id: str):
    history = list(tasks_collection.find(
        {"user_id": user_id},
        {"_id": 0}
    ).sort("date", -1).limit(7))

    return {
        "status": "success",
        "history": history
    }