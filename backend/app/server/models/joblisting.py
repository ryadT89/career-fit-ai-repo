from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
# Schema for JobListing creation
class JobListingSchema(BaseModel):
    title: str = Field(..., example="Software Engineer")
    description: str = Field(..., example="Develop, test, and deploy software applications.")
    recruiterId: str = Field(..., example="recruiter_id_1234")
    location: str = Field(..., example="San Francisco")
    status: str = Field(..., example="open")  # "open" or "filled"
    requiredSkills: str = Field(..., example="Python, JavaScript")
    requiredExperience: int = Field(..., example=3)  # years of experience
    createdAt: Optional[float] = Field(default=datetime.now().timestamp())  # Current time in seconds
    recruiter: Optional[dict] = Field(None, example={"userId": "user_id_1234", "company": "Tech Corp"})

    class Config:
        schema_extra = {
            "example": {
                "title": "Software Engineer",
                "description": "Develop, test, and deploy software applications.",
                "recruiterId": "recruiter_id_1234",
                "location": "San Francisco",
                "status": "open",
                "requiredSkills": "Python, JavaScript",
                "requiredExperience": 3
            }
        }

# Schema for updating JobListing (optional fields)
class JobListingUpdate(BaseModel):
    title: Optional[str] = Field(None, example="Software Engineer")
    description: Optional[str] = Field(None, example="Develop, test, and deploy software applications.")
    recruiterId: Optional[str] = Field(None, example="recruiter_id_1234")
    location: Optional[str] = Field(None, example="San Francisco")
    status: Optional[str] = Field(None, example="open")  # "open" or "filled"
    requiredSkills: Optional[str] = Field(None, example="Python, JavaScript")
    requiredExperience: Optional[int] = Field(None, example=3)  # years of experience

    class Config:
        schema_extra = {
            "example": {
                "title": "Software Engineer",
                "description": "Develop, test, and deploy software applications.",
                "recruiterId": "recruiter_id_1234",
                "location": "San Francisco",
                "status": "open",
                "requiredSkills": "Python, JavaScript",
                "requiredExperience": 3
            }
        }
