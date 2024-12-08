from pydantic import BaseModel, Field
from typing import Optional

# Schema for Candidate Profile creation
class CandidateSchema(BaseModel):
    userId: str = Field(..., example="user_id_1234")
    skills: str = Field(..., example="Python, JavaScript, SQL")
    experience: int = Field(..., example=5)
    location: str = Field(..., example="New York")
    interestSectors: Optional[str] = Field(None, example="Software Development")
    resume: Optional[str] = Field(None, example="https://example.com/resume.pdf")

    class Config:
        schema_extra = {
            "example": {
                "userId": "user_id_1234",
                "skills": "Python, JavaScript, SQL",
                "experience": 5,
                "location": "New York",
                "interestSectors": "Software Development",
                "resume": "https://example.com/resume.pdf",
            }
        }

# Schema for updating Candidate Profile (all fields are optional)
class CandidateUpdate(BaseModel):
    userId: Optional[str] = Field(None, example="user_id_1234")
    skills: Optional[str] = Field(None, example="Python, JavaScript, SQL")
    experience: Optional[int] = Field(None, example=5)
    location: Optional[str] = Field(None, example="New York")
    interestSectors: Optional[str] = Field(None, example="Software Development")
    resume: Optional[str] = Field(None, example="https://example.com/resume.pdf")

    class Config:
        schema_extra = {
            "example": {
                "userId": "user_id_1234",
                "skills": "Python, JavaScript, SQL",
                "experience": 5,
                "location": "New York",
                "interestSectors": "Software Development",
                "resume": "https://example.com/resume.pdf",
            }
        }