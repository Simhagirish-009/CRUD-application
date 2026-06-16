import random
from django.core.mail import send_mail
from django.conf import settings
from .models import Otp

def send_otp_to_email(user):
    # Generate a 6-digit random OTP
    otp_code = str(random.randint(100000, 999999))
    
    # Save OTP to database
    Otp.objects.create(user=user, otp=otp_code)
    
    # Send email
    subject = "Your Verification Code"
    message = f"Hello {user.username},\n\nYour OTP for verification is: {otp_code}\nIt is valid for 60 seconds."
    email_from = settings.DEFAULT_FROM_EMAIL
    recipient_list = [user.email]
    
    send_mail(subject, message, email_from, recipient_list)