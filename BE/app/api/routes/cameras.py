# app/api/routes/cameras.py
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.api import deps
from app.models.user import User, UserRole
from app.models.cctv import Cctv
from app.models.user_cctv import UserCctv
from app.schemas.cctv import CctvOut, CctvCreate

router = APIRouter(prefix="/cameras", tags=["cameras"])


# CCTV 목록 조회 (ADMIN: 전체, VIEWER: 권한 있는 것만)
@router.get("/", response_model=List[CctvOut])
def list_cameras(
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user),
):
    if current_user.role == UserRole.ADMIN:
        q = db.query(Cctv)
    else:
        q = (
            db.query(Cctv)
            .join(UserCctv, Cctv.cctv_id == UserCctv.cctv_id)
            .filter(UserCctv.user_id == current_user.user_id)
        )
    return q.all()


# CCTV 단건 조회
@router.get("/{cctv_id}", response_model=CctvOut)
def get_cctv(
    cctv_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user),
):
    if current_user.role == UserRole.ADMIN:
        q = db.query(Cctv).filter(Cctv.cctv_id == cctv_id)
    else:
        q = (
            db.query(Cctv)
            .join(UserCctv, Cctv.cctv_id == UserCctv.cctv_id)
            .filter(
                Cctv.cctv_id == cctv_id,
                UserCctv.user_id == current_user.user_id,
            )
        )

    cctv = q.first()
    if not cctv:
        raise HTTPException(status_code=404, detail="CCTV not found")

    return cctv


# CCTV 등록 (ADMIN 전용)
@router.post("/", response_model=CctvOut)
def create_cctv(
    payload: CctvCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user),
):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Admins only")

    cctv = Cctv(
        name=payload.name,
        location=payload.location,
        streaming_url=payload.streaming_url,
    )
    db.add(cctv)
    db.commit()
    db.refresh(cctv)
    return cctv


# 사용자–CCTV 매핑 (ADMIN 전용)
@router.post("/{cctv_id}/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def map_user_to_cctv(
    cctv_id: int,
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user),
):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Admins only")

    cctv = db.query(Cctv).filter(Cctv.cctv_id == cctv_id).first()
    if not cctv:
        raise HTTPException(status_code=404, detail="CCTV not found")

    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    existing = (
        db.query(UserCctv)
        .filter(UserCctv.user_id == user_id, UserCctv.cctv_id == cctv_id)
        .first()
    )
    if existing:
        # 이미 매핑돼 있으면 그냥 204로 끝
        return

    mapping = UserCctv(user_id=user_id, cctv_id=cctv_id)
    db.add(mapping)
    db.commit()
