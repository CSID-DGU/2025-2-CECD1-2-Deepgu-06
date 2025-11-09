# app/core/config.py
import os
from datetime import timedelta

# 진짜 운영에서는 환경변수로 빼세요
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60  # 1시간

def access_token_expires():
    return timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
