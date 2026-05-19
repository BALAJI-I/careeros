from fastapi import APIRouter, UploadFile, File, HTTPException, Header
from database import resumes_collection
from auth import decode_token
import pdfplumber
import io
from datetime import datetime
from typing import Optional

router = APIRouter()

@router.post("/upload")
async def upload_resume(
    file: UploadFile = File(...),
    authorization: Optional[str] = Header(None)
):
    # Check file is PDF
    if not file.filename.endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files allowed"
        )

    # Get user_id from token
    user_id = None
    if authorization:
        token = authorization.replace("Bearer ", "")
        payload = decode_token(token)
        if payload:
            user_id = payload.get("user_id")

    # Read file
    contents = await file.read()

    # Extract text from PDF
    text = ""
    num_pages = 0
    with pdfplumber.open(io.BytesIO(contents)) as pdf:
        num_pages = len(pdf.pages)
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"

    # Check if text extracted
    if not text.strip():
        raise HTTPException(
            status_code=400,
            detail="Could not extract text from PDF"
        )

    # Check if resume already exists for this user
    query = {"filename": file.filename}
    if user_id:
        query["user_id"] = user_id

    existing = resumes_collection.find_one(query)

    if existing:
        return {
            "filename": file.filename,
            "status": "success",
            "text": text,
            "pages": num_pages,
            "word_count": len(text.split()),
            "resume_id": str(existing["_id"])
        }

    # Save new resume to MongoDB
    resume_doc = {
        "filename": file.filename,
        "text": text,
        "pages": num_pages,
        "word_count": len(text.split()),
        "user_id": user_id,
        "uploaded_at": datetime.now()
    }
    result = resumes_collection.insert_one(resume_doc)

    return {
        "filename": file.filename,
        "status": "success",
        "text": text,
        "pages": num_pages,
        "word_count": len(text.split()),
        "resume_id": str(result.inserted_id)
    }

@router.get("/all")
def get_all_resumes():
    resumes = list(resumes_collection.find({}, {"text": 0}))
    for r in resumes:
        r["_id"] = str(r["_id"])
    return {
        "status": "success",
        "total": len(resumes),
        "resumes": resumes
    }