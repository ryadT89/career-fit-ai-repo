from typing import Optional
from pydantic import BaseModel, EmailStr, Field

# Schema for User creation
class UserSchema(BaseModel):
    fullname: str = Field(..., example="John Doe")
    email: EmailStr = Field(..., example="jdoe@x.edu.ng")
    password: str = Field(..., example="strongpassword")
    user_type: Optional[str] = Field(None, example="Candidate")  # User type (Recruiter/Candidate)
    image: Optional[str] = Field(None, example="https://example.com/image.jpg")

    class Config:
        schema_extra = {
            "example": {
                "fullname": "John Doe",
                "email": "jdoe@x.edu.ng",
                "password": "strongpassword",
                "user_type": "Candidate",
                "image": "https://example.com/image.jpg",
            }
        }

class LoginUserSchema(BaseModel):
    email: EmailStr = Field(..., example="jdoe@x.edu.ng")
    password: str = Field(..., example="strongpassword")

    class Config:
        schema_extra = {
            "example": {
                "email": "jdoe@x.edu.ng",
                "password": "strongpassword",
            }
        }

# Schema for updating User data
class UpdateUserModel(BaseModel):
    fullname: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    user_type: Optional[str] = None
    image: Optional[str] = None

    class Config:
        schema_extra = {
            "example": {
                "fullname": "John Doe",
                "email": "jdoe@x.edu.ng",
                "password": "newpassword",
                "user_type": "Recruiter",
                "image": "https://example.com/newimage.jpg",
            }
        }

