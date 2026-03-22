from rest_framework import serializers
from .models import KYCDetail


class KYCSerializer(serializers.ModelSerializer):
    aadhaar_front_url = serializers.SerializerMethodField()
    aadhaar_back_url  = serializers.SerializerMethodField()
    selfie_url        = serializers.SerializerMethodField()

    class Meta:
        model  = KYCDetail
        fields = [
            'id', 'status', 'rejection_reason',
            'aadhaar_front', 'aadhaar_back', 'selfie_with_doc',
            'aadhaar_front_url', 'aadhaar_back_url', 'selfie_url',
            'submitted_at',
        ]
        extra_kwargs = {
            'aadhaar_front':   {'write_only': True, 'required': False},
            'aadhaar_back':    {'write_only': True, 'required': False},
            'selfie_with_doc': {'write_only': True, 'required': False},
        }

    def get_aadhaar_front_url(self, obj):
        return obj.aadhaar_front.url  if obj.aadhaar_front  else None

    def get_aadhaar_back_url(self, obj):
        return obj.aadhaar_back.url   if obj.aadhaar_back   else None

    def get_selfie_url(self, obj):
        return obj.selfie_with_doc.url if obj.selfie_with_doc else None