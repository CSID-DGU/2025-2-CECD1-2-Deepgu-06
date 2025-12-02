# app/api/routes/upload.py
from datetime import datetime
from typing import List, Optional
import os
import shutil
import json

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Query
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.incident import Incident
from app.models.cctv import Cctv
from app.schemas.incident import IncidentOut

router = APIRouter(prefix="/upload", tags=["upload"])

# 업로드된 파일을 저장할 디렉토리
UPLOAD_DIR = os.getenv("UPLOAD_DIR", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

# 메타데이터 저장 파일 (DB 연결 실패 시 사용)
METADATA_FILE = os.path.join(UPLOAD_DIR, "metadata.json")


def get_or_create_cctv(db: Session):
    """CCTV를 가져오거나 생성합니다."""
    try:
        cctv = db.query(Cctv).first()
        if not cctv:
            from app.models.cctv import CctvStatus
            cctv = Cctv(
                name="기본 CCTV",
                location="기본 위치",
                streaming_url="http://localhost",
                status=CctvStatus.ACTIVE,
            )
            db.add(cctv)
            db.commit()
            db.refresh(cctv)
        return cctv.cctv_id
    except Exception:
        # DB 연결 실패 시 기본값 반환
        db.rollback()
        return 1


def save_metadata_to_file(incident_data: dict):
    """메타데이터를 JSON 파일에 저장합니다 (DB 연결 실패 시)."""
    try:
        if os.path.exists(METADATA_FILE):
            with open(METADATA_FILE, "r", encoding="utf-8") as f:
                metadata = json.load(f)
        else:
            metadata = []
        
        metadata.append(incident_data)
        
        with open(METADATA_FILE, "w", encoding="utf-8") as f:
            json.dump(metadata, f, ensure_ascii=False, indent=2, default=str)
    except Exception as e:
        print(f"메타데이터 파일 저장 실패: {e}")


def load_metadata_from_file() -> List[dict]:
    """메타데이터를 JSON 파일에서 불러옵니다."""
    try:
        if os.path.exists(METADATA_FILE):
            with open(METADATA_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        return []
    except Exception as e:
        print(f"메타데이터 파일 로드 실패: {e}")
        return []


@router.get("/video", response_model=List[dict])
def list_uploaded_videos(
    cctv_id: Optional[int] = Query(None, description="CCTV ID로 필터링"),
    limit: Optional[int] = Query(10, ge=1, le=100, description="조회할 최대 개수"),
    offset: Optional[int] = Query(0, ge=0, description="건너뛸 개수"),
    db: Session = Depends(get_db),
):
    """
    업로드된 영상 목록을 조회합니다.
    
    - type이 "uploaded"인 Incident만 조회
    - cctv_id로 필터링 가능
    - 최신순으로 정렬
    - DB 연결 실패 시 파일 메타데이터에서 조회
    """
    try:
        q = db.query(Incident).filter(Incident.type == "uploaded")
        
        if cctv_id is not None:
            q = q.filter(Incident.cctv_id == cctv_id)
        
        incidents = q.order_by(Incident.start_time.desc()).offset(offset).limit(limit).all()
        
        return [
            {
                "incident_id": inc.incident_id,
                "cctv_id": inc.cctv_id,
                "type": inc.type,
                "start_time": inc.start_time.isoformat(),
                "video_url": inc.video_url,
                "snapshot_url": inc.snapshot_url,
            }
            for inc in incidents
        ]
    except Exception:
        # DB 연결 실패 시 파일 메타데이터에서 조회
        db.rollback()
        metadata = load_metadata_from_file()
        
        # 필터링 및 페이지네이션
        if cctv_id is not None:
            # 메타데이터에는 cctv_id가 없으므로 필터링 불가
            pass
        
        # 최신순 정렬 (uploaded_at 기준)
        sorted_metadata = sorted(
            metadata, 
            key=lambda x: x.get("uploaded_at", ""), 
            reverse=True
        )
        
        return sorted_metadata[offset:offset + limit]


@router.get("/video/{incident_id}", response_model=dict)
def get_uploaded_video(
    incident_id: int,
    db: Session = Depends(get_db),
):
    """
    특정 업로드 영상 정보를 조회합니다.
    """
    try:
        incident = db.query(Incident).filter(
            Incident.incident_id == incident_id,
            Incident.type == "uploaded"
        ).first()
        
        if not incident:
            raise HTTPException(status_code=404, detail="업로드된 영상을 찾을 수 없습니다.")
        
        return {
            "incident_id": incident.incident_id,
            "cctv_id": incident.cctv_id,
            "type": incident.type,
            "start_time": incident.start_time.isoformat(),
            "video_url": incident.video_url,
            "snapshot_url": incident.snapshot_url,
        }
    except HTTPException:
        raise
    except Exception:
        # DB 연결 실패 시 파일 메타데이터에서 조회
        db.rollback()
        metadata = load_metadata_from_file()
        
        # incident_id로 찾기 (메타데이터에는 incident_id가 없으므로 video_url로 찾기)
        # 실제로는 메타데이터에 ID를 저장해야 함
        raise HTTPException(
            status_code=404, 
            detail="업로드된 영상을 찾을 수 없습니다. (DB 연결 실패)"
        )


@router.post("/video", response_model=dict)
async def upload_video(
    video: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    """
    영상을 업로드하고 저장합니다.
    
    - 프론트엔드에서 영상 파일만 전송
    - 백엔드가 파일을 저장
    - DB 연결 가능하면 Incident 생성, 실패하면 파일만 저장
    - 로그인 없이 사용 가능
    """
    saved_path = None
    try:
        # 파일명 검증
        if not video.filename:
            raise HTTPException(status_code=400, detail="파일명이 없습니다.")
        
        # 파일 확장자 검증
        allowed_extensions = {".mp4", ".avi", ".mov", ".mkv", ".webm"}
        file_ext = os.path.splitext(video.filename)[1].lower()
        if file_ext not in allowed_extensions:
            raise HTTPException(
                status_code=400,
                detail=f"지원하지 않는 파일 형식입니다. 허용된 형식: {', '.join(allowed_extensions)}"
            )
        
        # 파일명에서 특수문자 제거 (안전한 파일명 생성)
        import re
        safe_name = re.sub(r'[^\w\-_\.]', '_', video.filename)
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        safe_filename = f"{timestamp}_{safe_name}"
        saved_path = os.path.join(UPLOAD_DIR, safe_filename)
        
        # 업로드 디렉토리 확인 및 생성
        os.makedirs(UPLOAD_DIR, exist_ok=True)
        
        # 파일 저장
        with open(saved_path, "wb") as buffer:
            shutil.copyfileobj(video.file, buffer)
        
        # 파일 URL
        video_url = f"/uploads/{safe_filename}"
        
        # DB에 저장 시도
        try:
            cctv_id = get_or_create_cctv(db)
            
            incident = Incident(
                cctv_id=cctv_id,
                type="uploaded",
                start_time=datetime.now(),
                video_url=video_url,
            )
            db.add(incident)
            db.commit()
            db.refresh(incident)
            
            return {
                "success": True,
                "incident_id": incident.incident_id,
                "video_url": video_url,
                "message": "파일이 성공적으로 업로드되었습니다."
            }
        except Exception as db_error:
            # DB 연결 실패 시 파일은 저장하고 메타데이터만 파일로 저장
            db.rollback()
            print(f"DB 저장 실패, 파일 메타데이터로 저장: {db_error}")
            
            incident_data = {
                "video_url": video_url,
                "filename": safe_filename,
                "original_filename": video.filename,
                "uploaded_at": datetime.now().isoformat(),
                "type": "uploaded",
            }
            save_metadata_to_file(incident_data)
            
            return {
                "success": True,
                "incident_id": None,
                "video_url": video_url,
                "message": "파일이 업로드되었습니다. (DB 연결 실패로 메타데이터만 저장됨)"
            }
        
    except HTTPException:
        raise
    except Exception as e:
        # 파일 저장 실패 시 파일 삭제
        if saved_path and os.path.exists(saved_path):
            try:
                os.remove(saved_path)
            except:
                pass
        
        import traceback
        error_detail = traceback.format_exc()
        print(f"Upload error: {str(e)}")
        print(f"Traceback: {error_detail}")
        
        raise HTTPException(
            status_code=500, 
            detail=f"파일 업로드 실패: {str(e)}"
        )

