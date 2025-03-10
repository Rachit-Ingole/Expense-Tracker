import os
import smtplib
import time
from contextlib import asynccontextmanager
from datetime import datetime
from email.mime.text import MIMEText
from typing import List

from dotenv import load_dotenv
from models import User,Record,Budget,RecordWithPassword,BudgetWithPassword, UserWithNewPassword, UserWithNewUsername, loginInfo
from fastapi import FastAPI, HTTPException, Body, File, UploadFile, Form, BackgroundTasks
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel

from OCR import scan 
from models import User

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
async def read_root(): 
    return {"Hello": "World"}

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
    email_regex = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
    if(re.match(email_regex, email)):
        exists = await app.mongodb["users"].find_one({"email_address": user.email_address})
        if exists:
            raise HTTPException(status_code=404, detail="email already exists")
        result = await app.mongodb["users"].insert_one(user.dict())
        inserted_user = await app.mongodb["users"].find_one({"_id": result.inserted_id})
        return inserted_user
    else:
        raise HTTPException(status_code=404, detail="Email is invalid")

@app.post("/api/v1/createrecord",response_model=Record)
async def create_record(record: RecordWithPassword):
    record = record.dict()
    try:
        if float(record["amount"]) <= 0:
            return {"not valid input"}
    except e:
        raise HTTPException(status_code=400,detail="Amount must be positive number")

    user = await app.mongodb["users"].find_one({"email_address": record['email_address']})
    
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    if user["password"] != record['password']:
        raise HTTPException(status_code=404, detail="username/password incorrect")
    
    record.pop("password",None)

    result = await app.mongodb["record"].insert_one(record)
    inserted_record = await app.mongodb["record"].find_one({"_id": result.inserted_id})
    return inserted_record

@app.post("/api/v1/createbudget",response_model=Budget)
async def create_budget(budget: BudgetWithPassword):
    budget = budget.dict()
    try:
        if float(budget["budget"]) <= 0:
            return {"not valid input"}
    except e:
        return {e}
    
    user = await app.mongodb["users"].find_one({"email_address": budget["email_address"]})
    
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    if user["password"] != budget['password']:
        raise HTTPException(status_code=404, detail="username/password incorrect")

    exists = await app.mongodb["budget"].find_one({"email_address":budget["email_address"],"month":budget["month"],"year":budget["year"],"category":budget["category"]})

    if(exists != None):
        newBudget = await app.mongodb["budget"].find_one_and_update({"email_address":budget["email_address"],"month":budget["month"],"year":budget["year"],"category":budget["category"]}, {"$set": {"budget":budget["budget"]}})
        return newBudget
    

    budget.pop("password",None)

    result = await app.mongodb["budget"].insert_one(budget)
    inserted_budget = await app.mongodb["budget"].find_one({"_id": result.inserted_id})
    return inserted_budget

@app.post("/api/v1/getbudgets",response_model=List[Budget])
async def get_all_budgets(email: loginInfo):
    user = await app.mongodb["users"].find_one({"email_address": email.email_address})
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    if user["password"] != email.password:
        raise HTTPException(status_code=404, detail="username/password incorrect")

    budgets = await app.mongodb["budget"].find({"email_address": email.email_address}).to_list(None)
    return budgets

@app.post("/api/v1/getrecords",response_model=List[Record])
async def get_all_records(email: loginInfo):
    user = await app.mongodb["users"].find_one({"email_address": email.email_address})
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    if user["password"] != email.password:
        raise HTTPException(status_code=404, detail="username/password incorrect")

    records = await app.mongodb["record"].find({"email_address": email.email_address}).to_list(None)
    return records

@app.delete("/api/v1/deletebudget") 
async def delete_budget(budget: BudgetWithPassword = Body(...)):
    user = await app.mongodb["users"].find_one({"email_address": budget.email_address})
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    if user["password"] != budget.password:
        raise HTTPException(status_code=404, detail="username/password incorrect")

    budget = budget.dict()
    budget.pop('password',None)

    deleted_result = await app.mongodb["budget"].delete_one(budget)
    if deleted_result.deleted_count == 1:
        return {"message": "Record deleted successfully"}
    else:
        return {"message": "Record not found"}

@app.delete("/api/v1/deleterecord") 
async def delete_record(record: RecordWithPassword = Body(...)):
    user = await app.mongodb["users"].find_one({"email_address": record.email_address})
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    if user["password"] != record.password:
        raise HTTPException(status_code=404, detail="username/password incorrect")

    record = record.dict()
    record.pop('password',None)

    deleted_result = await app.mongodb["record"].delete_one(record)
    if deleted_result.deleted_count == 1:
        return {"message": "Record deleted successfully"}
    else:
        return {"message": "Record not found"}

@app.patch("/api/v1/changepassword",response_model=User)
async def change_password(user: UserWithNewPassword):
    user = user.dict()
    returneduser = await app.mongodb["users"].find_one({"email_address": user["email_address"]})
    if returneduser is None:
        raise HTTPException(status_code=404, detail="User not found")
    if returneduser["password"] != user["password"]:
        raise HTTPException(status_code=404, detail="username/password incorrect")

    newUser = await app.mongodb["users"].find_one_and_update({"email_address":user["email_address"]}, {"$set": {"password":user["newPassword"]}})

    newUser["password"] = user["newPassword"]
    return newUser

@app.patch("/api/v1/changeusername",response_model=User)
async def change_password(user: UserWithNewUsername):
    user = user.dict()
    returneduser = await app.mongodb["users"].find_one({"email_address": user["email_address"]})
    if returneduser is None:
        raise HTTPException(status_code=404, detail="User not found")
    if returneduser["password"] != user["password"]:
        raise HTTPException(status_code=404, detail="username/password incorrect")

    newUser = await app.mongodb["users"].find_one_and_update({"email_address":user["email_address"]}, {"$set": {"username":user["newUsername"]}})

    newUser["username"] = user["newUsername"]
    return newUser

# ocr
from pathlib import Path
UPLOAD_DIRECTORY = "uploads/"
@app.post("/api/v1/upload")
async def upload_image(image: UploadFile = File(...)):
    Path(UPLOAD_DIRECTORY).mkdir(parents=True, exist_ok=True)
    file_location = Path(UPLOAD_DIRECTORY) / image.filename
    contents = await image.read()

    with open(f"{file_location}", "wb") as f:
        f.write(contents)
        cost = scan(file_location)
    os.remove(file_location)
    return {"filename": image.filename, "cost": cost}

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


@app.post("/api/v1/schedule-email/")
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
