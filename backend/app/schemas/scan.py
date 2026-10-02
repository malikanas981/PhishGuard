from datetime import datetime

from pydantic import BaseModel, HttpUrl


class ScanCreate(BaseModel):
    url: HttpUrl


class ScanResponse(BaseModel):
    id: int
    url: str
    risk_score: float
    risk_level: str
    reasons: str
    scanned_at: datetime
    user_id: int | None

    model_config = {
        "from_attributes": True,
    }