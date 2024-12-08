from pydantic import BaseModel, Field
from typing import Optional
import time
from datetime import datetime

# Schema for Invitation creation
class InvitationSchema(BaseModel):
    recruiterId: str = Field(..., example=1)
    candidateId: str = Field(..., example=1)
    message: str = Field(..., example="We would like to invite you for an interview.")
    invitedAt: Optional[float] = Field(default=datetime.now().timestamp())

    class Config:
        schema_extra = {
            "example": {
                "recruiterId": "id1",
                "candidateId": "id2",
                "message": "We would like to invite you for an interview."
            }
        }

# Schema for updating Invitation (optional fields)
class InvitationUpdate(BaseModel):
    recruiterId: Optional[str] = Field(None, example=1)
    candidateId: Optional[str] = Field(None, example=1)
    message: Optional[str] = Field(None, example="We would like to invite you for an interview.")

    class Config:
        schema_extra = {
            "example": {
                "recruiterId": "id1",
                "candidateId": "id2",
                "message": "We would like to invite you for an interview."
            }
        }

