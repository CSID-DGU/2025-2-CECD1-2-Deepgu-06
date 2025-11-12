# app/main.py
from fastapi import FastAPI
from dotenv import load_dotenv
load_dotenv()
from app.api.routes import auth, cameras, incidents, systems

app = FastAPI(title="CCTV Monitoring API")

app.include_router(auth.router, prefix="/api")
app.include_router(cameras.router, prefix="/api")
app.include_router(incidents.router, prefix="/api")
app.include_router(systems.router)