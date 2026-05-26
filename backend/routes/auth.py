from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from database import users_collection
from auth import hash_password, verify_password, create_token
from datetime import datetime

router = APIRouter()

class SignupRequest(BaseModel):
    name: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/signup")
def signup(data: SignupRequest):

    # Check if email already exists
    existing = users_collection.find_one({"email": data.email})
    if existing:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    # Validate password length
    if len(data.password) < 6:
        raise HTTPException(
            status_code=400,
            detail="Password must be at least 6 characters"
        )

    # Create user
    user = {
        "name": data.name,
        "email": data.email,
        "password": hash_password(data.password),
        "created_at": datetime.now(),
        "streak": 0,
        "total_tasks_completed": 0,
    }
    result = users_collection.insert_one(user)

    # Create token
    token = create_token({
        "user_id": str(result.inserted_id),
        "email": data.email,
        "name": data.name
    })
    # Send welcome email
    try:
        import resend
        import os
        resend.api_key = os.getenv("RESEND_API_KEY")
        resend.Emails.send({
            "from": "CareerOS <onboarding@resend.dev>",
            "to": data.email,
            "subject": "Welcome to CareerOS 🚀",
            "html": f"<h1>Welcome {data.name}!</h1><p>Your CareerOS journey starts now. Upload your resume to get started.</p>"
        })
    except Exception as e:
        print(f"Welcome email error: {e}")

    return {
        "status": "success",
        "message": "Account created successfully",
        "token": token,
        "user": {
            "id": str(result.inserted_id),
            "name": data.name,
            "email": data.email
        }
    }

@router.post("/login")
def login(data: LoginRequest):

    # Find user
    user = users_collection.find_one({"email": data.email})
    if not user:
        raise HTTPException(
            status_code=400,
            detail="Email not found"
        )

    # Verify password
    if not verify_password(data.password, user["password"]):
        raise HTTPException(
            status_code=400,
            detail="Incorrect password"
        )

    # Create token
    token = create_token({
        "user_id": str(user["_id"]),
        "email": user["email"],
        "name": user["name"]
    })

    return {
        "status": "success",
        "message": "Login successful",
        "token": token,
        "user": {
            "id": str(user["_id"]),
            "name": user["name"],
            "email": user["email"]
        }
    }

@router.get("/me")
def get_me(token: str):
    from auth import decode_token
    payload = decode_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    return {
        "status": "success",
        "user": payload
    }