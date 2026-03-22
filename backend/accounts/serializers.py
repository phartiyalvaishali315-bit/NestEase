from rest_framework import serializers
from .models import User


class UserSerializer(serializers.ModelSerializer):
    profile_photo_url = serializers.SerializerMethodField()

    class Meta:
        model  = User
        fields = [
            'id', 'mobile', 'email', 'full_name', 'role',
            'is_mobile_verified', 'is_email_verified',
            'is_kyc_verified', 'is_blocked',
            'trust_score', 'language',
            'profile_photo', 'profile_photo_url',
            'created_at',
        ]
        extra_kwargs = {
            'profile_photo': {'write_only': True, 'required': False},
        }

    def get_profile_photo_url(self, obj):
        if obj.profile_photo:
            return obj.profile_photo.url
        return None


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model  = User
        fields = ['mobile', 'role']