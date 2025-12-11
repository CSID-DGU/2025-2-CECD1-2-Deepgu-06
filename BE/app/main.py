# app/main.py
from fastapi import FastAPI
from dotenv import load_dotenv
load_dotenv()
from app.api.routes import auth, cameras, incidents, systems
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI(
    docs_url="/api/docs",
    redoc_url=None,
    openapi_url="/api/openapi.json",
)
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://www.maeumnaru.shop",
    "https://maeumnaru.shop",
    "https://deepgu.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,        # 개발 중이면 ["*"]도 가능 (credentials 안 쓰면)
    allow_credentials=True,       # 쿠키 기반 인증이면 True
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth.router, prefix="/api")
app.include_router(cameras.router, prefix="/api")
app.include_router(incidents.router, prefix="/api")
app.include_router(systems.router)