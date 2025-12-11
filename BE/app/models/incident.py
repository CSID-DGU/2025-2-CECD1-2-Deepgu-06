# app/models/incident.py
from sqlalchemy import (
    Column,
    BigInteger,
    Integer,
    String,
    DateTime,
    Text,
    Enum,
    ForeignKey,
)
from sqlalchemy.orm import relationship

from app.db.base import Base  # 프로젝트에서 쓰는 Base

class Incident(Base):
    __tablename__ = "incidents"

    incident_id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    cctv_id = Column(BigInteger, ForeignKey("cctv.cctv_id"), nullable=False)

    type = Column(String(20), nullable=False)  # 예: 'ANOMALY', 'VIOLENCE', ...
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=True)

    start_frame = Column(Integer, nullable=True)
    end_frame = Column(Integer, nullable=True)
    explanation = Column(Text, nullable=True)
    status = Column(Enum("OPEN", "CLOSED", name="incident_status"), nullable=False, default="OPEN")

    video_url = Column(String(255), nullable=True)

    created_at = Column(DateTime, nullable=False)
    updated_at = Column(DateTime, nullable=False)

    # 필요하면 역관계
    cctv = relationship("Cctv", backref="incidents")
