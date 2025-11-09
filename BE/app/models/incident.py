# app/models/incident.py
from sqlalchemy import BigInteger, Column, String, TIMESTAMP, ForeignKey, text

from app.db.base import Base


class Incident(Base):
    __tablename__ = "incidents"

    incident_id = Column(BigInteger, primary_key=True, autoincrement=True)
    cctv_id = Column(BigInteger, ForeignKey("cctv.cctv_id"), nullable=False)
    type = Column(String(50), nullable=False)
    start_time = Column(TIMESTAMP, nullable=False)
    end_time = Column(TIMESTAMP, nullable=True)
    video_url = Column(String(255), nullable=True)
    snapshot_url = Column(String(255), nullable=True)
    created_at = Column(TIMESTAMP, nullable=False, server_default=text("CURRENT_TIMESTAMP"))
