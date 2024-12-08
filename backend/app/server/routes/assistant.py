from fastapi import APIRouter, Depends, HTTPException
from openai import OpenAI
from dotenv import load_dotenv
import os
from app.server.models.assistant import UserMessages, Invite, CoverLetter
from app.server.database import get_db
from bson import ObjectId

load_dotenv()

router = APIRouter()

system_prompt = {
    "role": "system",
    "content": "Your are a career assistant. You are helping the candidates and recruiters to find the best match for their job requirements and also helping them to find the best job opportunities. You are also helping the candidates to prepare for the interviews and helping the recruiters to find the best candidates for their job requirements. CHANGE YOUR GUIDES BASED ON THE USER TYPE IF IT'S A CANDIDATE OR RECRUITER. ALL THE SUGGESTIONS SHOULD BU CUSTOMIZED TO THE BASED ON THE USER PROFILE DATA. MAKE THE ANSWER SHOW AND CONSIZE"
}

# Route to get response from OpenAI API
@router.post("/", response_description="Assistant response")
async def get_assistant_response(user_messages: UserMessages):
    try:
        messages = [system_prompt] + user_messages.model_dump()["messages"]
        client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages,
            max_tokens=150,
            temperature=0.7
        )
        assistant_response = response.choices[0].message.content
        return {"response": assistant_response}
    except Exception as e:
        print("eror")
        raise HTTPException(status_code=500, detail=f"OpenAI API error: {str(e)}")

# Generate a candidate invite by the recruiter using the candidate and the recruiter ids
@router.post("/invite", response_description="Candidate invite generated successfully")
async def generate_invite(info: Invite, db=Depends(get_db)):
    candidate = await db.candidates.find_one({"_id": ObjectId(info.candidate_id)})
    recruiter = await db.recruiter_profiles.find_one({"_id": ObjectId(info.recruiter_id)})
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    if not recruiter:
        raise HTTPException(status_code=404, detail="Recruiter not found")

    try:
        client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": "You are a recruiter. You are inviting a candidate for an interview. You need to provide the candidate with the details of the interview and the job requirements. You should also ask the candidate about their availability and any other relevant information."
                },
                {
                    "role": "user",
                    "content": f"Here's the candidate data {candidate} and my data {recruiter}. Please generate an invite for the candidate."
                }
            ],
            temperature=0.7
        )
        assistant_response = response.choices[0].message.content
        return {"response": assistant_response}
    except Exception as e:
        print("eror")
        raise HTTPException(status_code=500, detail=f"OpenAI API error: {str(e)}")

@router.post("/cover-letter", response_description="Cover letter generated successfully")
async def generate_cover_letter(info: CoverLetter, db=Depends(get_db)):
    candidate = await db.candidates.find_one({"_id": ObjectId(info.candidate_id)})
    job_listing = await db.job_listings.find_one({"_id": ObjectId(info.jobListing_id)})
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    if not job_listing:
        raise HTTPException(status_code=404, detail="Job listing not found")
    cover_letter = {
        "candidate": candidate,
        "job_listing": job_listing
    }

    try:
        client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": "You are a candidate. You are applying for a job. You need to write a cover letter for the job application. You should introduce yourself, explain why you are a good fit for the job, and express your interest in the position."
                },
                {
                    "role": "user",
                    "content": f"Here's the candidate data {candidate} and the job listing data {job_listing}. Please generate a cover letter for the candidate."
                }
            ],
            temperature=0.7
        )
        assistant_response = response.choices[0].message.content
        return {"response": assistant_response}
    except Exception as e:
        print("eror")
        raise HTTPException(status_code=500, detail=f"OpenAI API error: {str(e)}")