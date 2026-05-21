from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.resume import router as resume_router
from routes.skills import router as skills_router
from routes.jobs import router as jobs_router
from routes.auth import router as auth_router
from routes.tasks import router as tasks_router
from routes.progress import router as progress_router
from routes.admin import router as admin_router
from routes.tips import router as tips_router
from routes.learning import router as learning_router

app = FastAPI(title="CareerOS API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/auth", tags=["Auth"])
app.include_router(resume_router, prefix="/resume", tags=["Resume"])
app.include_router(skills_router, prefix="/skills", tags=["Skills"])
app.include_router(jobs_router, prefix="/jobs", tags=["Jobs"])
app.include_router(tasks_router, prefix="/tasks", tags=["Tasks"])
app.include_router(progress_router, prefix="/progress", tags=["Progress"])
app.include_router(admin_router, prefix="/admin", tags=["Admin"])
app.include_router(tips_router, prefix="/tips", tags=["Tips"])
app.include_router(learning_router, prefix="/learning", tags=["Learning"])

@app.get("/")
def root():
    return {
        "message": "CareerOS Backend Running ✅",
        "version": "1.0.0",
        "status": "healthy"
    }

@app.get("/health")
def health():
    return {"status": "healthy"}