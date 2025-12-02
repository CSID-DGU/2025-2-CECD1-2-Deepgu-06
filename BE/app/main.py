# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
load_dotenv()
from app.api.routes import auth, cameras, incidents, systems, upload

app = FastAPI(
    docs_url="/api/docs",
    redoc_url=None,
    openapi_url="/api/openapi.json",
)

# 1. CORS 설정
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,      # 허용할 출처 목록
    allow_credentials=True,
    allow_methods=["*"],        # 모든 HTTP 메서드 허용 (GET, POST 등)
    allow_headers=["*"],        # 모든 헤더 허용
)

app.include_router(auth.router, prefix="/api")
app.include_router(cameras.router, prefix="/api")
app.include_router(incidents.router, prefix="/api")
app.include_router(upload.router, prefix="/api")
app.include_router(systems.router)

# 업로드된 파일 서빙
import os
UPLOAD_DIR = os.getenv("UPLOAD_DIR", "uploads")
if os.path.exists(UPLOAD_DIR):
    from fastapi.staticfiles import StaticFiles
    app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")