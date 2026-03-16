from rest_framework import serializers
from .models import Booking

class BookingSerializer(serializers.ModelSerializer):
    tenant_name    = serializers.CharField(source='tenant.full_name', read_only=True)
    owner_name     = serializers.CharField(source='owner.full_name', read_only=True)
    property_title = serializers.CharField(source='property.title', read_only=True)
    owner_mobile   = serializers.CharField(source='owner.mobile', read_only=True)
    owner_email    = serializers.CharField(source='owner.email', read_only=True)

    class Meta:
        model  = Booking
        fields = [
            'id', 'booking_ref', 'property', 'property_title',
            'owner', 'owner_name', 'owner_mobile', 'owner_email',
            'tenant', 'tenant_name', 'start_date', 'end_date',
            'monthly_rent', 'advance_amount', 'status', 'created_at'
        ]
        read_only_fields = ['id', 'booking_ref', 'created_at']