from fastapi import APIRouter, Body, Depends, HTTPException
from app.server.database import get_db
from app.server.models.invitation import InvitationSchema, InvitationUpdate
from app.server.models.response import ResponseModel
from bson import ObjectId

router = APIRouter()

# Helper function to format the invitation data
def invitation_helper(invitation) -> dict:
    return {
        "id": str(invitation["_id"]),
        "recruiterId": invitation["recruiterId"],
        "candidateId": invitation["candidateId"],
        "message": invitation["message"],
        "invitedAt": invitation["invitedAt"],
        "candidate": invitation.get("candidate", {}),
        "recruiter": invitation.get("recruiter", {})
    }

# Create a new invitation
@router.post("/", response_description="Invitation created successfully", status_code=201)
async def create_invitation(invitation: InvitationSchema = Body(...), db=Depends(get_db)):
    # Create new invitation
    new_invitation = await db.invitations.insert_one(invitation.dict())
    invitation_data = await db.invitations.find_one({"_id": new_invitation.inserted_id})
    
    return ResponseModel(invitation_helper(invitation_data), "Invitation created successfully")

# Get all invitations
@router.get("/", response_description="All invitations retrieved successfully")
async def get_all_invitations(db=Depends(get_db)):
    invitations = await db.invitations.find().to_list(100)
    if not invitations:
        raise HTTPException(status_code=404, detail="No invitations found")
    for i in range(len(invitations)):
        candidate = await db.candidates.find_one({"_id": ObjectId(invitations[i]["candidateId"])})
        candidate.pop("_id")
        invitations[i]["candidate"] = candidate
        user = await db.users.find_one({"_id": ObjectId(candidate["userId"])})
        user.pop("_id")
        invitations[i]["candidate"]["user"] = user
    return ResponseModel([invitation_helper(invitation) for invitation in invitations], "Invitations fetched successfully")

# Get a single invitation by ID
@router.get("/{invitation_id}", response_description="Invitation fetched successfully")
async def get_invitation(invitation_id: str, db=Depends(get_db)):
    invitation = await db.invitations.find_one({"_id": ObjectId(invitation_id)})
    if not invitation:
        raise HTTPException(status_code=404, detail="Invitation not found")
    candidate = await db.candidates.find_one({"_id": ObjectId(invitation["candidateId"])})
    candidate.pop("_id")
    invitation["candidate"] = candidate
    user = await db.users.find_one({"_id": ObjectId(candidate["userId"])})
    user.pop("_id")
    invitation["candidate"]["user"] = user
    recruiter = await db.recruiter_profiles.find_one({"_id": ObjectId(invitation["recruiterId"])})
    recruiter.pop("_id")
    invitation["recruiter"] = recruiter
    user = await db.users.find_one({"_id": ObjectId(recruiter["userId"])})
    user.pop("_id")
    invitation["recruiter"]["user"] = user

    return ResponseModel(invitation_helper(invitation), "Invitation fetched successfully")

# Get all invitations by recruiter userId
@router.get("/recruiter/{user_id}", response_description="All invitations retrieved successfully")
async def get_all_invitations_by_recruiter(user_id: str, db=Depends(get_db)):
    recruiter = await db.recruiter_profiles.find_one({"userId": user_id})
    if not recruiter:
        raise HTTPException(status_code=404, detail="Recruiter not found")
    invitations = await db.invitations.find({"recruiterId": str(recruiter["_id"])}).to_list(100)
    if not invitations:
        raise HTTPException(status_code=404, detail="No invitations found")
    for i in range(len(invitations)):
        candidate = await db.candidates.find_one({"_id": ObjectId(invitations[i]["candidateId"])})
        candidate.pop("_id")
        invitations[i]["candidate"] = candidate
        user = await db.users.find_one({"_id": ObjectId(candidate["userId"])})
        user.pop("_id")
        invitations[i]["candidate"]["user"] = user
    return ResponseModel([invitation_helper(invitation) for invitation in invitations], "Invitations fetched successfully")

# Get all invitations by candidate userId
@router.get("/candidate/{user_id}", response_description="All invitations retrieved successfully")
async def get_all_invitations_by_candidate(user_id: str, db=Depends(get_db)):
    print(user_id)
    candidate = await db.candidates.find_one({"userId": user_id})
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    invitations = await db.invitations.find({"candidateId": str(candidate["_id"])}).to_list(100)
    if not invitations:
        raise HTTPException(status_code=404, detail="No invitations found")
    for i in range(len(invitations)):
        recruiter = await db.recruiter_profiles.find_one({"_id": ObjectId(invitations[i]["recruiterId"])})
        recruiter.pop("_id")
        invitations[i]["recruiter"] = recruiter
        user = await db.users.find_one({"_id": ObjectId(recruiter["userId"])})
        user.pop("_id")
        invitations[i]["recruiter"]["user"] = user
    return ResponseModel([invitation_helper(invitation) for invitation in invitations], "Invitations fetched successfully")

# Update an invitation
@router.put("/{invitation_id}", response_description="Invitation updated successfully")
async def update_invitation(invitation_id: str, invitation: InvitationUpdate = Body(...), db=Depends(get_db)):
    # Fetch the existing invitation
    existing_invitation = await db.invitations.find_one({"_id": ObjectId(invitation_id)})
    if not existing_invitation:
        raise HTTPException(status_code=404, detail="Invitation not found")
    
    # Update only the fields provided
    update_data = {k: v for k, v in invitation.dict().items() if v is not None}
    updated_invitation = await db.invitations.find_one_and_update(
        {"_id": ObjectId(invitation_id)}, {"$set": update_data}, return_document=True
    )
    
    return ResponseModel(invitation_helper(updated_invitation), "Invitation updated successfully")

# Delete an invitation
@router.delete("/{invitation_id}", response_description="Invitation deleted successfully")
async def delete_invitation(invitation_id: str, db=Depends(get_db)):
    invitation = await db.invitations.find_one_and_delete({"_id": ObjectId(invitation_id)})
    if not invitation:
        raise HTTPException(status_code=404, detail="Invitation not found")
    
    return ResponseModel(invitation_helper(invitation), "Invitation deleted successfully")
