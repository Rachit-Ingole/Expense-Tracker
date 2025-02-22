from fastapi import FastAPI, File, UploadFile
import os
import OCR
import time

app = FastAPI()


@app.get("/")
async def home():
    return {"Data": "Home"}


@app.post("/upload/")
async def upload_image(image: UploadFile = File(...)):
    image.filename = "/Users/rishitbaitule/PycharmProjects/Expense-Tracker/images/img.png"
    contents = await image.read()

    with open(f"{image.filename}", "wb") as f:
        f.write(contents)
        cost = OCR.scan(image.filename)
    os.remove(image.filename)
    return {"filename": image.filename, "cost": cost}

