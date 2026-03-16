from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model  = User
        fields = [
            'id', 'mobile', 'email', 'full_name',
            'role', 'is_mobile_verified', 'is_email_verified',
            'is_kyc_verified', 'trust_score', 'language', 'created_at'
        ]
        read_only_fields = [
            'id', 'is_mobile_verified', 'is_email_verified',
            'is_kyc_verified', 'trust_score', 'created_at'
        ]

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model  = User
        fields = ['mobile', 'full_name', 'email', 'role', 'language']