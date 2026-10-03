from datetime import datetime, timedelta, timezone
from app.core.config import settings
from app.security.otp import generate_otp, hash_otp, verify_otp
from app.services.email import send_verification_email
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.user import User
from app.schemas.user import (
    EmailVerificationRequest,
    ResendVerificationRequest,
    UserCreate,
    UserLogin,
    UserResponse,
)
from app.security.auth import (
    create_access_token,
    get_current_user,
    hash_password,
    verify_password,
)


router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=UserResponse)
def register_user(
    user_data: UserCreate,
    db: Session = Depends(get_db),
):
    existing_user = db.scalar(
        select(User).where(User.email == user_data.email)
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email is already registered",
        )

    otp = generate_otp()

    user = User(
        email=user_data.email,
        full_name=user_data.full_name,
        hashed_password=hash_password(user_data.password),
        is_verified=False,
        verification_otp_hash=hash_otp(otp),
        verification_otp_expires_at=datetime.now(timezone.utc)
        + timedelta(minutes=settings.OTP_EXPIRE_MINUTES),
        verification_otp_attempts=0,
        verification_last_sent_at=datetime.now(timezone.utc),
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    send_verification_email(
        user.email,
        otp,
    )

    return user


@router.post("/login")
def login_user(
    user_data: UserLogin,
    db: Session = Depends(get_db),
):
    user = db.scalar(
        select(User).where(User.email == user_data.email)
    )

    if not user or not verify_password(
        user_data.password,
        user.hashed_password,
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=403,
            detail="User account is inactive",
        )

    if not user.is_verified:
        raise HTTPException(
            status_code=403,
            detail="Please verify your email before logging in",
        )

    access_token = create_access_token(
        {"sub": str(user.id)}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
    }


@router.get("/me", response_model=UserResponse)
def get_my_profile(
    current_user: User = Depends(get_current_user),
):
    return current_user


@router.post("/verify-email")
def verify_email(
    request: EmailVerificationRequest,
    db: Session = Depends(get_db),
):
    user = db.scalar(
        select(User).where(User.email == request.email)
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    if user.is_verified:
        raise HTTPException(
            status_code=400,
            detail="Email is already verified",
        )

    if not user.verification_otp_hash:
        raise HTTPException(
            status_code=400,
            detail="No verification code is available",
        )

    if user.verification_otp_expires_at is None:
        raise HTTPException(
            status_code=400,
            detail="Verification code has expired",
        )

    if datetime.now(timezone.utc) > user.verification_otp_expires_at:
        raise HTTPException(
            status_code=400,
            detail="Verification code has expired",
        )

    if user.verification_otp_attempts >= settings.OTP_MAX_ATTEMPTS:
        raise HTTPException(
            status_code=429,
            detail="Maximum verification attempts exceeded",
        )

    if not verify_otp(request.otp, user.verification_otp_hash):
        user.verification_otp_attempts += 1
        db.commit()

        raise HTTPException(
            status_code=400,
            detail="Invalid verification code",
        )

    user.is_verified = True
    user.verification_otp_hash = None
    user.verification_otp_expires_at = None
    user.verification_otp_attempts = 0
    user.verification_last_sent_at = None

    db.commit()

    return {
        "message": "Email verified successfully",
    }


@router.post("/resend-verification")
def resend_verification_code(
    request: ResendVerificationRequest,
    db: Session = Depends(get_db),
):
    user = db.scalar(
        select(User).where(User.email == request.email)
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    if user.is_verified:
        raise HTTPException(
            status_code=400,
            detail="Email is already verified",
        )

    now = datetime.now(timezone.utc)

    if user.verification_last_sent_at:
        elapsed = (
            now - user.verification_last_sent_at
        ).total_seconds()

        if elapsed < settings.OTP_RESEND_COOLDOWN_SECONDS:
            remaining = int(
                settings.OTP_RESEND_COOLDOWN_SECONDS - elapsed
            )

            raise HTTPException(
                status_code=429,
                detail=f"Please wait {remaining} seconds before requesting a new code",
            )

    otp = generate_otp()

    user.verification_otp_hash = hash_otp(otp)
    user.verification_otp_expires_at = (
        now + timedelta(minutes=settings.OTP_EXPIRE_MINUTES)
    )
    user.verification_otp_attempts = 0
    user.verification_last_sent_at = now

    db.commit()

    send_verification_email(
        user.email,
        otp,
    )

    return {
        "message": "A new verification code has been sent to your email",
    }
