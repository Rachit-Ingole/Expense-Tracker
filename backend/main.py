import os
import smtplib
import time
from contextlib import asynccontextmanager
from datetime import datetime
from email.mime.text import MIMEText
from typing import List

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Body, File, UploadFile, Form, BackgroundTasks
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel  # Most widely used data validation library for python

from OCR import scan  # imports user defined scan func for reading bills
from models import User  # import the user model defined by us

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
    email_address: str
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


# ocr
@app.post("/upload/")
async def upload_image(image: UploadFile = File(...)):
    image.filename = "/Users/rishitbaitule/PycharmProjects/Expense-Tracker/images/img.png"
    contents = await image.read()

    with open(f"{image.filename}", "wb") as f:
        f.write(contents)
        cost = scan(image.filename)
    os.remove(image.filename)
    return {"filename": image.filename, "cost": cost}


load_dotenv('creds.env')

# Load environment variables
SMTP_EMAIL = os.getenv("SMTP_EMAIL")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
SMTP_SERVER = os.getenv("SMTP_SERVER")
SMTP_PORT = int(os.getenv("SMTP_PORT"))


def send_email(recipient: str, subject: str, message: str):
    try:
        # SMTP SERVER SETUP
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(SMTP_EMAIL, SMTP_PASSWORD)

        # Create email
        msg = MIMEText(message)
        msg["From"] = SMTP_EMAIL
        msg["To"] = recipient
        msg["Subject"] = subject

        # SEND MAIL
        server.sendmail(SMTP_EMAIL, recipient, msg.as_string())
        server.quit()

        print(f"Email sent to {recipient} at {datetime.now()}")
    except smtplib.SMTPException as e:
        print(f"Email sending failed: {str(e)}")


def schedule_email(recipient: str, subject: str, remind_of: str, scheduled_datetime: str):
    scheduled_time = datetime.strptime(scheduled_datetime, "%d-%m-%Y %H:%M")

    # Calculate delay
    delay = (scheduled_time - datetime.now()).total_seconds()

    if delay > 0:
        print(f"Waiting {delay:.2f} seconds to send email at {scheduled_datetime}...")
        time.sleep(delay)

    send_email(recipient, subject, remind_of)


@app.post("/schedule-email/")
def schedule_email_api(
        background_tasks: BackgroundTasks,
        recipient: str = Form(...),
        subject: str = "BILL PAYMENT EMAIL REMINDER",
        remind_of: str = Form(...),
        schedule_datetime: str = Form(...)  # Format: DD-MM-YYYY HH:MM
):
    try:
        scheduled_time = datetime.strptime(schedule_datetime, "%d-%m-%Y %H:%M")
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use DD-MM-YYYY HH:MM")
    message = f"Reminder to pay {remind_of} bill.\nAutomated Message sent by PennyWise"
    # Validate future date/time
    if scheduled_time < datetime.now():
        raise HTTPException(status_code=400, detail="Scheduled time must be in the future.")

    # Schedule email in the background
    background_tasks.add_task(schedule_email, recipient, subject, message, schedule_datetime)

    return {"Message": "Email scheduled successfully", "scheduled_datetime": schedule_datetime}
