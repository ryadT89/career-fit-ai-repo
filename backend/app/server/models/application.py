from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

# Schema for Application creation
class ApplicationSchema(BaseModel):
    jobListingId: str = Field(..., example="job_listing_1")
    candidateId: str = Field(..., example="candidate_1")
    status: str = Field(..., example="applied")
    coverLetter: str = Field(..., example="This is my cover letter for the position.")
    appliedAt: Optional[float] = Field(default=datetime.now().timestamp())

    class Config:
        schema_extra = {
            "example": {
                "jobListingId": "job_listing_1",
                "candidateId": "candidate_1",
                "status": "applied",
                "coverLetter": "This is my cover letter for the position."
            }
        }

# Schema for updating Application (optional fields)
class ApplicationUpdate(BaseModel):
    status: Optional[str] = Field(None, example="rejected")
    coverLetter: Optional[str] = Field(None, example="Updated cover letter content.")

    class Config:
        schema_extra = {
            "example": {
                "status": "rejected",
                "coverLetter": "Updated cover letter content."
            }
        }
