# app/models/user.py
from sqlalchemy import Column, BigInteger, String, Enum, TIMESTAMP, text
from app.db.base import Base
import enum

class UserRole(str, enum.Enum):
    ADMIN = "ADMIN"
    VIEWER = "VIEWER"

class User(Base):
    __tablename__ = "user"

    user_id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    name = Column(String(20), nullable=False)
    email = Column(String(100), nullable=False, unique=True, index=True)
    password = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), nullable=False, server_default="VIEWER")
    created_at = Column(TIMESTAMP, server_default=text("CURRENT_TIMESTAMP"))
