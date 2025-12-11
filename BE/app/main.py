# app/main.py
from fastapi import FastAPI
from dotenv import load_dotenv
load_dotenv()
from app.api.routes import auth, cameras, incidents, systems

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
]

app.add_middleware(
    allow_origins=origins,       # 개발 중엔 ['*'] 도 가능 (credentials 안 쓰면)
    allow_credentials=True,      # 로그인/JWT 쿠키 쓰면 True 유지
    allow_methods=["*"],         # GET, POST, OPTIONS 등 모두 허용
    allow_headers=["*"],         # Authorization 등 커스텀 헤더 허용
)
app.include_router(auth.router, prefix="/api")
app.include_router(cameras.router, prefix="/api")
app.include_router(incidents.router, prefix="/api")
app.include_router(systems.router)