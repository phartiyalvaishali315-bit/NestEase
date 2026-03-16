from django.contrib import admin
from .models import KYCDetail

@admin.register(KYCDetail)
class KYCAdmin(admin.ModelAdmin):
    list_display  = ['user', 'status', 'created_at', 'verified_at']
    list_filter   = ['status']
    search_fields = ['user__mobile']