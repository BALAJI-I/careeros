from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

router = APIRouter()

ROADMAPS = {
    "Frontend Developer": {
        "role": "Frontend Developer",
        "avg_salary": "4-12 LPA",
        "demand": "Very High",
        "time_to_job": "3-6 months",
        "phases": [
            {
                "phase": 1,
                "title": "HTML & CSS Basics",
                "duration": "2 weeks",
                "skills": ["html", "css"],
                "tasks": [
                    "Learn HTML tags, forms, tables",
                    "Learn CSS selectors, flexbox, grid",
                    "Build 3 static web pages",
                    "Learn responsive design basics"
                ],
                "resources": [
                    {"name": "freeCodeCamp HTML/CSS", "url": "https://www.freecodecamp.org/learn/responsive-web-design/"},
                    {"name": "MDN Web Docs", "url": "https://developer.mozilla.org/en-US/docs/Learn"}
                ],
                "project": "Build a personal portfolio landing page"
            },
            {
                "phase": 2,
                "title": "JavaScript Fundamentals",
                "duration": "3 weeks",
                "skills": ["javascript"],
                "tasks": [
                    "Learn variables, functions, loops",
                    "DOM manipulation",
                    "Fetch API and promises",
                    "ES6+ features"
                ],
                "resources": [
                    {"name": "JavaScript.info", "url": "https://javascript.info"},
                    {"name": "freeCodeCamp JS", "url": "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/"}
                ],
                "project": "Build a weather app using free API"
            },
            {
                "phase": 3,
                "title": "React Framework",
                "duration": "4 weeks",
                "skills": ["react"],
                "tasks": [
                    "Learn components and props",
                    "State management with useState",
                    "useEffect and API calls",
                    "React Router for navigation"
                ],
                "resources": [
                    {"name": "React Official Docs", "url": "https://react.dev/learn"},
                    {"name": "React Tutorial - YouTube", "url": "https://www.youtube.com/watch?v=w7ejDZ8SWv8"}
                ],
                "project": "Build a GitHub profile finder app"
            },
            {
                "phase": 4,
                "title": "Tools & Deployment",
                "duration": "1 week",
                "skills": ["git", "github"],
                "tasks": [
                    "Learn Git commands",
                    "Push projects to GitHub",
                    "Deploy on Vercel or Netlify",
                    "Add projects to resume"
                ],
                "resources": [
                    {"name": "Learn Git Branching", "url": "https://learngitbranching.js.org"},
                    {"name": "Vercel Docs", "url": "https://vercel.com/docs"}
                ],
                "project": "Deploy all 3 projects live with custom domain"
            },
            {
                "phase": 5,
                "title": "Apply & Interview",
                "duration": "2 weeks",
                "skills": ["interview"],
                "tasks": [
                    "Update resume with all projects",
                    "Apply to 5 jobs daily",
                    "Practice interview questions",
                    "Complete CareerOS interview simulator"
                ],
                "resources": [
                    {"name": "Frontend Interview Questions", "url": "https://frontendinterviewhandbook.com"},
                    {"name": "LeetCode Easy Problems", "url": "https://leetcode.com/problemset/?difficulty=EASY"}
                ],
                "project": "Get your first interview callback"
            }
        ]
    },
    "Python Backend Developer": {
        "role": "Python Backend Developer",
        "avg_salary": "5-15 LPA",
        "demand": "High",
        "time_to_job": "4-6 months",
        "phases": [
            {
                "phase": 1,
                "title": "Python Fundamentals",
                "duration": "3 weeks",
                "skills": ["python"],
                "tasks": [
                    "Variables, data types, functions",
                    "OOP concepts in Python",
                    "File handling and modules",
                    "Error handling and debugging"
                ],
                "resources": [
                    {"name": "Python.org Tutorial", "url": "https://docs.python.org/3/tutorial/"},
                    {"name": "Automate the Boring Stuff", "url": "https://automatetheboringstuff.com"}
                ],
                "project": "Build a CLI task manager"
            },
            {
                "phase": 2,
                "title": "Web Framework (FastAPI)",
                "duration": "3 weeks",
                "skills": ["fastapi", "python"],
                "tasks": [
                    "REST API concepts",
                    "FastAPI routes and models",
                    "Request/Response handling",
                    "API documentation with Swagger"
                ],
                "resources": [
                    {"name": "FastAPI Official Docs", "url": "https://fastapi.tiangolo.com"},
                    {"name": "FastAPI Tutorial", "url": "https://www.youtube.com/watch?v=0sOvCWFmrtA"}
                ],
                "project": "Build a todo list REST API"
            },
            {
                "phase": 3,
                "title": "Database (MongoDB)",
                "duration": "2 weeks",
                "skills": ["mongodb"],
                "tasks": [
                    "MongoDB CRUD operations",
                    "PyMongo integration",
                    "Data modeling and schemas",
                    "Indexing and queries"
                ],
                "resources": [
                    {"name": "MongoDB University", "url": "https://learn.mongodb.com"},
                    {"name": "PyMongo Docs", "url": "https://pymongo.readthedocs.io"}
                ],
                "project": "Add database to your REST API"
            },
            {
                "phase": 4,
                "title": "Authentication & Security",
                "duration": "1 week",
                "skills": ["python", "jwt"],
                "tasks": [
                    "JWT authentication",
                    "Password hashing with bcrypt",
                    "Protected routes",
                    "CORS and security headers"
                ],
                "resources": [
                    {"name": "FastAPI Security", "url": "https://fastapi.tiangolo.com/tutorial/security/"},
                    {"name": "JWT Introduction", "url": "https://jwt.io/introduction"}
                ],
                "project": "Add auth to your API"
            },
            {
                "phase": 5,
                "title": "Deploy & Apply",
                "duration": "2 weeks",
                "skills": ["git", "deployment"],
                "tasks": [
                    "Deploy API on Render",
                    "Write good README",
                    "Apply to 5 backend jobs daily",
                    "Practice system design basics"
                ],
                "resources": [
                    {"name": "Render Deployment", "url": "https://render.com/docs"},
                    {"name": "System Design Primer", "url": "https://github.com/donnemartin/system-design-primer"}
                ],
                "project": "Full deployed API with auth and docs"
            }
        ]
    },
    "Data Scientist": {
        "role": "Data Scientist",
        "avg_salary": "6-18 LPA",
        "demand": "Very High",
        "time_to_job": "5-8 months",
        "phases": [
            {
                "phase": 1,
                "title": "Python for Data Science",
                "duration": "3 weeks",
                "skills": ["python", "numpy", "pandas"],
                "tasks": [
                    "NumPy arrays and operations",
                    "Pandas DataFrames",
                    "Data cleaning and preprocessing",
                    "Matplotlib visualizations"
                ],
                "resources": [
                    {"name": "Kaggle Python Course", "url": "https://www.kaggle.com/learn/python"},
                    {"name": "Kaggle Pandas Course", "url": "https://www.kaggle.com/learn/pandas"}
                ],
                "project": "Analyze a real dataset from Kaggle"
            },
            {
                "phase": 2,
                "title": "Machine Learning Basics",
                "duration": "4 weeks",
                "skills": ["machine learning", "scikit-learn"],
                "tasks": [
                    "Supervised vs unsupervised learning",
                    "Linear and logistic regression",
                    "Decision trees and random forests",
                    "Model evaluation metrics"
                ],
                "resources": [
                    {"name": "Andrew Ng ML Course", "url": "https://www.coursera.org/specializations/machine-learning-introduction"},
                    {"name": "Kaggle ML Course", "url": "https://www.kaggle.com/learn/intro-to-machine-learning"}
                ],
                "project": "Build a spam classifier"
            },
            {
                "phase": 3,
                "title": "Deep Learning",
                "duration": "4 weeks",
                "skills": ["deep learning", "tensorflow", "pytorch"],
                "tasks": [
                    "Neural network basics",
                    "TensorFlow or PyTorch",
                    "CNN for image classification",
                    "Transfer learning"
                ],
                "resources": [
                    {"name": "Deep Learning Specialization", "url": "https://www.coursera.org/specializations/deep-learning"},
                    {"name": "fast.ai Course", "url": "https://course.fast.ai"}
                ],
                "project": "Image classifier with 90%+ accuracy"
            },
            {
                "phase": 4,
                "title": "Apply & Portfolio",
                "duration": "2 weeks",
                "skills": ["kaggle"],
                "tasks": [
                    "Complete 2 Kaggle competitions",
                    "Write blog posts about projects",
                    "Apply to data science roles",
                    "Practice ML interview questions"
                ],
                "resources": [
                    {"name": "Kaggle Competitions", "url": "https://www.kaggle.com/competitions"},
                    {"name": "ML Interview Questions", "url": "https://www.interviewquery.com"}
                ],
                "project": "Top 25% in a Kaggle competition"
            }
        ]
    },
    "Full Stack Developer": {
        "role": "Full Stack Developer",
        "avg_salary": "6-20 LPA",
        "demand": "Very High",
        "time_to_job": "5-8 months",
        "phases": [
            {
                "phase": 1,
                "title": "Frontend Basics",
                "duration": "4 weeks",
                "skills": ["html", "css", "javascript", "react"],
                "tasks": [
                    "HTML, CSS, JavaScript basics",
                    "React components and hooks",
                    "Build 2 frontend projects",
                    "Learn Tailwind CSS"
                ],
                "resources": [
                    {"name": "React Docs", "url": "https://react.dev"},
                    {"name": "Tailwind CSS", "url": "https://tailwindcss.com/docs"}
                ],
                "project": "Build a responsive dashboard UI"
            },
            {
                "phase": 2,
                "title": "Backend Development",
                "duration": "4 weeks",
                "skills": ["nodejs", "python", "fastapi"],
                "tasks": [
                    "REST API design",
                    "Node.js or Python backend",
                    "Database integration",
                    "Authentication with JWT"
                ],
                "resources": [
                    {"name": "Node.js Docs", "url": "https://nodejs.org/en/docs"},
                    {"name": "FastAPI Docs", "url": "https://fastapi.tiangolo.com"}
                ],
                "project": "Build a full REST API with auth"
            },
            {
                "phase": 3,
                "title": "Full Stack Project",
                "duration": "3 weeks",
                "skills": ["react", "nodejs", "mongodb"],
                "tasks": [
                    "Connect frontend to backend",
                    "Build complete CRUD application",
                    "Add authentication flow",
                    "Deploy full stack app"
                ],
                "resources": [
                    {"name": "MERN Stack Tutorial", "url": "https://www.youtube.com/watch?v=7CqJlxBYj-M"},
                    {"name": "Render + Vercel Deploy", "url": "https://render.com/docs"}
                ],
                "project": "Full stack app like CareerOS!"
            },
            {
                "phase": 4,
                "title": "Apply & Interview",
                "duration": "2 weeks",
                "skills": ["interview"],
                "tasks": [
                    "Polish GitHub with 3+ projects",
                    "Apply to 5 jobs daily",
                    "Practice system design",
                    "Do mock interviews"
                ],
                "resources": [
                    {"name": "System Design Primer", "url": "https://github.com/donnemartin/system-design-primer"},
                    {"name": "Blind 75 LeetCode", "url": "https://leetcode.com/discuss/general-discussion/460599/blind-75-leetcode-questions"}
                ],
                "project": "Land your first full stack role"
            }
        ]
    },
    "DevOps Engineer": {
        "role": "DevOps Engineer",
        "avg_salary": "8-20 LPA",
        "demand": "High",
        "time_to_job": "4-6 months",
        "phases": [
            {
                "phase": 1,
                "title": "Linux & Bash",
                "duration": "2 weeks",
                "skills": ["linux", "bash"],
                "tasks": [
                    "Linux commands and file system",
                    "Bash scripting basics",
                    "Process management",
                    "SSH and networking"
                ],
                "resources": [
                    {"name": "Linux Journey", "url": "https://linuxjourney.com"},
                    {"name": "Bash Scripting Guide", "url": "https://tldp.org/LDP/abs/html/"}
                ],
                "project": "Write 5 useful bash scripts"
            },
            {
                "phase": 2,
                "title": "Docker & Containers",
                "duration": "2 weeks",
                "skills": ["docker"],
                "tasks": [
                    "Docker concepts and commands",
                    "Write Dockerfiles",
                    "Docker Compose",
                    "Container networking"
                ],
                "resources": [
                    {"name": "Docker Getting Started", "url": "https://docs.docker.com/get-started/"},
                    {"name": "Docker Tutorial", "url": "https://www.youtube.com/watch?v=3c-iBn73dDE"}
                ],
                "project": "Dockerize a web application"
            },
            {
                "phase": 3,
                "title": "Cloud (AWS)",
                "duration": "4 weeks",
                "skills": ["aws"],
                "tasks": [
                    "AWS core services: EC2, S3, RDS",
                    "IAM and security",
                    "Deploy apps on AWS",
                    "AWS certification prep"
                ],
                "resources": [
                    {"name": "AWS Free Tier", "url": "https://aws.amazon.com/free"},
                    {"name": "AWS Cloud Practitioner", "url": "https://www.youtube.com/watch?v=SOTamWNgDKc"}
                ],
                "project": "Deploy full stack app on AWS"
            },
            {
                "phase": 4,
                "title": "CI/CD Pipeline",
                "duration": "2 weeks",
                "skills": ["git", "github"],
                "tasks": [
                    "GitHub Actions basics",
                    "Build CI pipeline",
                    "Automated testing",
                    "CD to production"
                ],
                "resources": [
                    {"name": "GitHub Actions Docs", "url": "https://docs.github.com/en/actions"},
                    {"name": "CI/CD Tutorial", "url": "https://www.youtube.com/watch?v=scEDHsr3APg"}
                ],
                "project": "Full CI/CD pipeline for a project"
            }
        ]
    }
}

class RoadmapRequest(BaseModel):
    role: str
    existing_skills: List[str] = []

@router.post("/generate")
def generate_roadmap(data: RoadmapRequest):
    # Find matching roadmap
    roadmap = None
    role_lower = data.role.lower()

    for key in ROADMAPS:
        if key.lower() in role_lower or role_lower in key.lower():
            roadmap = ROADMAPS[key]
            break

    # Default to Full Stack if no match
    if not roadmap:
        roadmap = ROADMAPS["Full Stack Developer"]

    # Calculate progress based on existing skills
    existing_lower = [s.lower() for s in data.existing_skills]
    total_skills = 0
    completed_skills = 0

    for phase in roadmap["phases"]:
        for skill in phase["skills"]:
            total_skills += 1
            if skill.lower() in existing_lower:
                completed_skills += 1

    progress = round((completed_skills / total_skills * 100)) if total_skills > 0 else 0

    return {
        "status": "success",
        "roadmap": roadmap,
        "progress": progress,
        "completed_skills": completed_skills,
        "total_skills": total_skills
    }

@router.get("/roles")
def get_roles():
    return {
        "status": "success",
        "roles": list(ROADMAPS.keys())
    }