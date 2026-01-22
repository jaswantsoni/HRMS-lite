from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ..utils import serialize_doc
from pymongo import MongoClient
from ..database import db
# # MongoDB connection
# client = MongoClient("mongodb://localhost:27017")
# db = client.hrms_lite
collection = db.attendance

router = APIRouter()

class Attendance(BaseModel):
    employee_id: str
    date: str   # YYYY-MM-DD
    status: str # "Present" or "Absent"

@router.post("/")
async def mark_attendance(record: Attendance):
    # Optional: check if employee exists
    db_record = record.dict()
    collection.insert_one(db_record)
    return {"message": "Attendance marked"}

@router.get("/")
async def list_attendance(employee_id: str = None, date: str = None):
    """List attendance records with optional filters for employee_id and/or date"""
    query = {}
    if employee_id:
        query["employee_id"] = employee_id
    if date:
        query["date"] = date
    
    records = [serialize_doc(rec) for rec in collection.find(query)]
    return records

@router.get("/summary/{date}")
async def attendance_summary(date: str):
    """Get attendance summary for a specific date (total present and absent)"""
    total_present = collection.count_documents({"date": date, "status": {"$regex": "^present$", "$options": "i"}})
    total_absent = collection.count_documents({"date": date, "status": {"$regex": "^absent$", "$options": "i"}})
    
    return {
        "date": date,
        "total_present": total_present,
        "total_absent": total_absent
    }
