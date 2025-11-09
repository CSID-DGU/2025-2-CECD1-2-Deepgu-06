# app/models/cctv.py
import enum

from sqlalchemy import BigInteger, Column, String, Enum, TIMESTAMP, text

from app.db.base import Base


class CctvStatus(str, enum.Enum):
    ACTIVE = "ACTIVE"
    INACTIVE = "INACTIVE"


class Cctv(Base):
    __tablename__ = "cctv"

    cctv_id = Column(BigInteger, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    location = Column(String(255), nullable=False)
    streaming_url = Column(String(255), nullable=False)
    status = Column(Enum(CctvStatus), nullable=False, server_default="ACTIVE")
    created_at = Column(TIMESTAMP, nullable=False, server_default=text("CURRENT_TIMESTAMP"))
