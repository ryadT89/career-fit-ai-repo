from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from fastapi.responses import FileResponse
from app.server.database import get_db
from app.server.models.response import ResponseModel
import os
from uuid import uuid4
from bson import ObjectId

router = APIRouter()

# Define directories for storing files
PROFILE_PIC_DIR = "uploads/profile_pictures"
RESUME_DIR = "uploads/resumes"

os.makedirs(PROFILE_PIC_DIR, exist_ok=True)
os.makedirs(RESUME_DIR, exist_ok=True)


# Helper function to save files
def save_file(file: UploadFile, folder: str) -> str:
    file_name = f"{uuid4()}-{file.filename}"
    file_path = os.path.join(folder, file_name)
    with open(file_path, "wb") as buffer:
        buffer.write(file.file.read())
    return file_path


# Profile Picture Upload
@router.post("/profile-picture/{user_id}", response_description="Profile picture uploaded successfully")
async def upload_profile_picture(user_id: str, file: UploadFile = File(...), db=Depends(get_db)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload an image.")
    
    # Remove old profile picture
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    if "image" in user and os.path.exists(user["image"] if user["image"] else ""):
        os.remove(user["image"])

    # Save new profile picture
    file_path = save_file(file, PROFILE_PIC_DIR)
    await db.users.update_one({"_id": ObjectId(user_id)}, {"$set": {"image": file_path}})
    
    return ResponseModel({"filePath": file_path}, "Profile picture uploaded successfully.")


# Resume Upload
@router.post("/resume/{user_id}", response_description="Resume uploaded successfully")
async def upload_resume(user_id: str, file: UploadFile = File(...), db=Depends(get_db)):
    if file.content_type not in ["application/pdf"]:
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload a PDF or Word document.")

    # Remove old resume
    candidate = await db.candidates.find_one({"userId": user_id})
    if not candidate:
        raise HTTPException(status_code=404, detail="User not found.")
    if "resume" in candidate and os.path.exists(candidate["resume"] if candidate["resume"] else ""):
        os.remove(candidate["resume"])

    # Save new resume
    file_path = save_file(file, RESUME_DIR)
    await db.candidates.update_one({"userId": user_id}, {"$set": {"resume": file_path}})
    
    return ResponseModel({"filePath": file_path}, "Resume uploaded successfully.")


# Get Profile Picture
@router.get("/profile-picture/{user_id}", response_description="Profile picture retrieved successfully")
async def get_profile_picture(user_id: str, db=Depends(get_db)):
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    if not user or "image" not in user:
        raise HTTPException(status_code=404, detail="Profile picture not found.")

    file_path = user["image"]
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File does not exist on the server.")

    return FileResponse(file_path, media_type="image/jpeg", filename=os.path.basename(file_path))


# Get Resume
@router.get("/resume/{user_id}", response_description="Resume retrieved successfully")
async def get_resume(user_id: str, db=Depends(get_db)):
    candidate = await db.candidates.find_one({"userId": user_id})
    if not candidate or "resume" not in candidate:
        raise HTTPException(status_code=404, detail="Resume not found.")

    file_path = candidate["resume"]
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File does not exist on the server.")

    return FileResponse(file_path, media_type="application/pdf", filename=os.path.basename(file_path))
