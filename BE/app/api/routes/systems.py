# api/system.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.db.session import get_db

router = APIRouter(
    prefix="/api",
    tags=["System"]
)

@router.get("/health")
def health_check():
    return {"status": "ok"}

@router.get("/dbhealth")
def db_health_check(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))  # 간단한 연결 테스트
        return {"status": "ok"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database health check failed: {str(e)}")