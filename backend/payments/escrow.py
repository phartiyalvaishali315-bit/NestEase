import uuid
from django.utils import timezone
from .models import Payment

class EscrowService:

    @staticmethod
    def initiate(booking):
        ref = 'NE-PAY-' + str(uuid.uuid4())[:8].upper()
        payment = Payment.objects.create(
            booking       = booking,
            payer         = booking.tenant,
            payee         = booking.owner,
            amount        = booking.advance_amount,
            payment_type  = 'advance',
            escrow_status = 'pending_payment',
            transaction_ref = ref
        )
        return payment

    @staticmethod
    def pay(payment):
        # Mock payment — always succeeds
        payment.escrow_status = 'held'
        payment.save()
        return payment

    @staticmethod
    def release(payment, admin_user):
        payment.escrow_status = 'released'
        payment.released_at   = timezone.now()
        payment.released_by   = admin_user
        payment.save()
        return payment

    @staticmethod
    def refund(payment, admin_user):
        payment.escrow_status = 'refunded'
        payment.released_at   = timezone.now()
        payment.released_by   = admin_user
        payment.save()
        return payment