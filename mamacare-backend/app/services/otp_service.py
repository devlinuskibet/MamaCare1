import random
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timedelta
from app.core.config import settings

# In-memory OTP store: {email: {"code": str, "expires_at": datetime}}
_otp_store: dict = {}

OTP_EXPIRY_MINUTES = 10


def generate_and_send(email: str) -> None:
    """Generate a 6-digit OTP, store it, and email it to the user."""
    code = str(random.randint(100000, 999999))
    expires_at = datetime.utcnow() + timedelta(minutes=OTP_EXPIRY_MINUTES)
    _otp_store[email] = {"code": code, "expires_at": expires_at}

    _send_otp_email(email, code)
    print(f"[OTP] Sent code {code} to {email} (expires {expires_at})")


def verify(email: str, code: str) -> bool:
    """Verify the OTP for an email. Returns True on success and clears the entry."""
    entry = _otp_store.get(email)
    if not entry:
        return False
    if datetime.utcnow() > entry["expires_at"]:
        _otp_store.pop(email, None)
        return False
    if entry["code"] != code:
        return False
    _otp_store.pop(email, None)
    return True


def _send_otp_email(to_email: str, code: str) -> None:
    """Send a professional OTP email via Gmail SMTP."""
    msg = MIMEMultipart("alternative")
    msg["Subject"] = "Your MamaCare Verification Code"
    msg["From"] = settings.MAIL_USERNAME
    msg["To"] = to_email

    html_body = f"""
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 32px; background: #fff; border-radius: 12px; border: 1px solid #e2e8f0;">
        <div style="text-align: center; margin-bottom: 24px;">
            <span style="font-size: 28px; font-weight: 800; color: #db2777;">Mama<span style="color: #1e293b;">Care</span></span>
        </div>
        <h2 style="color: #1e293b; font-size: 20px; margin-bottom: 8px;">Your Verification Code</h2>
        <p style="color: #64748b; font-size: 14px; margin-bottom: 24px;">
            Use the code below to complete your sign-in. It expires in {OTP_EXPIRY_MINUTES} minutes.
        </p>
        <div style="background: #fdf2f8; border: 2px dashed #f9a8d4; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
            <span style="font-size: 42px; font-weight: 900; letter-spacing: 12px; color: #db2777;">{code}</span>
        </div>
        <p style="color: #94a3b8; font-size: 12px; text-align: center;">
            If you did not request this code, you can safely ignore this email.
        </p>
    </div>
    """

    msg.attach(MIMEText(html_body, "html"))

    with smtplib.SMTP("smtp.gmail.com", 587) as server:
        server.starttls()
        server.login(settings.MAIL_USERNAME, settings.MAIL_PASSWORD)
        server.sendmail(settings.MAIL_USERNAME, to_email, msg.as_string())
