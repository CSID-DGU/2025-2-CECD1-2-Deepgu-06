# app/db/session.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os

# DATABASE_URL이 없거나 연결 실패 시 SQLite 사용
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    # SQLite를 기본값으로 사용 (로컬 개발용)
    DATABASE_URL = "sqlite:///./local.db"

# SQLite인 경우 connect_args 추가
if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False}, pool_pre_ping=True)
else:
    engine = create_engine(DATABASE_URL, pool_pre_ping=True)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
