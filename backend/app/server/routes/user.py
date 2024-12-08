from fastapi import APIRouter, HTTPException, Body, Depends
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel, EmailStr
import bcrypt
from app.server.database import get_db
from app.server.models.user import UserSchema, UpdateUserModel
from app.server.models.response import ResponseModel, ErrorResponseModel
from bson import ObjectId

router = APIRouter()

# Helper function to format MongoDB user response
def user_helper(user) -> dict:
    return {
        "id": str(user["_id"]),
        "fullname": user["fullname"],
        "email": user["email"],
        "user_type": user["user_type"],
        "image": user["image"],
    }

@router.get("/", response_description="All users retrieved successfully")
async def get_all_users(db=Depends(get_db)):
    users = await db.users.find().to_list(1000)  # Limit the number of users to 1000
    return ResponseModel([user_helper(user) for user in users], "Users retrieved successfully")

# Create User Route (Equivalent to createUser in tRPC)
@router.post("/", response_description="User created successfully")
async def create_user(user: UserSchema = Body(...), db=Depends(get_db)):
    user_dict = jsonable_encoder(user)
    existing_user = await db.users.find_one({"email": user.email})

    if existing_user:
        raise HTTPException(status_code=400, detail="User with this email already exists")

    hashed_password = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    new_user = {
        **user_dict,
        "password": hashed_password,
        "user_type": user.user_type or "",
    }

    user = await db.users.insert_one(new_user)
    new_user_data = await db.users.find_one({"_id": user.inserted_id})

    return ResponseModel(user_helper(new_user_data), "User created successfully")

# Get User by ID (Equivalent to getUserById in tRPC)
@router.get("/{user_id}", response_description="User data retrieved")
async def get_user_by_id(user_id: str, db=Depends(get_db)):
    user = await db.users.find_one({"_id": ObjectId(user_id)})

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return ResponseModel(user_helper(user), "User retrieved successfully")

# Get User by Email (Equivalent to getUserByEmail in tRPC)
@router.get("/email/{email}", response_description="User data retrieved")
async def get_user_by_email(email: str, db=Depends(get_db)):
    user = await db.users.find_one({"email": email})

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return ResponseModel(user_helper(user), "User retrieved successfully")

# Update User (Equivalent to updateUser in tRPC)
@router.put("/{user_id}", response_description="User updated successfully")
async def update_user(user_id: str, user: UpdateUserModel = Body(...), db=Depends(get_db)):
    data = user.model_dump(exclude_unset=True)

    if data.get("password"):
        data["password"] = bcrypt.hashpw(data["password"].encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    updated_user = await db.users.find_one_and_update(
        {"_id": ObjectId(user_id)},
        {"$set": data},
        return_document=True
    )

    if not updated_user:
        raise HTTPException(status_code=404, detail="User not found")

    return ResponseModel(user_helper(updated_user), "User updated successfully")

# Delete User (Equivalent to deleteUser in tRPC)
@router.delete("/{user_id}", response_description="User deleted successfully")
async def delete_user(user_id: str, db=Depends(get_db)):
    user = await db.users.find_one({"_id": ObjectId(user_id)})

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    await db.users.delete_one({"_id": ObjectId(user_id)})

    return ResponseModel({"id": user_id}, "User deleted successfully")
