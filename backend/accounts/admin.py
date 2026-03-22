from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, OTPToken


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display   = ['mobile', 'full_name', 'role', 'is_kyc_verified', 'trust_score']
    list_filter    = ['role', 'is_kyc_verified', 'is_active']
    search_fields  = ['mobile', 'full_name', 'email']
    ordering       = ['-created_at']
    fieldsets      = (
        (None, {'fields': ('mobile', 'password')}),
        ('Personal', {'fields': ('full_name', 'email', 'profile_photo')}),
        ('Status', {'fields': ('role', 'is_kyc_verified', 'is_mobile_verified', 'is_active', 'is_blocked', 'trust_score')}),
        ('Permissions', {'fields': ('is_staff', 'is_superuser', 'groups', 'user_permissions')}),
    )
    add_fieldsets  = (
        (None, {'fields': ('mobile', 'password1', 'password2', 'role')}),
    )


@admin.register(OTPToken)
class OTPAdmin(admin.ModelAdmin):
    list_display  = ['mobile', 'purpose', 'is_used', 'expires_at']
    list_filter   = ['purpose', 'is_used']
    search_fields = ['mobile']