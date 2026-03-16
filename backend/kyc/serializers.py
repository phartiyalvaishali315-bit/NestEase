from rest_framework import serializers
from .models import KYCDetail

class KYCSerializer(serializers.ModelSerializer):
    class Meta:
        model = KYCDetail
        fields = [
            'id', 'aadhaar_front', 'aadhaar_back',
            'selfie_with_doc', 'status', 'rejection_reason',
            'verified_at', 'created_at'
        ]
        read_only_fields = [
            'id', 'status', 'rejection_reason',
            'verified_at', 'created_at'
        ]