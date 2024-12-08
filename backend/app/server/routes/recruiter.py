from fastapi import APIRouter, Body, Depends, HTTPException
from app.server.database import get_db
from app.server.models.recruiter import RecruiterSchema, RecruiterUpdate
from app.server.models.response import ResponseModel
from bson import ObjectId

router = APIRouter()

# Helper function to format the recruiter profile
def recruiter_helper(recruiter) -> dict:
    return {
        "id": str(recruiter["_id"]),
        "userId": recruiter["userId"],
        "company": recruiter["company"],
        "website": recruiter.get("website", ""),
        "sector": recruiter["sector"],
        "description": recruiter.get("description", ""),
        "user": recruiter.get("user", {})
    }

# Create a new recruiter profile
@router.post("/", response_description="Recruiter profile created successfully", status_code=201)
async def create_recruiter(recruiter: RecruiterSchema = Body(...), db=Depends(get_db)):
    # Check if the user already has a profile
    existing_profile = await db.recruiter_profiles.find_one({"userId": recruiter.userId})
    if existing_profile:
        raise HTTPException(status_code=400, detail="Recruiter profile already exists")
    
    # Create new profile
    new_profile = await db.recruiter_profiles.insert_one(recruiter.dict())
    profile = await db.recruiter_profiles.find_one({"_id": new_profile.inserted_id})
    
    return ResponseModel(recruiter_helper(profile), "Recruiter profile created successfully")

# Get all recruiter profiles
@router.get("/", response_description="All recruiters retrieved successfully")
async def get_all_recruiters(db=Depends(get_db)):
    profiles = await db.recruiter_profiles.find().to_list(100)
    if not profiles:
        raise HTTPException(status_code=404, detail="No recruiters found")
    
    return ResponseModel([recruiter_helper(profile) for profile in profiles], "Recruiters fetched successfully")

# Get a single recruiter profile by userId
@router.get("/{recruiter_id}", response_description="Recruiter profile fetched successfully")
async def get_recruiter(recruiter_id: str, db=Depends(get_db)):
    profile = await db.recruiter_profiles.find_one({"_id": ObjectId(recruiter_id)})
    if not profile:
        raise HTTPException(status_code=404, detail="Recruiter profile not found")
    
    return ResponseModel(recruiter_helper(profile), "Recruiter profile fetched successfully")

# Get a single recruiter profile by userId
@router.get("/userId/{userId}", response_description="Recruiter profile fetched successfully")
async def get_recruiter_by_userId(userId: str, db=Depends(get_db)):
    profile = await db.recruiter_profiles.find_one({"userId": userId})
    if not profile:
        raise HTTPException(status_code=404, detail="Recruiter profile not found")
    user = await db.users.find_one({"_id": ObjectId(userId)})
    user.pop("_id")
    profile["user"] = user
    return ResponseModel(recruiter_helper(profile), "Recruiter profile fetched successfully")

# Update a recruiter profile
@router.put("/{recruiter_id}", response_description="Recruiter profile updated successfully")
async def update_recruiter(recruiter_id: str, recruiter: RecruiterUpdate = Body(...), db=Depends(get_db)):
    # Fetch the existing profile
    existing_profile = await db.recruiter_profiles.find_one({"_id": ObjectId(recruiter_id)})
    if not existing_profile:
        raise HTTPException(status_code=404, detail="Recruiter profile not found")
    
    # Update only the fields provided
    update_data = {k: v for k, v in recruiter.dict().items() if v is not None}
    updated_profile = await db.recruiter_profiles.find_one_and_update(
        {"_id": ObjectId(recruiter_id)}, {"$set": update_data}, return_document=True
    )
    
    return ResponseModel(recruiter_helper(updated_profile), "Recruiter profile updated successfully")

# Delete a recruiter profile
@router.delete("/{recruiter_id}", response_description="Recruiter profile deleted successfully")
async def delete_recruiter(recruiter_id: str, db=Depends(get_db)):
    profile = await db.recruiter_profiles.find_one_and_delete({"_id": ObjectId(recruiter_id)})
    if not profile:
        raise HTTPException(status_code=404, detail="Recruiter profile not found")
    
    return ResponseModel(recruiter_helper(profile), "Recruiter profile deleted successfully")
