from fastapi import APIRouter, Body, Depends, HTTPException
from app.server.database import get_db
from app.server.models.candidate import CandidateSchema, CandidateUpdate
from app.server.models.response import ResponseModel
from bson import ObjectId

router = APIRouter()

# Helper function to format the candidate profile
def candidate_helper(candidate) -> dict:
    return {
        "id": str(candidate["_id"]),
        "userId": candidate["userId"],
        "skills": candidate["skills"],
        "experience": candidate["experience"],
        "location": candidate["location"],
        "interestSectors": candidate["interestSectors"],
        "resume": candidate["resume"],
        "user": candidate.get("user", {}),
    }

# Create a new candidate profile
@router.post("/", response_description="Candidate profile created successfully", status_code=201)
async def create_candidate(candidate: CandidateSchema = Body(...), db=Depends(get_db)):
    # Check if the user already has a profile
    existing_profile = await db.candidates.find_one({"userId": candidate.userId})
    if existing_profile:
        raise HTTPException(status_code=400, detail="Candidate profile already exists")
    
    # Create new profile
    new_profile = await db.candidates.insert_one(candidate.dict())
    profile = await db.candidates.find_one({"_id": new_profile.inserted_id})
    
    return ResponseModel(candidate_helper(profile), "Candidate profile created successfully")

# Get all candidate profiles
@router.get("/", response_description="All candidates retrieved successfully")
async def get_all_candidates(db=Depends(get_db)):
    profiles = await db.candidates.find().to_list(100)
    if not profiles:
        raise HTTPException(status_code=404, detail="No candidates found")
    
    for profile in profiles:
        user_data = await db.users.find_one({"_id": ObjectId(profile["userId"])})
        user_data.pop("_id")
        profile["user"] = user_data

    return ResponseModel([candidate_helper(profile) for profile in profiles], "Candidates fetched successfully")

# Get a single candidate profile by userId
@router.get("/{candidate_id}", response_description="Candidate profile fetched successfully")
async def get_candidate(candidate_id: str, db=Depends(get_db)):
    profile = await db.candidates.find_one({"_id": ObjectId(candidate_id)})
    if not profile:
        raise HTTPException(status_code=404, detail="Candidate profile not found")
    user_data = await db.users.find_one({"_id": ObjectId(profile["userId"])})
    user_data.pop("_id")
    profile["user"] = user_data

    return ResponseModel(candidate_helper(profile), "Candidate profile fetched successfully")

@router.get("/userId/{userId}", response_description="Candidate profile fetched successfully")
async def get_candidate_by_userId(userId: str, db=Depends(get_db)):
    profile = await db.candidates.find_one({"userId": userId})
    if not profile:
        raise HTTPException(status_code=404, detail="Candidate profile not found")
    user_data = await db.users.find_one({"_id": ObjectId(userId)})
    user_data.pop("_id")
    profile["user"] = user_data

    return ResponseModel(candidate_helper(profile), "Candidate profile fetched successfully")

# Update a candidate profile
@router.put("/{candidate_id}", response_description="Candidate profile updated successfully")
async def update_candidate(candidate_id: str, candidate: CandidateUpdate = Body(...), db=Depends(get_db)):
    # Fetch the existing profile
    existing_profile = await db.candidates.find_one({"_id": ObjectId(candidate_id)})
    if not existing_profile:
        raise HTTPException(status_code=404, detail="Candidate profile not found")
    
    # Update only the fields provided
    update_data = {k: v for k, v in candidate.dict().items() if v is not None}
    updated_profile = await db.candidates.find_one_and_update(
        {"_id": ObjectId(candidate_id)}, {"$set": update_data}, return_document=True
    )
    
    return ResponseModel(candidate_helper(updated_profile), "Candidate profile updated successfully")

# Delete a candidate profile
@router.delete("/{candidate_id}", response_description="Candidate profile deleted successfully")
async def delete_candidate(candidate_id: str, db=Depends(get_db)):
    profile = await db.candidates.find_one_and_delete({"_id": ObjectId(candidate_id)})
    if not profile:
        raise HTTPException(status_code=404, detail="Candidate profile not found")
    
    return ResponseModel(candidate_helper(profile), "Candidate profile deleted successfully")
