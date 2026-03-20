from rest_framework import serializers
from .models import Booking


class BookingSerializer(serializers.ModelSerializer):
    property_title = serializers.SerializerMethodField()
    tenant_name    = serializers.SerializerMethodField()
    owner_name     = serializers.SerializerMethodField()

    class Meta:
        model  = Booking
        fields = [
            'id', 'booking_ref',
            'property', 'property_title',
            'owner', 'owner_name',
            'tenant', 'tenant_name',
            'start_date', 'monthly_rent',
            'advance_amount', 'status',
            'created_at',
        ]

    def get_property_title(self, obj):
        return obj.property.title

    def get_tenant_name(self, obj):
        return obj.tenant.full_name or obj.tenant.mobile

    def get_owner_name(self, obj):
        return obj.owner.full_name or obj.owner.mobile