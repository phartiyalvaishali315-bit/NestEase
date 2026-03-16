from rest_framework import serializers
from .models import Review

class ReviewSerializer(serializers.ModelSerializer):
    reviewer_name  = serializers.CharField(source='reviewer.full_name', read_only=True)
    property_title = serializers.CharField(source='property.title', read_only=True)

    class Meta:
        model  = Review
        fields = [
            'id', 'booking', 'reviewer', 'reviewer_name',
            'property', 'property_title', 'rating',
            'cleanliness', 'owner_behaviour', 'value_for_money',
            'comment', 'is_visible', 'created_at'
        ]
        read_only_fields = ['id', 'reviewer', 'created_at']