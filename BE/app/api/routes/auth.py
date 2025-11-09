# app/api/routes/auth.py
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.user import User, UserRole
from app.core.security import get_password_hash, verify_password, create_access_token
from app.schemas.auth import LoginRequest, Token, UserCreate, UserOut
from app.api import deps

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/login", response_model=Token)
def login(
    payload: LoginRequest,
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )

    token = create_access_token({"sub": str(user.user_id)})
    return Token(access_token=token)

@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def register(
    payload: UserCreate,
    db: Session = Depends(get_db),
):
    # 이메일 중복 체크
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    hashed_pw = get_password_hash(payload.password)

    user = User(
        name=payload.name,
        email=payload.email,
        password=hashed_pw,
        role=UserRole.VIEWER,  # 기본은 VIEWER로
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    return user

@router.get("/me")
def read_me(current_user: User = Depends(deps.get_current_user)):
    return current_user