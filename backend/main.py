from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.resume import router as resume_router
from routes.skills import router as skills_router

app = FastAPI(title="CareerOS API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(resume_router, prefix="/resume", tags=["Resume"])
app.include_router(skills_router, prefix="/skills", tags=["Skills"])

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