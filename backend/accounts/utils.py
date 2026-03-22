import random
from django.utils import timezone
from datetime import timedelta
from .models import OTPToken


def generate_otp(mobile, purpose):
    otp = str(random.randint(100000, 999999))

    OTPToken.objects.create(
        mobile     = mobile,
        otp        = otp,
        purpose    = purpose,
        expires_at = timezone.now() + timedelta(minutes=10)
    )

    print(f"\n{'='*40}")
    print(f"OTP for {mobile}: {otp}")
    print(f"Purpose: {purpose}")
    print(f"{'='*40}\n")

    return otp


def verify_otp(mobile, otp, purpose):
    try:
        token = OTPToken.objects.filter(
            mobile         = mobile,
            otp            = otp,
            purpose        = purpose,
            is_used        = False,
            expires_at__gt = timezone.now()
        ).latest('expires_at')

        token.is_used = True
        token.save()
        return True

    except OTPToken.DoesNotExist:
        return False