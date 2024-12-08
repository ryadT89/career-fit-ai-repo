from pydantic import BaseModel, Field
from typing import Optional, List

# Schema for Recruiter Profile creation
class RecruiterSchema(BaseModel):
    userId: str = Field(..., example="user_id_1234")
    company: str = Field(..., example="Tech Corp")
    website: Optional[str] = Field(None, example="https://techcorp.com")
    sector: str = Field(..., example="Software Development")
    description: Optional[str] = Field(None, example="Leading the tech industry with innovative solutions")

    class Config:
        schema_extra = {
            "example": {
                "userId": "user_id_1234",
                "company": "Tech Corp",
                "website": "https://techcorp.com",
                "sector": "Software Development",
                "description": "Leading the tech industry with innovative solutions"
            }
        }

# Schema for updating Recruiter Profile (all fields are optional)
class RecruiterUpdate(BaseModel):
    userId: Optional[str] = Field(None, example="user_id_1234")
    company: Optional[str] = Field(None, example="Tech Corp")
    website: Optional[str] = Field(None, example="https://techcorp.com")
    sector: Optional[str] = Field(None, example="Software Development")
    description: Optional[str] = Field(None, example="Leading the tech industry with innovative solutions")

    class Config:
        schema_extra = {
            "example": {
                "userId": "user_id_1234",
                "company": "Tech Corp",
                "website": "https://techcorp.com",
                "sector": "Software Development",
                "description": "Leading the tech industry with innovative solutions"
            }
        }
