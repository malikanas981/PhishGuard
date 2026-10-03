import smtplib
from email.message import EmailMessage

from app.core.config import settings


def send_verification_email(
    recipient_email: str,
    otp: str,
) -> None:
    message = EmailMessage()
    message["Subject"] = "PhishGuard Email Verification Code"
    message["From"] = settings.SMTP_FROM_EMAIL
    message["To"] = recipient_email

    message.set_content(
        f"Your PhishGuard verification code is: {otp}\n\n"
        f"This code will expire in {settings.OTP_EXPIRE_MINUTES} minutes.\n\n"
        "If you did not create a PhishGuard account, you can safely ignore this email."
    )

    with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
        server.starttls()
        server.login(
            settings.SMTP_USERNAME,
            settings.SMTP_PASSWORD,
        )
        server.send_message(message)
