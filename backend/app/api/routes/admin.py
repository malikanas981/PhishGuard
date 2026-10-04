from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.user import User
from app.schemas.user import UserResponse
from app.security.admin import get_current_admin

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/me")
def admin_me(current_admin: User = Depends(get_current_admin)):
    return {
        "message": "Admin access granted",
        "admin_id": current_admin.id,
        "email": current_admin.email,
    }


@router.get("/users", response_model=list[UserResponse])
def get_users(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    return db.scalars(
        select(User).order_by(User.id)
    ).all()


@router.patch("/users/{user_id}/status", response_model=UserResponse)
def update_user_status(
    user_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    user = db.get(User, user_id)

    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    if user.id == current_admin.id:
        raise HTTPException(
            status_code=400,
            detail="Admin cannot change their own status",
        )

    user.is_active = not user.is_active
    db.commit()
    db.refresh(user)

    return user
