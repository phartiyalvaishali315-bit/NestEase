from django.db import models
from accounts.models import User
from properties.models import Property
from applications.models import Application
import uuid
import random
import string

def generate_booking_ref():
    return 'NE' + ''.join(random.choices(string.digits, k=8))

class Booking(models.Model):
    STATUS = [
        ('active', 'Active'),
        ('completed', 'Completed'),
        ('disputed', 'Disputed'),
        ('cancelled', 'Cancelled'),
    ]
    id            = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    application   = models.OneToOneField(Application, on_delete=models.CASCADE)
    property      = models.ForeignKey(Property, on_delete=models.CASCADE)
    owner         = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owner_bookings')
    tenant        = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tenant_bookings')
    start_date    = models.DateField()
    end_date      = models.DateField(null=True, blank=True)
    monthly_rent  = models.DecimalField(max_digits=10, decimal_places=2)
    advance_amount= models.DecimalField(max_digits=10, decimal_places=2)
    status        = models.CharField(max_length=20, choices=STATUS, default='active')
    booking_ref   = models.CharField(max_length=20, unique=True, default=generate_booking_ref)
    created_at    = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.booking_ref} - {self.tenant.mobile}"