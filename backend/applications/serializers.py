from rest_framework import serializers
from .models import Application

class ApplicationSerializer(serializers.ModelSerializer):
    tenant_name     = serializers.CharField(source='tenant.full_name', read_only=True)
    tenant_mobile   = serializers.CharField(source='tenant.mobile', read_only=True)
    property_title  = serializers.CharField(source='property.title', read_only=True)
    property_city   = serializers.CharField(source='property.city', read_only=True)

    class Meta:
        model  = Application
        fields = [
            'id', 'property', 'property_title', 'property_city',
            'tenant', 'tenant_name', 'tenant_mobile',
            'message', 'move_in_date', 'status',
            'rejection_reason', 'reviewed_at', 'created_at'
        ]
        read_only_fields = [
            'id', 'tenant', 'status',
            'rejection_reason', 'reviewed_at', 'created_at'
        ]