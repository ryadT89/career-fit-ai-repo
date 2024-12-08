from fastapi import APIRouter, Body, Depends, HTTPException
from app.server.database import get_db
from app.server.models.joblisting import JobListingSchema, JobListingUpdate
from app.server.models.response import ResponseModel
from bson import ObjectId

router = APIRouter()

# Helper function to format the job listing data
def job_listing_helper(job_listing) -> dict:
    return {
        "id": str(job_listing["_id"]),
        "title": job_listing["title"],
        "description": job_listing["description"],
        "recruiterId": job_listing["recruiterId"],
        "location": job_listing["location"],
        "status": job_listing["status"],
        "createdAt": job_listing["createdAt"],
        "requiredSkills": job_listing["requiredSkills"],
        "requiredExperience": job_listing["requiredExperience"],
        "recruiter": job_listing.get("recruiter", {}),
        "applications": job_listing.get("applications", [])
    }

# Create a new job listing
@router.post("/", response_description="Job listing created successfully", status_code=201)
async def create_job_listing(job_listing: JobListingSchema = Body(...), db=Depends(get_db)):
    # Create new job listing
    print(job_listing)
    new_job_listing = await db.job_listings.insert_one(job_listing.dict())
    job_listing_data = await db.job_listings.find_one({"_id": new_job_listing.inserted_id})
    
    return ResponseModel(job_listing_helper(job_listing_data), "Job listing created successfully")

# Get all job listings
@router.get("/", response_description="All job listings retrieved successfully")
async def get_all_job_listings(db=Depends(get_db)):
    job_listings = await db.job_listings.find().to_list(100)
    if not job_listings:
        raise HTTPException(status_code=404, detail="No job listings found")
    
    for i in range(len(job_listings)):
        recruiter = await db.recruiter_profiles.find_one({"_id": ObjectId(job_listings[i]["recruiterId"])})
        recruiter.pop("_id")
        user = await db.users.find_one({"_id": ObjectId(recruiter["userId"])})
        user.pop("_id")
        job_listings[i]["recruiter"] = recruiter
        job_listings[i]["recruiter"]["user"] = user

    return ResponseModel([job_listing_helper(job_listing) for job_listing in job_listings], "Job listings fetched successfully")

# Get all recruiter Job listings
@router.get("/recruiter/{user_id}", response_description="All job listings retrieved successfully")
async def get_all_job_listings_by_recruiter(user_id: str, db=Depends(get_db)):
    recruiter = await db.recruiter_profiles.find_one({"userId": user_id})
    job_listings = await db.job_listings.find({"recruiterId": str(recruiter["_id"])}).to_list(100)
    if not job_listings:
        raise HTTPException(status_code=404, detail="No job listings found")

    return ResponseModel([job_listing_helper(job_listing) for job_listing in job_listings], "Job listings fetched successfully")


# Get a single job listing by ID
@router.get("/{job_listing_id}", response_description="Job listing fetched successfully")
async def get_job_listing(job_listing_id: str, db=Depends(get_db)):
    job_listing = await db.job_listings.find_one({"_id": ObjectId(job_listing_id)})
    if not job_listing:
        raise HTTPException(status_code=404, detail="Job listing not found")
    
    recruiter = await db.recruiter_profiles.find_one({"_id": ObjectId(job_listing["recruiterId"])})
    recruiter.pop("_id")
    user = await db.users.find_one({"_id": ObjectId(recruiter["userId"])})
    user.pop("_id")
    job_listing["recruiter"] = recruiter
    job_listing["recruiter"]["user"] = user
    applications = await db.applications.find({"jobListingId": job_listing_id}).to_list(100)
    for application in applications:
        application.pop("_id")

    job_listing["applications"] = applications

    return ResponseModel(job_listing_helper(job_listing), "Job listing fetched successfully")

# Update a job listing
@router.put("/{job_listing_id}", response_description="Job listing updated successfully")
async def update_job_listing(job_listing_id: str, job_listing: JobListingUpdate = Body(...), db=Depends(get_db)):
    # Fetch the existing job listing
    existing_job_listing = await db.job_listings.find_one({"_id": ObjectId(job_listing_id)})
    if not existing_job_listing:
        raise HTTPException(status_code=404, detail="Job listing not found")
    
    # Update only the fields provided
    update_data = {k: v for k, v in job_listing.dict().items() if v is not None}
    updated_job_listing = await db.job_listings.find_one_and_update(
        {"_id": ObjectId(job_listing_id)}, {"$set": update_data}, return_document=True
    )
    
    return ResponseModel(job_listing_helper(updated_job_listing), "Job listing updated successfully")

# Delete a job listing
@router.delete("/{job_listing_id}", response_description="Job listing deleted successfully")
async def delete_job_listing(job_listing_id: str, db=Depends(get_db)):
    job_listing = await db.job_listings.find_one_and_delete({"_id": ObjectId(job_listing_id)})
    if not job_listing:
        raise HTTPException(status_code=404, detail="Job listing not found")
    
    return ResponseModel(job_listing_helper(job_listing), "Job listing deleted successfully")
