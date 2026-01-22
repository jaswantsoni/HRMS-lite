from fastapi import APIRouter, HTTPException
from ..database import db, client

router = APIRouter()

@router.get("/")
async def health_check():
    """Health check endpoint to verify API and database connectivity"""
    try:
        # Ping MongoDB to check connection
        client.admin.command('ping')
        db_status = "connected"
    except Exception as e:
        db_status = "disconnected"
        raise HTTPException(status_code=503, detail=f"Database connection failed: {str(e)}")
    
    return {
        "status": "healthy",
        "api": "running",
        "database": db_status
    }
