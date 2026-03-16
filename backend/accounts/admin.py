from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, OTPToken

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['mobile', 'full_name', 'role', 'is_kyc_verified', 'is_active']
    list_filter  = ['role', 'is_kyc_verified', 'is_active']
    search_fields = ['mobile', 'full_name', 'email']
    ordering     = ['-created_at']
    fieldsets    = None
    fields       = ('mobile', 'email', 'full_name', 'role',
                    'is_mobile_verified', 'is_email_verified',
                    'is_kyc_verified', 'is_active', 'is_blocked',
                    'trust_score', 'language')

@admin.register(OTPToken)
class OTPAdmin(admin.ModelAdmin):
    list_display = ['mobile', 'otp_code', 'purpose', 'is_used', 'expires_at']