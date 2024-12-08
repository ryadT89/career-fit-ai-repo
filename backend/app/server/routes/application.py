from fastapi import APIRouter, Body, Depends, HTTPException
from app.server.database import get_db
from app.server.models.application import ApplicationSchema, ApplicationUpdate
from app.server.models.response import ResponseModel
from bson import ObjectId
import time

router = APIRouter()

# Helper function to format the application details
def application_helper(application) -> dict:
    return {
        "id": str(application["_id"]),
        "jobListingId": application["jobListingId"],
        "candidateId": application["candidateId"],
        "status": application["status"],
        "coverLetter": application["coverLetter"],
        "appliedAt": application["appliedAt"],
        "candidate": application.get("candidate", {}),
        "jobListing": application.get("jobListing", {}),
    }

# Create a new application
@router.post("/", response_description="Application created successfully", status_code=201)
async def create_application(application: ApplicationSchema = Body(...), db=Depends(get_db)):
    # Check if the application already exists for the job listing and candidate
    existing_application = await db.applications.find_one({
        "jobListingId": application.jobListingId,
        "candidateId": application.candidateId,
    })
    if existing_application:
        raise HTTPException(status_code=400, detail="The candidate has already applied for this job.")

    # Add current time for appliedAt
    application_data = application.dict()
    application_data["appliedAt"] = int(time.time())

    # Insert new application
    new_application = await db.applications.insert_one(application_data)
    created_application = await db.applications.find_one({"_id": new_application.inserted_id})
    candidate = await db.candidates.find_one({"_id": ObjectId(created_application["candidateId"])})
    candidate.pop("_id")
    created_application["candidate"] = candidate
    user = await db.users.find_one({"_id": ObjectId(candidate["userId"])})
    user.pop("_id")
    created_application["candidate"]["user"] = user
    job_listing = await db.job_listings.find_one({"_id": ObjectId(created_application["jobListingId"])})
    if job_listing:
        job_listing.pop("_id")
        created_application["jobListing"] = job_listing

    return ResponseModel(application_helper(created_application), "Application created successfully")

# Get all applications
@router.get("/", response_description="All applications retrieved successfully")
async def get_all_applications(db=Depends(get_db)):
    applications = await db.applications.find().to_list(100)
    if not applications:
        raise HTTPException(status_code=404, detail="No applications found in the database.")
    print(applications)
    for i in range(len(applications)):
        candidate = await db.candidates.find_one({"_id": ObjectId(applications[i]["candidateId"])})
        candidate.pop("_id")
        applications[i]["candidate"] = candidate
        user = await db.users.find_one({"_id": ObjectId(candidate["userId"])})
        user.pop("_id")
        applications[i]["candidate"]["user"] = user
        print(applications[i]["jobListingId"])
        job_listing = await db.job_listings.find_one({"_id": ObjectId(applications[i]["jobListingId"])})
        if job_listing:
            job_listing.pop("_id")
            applications[i]["jobListing"] = job_listing

    return ResponseModel([application_helper(application) for application in applications], "Applications retrieved successfully")

# Get a single application by ID
@router.get("/{application_id}", response_description="Application retrieved successfully")
async def get_application(application_id: str, db=Depends(get_db)):
    application = await db.applications.find_one({"_id": ObjectId(application_id)})
    if not application:
        raise HTTPException(status_code=404, detail="The application does not exist.")

    candidate = await db.candidates.find_one({"_id": ObjectId(application["candidateId"])})
    candidate.pop("_id")
    application["candidate"] = candidate
    user = await db.users.find_one({"_id": ObjectId(candidate["userId"])})
    user.pop("_id")
    application["candidate"]["user"] = user
    job_listing = await db.job_listings.find_one({"_id": ObjectId(application["jobListingId"])})
    if job_listing:
        job_listing.pop("_id")
        application["jobListing"] = job_listing

    return ResponseModel(application_helper(application), "Application retrieved successfully")

# Get all applications by recruiter userId joblistings
@router.get("/recruiter/{user_id}", response_description="All applications retrieved successfully")
async def get_all_applications_by_recruiter(user_id: str, db=Depends(get_db)):
    recruiter = await db.recruiter_profiles.find_one({"userId": user_id})
    job_listings = await db.job_listings.find({"recruiterId": str(recruiter["_id"])}).to_list(100)
    if not job_listings:
        raise HTTPException(status_code=404, detail="No job listings found for the recruiter.")
    applications = []
    for job_listing in job_listings:
        job_listing_applications = await db.applications.find({"jobListingId": str(job_listing["_id"])}).to_list(100)
        for application in job_listing_applications:
            candidate = await db.candidates.find_one({"_id": ObjectId(application["candidateId"])})
            candidate.pop("_id")
            application["candidate"] = candidate
            user = await db.users.find_one({"_id": ObjectId(candidate["userId"])})
            user.pop("_id")
            application["candidate"]["user"] = user
            job_listing.pop("_id")
            application["jobListing"] = job_listing
            applications.append(application)
    
    return ResponseModel([application_helper(application) for application in applications], "Applications retrieved successfully")

# Get all applications by candidate userId
@router.get("/candidate/{user_id}", response_description="All applications retrieved successfully")
async def get_all_applications_by_candidate(user_id: str, db=Depends(get_db)):
    candidate = await db.candidates.find_one({"userId": user_id})
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found.")
    applications = await db.applications.find({"candidateId": str(candidate["_id"])}).to_list(100)
    if not applications:
        raise HTTPException(status_code=404, detail="No applications found for the candidate.")
    for i in range(len(applications)):
        job_listing = await db.job_listings.find_one({"_id": ObjectId(applications[i]["jobListingId"])})
        job_listing.pop("_id")
        applications[i]["jobListing"] = job_listing

    return ResponseModel([application_helper(application) for application in applications], "Applications retrieved successfully")

# Update an application
@router.put("/{application_id}", response_description="Application updated successfully")
async def update_application(application_id: str, application: ApplicationUpdate = Body(...), db=Depends(get_db)):
    # Fetch the existing application
    existing_application = await db.applications.find_one({"_id": ObjectId(application_id)})
    if not existing_application:
        raise HTTPException(status_code=404, detail="The application does not exist.")

    # Update only provided fields
    update_data = {k: v for k, v in application.dict().items() if v is not None}
    updated_application = await db.applications.find_one_and_update(
        {"_id": ObjectId(application_id)}, {"$set": update_data}, return_document=True
    )

    return ResponseModel(application_helper(updated_application), "Application updated successfully")

# Delete an application
@router.delete("/{application_id}", response_description="Application deleted successfully")
async def delete_application(application_id: str, db=Depends(get_db)):
    application = await db.applications.find_one_and_delete({"_id": ObjectId(application_id)})
    if not application:
        raise HTTPException(status_code=404, detail="The application does not exist.")

    return ResponseModel(application_helper(application), "Application deleted successfully")
