import os
import motor.motor_asyncio
from bson.objectid import ObjectId
from dotenv import load_dotenv

load_dotenv()

# Create a new client and connect to the server
client = motor.motor_asyncio.AsyncIOMotorClient(os.getenv("MONGO_URI"))
db = client.get_database("career-fit-ai")

def get_db():
    return db
