# syntax=docker/dockerfile:1.6
FROM python:3.14-slim AS builder
WORKDIR /app

# venv 생성 및 활성
ENV VENV=/opt/venv
RUN python -m venv $VENV
ENV PATH="$VENV/bin:$PATH"

# 의존성 설치
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# ----- Runtime -----
FROM python:3.14-slim
WORKDIR /app

# venv 복사 및 PATH 설정
ENV VENV=/opt/venv
COPY --from=builder $VENV $VENV
ENV PATH="$VENV/bin:$PATH"

# 앱 복사
COPY . .

EXPOSE 8000
# 필요에 따라 모듈 경로를 main:app 또는 app.main:app 등으로 변경
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]