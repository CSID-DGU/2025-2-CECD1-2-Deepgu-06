# Deepgu V2 — VLM 기반 이상행동 분석 플랫폼

> **"CCTV 영상에서 이상행동을 실시간으로 감지하고 관제합니다."**  
> V1의 단일 인스턴스 한계를 개선한 이중 서버 아키텍처.  
> AI Worker가 이상행동을 탐지하면 Backend로 이벤트를 전송하고, Frontend가 실시간 알림을 표시합니다.
>
> V1 보기 → [2025-2-CECD1-2-Deepgu-06](https://github.com/CSID-DGU/2025-2-CECD1-2-Deepgu-06)

<p>
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-16-000000?style=flat&logo=nextdotjs&logoColor=white">
  <img alt="FastAPI" src="https://img.shields.io/badge/FastAPI-Python-009688?style=flat&logo=fastapi&logoColor=white">
  <img alt="MySQL" src="https://img.shields.io/badge/MySQL-8.0-4479A1?style=flat&logo=mysql&logoColor=white">
  <img alt="AWS" src="https://img.shields.io/badge/AWS-EC2-FF9900?style=flat&logo=amazonaws&logoColor=white">
  <img alt="Vercel" src="https://img.shields.io/badge/Frontend-Vercel-000000?style=flat&logo=vercel&logoColor=white">
  <img alt="Docker" src="https://img.shields.io/badge/Docker-배포-2496ED?style=flat&logo=docker&logoColor=white">
</p>

---

## 👀 주요 기능

| 기능 | 설명 |
|------|------|
| **카메라 관리** | CCTV 등록·수정·삭제, ACTIVE/INACTIVE 상태 관리 |
| **이상행동 탐지** | AI Worker가 VLM으로 이상행동 감지 후 Backend로 이벤트 전송 |
| **실시간 알림** | Frontend가 OPEN 상태 Incident를 폴링해 관제 화면에 표시 |
| **권한 관리** | ADMIN(전체 접근) / VIEWER(담당 카메라만) 역할 분리 |
| **Incident 이력** | 이상행동 시작·종료 시각, 설명, 영상 URL 기록 |

---

## 🏗️ 시스템 아키텍처

<img width="1430" height="1280" alt="image" src="https://github.com/user-attachments/assets/9432b1d6-05ec-478d-8aab-62e996510501" />


### Incident 생명주기

```
AI 이상 감지
    │
    ▼ POST /api/incidents/events (event: "start")
Incident 생성 (status: OPEN)
    │
    ▼ Frontend polling GET /api/incidents?status=OPEN
관제 화면 알림 표시
    │
    ▼ POST /api/incidents/events (event: "end")
Incident 종료 (status: CLOSED)
```

### 기술 스택

**Frontend**
- Next.js 16 + React 19
- Vercel 배포 (`deepgu.vercel.app`)
- App Router 기반 (`app/` 디렉토리)

**Backend**
- FastAPI (Python)
- JWT 인증 (bcrypt + HS256), 역할 기반 접근 제어 (ADMIN / VIEWER)
- MySQL (SQLAlchemy ORM)
- Docker, GitHub Actions

**AI**
- VLM 기반 이상행동 탐지
- CUDA GPU 필요

---

## 📁 프로젝트 구조

```
├── FE/deepgu/
│   ├── app/                  # Next.js App Router
│   │   ├── layout.tsx
│   │   ├── page.tsx          # 대시보드
│   │   ├── signin/           # 로그인
│   │   └── signup/           # 회원가입
│   ├── components/
│   │   ├── atoms/            # Button, Input, Text 등 기본 UI
│   │   └── common/           # DatePicker 등 조합 컴포넌트
│   └── lib/                  # 유틸리티
│
├── BE/app/
│   ├── main.py               # FastAPI 앱, CORS, 라우터 등록
│   ├── api/
│   │   ├── deps.py           # JWT 검증 (get_current_user)
│   │   └── routes/           # auth · cameras · incidents · systems
│   ├── core/
│   │   ├── config.py         # SECRET_KEY, ALGORITHM, TOKEN_EXPIRE
│   │   └── security.py       # bcrypt, JWT 생성
│   ├── db/
│   │   └── session.py        # SQLAlchemy engine + get_db()
│   ├── models/               # SQLAlchemy ORM
│   └── schemas/              # Pydantic DTO
│
└── AI/deepgu/                # AI Worker
```

---

## 🚀 실행 방법

### 사전 요구사항

- Node.js 18+
- Python 3.11+
- Docker
- MySQL 서버
- CUDA GPU (AI Worker용)

### 프론트엔드

```bash
cd FE/deepgu

npm install
npm run dev       # http://localhost:3000

# 환경변수
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 백엔드

```bash
cd BE/app

# 환경변수 설정
cat > .env <<EOF
DATABASE_URL=mysql+pymysql://user:pass@host:3306/noonai
SECRET_KEY=<secret>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
EOF

# 로컬 실행
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Docker 실행
docker build -t noonai-be .
docker run -p 8000:8000 noonai-be
```

API 문서: `http://localhost:8000/api/docs` (Swagger UI)

---

## 📡 API

### 인증

| Method | Path | 설명 |
|--------|------|------|
| POST | `/api/auth/login` | 로그인 · JWT 발급 |
| POST | `/api/auth/signup` | 회원가입 |

### 카메라

| Method | Path | 설명 |
|--------|------|------|
| GET | `/api/cameras` | 카메라 목록 (VIEWER: 담당 카메라만) |
| POST | `/api/cameras` | 카메라 등록 (ADMIN) |
| PATCH | `/api/cameras/{id}` | 카메라 수정 (ADMIN) |
| DELETE | `/api/cameras/{id}` | 카메라 삭제 (ADMIN) |

### Incident

| Method | Path | 설명 |
|--------|------|------|
| GET | `/api/incidents` | Incident 목록 (cctv_id · status 필터) |
| POST | `/api/incidents/events` | AI Worker → 이상행동 이벤트 수신 |

---

## 🗄️ 데이터 모델

| 모델 | 주요 필드 |
|------|-----------|
| `User` | user_id · name · email · hashed_password · role (ADMIN/VIEWER) |
| `CCTV` | cctv_id · name · location · streaming_url · status (ACTIVE/INACTIVE) |
| `Incident` | incident_id · cctv_id · type · start/end_time · explanation · status (OPEN/CLOSED) · video_url |
| `UserCCTV` | user_id · cctv_id (VIEWER 접근 제어용 조인 테이블) |

---

## 🔄 V1 → V2 개선 내용

| 항목 | V1 | V2 |
|------|----|----|
| 서버 구조 | 단일 EC2 인스턴스 | BE 서버 / AI Worker 분리 |
| 스트리밍 | FFmpeg OS 레벨 직접 실행 | HLS Media Server 분리 |
| 부하 격리 | ❌ 리소스 경합 | ✅ 독립적 운영 |
| 인증 | 없음 | JWT · ADMIN/VIEWER 역할 분리 |
| 이상행동 이력 | 없음 | Incident 모델로 OPEN/CLOSED 관리 |

---

## 📄 라이센스

This project is licensed under the MIT License.
