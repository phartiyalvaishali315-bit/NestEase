from rest_framework import serializers
from .models import Review


class ReviewSerializer(serializers.ModelSerializer):
    reviewer_name = serializers.SerializerMethodField()

    class Meta:
        model  = Review
        fields = [
            'id', 'booking', 'reviewer', 'reviewer_name',
            'property', 'rating', 'cleanliness',
            'owner_behaviour', 'value_for_money',
            'comment', 'created_at',
        ]

    def get_reviewer_name(self, obj):
        return obj.reviewer.full_name or obj.reviewer.mobile