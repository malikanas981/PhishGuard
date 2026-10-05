import requests

from app.core.config import settings


def send_verification_email(
    recipient_email: str,
    otp: str,
) -> None:
    payload = {
        "sender": {
            "name": "PhishGuard",
            "email": settings.BREVO_FROM_EMAIL,
        },
        "to": [
            {
                "email": recipient_email,
            }
        ],
        "subject": "Your PhishGuard verification code",
        "textContent": (
            f"Your PhishGuard verification code is: {otp}\n\n"
            f"This code will expire in "
            f"{settings.OTP_EXPIRE_MINUTES} minutes.\n\n"
            "If you did not create a PhishGuard account, "
            "you can safely ignore this email."
        ),
    }

    response = requests.post(
        "https://api.brevo.com/v3/smtp/email",
        headers={
            "accept": "application/json",
            "api-key": settings.BREVO_API_KEY,
            "content-type": "application/json",
        },
        json=payload,
        timeout=15,
    )

    if not response.ok:
        raise RuntimeError(
            f"Unable to send verification email: "
            f"{response.status_code} {response.text}"
        )