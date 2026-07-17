from flask_mail import Message
from app.extensions import mail
from app.config import Config


def send_otp_email(email, otp):
    try:
        print(f"Sending OTP to: {email}")

        msg = Message(
            subject="Email Verification OTP",
            sender=Config.MAIL_DEFAULT_SENDER,
            recipients=[email]
        )

        msg.body = f"""
Your OTP for email verification is: {otp}

This OTP will expire in 10 minutes.
"""
        from app.config import Config

        print("MAIL_USERNAME =", Config.MAIL_USERNAME)
        print("MAIL_PASSWORD exists =", bool(Config.MAIL_PASSWORD))
        print("MAIL_SERVER =", Config.MAIL_SERVER)

        mail.send(msg)

        print("Email sent successfully")
        return True

    except Exception as e:
        print("EMAIL SENDING FAILED:")
        print(e)
        return False