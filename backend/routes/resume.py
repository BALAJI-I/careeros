from fastapi import APIRouter, UploadFile, File, HTTPException
from database import resumes_collection
import pdfplumber
import io
from datetime import datetime

router = APIRouter()

@router.post("/upload")
async def upload_resume(file: UploadFile = File(...)):

    # Check file is PDF
    if not file.filename.endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files allowed"
        )

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

    # Save to MongoDB
    resume_doc = {
        "filename": file.filename,
        "text": text,
        "pages": num_pages,
        "word_count": len(text.split()),
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