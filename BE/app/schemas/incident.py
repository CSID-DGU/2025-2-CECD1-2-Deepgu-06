# app/schemas/incident.py
from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class IncidentCreate(BaseModel):
    cctv_id: int
    type: str
    start_time: datetime
    end_time: Optional[datetime] = None
    video_url: Optional[str] = None
    snapshot_url: Optional[str] = None


class IncidentOut(BaseModel):
    incident_id: int
    cctv_id: int
    type: str
    start_time: datetime
    end_time: Optional[datetime] = None
    video_url: Optional[str] = None
    snapshot_url: Optional[str] = None

    class Config:
        orm_mode = True
