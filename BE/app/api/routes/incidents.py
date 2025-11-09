# app/api/routes/incidents.py
from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.api import deps
from app.models.user import User, UserRole
from app.models.incident import Incident
from app.models.user_cctv import UserCctv
from app.schemas.incident import IncidentCreate, IncidentOut

router = APIRouter(prefix="/incidents", tags=["incidents"])


@router.post("/", response_model=IncidentOut)
def create_incident(payload: IncidentCreate, db: Session = Depends(get_db)):
    incident = Incident(**payload.dict())
    db.add(incident)
    db.commit()
    db.refresh(incident)
    return incident


@router.get("/", response_model=List[IncidentOut])
def list_incidents(
    cctv_id: Optional[int] = None,
    type: Optional[str] = None,
    from_time: Optional[datetime] = Query(None, alias="from"),
    to_time: Optional[datetime] = Query(None, alias="to"),
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user),
):
    q = db.query(Incident)

    if current_user.role != UserRole.ADMIN:
        allowed_cctv_ids = (
            db.query(UserCctv.cctv_id)
            .filter(UserCctv.user_id == current_user.user_id)
            .subquery()
        )
        q = q.filter(Incident.cctv_id.in_(allowed_cctv_ids))

    if cctv_id is not None:
        q = q.filter(Incident.cctv_id == cctv_id)
    if type is not None:
        q = q.filter(Incident.type == type)
    if from_time is not None:
        q = q.filter(Incident.start_time >= from_time)
    if to_time is not None:
        q = q.filter(Incident.start_time <= to_time)

    return q.order_by(Incident.start_time.desc()).all()


# 사건 상세 조회
@router.get("/{incident_id}", response_model=IncidentOut)
def get_incident(
    incident_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user),
):
    q = db.query(Incident).filter(Incident.incident_id == incident_id)

    if current_user.role != UserRole.ADMIN:
        allowed_cctv_ids = (
            db.query(UserCctv.cctv_id)
            .filter(UserCctv.user_id == current_user.user_id)
            .subquery()
        )
        q = q.filter(Incident.cctv_id.in_(allowed_cctv_ids))

    incident = q.first()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")

    return incident
