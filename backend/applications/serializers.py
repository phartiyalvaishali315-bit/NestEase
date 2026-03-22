from rest_framework import serializers
from .models import Application


class ApplicationSerializer(serializers.ModelSerializer):
    tenant_name      = serializers.SerializerMethodField()
    tenant_mobile    = serializers.SerializerMethodField()
    property_title   = serializers.SerializerMethodField()
    property_city    = serializers.SerializerMethodField()
    rejection_reason = serializers.SerializerMethodField()

    class Meta:
        model  = Application
        fields = [
            'id', 'property', 'tenant', 'tenant_name', 'tenant_mobile',
            'property_title', 'property_city', 'message',
            'move_in_date', 'status', 'rejection_reason', 'created_at',
        ]
        read_only_fields = ['status', 'created_at']

    def get_tenant_name(self, obj):
        return obj.tenant.full_name or obj.tenant.mobile

    def get_tenant_mobile(self, obj):
        return obj.tenant.mobile

    def get_property_title(self, obj):
        return obj.property.title

    def get_property_city(self, obj):
        return obj.property.city

    def get_rejection_reason(self, obj):
        return getattr(obj, 'rejection_reason', '')