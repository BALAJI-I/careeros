from fastapi import APIRouter, UploadFile, File, HTTPException
import pdfplumber
import io

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
    with pdfplumber.open(io.BytesIO(contents)) as pdf:
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
    
    return {
        "filename": file.filename,
        "status": "success",
        "text": text,
        "pages": len(pdf.pages) if pdf else 0,
        "word_count": len(text.split())
    }