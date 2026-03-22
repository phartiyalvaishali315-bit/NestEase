import uuid


class EscrowService:

    @staticmethod
    def initiate(booking):
        from .models import Payment
        ref = 'NE-PAY-' + str(uuid.uuid4())[:8].upper()
        payment = Payment.objects.create(
            booking         = booking,
            payer           = booking.tenant,
            payee           = booking.owner,
            amount          = booking.advance_amount,
            payment_type    = 'advance',
            escrow_status   = 'pending_payment',
            transaction_ref = ref
        )
        return payment

    @staticmethod
    def pay(payment):
        payment.escrow_status = 'held'
        payment.save()
        return payment

    @staticmethod
    def release(payment):
        payment.escrow_status = 'released'
        payment.save()
        return payment

    @staticmethod
    def refund(payment):
        payment.escrow_status = 'refunded'
        payment.save()
        return payment