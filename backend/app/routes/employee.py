from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from ..utils import serialize_doc
from pymongo import MongoClient
from ..database import db

# Connect to MongoDB (replace with your Mongo URI)
# client = MongoClient("mongodb://localhost:27017")
# db = client.hrms_lite
collection = db.employees

router = APIRouter()

# Pydantic model
class Employee(BaseModel):
    employee_id: str
    full_name: str
    email: EmailStr
    department: str

@router.post("/")
async def add_employee(employee: Employee):
    # Check duplicate
    if collection.find_one({"employee_id": employee.employee_id}):
        raise HTTPException(status_code=400, detail="Employee already exists")
    result = collection.insert_one(employee.dict())
    return {"message": "Employee added", "id": str(result.inserted_id)}

@router.get("/")
async def list_employees(page: int = None, limit: int = None):
    query = collection.find()
    
    # Apply pagination if params provided
    if page is not None and limit is not None:
        skip = (page - 1) * limit
        query = query.skip(skip).limit(limit)
        total = collection.count_documents({})
        employees = [serialize_doc(emp) for emp in query]
        return {
            "total": total,
            "page": page,
            "limit": limit,
            "employees": employees
        }
    
    employees = [serialize_doc(emp) for emp in query]
    return employees

@router.get("/search")
async def search_employees(employee_id: str = None, full_name: str = None, email: str = None):
    """Search employees by employee_id, full_name (partial, case-insensitive), or email"""
    query = {}
    
    if employee_id:
        query["employee_id"] = employee_id
    if full_name:
        query["full_name"] = {"$regex": full_name, "$options": "i"}
    if email:
        query["email"] = email
    
    if not query:
        raise HTTPException(status_code=400, detail="At least one search parameter required")
    
    employees = [serialize_doc(emp) for emp in collection.find(query)]
    return employees

@router.get("/{employee_id}")
async def get_employee(employee_id: str):
    """Get a single employee by employee_id"""
    employee = collection.find_one({"employee_id": employee_id})
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    return serialize_doc(employee)

@router.delete("/{employee_id}")
async def delete_employee(employee_id: str):
    result = collection.delete_one({"employee_id": employee_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Employee not found")
    return {"message": "Employee deleted"}
