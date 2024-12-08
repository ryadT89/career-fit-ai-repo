from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.server.routes.user import router as UserRouter
from app.server.routes.auth import router as AuthRouter
from app.server.routes.candidate import router as CandidateRouter
from app.server.routes.recruiter import router as RecruiterRouter
from app.server.routes.invitation import router as InvitationRouter
from app.server.routes.joblisting import router as JobListingRouter
from app.server.routes.application import router as ApplicationRouter
from app.server.routes.upload import router as UploadRouter
from app.server.routes.assistant import router as AssistantRouter

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

app.include_router(UserRouter, tags=["User"], prefix="/user")
app.include_router(AuthRouter, tags=["Auth"], prefix="/auth")
app.include_router(CandidateRouter, tags=["Candidate"], prefix="/candidate")
app.include_router(RecruiterRouter, tags=["Recruiter"], prefix="/recruiter")
app.include_router(InvitationRouter, tags=["Invitation"], prefix="/invitation")
app.include_router(JobListingRouter, tags=["JobListing"], prefix="/joblisting")
app.include_router(ApplicationRouter, tags=["Application"], prefix="/application")
app.include_router(UploadRouter, tags=["Upload"], prefix="/upload")
app.include_router(AssistantRouter, tags=["Assistant"], prefix="/assistant")
