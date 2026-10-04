from fastapi import APIRouter
from app.api.routes import auth, scans, admin

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/api")
api_router.include_router(scans.router, prefix="/api")
api_router.include_router(admin.router, prefix="/api")
