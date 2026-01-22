from pydantic import BaseModel, EmailStr
from typing import Optional

# Employee schema
class EmployeeBase(BaseModel):
    employee_id: str
    full_name: str
    email: EmailStr
    department: str

# Attendance schema
class AttendanceBase(BaseModel):
    employee_id: str
    date: str   # YYYY-MM-DD
    status: str # Present / Absent

# Optional response models
class EmployeeResponse(EmployeeBase):
    id: str

class AttendanceResponse(AttendanceBase):
    id: str
