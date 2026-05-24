from fastapi import APIRouter, UploadFile, File, HTTPException, Header
from database import resumes_collection
from auth import decode_token
import pdfplumber
import io
import base64
from datetime import datetime
from typing import Optional

router = APIRouter()

@router.post("/upload")
async def upload_resume(
    file: UploadFile = File(...),
    authorization: Optional[str] = Header(None)
):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files allowed"
        )

    user_id = None
    if authorization:
        token = authorization.replace("Bearer ", "")
        payload = decode_token(token)
        if payload:
            user_id = payload.get("user_id")

    contents = await file.read()

    # Extract text
    text = ""
    num_pages = 0
    with pdfplumber.open(io.BytesIO(contents)) as pdf:
        num_pages = len(pdf.pages)
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"

    if not text.strip():
        raise HTTPException(
            status_code=400,
            detail="Could not extract text from PDF"
        )

    # Convert PDF to base64 for storage
    pdf_base64 = base64.b64encode(contents).decode("utf-8")

    # Check if resume already exists for this user
    query = {"filename": file.filename}
    if user_id:
        query["user_id"] = user_id

    existing = resumes_collection.find_one(query)

    if existing:
        # Update with new PDF data
        resumes_collection.update_one(
            {"_id": existing["_id"]},
            {"$set": {
                "pdf_data": pdf_base64,
                "updated_at": datetime.now()
            }}
        )
        return {
            "filename": file.filename,
            "status": "success",
            "text": text,
            "pages": num_pages,
            "word_count": len(text.split()),
            "resume_id": str(existing["_id"])
        }

    # Save new resume
    resume_doc = {
        "filename": file.filename,
        "text": text,
        "pdf_data": pdf_base64,
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

@router.get("/view/{resume_id}")
async def view_resume(resume_id: str):
    from bson import ObjectId
    from fastapi.responses import Response

    try:
        resume = resumes_collection.find_one({"_id": ObjectId(resume_id)})
        if not resume:
            raise HTTPException(status_code=404, detail="Resume not found")

        if not resume.get("pdf_data"):
            raise HTTPException(status_code=404, detail="PDF not available")

        pdf_bytes = base64.b64decode(resume["pdf_data"])
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"inline; filename={resume['filename']}"
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/all")
def get_all_resumes():
    resumes = list(resumes_collection.find({}, {"text": 0, "pdf_data": 0}))
    for r in resumes:
        r["_id"] = str(r["_id"])
    return {
        "status": "success",
        "total": len(resumes),
        "resumes": resumes
    }