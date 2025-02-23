from fastapi import FastAPI, HTTPException, Body
import os
from dotenv import load_dotenv
from models import User,Record # import the user model defined by us
from motor.motor_asyncio import AsyncIOMotorClient
from contextlib import asynccontextmanager
from typing import List 
from pydantic import BaseModel # Most widely used data validation library for python

load_dotenv()

from fastapi.middleware.cors import CORSMiddleware


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Start the database connection
    await startup_db_client(app)
    yield
    # Close the database connection
    await shutdown_db_client(app)

# method for start the MongoDb Connection
async def startup_db_client(app):
    app.mongodb_client = AsyncIOMotorClient(os.getenv("MONGODB_URL"))
    app.mongodb = app.mongodb_client.get_database("Database")
    print("MongoDB connected.")

# method to close the database connection
async def shutdown_db_client(app):
    app.mongodb_client.close()
    print("Database disconnected.")

# creating a server with python FastAPI
app = FastAPI(lifespan=lifespan)


origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def read_root():  # function that is binded with the endpoint
    return {"Hello": "World"}

class loginInfo(BaseModel):
    email_address:str
    password: str

@app.post("/api/v1/auth/login", response_model=User)
async def login_user(userInfo: loginInfo = Body(...)):
    user = await app.mongodb["users"].find_one({"email_address": userInfo.email_address})
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    if user["password"] == userInfo.password:
        return user
    else:
        raise HTTPException(status_code=404, detail="username/password incorrect")


@app.post("/api/v1/auth/register", response_model=User)
async def register_user(user: User):
    exists = await app.mongodb["users"].find_one({"email_address": user.email_address})
    if exists:
        raise HTTPException(status_code=404, detail="email already exists")
    result = await app.mongodb["users"].insert_one(user.dict())
    inserted_user = await app.mongodb["users"].find_one({"_id": result.inserted_id})
    return inserted_user


@app.post("/api/v1/createrecord",response_model=Record)
async def create_record(record: Record):
    result = await app.mongodb["record"].insert_one(record.dict())
    inserted_record = await app.mongodb["record"].find_one({"_id": result.inserted_id})
    return inserted_record


class EmailInput(BaseModel):
    email_address:str
    password:str


@app.post("/api/v1/getrecords",response_model=List[Record])
async def get_all_records(email: EmailInput):
    user = await app.mongodb["users"].find_one({"email_address": email.email_address})
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    if user["password"] != email.password:
        raise HTTPException(status_code=404, detail="username/password incorrect")

    records = await app.mongodb["record"].find({"email_address": email.email_address}).to_list(None)
    return records

@app.delete("/api/v1/deleterecord") 
async def delete_record(record: Record):
    deleted_result = app.mongodb["record"].delete_one(record)
    if deleted_result.deleted_count == 1:
        return {"message": "User deleted successfully"}
    else:
        return {"message": "User not found"}

# C <=== Create
@app.post("/api/v1/create-user", response_model=User)
async def insert_user(user: User):
    result = await app.mongodb["users"].insert_one(user.dict())
    inserted_user = await app.mongodb["users"].find_one({"_id": result.inserted_id})
    return inserted_user

# R <=== Read
# Read all users
@app.get("/api/v1/read-all-users", response_model=List[User])
async def read_users():
    users = await app.mongodb["users"].find().to_list(None)
    return users

# Read one user by email_address
@app.get("/api/v1/read-user/{email_address}", response_model=User)
async def read_user_by_email(email_address: str):
    user = await app.mongodb["users"].find_one({"email_address": email_address})
    
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

