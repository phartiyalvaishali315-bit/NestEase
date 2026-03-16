from django.db import models
from accounts.models import User
from bookings.models import Booking
import uuid

class Payment(models.Model):
    TYPES = [
        ('advance', 'Advance'),
        ('security', 'Security'),
        ('refund', 'Refund'),
    ]
    ESCROW = [
        ('pending_payment', 'Pending Payment'),
        ('held', 'Held'),
        ('released', 'Released'),
        ('refunded', 'Refunded'),
        ('disputed', 'Disputed'),
    ]
    id              = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    booking         = models.ForeignKey(Booking, on_delete=models.CASCADE, related_name='payments')
    payer           = models.ForeignKey(User, on_delete=models.CASCADE, related_name='payments_made')
    payee           = models.ForeignKey(User, on_delete=models.CASCADE, related_name='payments_received')
    amount          = models.DecimalField(max_digits=10, decimal_places=2)
    payment_type    = models.CharField(max_length=20, choices=TYPES)
    escrow_status   = models.CharField(max_length=20, choices=ESCROW, default='pending_payment')
    transaction_ref = models.CharField(max_length=64, unique=True)
    released_at     = models.DateTimeField(null=True, blank=True)
    released_by     = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name='payments_released')
    created_at      = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.transaction_ref} - {self.escrow_status}"