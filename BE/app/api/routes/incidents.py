# app/api/routes/incidents.py

from typing import Optional, Literal, List
from datetime import datetime, timezone

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.incident import Incident as IncidentModel   # ★ ORM 모델
from app.schemas.incident import IncidentEventIn, IncidentOut  # ★ Pydantic 스키마

router = APIRouter(
    prefix="/incidents",   # cameras와 스타일 맞춤: /api/incidents
    tags=["Incidents"],
)


@router.post("/events")
def handle_incident_event(
    ev: IncidentEventIn,
    db: Session = Depends(get_db),
):
    """
    worker에서 보내는 start/end 이벤트 처리.
    - event == "start": 새로운 이상행동 구간 시작 (INSERT)
    - event == "end": 해당 cctv의 마지막 OPEN incident 종료 (UPDATE)
    """
    ts = datetime.fromtimestamp(ev.timestamp, tz=timezone.utc)

    if ev.event == "start":
        # 이미 OPEN 상태가 있으면 중복 start 막기
        open_incident = (
            db.query(IncidentModel)
            .filter(
                IncidentModel.cctv_id == ev.cctv_id,
                IncidentModel.status == "OPEN",
            )
            .order_by(IncidentModel.start_time.desc())
            .first()
        )
        if open_incident:
            return {
                "ok": True,
                "message": "incident already open",
                "incident_id": open_incident.incident_id,
            }

        now = datetime.now(timezone.utc)

        new_incident = IncidentModel(
            cctv_id=ev.cctv_id,
            type="ANOMALY",          # 나중에 VIOLENCE, FALL 등으로 확장 가능
            start_time=ts,
            end_time=None,
            start_frame=ev.frame_idx,
            end_frame=None,
            explanation=ev.explanation,
            status="OPEN",
            video_url=None,
            created_at=now,
            updated_at=now,
        )
        db.add(new_incident)
        db.commit()
        db.refresh(new_incident)

        return {
            "ok": True,
            "message": "incident started",
            "incident_id": new_incident.incident_id,
        }

    elif ev.event == "end":
        open_incident = (
            db.query(IncidentModel)
            .filter(
                IncidentModel.cctv_id == ev.cctv_id,
                IncidentModel.status == "OPEN",
            )
            .order_by(IncidentModel.start_time.desc())
            .first()
        )
        if not open_incident:
            return {"ok": False, "message": "no open incident for this cctv"}

        open_incident.end_time = ts
        open_incident.end_frame = ev.frame_idx
        open_incident.status = "CLOSED"
        open_incident.updated_at = datetime.now(timezone.utc)

        db.commit()

        return {
            "ok": True,
            "message": "incident ended",
            "incident_id": open_incident.incident_id,
        }

    else:
        return {"ok": False, "message": "invalid event type"}
