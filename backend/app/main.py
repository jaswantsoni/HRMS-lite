from fastapi import FastAPI
from .routes import employee, attendance, health
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="HRMS Lite API",
    description="Human Resource Management System Lite",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(health.router, prefix="/health", tags=["Health"])
app.include_router(employee.router, prefix="/employees", tags=["Employees"])
app.include_router(attendance.router, prefix="/attendance", tags=["Attendance"])
