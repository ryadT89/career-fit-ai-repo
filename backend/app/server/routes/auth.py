from fastapi import APIRouter, Body, Depends, HTTPException
from app.server.auth import hash_password, verify_password, create_access_token, verify_token
from app.server.models.user import UserSchema, LoginUserSchema
from app.server.models.response import ResponseModel, ErrorResponseModel
from app.server.database import get_db
from app.server.auth import SECRET_KEY
from fastapi.security import OAuth2PasswordBearer
from datetime import timedelta
from bson import ObjectId

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

# Registration route
@router.post("/register", response_description="User registered successfully")
async def register(user: UserSchema = Body(...), db=Depends(get_db)):
    # Check if user already exists
    existing_user = await db.users.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already in use")

    print(user)

    # Hash password
    hashed_password = hash_password(user.password)

    # Create the user
    user_data = user.dict(exclude={"password"})
    user_data["password"] = hashed_password

    new_user = await db.users.insert_one(user_data)
    user_id = new_user.inserted_id

    # Generate JWT token
    access_token = create_access_token({"sub": str(user_id)})

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": str(user_id)
    }

# Login route
@router.post("/login", response_description="Login successful")
async def login(user: LoginUserSchema = Body(...), db=Depends(get_db)):
    # Check if user exists
    existing_user = await db.users.find_one({"email": user.email})
    if not existing_user:
        raise HTTPException(status_code=400, detail="Invalid credentials")

    # Verify password
    if not verify_password(user.password, existing_user["password"]):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    # Generate JWT token with user ID in payload
    user_id = existing_user["_id"]
    access_token = create_access_token({"sub": str(user_id)})

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": str(user_id)
    }

# Protected route example (using the JWT token to access)
@router.get("/validate-token")
async def validate_token_route(token: str = Depends(oauth2_scheme), db=Depends(get_db)):
    # Verify token and decode it
    payload = verify_token(token)
    user_id = payload.get("sub")

    # Retrieve user from DB
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return ResponseModel(data={"user": {"id": str(user['_id']), "userType": user["user_type"]}}, message="Protected route accessed successfully")
