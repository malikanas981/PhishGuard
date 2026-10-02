from pydantic import BaseModel


class DashboardStats(BaseModel):
    total_scans: int
    low_risk: int
    medium_risk: int
    high_risk: int
