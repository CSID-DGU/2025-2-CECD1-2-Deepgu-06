# app/schemas/incident.py
from datetime import datetime
from typing import Optional, Literal

from pydantic import BaseModel

class IncidentOut(BaseModel):
    incident_id: int
    cctv_id: int
    type: str
    start_time: datetime
    end_time: Optional[datetime]
    start_frame: int
    end_frame: Optional[int]
    explanation: Optional[str]
    status: str
    video_url: Optional[str]

    class Config:
        orm_mode = True
        
class IncidentEventIn(BaseModel):
    """
    워커가 보내는 start/end 이벤트 페이로드
    """
    event: Literal["start", "end"]
    cctv_id: int
    frame_idx: int
    timestamp: float   # worker의 time.time()
    explanation: Optional[str] = None


class IncidentOut(BaseModel):
    """
    프론트에서 조회할 때 쓰는 Incident 응답 모델
    """
    incident_id: int
    cctv_id: int
    type: str
    start_time: datetime
    end_time: Optional[datetime]
    start_frame: Optional[int]
    end_frame: Optional[int]
    explanation: Optional[str]
    status: Literal["OPEN", "CLOSED"]
    video_url: Optional[str]

    class Config:
        orm_mode = True
