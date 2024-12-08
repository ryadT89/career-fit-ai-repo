from pydantic import BaseModel, Field
from typing import List, Dict

class UserMessages(BaseModel):
    messages: List[Dict[str, str]] = Field(..., example=[{"role": "system", "content": "Hello, how can I help you today?"}])

    class Config:
        schema_extra = {
            "example": {
                "messages": [
                    {
                        "role": "system",
                        "content": "Hello, how can I help you today?"
                    }
                ]
            }
        }

class Invite(BaseModel):
    candidate_id: str = Field(..., example="candidate_id_1234")
    recruiter_id: str = Field(..., example="recruiter_id_1234")

    class Config:
        schema_extra = {
            "example": {
                "candidate_id": "candidate_id_1234",
                "recruiter_id": "recruiter_id_1234"
            }
        }

class CoverLetter(BaseModel):
    candidate_id: str = Field(..., example="candidate_id_1234")
    jobListing_id: str = Field(..., example="job_id_1234")

    class Config:
        schema_extra = {
            "example": {
                "candidate_id": "candidate_id_1234",
                "jobListing_id": "job_id_1234"
            }
        }