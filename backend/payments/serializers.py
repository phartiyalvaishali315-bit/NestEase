from rest_framework import serializers
from .models import Payment


class PaymentSerializer(serializers.ModelSerializer):
    payer_name = serializers.SerializerMethodField()
    payee_name = serializers.SerializerMethodField()

    class Meta:
        model  = Payment
        fields = [
            'id', 'booking', 'payer', 'payer_name',
            'payee', 'payee_name', 'amount',
            'payment_type', 'escrow_status',
            'transaction_ref', 'created_at',
        ]

    def get_payer_name(self, obj):
        return obj.payer.full_name or obj.payer.mobile

    def get_payee_name(self, obj):
        return obj.payee.full_name or obj.payee.mobile