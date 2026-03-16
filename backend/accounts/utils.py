import random
import string
from datetime import timedelta
from django.utils import timezone
from .models import OTPToken

def generate_otp(mobile, purpose='login'):
    # Purane OTP expire karo
    OTPToken.objects.filter(
        mobile=mobile,
        purpose=purpose,
        is_used=False
    ).update(is_used=True)

    # Naya OTP banao
    otp = ''.join(random.choices(string.digits, k=6))
    OTPToken.objects.create(
        mobile=mobile,
        otp_code=otp,
        purpose=purpose,
        expires_at=timezone.now() + timedelta(minutes=10)
    )

    # Development mein console pe print hoga
    print(f"OTP for {mobile}: {otp}")
    return otp

def verify_otp(mobile, otp_code, purpose='login'):
    try:
        token = OTPToken.objects.get(
            mobile=mobile,
            otp_code=otp_code,
            purpose=purpose,
            is_used=False,
            expires_at__gt=timezone.now()
        )
        token.is_used = True
        token.save()
        return True
    except OTPToken.DoesNotExist:
        return False