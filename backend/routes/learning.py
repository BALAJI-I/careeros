from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

router = APIRouter()

LEARNING_RESOURCES = {
    "python": {
        "skill": "Python",
        "level": "Beginner → Advanced",
        "time": "4-6 weeks",
        "resources": [
            {
                "type": "video",
                "title": "Python Full Course for Beginners",
                "platform": "YouTube",
                "channel": "Programming with Mosh",
                "url": "https://www.youtube.com/watch?v=_uQrJ0TkZlc",
                "duration": "6 hours",
                "free": True
            },
            {
                "type": "course",
                "title": "Python for Everybody",
                "platform": "Coursera",
                "channel": "University of Michigan",
                "url": "https://www.coursera.org/specializations/python",
                "duration": "8 weeks",
                "free": True
            },
            {
                "type": "practice",
                "title": "Python Practice Problems",
                "platform": "HackerRank",
                "channel": "HackerRank",
                "url": "https://www.hackerrank.com/domains/python",
                "duration": "Daily",
                "free": True
            },
            {
                "type": "docs",
                "title": "Official Python Documentation",
                "platform": "python.org",
                "channel": "Python",
                "url": "https://docs.python.org/3/tutorial",
                "duration": "Reference",
                "free": True
            }
        ]
    },
    "javascript": {
        "skill": "JavaScript",
        "level": "Beginner → Advanced",
        "time": "4-6 weeks",
        "resources": [
            {
                "type": "video",
                "title": "JavaScript Full Course",
                "platform": "YouTube",
                "channel": "Traversy Media",
                "url": "https://www.youtube.com/watch?v=hdI2bqOjy3c",
                "duration": "3.5 hours",
                "free": True
            },
            {
                "type": "course",
                "title": "The Complete JavaScript Course",
                "platform": "Udemy",
                "channel": "Jonas Schmedtmann",
                "url": "https://www.udemy.com/course/the-complete-javascript-course",
                "duration": "69 hours",
                "free": False
            },
            {
                "type": "practice",
                "title": "JavaScript Algorithms",
                "platform": "freeCodeCamp",
                "channel": "freeCodeCamp",
                "url": "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures",
                "duration": "300 hours",
                "free": True
            },
            {
                "type": "docs",
                "title": "MDN JavaScript Guide",
                "platform": "MDN",
                "channel": "Mozilla",
                "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide",
                "duration": "Reference",
                "free": True
            }
        ]
    },
    "react": {
        "skill": "React",
        "level": "Intermediate",
        "time": "3-4 weeks",
        "resources": [
            {
                "type": "video",
                "title": "React JS Full Course",
                "platform": "YouTube",
                "channel": "Traversy Media",
                "url": "https://www.youtube.com/watch?v=w7ejDZ8SWv8",
                "duration": "2 hours",
                "free": True
            },
            {
                "type": "docs",
                "title": "Official React Documentation",
                "platform": "react.dev",
                "channel": "React",
                "url": "https://react.dev/learn",
                "duration": "Reference",
                "free": True
            },
            {
                "type": "practice",
                "title": "Build 15 React Projects",
                "platform": "YouTube",
                "channel": "freeCodeCamp",
                "url": "https://www.youtube.com/watch?v=a_7Z7C_JCyo",
                "duration": "9 hours",
                "free": True
            }
        ]
    },
    "machine learning": {
        "skill": "Machine Learning",
        "level": "Intermediate → Advanced",
        "time": "8-12 weeks",
        "resources": [
            {
                "type": "course",
                "title": "Machine Learning Specialization",
                "platform": "Coursera",
                "channel": "Andrew Ng",
                "url": "https://www.coursera.org/specializations/machine-learning-introduction",
                "duration": "3 months",
                "free": True
            },
            {
                "type": "video",
                "title": "ML Course Full",
                "platform": "YouTube",
                "channel": "Sentdex",
                "url": "https://www.youtube.com/watch?v=OGxgnH8y2NM",
                "duration": "10 hours",
                "free": True
            },
            {
                "type": "practice",
                "title": "Kaggle ML Competitions",
                "platform": "Kaggle",
                "channel": "Kaggle",
                "url": "https://www.kaggle.com/learn",
                "duration": "Self paced",
                "free": True
            }
        ]
    },
    "docker": {
        "skill": "Docker",
        "level": "Intermediate",
        "time": "2-3 weeks",
        "resources": [
            {
                "type": "video",
                "title": "Docker Tutorial for Beginners",
                "platform": "YouTube",
                "channel": "TechWorld with Nana",
                "url": "https://www.youtube.com/watch?v=3c-iBn73dDE",
                "duration": "3 hours",
                "free": True
            },
            {
                "type": "docs",
                "title": "Official Docker Documentation",
                "platform": "docs.docker.com",
                "channel": "Docker",
                "url": "https://docs.docker.com/get-started",
                "duration": "Reference",
                "free": True
            }
        ]
    },
    "aws": {
        "skill": "AWS",
        "level": "Intermediate → Advanced",
        "time": "6-8 weeks",
        "resources": [
            {
                "type": "course",
                "title": "AWS Certified Cloud Practitioner",
                "platform": "YouTube",
                "channel": "freeCodeCamp",
                "url": "https://www.youtube.com/watch?v=SOTamWNgDKc",
                "duration": "13 hours",
                "free": True
            },
            {
                "type": "practice",
                "title": "AWS Free Tier Labs",
                "platform": "AWS",
                "channel": "Amazon",
                "url": "https://aws.amazon.com/free",
                "duration": "Self paced",
                "free": True
            }
        ]
    },
    "nodejs": {
        "skill": "Node.js",
        "level": "Intermediate",
        "time": "3-4 weeks",
        "resources": [
            {
                "type": "video",
                "title": "Node.js Full Course",
                "platform": "YouTube",
                "channel": "Traversy Media",
                "url": "https://www.youtube.com/watch?v=fBNz5xF-Kx4",
                "duration": "1.5 hours",
                "free": True
            },
            {
                "type": "docs",
                "title": "Official Node.js Documentation",
                "platform": "nodejs.org",
                "channel": "Node.js",
                "url": "https://nodejs.org/en/docs",
                "duration": "Reference",
                "free": True
            }
        ]
    },
    "mongodb": {
        "skill": "MongoDB",
        "level": "Beginner → Intermediate",
        "time": "2-3 weeks",
        "resources": [
            {
                "type": "course",
                "title": "MongoDB University Free Courses",
                "platform": "MongoDB University",
                "channel": "MongoDB",
                "url": "https://learn.mongodb.com",
                "duration": "Self paced",
                "free": True
            },
            {
                "type": "video",
                "title": "MongoDB Crash Course",
                "platform": "YouTube",
                "channel": "Traversy Media",
                "url": "https://www.youtube.com/watch?v=-56x56UppqQ",
                "duration": "1.5 hours",
                "free": True
            }
        ]
    },
    "git": {
        "skill": "Git",
        "level": "Beginner",
        "time": "1 week",
        "resources": [
            {
                "type": "video",
                "title": "Git & GitHub Full Course",
                "platform": "YouTube",
                "channel": "freeCodeCamp",
                "url": "https://www.youtube.com/watch?v=RGOj5yH7evk",
                "duration": "1 hour",
                "free": True
            },
            {
                "type": "practice",
                "title": "Learn Git Branching",
                "platform": "Interactive",
                "channel": "learngitbranching.js.org",
                "url": "https://learngitbranching.js.org",
                "duration": "Self paced",
                "free": True
            }
        ]
    },
    "typescript": {
        "skill": "TypeScript",
        "level": "Intermediate",
        "time": "2-3 weeks",
        "resources": [
            {
                "type": "video",
                "title": "TypeScript Full Course",
                "platform": "YouTube",
                "channel": "Traversy Media",
                "url": "https://www.youtube.com/watch?v=BCg4U1FzODs",
                "duration": "1.5 hours",
                "free": True
            },
            {
                "type": "docs",
                "title": "TypeScript Handbook",
                "platform": "typescriptlang.org",
                "channel": "Microsoft",
                "url": "https://www.typescriptlang.org/docs/handbook/intro.html",
                "duration": "Reference",
                "free": True
            }
        ]
    },
    "django": {
        "skill": "Django",
        "level": "Intermediate",
        "time": "3-4 weeks",
        "resources": [
            {
                "type": "video",
                "title": "Django Full Course",
                "platform": "YouTube",
                "channel": "freeCodeCamp",
                "url": "https://www.youtube.com/watch?v=F5mRW0jo-U4",
                "duration": "3.5 hours",
                "free": True
            },
            {
                "type": "docs",
                "title": "Django Official Documentation",
                "platform": "djangoproject.com",
                "channel": "Django",
                "url": "https://docs.djangoproject.com/en/stable/intro/tutorial01",
                "duration": "Reference",
                "free": True
            }
        ]
    },
    "pandas": {
        "skill": "Pandas",
        "level": "Intermediate",
        "time": "2 weeks",
        "resources": [
            {
                "type": "video",
                "title": "Pandas Full Course",
                "platform": "YouTube",
                "channel": "Keith Galli",
                "url": "https://www.youtube.com/watch?v=vmEHCJofslg",
                "duration": "1 hour",
                "free": True
            },
            {
                "type": "practice",
                "title": "Pandas on Kaggle",
                "platform": "Kaggle",
                "channel": "Kaggle",
                "url": "https://www.kaggle.com/learn/pandas",
                "duration": "4 hours",
                "free": True
            }
        ]
    },
    "default": {
        "skill": "General",
        "level": "All levels",
        "time": "Self paced",
        "resources": [
            {
                "type": "platform",
                "title": "freeCodeCamp - Free Coding Courses",
                "platform": "freeCodeCamp",
                "channel": "freeCodeCamp",
                "url": "https://www.freecodecamp.org",
                "duration": "Self paced",
                "free": True
            },
            {
                "type": "platform",
                "title": "The Odin Project",
                "platform": "theodinproject.com",
                "channel": "Odin Project",
                "url": "https://www.theodinproject.com",
                "duration": "Self paced",
                "free": True
            },
            {
                "type": "platform",
                "title": "MIT OpenCourseWare",
                "platform": "MIT",
                "channel": "MIT",
                "url": "https://ocw.mit.edu",
                "duration": "Self paced",
                "free": True
            }
        ]
    }
}

class SkillsRequest(BaseModel):
    missing_skills: List[str]

@router.post("/resources")
def get_learning_resources(data: SkillsRequest):
    result = []

    for skill in data.missing_skills[:6]:
        skill_lower = skill.lower()
        if skill_lower in LEARNING_RESOURCES:
            result.append(LEARNING_RESOURCES[skill_lower])
        else:
            resource = LEARNING_RESOURCES["default"].copy()
            resource["skill"] = skill
            result.append(resource)

    if not result:
        result.append(LEARNING_RESOURCES["default"])

    return {
        "status": "success",
        "total_skills": len(result),
        "resources": result
    }

@router.get("/all")
def get_all_resources():
    return {
        "status": "success",
        "skills": list(LEARNING_RESOURCES.keys())
    }