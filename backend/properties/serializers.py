from rest_framework import serializers
from .models import Property, PropertyMedia


class PropertyMediaSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model  = PropertyMedia
        fields = ['id', 'image_url']

    def get_image_url(self, obj):
        if obj.file:
            return obj.file.url
        return None


class PropertySerializer(serializers.ModelSerializer):
    media        = PropertyMediaSerializer(many=True, read_only=True)
    owner_mobile = serializers.SerializerMethodField()
    owner_name   = serializers.SerializerMethodField()

    class Meta:
        model  = Property
        fields = [
            'id', 'title', 'description', 'property_type',
            'address', 'city', 'state', 'pincode',
            'latitude', 'longitude',
            'monthly_rent', 'security_deposit',
            'has_kitchen', 'bathroom_type', 'sharing_type',
            'is_women_only', 'is_pet_friendly',
            'availability', 'admin_status',
            'media', 'owner_mobile', 'owner_name',
            'created_at',
        ]
        read_only_fields = ['admin_status', 'owner_mobile', 'owner_name']

    def get_owner_mobile(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            if request.user == obj.owner or request.user.role == 'admin':
                return obj.owner.mobile
        return None

    def get_owner_name(self, obj):
        return obj.owner.full_name or 'Owner'