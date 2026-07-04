from flask_mail import Message
from app.extensions import mail
from app.config import Config


def send_otp_email(email, otp):
    try:
        msg = Message(
            subject="Email Verification OTP",
            sender=Config.MAIL_DEFAULT_SENDER,
            recipients=[email]
        )

        msg.body = f"""
Your OTP for email verification is: {otp}

This OTP will expire in 10 minutes.
Do not share it with anyone.
"""

        mail.send(msg)
        return True

    except Exception as e:
        print("❌ EMAIL SENDING FAILED:", str(e))
        return False