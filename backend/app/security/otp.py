import hashlib
import hmac
import secrets

from app.core.config import settings


def generate_otp() -> str:
    return f"{secrets.randbelow(1_000_000):06d}"


def hash_otp(otp: str) -> str:
    return hmac.new(
        settings.SECRET_KEY.encode(),
        otp.encode(),
        hashlib.sha256,
    ).hexdigest()


def verify_otp(otp: str, otp_hash: str) -> bool:
    expected_hash = hash_otp(otp)

    return hmac.compare_digest(
        expected_hash,
        otp_hash,
    )
