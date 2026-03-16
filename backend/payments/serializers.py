from rest_framework import serializers
from .models import Payment

class PaymentSerializer(serializers.ModelSerializer):
    payer_name  = serializers.CharField(source='payer.full_name', read_only=True)
    payee_name  = serializers.CharField(source='payee.full_name', read_only=True)
    booking_ref = serializers.CharField(source='booking.booking_ref', read_only=True)

    class Meta:
        model  = Payment
        fields = [
            'id', 'booking', 'booking_ref',
            'payer', 'payer_name', 'payee', 'payee_name',
            'amount', 'payment_type', 'escrow_status',
            'transaction_ref', 'released_at', 'created_at'
        ]
        read_only_fields = ['id', 'transaction_ref', 'released_at', 'created_at']