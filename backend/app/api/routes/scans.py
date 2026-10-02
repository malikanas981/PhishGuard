from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.detection.url_analyzer import analyze_url
from app.models.scan import Scan
from app.schemas.scan import ScanCreate, ScanResponse
from app.schemas.dashboard import DashboardStats
from app.security.auth import get_current_user
from app.models.user import User


router = APIRouter(prefix="/scans", tags=["Scans"])


@router.post("/", response_model=ScanResponse)
def create_scan(
    scan_data: ScanCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    analysis = analyze_url(str(scan_data.url))

    scan = Scan(
        url=str(scan_data.url),
        risk_score=analysis["risk_score"],
        risk_level=analysis["risk_level"],
        reasons=", ".join(analysis["reasons"]) or "No suspicious indicators detected",
        user_id=current_user.id,
    )

    db.add(scan)
    db.commit()
    db.refresh(scan)

    return scan
@router.get("/", response_model=list[ScanResponse])
def get_scan_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    scans = db.scalars(
        select(Scan)
        .where(Scan.user_id == current_user.id)
        .order_by(Scan.scanned_at.desc())
    ).all()

    return scans
@router.get("/stats", response_model=DashboardStats)
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    scans = db.scalars(
        select(Scan).where(Scan.user_id == current_user.id)
    ).all()

    return DashboardStats(
        total_scans=len(scans),
        low_risk=sum(scan.risk_level == "LOW" for scan in scans),
        medium_risk=sum(scan.risk_level == "MEDIUM" for scan in scans),
        high_risk=sum(scan.risk_level == "HIGH" for scan in scans),
    )
