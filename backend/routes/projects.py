from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

router = APIRouter()

PROJECTS_DB = {
    "python": [
        {
            "title": "CLI Expense Tracker",
            "description": "Build a command-line expense tracker that saves data to a JSON file",
            "skills": ["python"],
            "difficulty": "Beginner",
            "time": "1-2 days",
            "github_topics": "python cli expense-tracker",
            "why": "Shows Python basics, file handling and data persistence",
            "steps": [
                "Create expense model with category, amount, date",
                "Add CLI commands: add, list, delete, summary",
                "Save/load data from JSON file",
                "Add monthly summary and category filtering"
            ]
        },
        {
            "title": "Weather App with API",
            "description": "Build a weather app using OpenWeatherMap free API",
            "skills": ["python", "api"],
            "difficulty": "Beginner",
            "time": "1 day",
            "github_topics": "python weather-app api",
            "why": "Shows API integration skills recruiters love",
            "steps": [
                "Sign up for free OpenWeatherMap API",
                "Fetch current weather by city name",
                "Display temperature, humidity, description",
                "Add 5-day forecast feature"
            ]
        },
        {
            "title": "URL Shortener",
            "description": "Build a URL shortener with FastAPI and MongoDB",
            "skills": ["python", "fastapi", "mongodb"],
            "difficulty": "Intermediate",
            "time": "2-3 days",
            "github_topics": "python fastapi url-shortener",
            "why": "Full backend project showing real-world API design",
            "steps": [
                "Create FastAPI endpoints for shorten and redirect",
                "Generate unique short codes",
                "Store mappings in MongoDB",
                "Add click tracking and analytics"
            ]
        },
    ],
    "javascript": [
        {
            "title": "Todo App with LocalStorage",
            "description": "Build a todo app that persists data in browser localStorage",
            "skills": ["javascript", "html", "css"],
            "difficulty": "Beginner",
            "time": "1 day",
            "github_topics": "javascript todo-app localstorage",
            "why": "Classic project showing DOM manipulation and storage",
            "steps": [
                "Create HTML structure for todo list",
                "Add JavaScript for CRUD operations",
                "Save todos to localStorage",
                "Add filters: all, active, completed"
            ]
        },
        {
            "title": "Quiz App",
            "description": "Build an interactive quiz app with score tracking",
            "skills": ["javascript", "html", "css"],
            "difficulty": "Beginner",
            "time": "1-2 days",
            "github_topics": "javascript quiz-app",
            "why": "Shows event handling, timers and state management",
            "steps": [
                "Create quiz data with questions and answers",
                "Display one question at a time",
                "Track score and show results",
                "Add timer for each question"
            ]
        },
    ],
    "react": [
        {
            "title": "GitHub Profile Finder",
            "description": "Search GitHub users and display their profile stats",
            "skills": ["react", "javascript", "api"],
            "difficulty": "Beginner",
            "time": "1-2 days",
            "github_topics": "react github-api profile-finder",
            "why": "Shows React hooks, API calls and conditional rendering",
            "steps": [
                "Create search input with GitHub API call",
                "Display user avatar, bio, followers",
                "Show recent repositories list",
                "Add loading and error states"
            ]
        },
        {
            "title": "E-Commerce Product Page",
            "description": "Build a product listing page with cart functionality",
            "skills": ["react", "javascript", "css"],
            "difficulty": "Intermediate",
            "time": "3-4 days",
            "github_topics": "react ecommerce shopping-cart",
            "why": "Shows React state management and component design",
            "steps": [
                "Create product cards with mock data",
                "Add to cart functionality with useContext",
                "Build cart sidebar with quantity controls",
                "Calculate and display total price"
            ]
        },
    ],
    "machine learning": [
        {
            "title": "Spam Email Classifier",
            "description": "Build a spam detector using Naive Bayes classifier",
            "skills": ["python", "machine learning", "pandas"],
            "difficulty": "Intermediate",
            "time": "2-3 days",
            "github_topics": "machine-learning spam-classifier nlp",
            "why": "Classic ML project showing real-world text classification",
            "steps": [
                "Download spam dataset from Kaggle",
                "Clean and preprocess text data with pandas",
                "Train Naive Bayes classifier with scikit-learn",
                "Evaluate accuracy and build prediction function"
            ]
        },
        {
            "title": "House Price Predictor",
            "description": "Predict house prices using regression models",
            "skills": ["python", "machine learning", "pandas", "numpy"],
            "difficulty": "Intermediate",
            "time": "2-3 days",
            "github_topics": "machine-learning regression house-price",
            "why": "Shows end-to-end ML pipeline with real dataset",
            "steps": [
                "Download Boston/Ames housing dataset",
                "Explore and visualize data with matplotlib",
                "Train linear regression and random forest",
                "Compare models and explain predictions"
            ]
        },
    ],
    "nodejs": [
        {
            "title": "REST API with Authentication",
            "description": "Build a complete REST API with JWT authentication",
            "skills": ["nodejs", "javascript", "mongodb"],
            "difficulty": "Intermediate",
            "time": "3-4 days",
            "github_topics": "nodejs express rest-api jwt",
            "why": "Essential backend project every company looks for",
            "steps": [
                "Setup Express.js with MongoDB",
                "Create user auth with bcrypt and JWT",
                "Build CRUD endpoints for a resource",
                "Add middleware for auth protection"
            ]
        },
    ],
    "docker": [
        {
            "title": "Dockerize a Python App",
            "description": "Containerize an existing Python Flask app with Docker",
            "skills": ["docker", "python"],
            "difficulty": "Beginner",
            "time": "1 day",
            "github_topics": "docker python flask containerization",
            "why": "DevOps skill that 80% of companies require now",
            "steps": [
                "Create simple Flask app with 2-3 routes",
                "Write Dockerfile with proper base image",
                "Add docker-compose for multi-container setup",
                "Push image to Docker Hub"
            ]
        },
    ],
    "aws": [
        {
            "title": "Deploy App on AWS EC2",
            "description": "Deploy a web application on AWS EC2 with Nginx",
            "skills": ["aws", "linux", "python"],
            "difficulty": "Intermediate",
            "time": "2-3 days",
            "github_topics": "aws ec2 deployment nginx",
            "why": "Cloud deployment skill that makes your resume stand out",
            "steps": [
                "Launch free tier EC2 instance",
                "Install Python and Nginx on server",
                "Deploy Flask app with gunicorn",
                "Configure Nginx as reverse proxy"
            ]
        },
    ],
    "default": [
        {
            "title": "Personal Portfolio Website",
            "description": "Build a professional portfolio website showcasing your projects",
            "skills": ["html", "css", "javascript"],
            "difficulty": "Beginner",
            "time": "2-3 days",
            "github_topics": "portfolio website personal",
            "why": "Every developer needs a portfolio — recruiters always check it",
            "steps": [
                "Create home section with intro and photo",
                "Add skills section with progress bars",
                "Build projects section with GitHub links",
                "Add contact form and deploy on GitHub Pages"
            ]
        },
        {
            "title": "GitHub README Profile",
            "description": "Create an impressive GitHub profile README",
            "skills": ["git", "github"],
            "difficulty": "Beginner",
            "time": "2 hours",
            "github_topics": "github profile readme",
            "why": "First thing recruiters see on GitHub — make it count",
            "steps": [
                "Create special repository with your username",
                "Add animated typing header",
                "Include skills badges and stats",
                "Add recent projects and contact links"
            ]
        },
    ]
}

class SkillsRequest(BaseModel):
    missing_skills: List[str]
    existing_skills: List[str] = []

@router.post("/recommend")
def recommend_projects(data: SkillsRequest):
    recommendations = []
    seen_titles = set()

    # First recommend projects for missing skills
    for skill in data.missing_skills[:4]:
        skill_lower = skill.lower()
        if skill_lower in PROJECTS_DB:
            for project in PROJECTS_DB[skill_lower][:2]:
                if project["title"] not in seen_titles:
                    recommendations.append({
                        **project,
                        "reason": f"Helps you learn {skill} — currently missing from your resume",
                        "type": "skill_gap"
                    })
                    seen_titles.add(project["title"])

    # Then recommend projects for existing skills to strengthen them
    for skill in data.existing_skills[:3]:
        skill_lower = skill.lower()
        if skill_lower in PROJECTS_DB:
            for project in PROJECTS_DB[skill_lower][:1]:
                if project["title"] not in seen_titles:
                    recommendations.append({
                        **project,
                        "reason": f"Strengthens your existing {skill} skills with a real project",
                        "type": "skill_boost"
                    })
                    seen_titles.add(project["title"])

    # Add default projects if not enough
    if len(recommendations) < 3:
        for project in PROJECTS_DB["default"]:
            if project["title"] not in seen_titles:
                recommendations.append({
                    **project,
                    "reason": "Essential project every developer should have",
                    "type": "essential"
                })
                seen_titles.add(project["title"])

    return {
        "status": "success",
        "total": len(recommendations[:6]),
        "projects": recommendations[:6]
    }