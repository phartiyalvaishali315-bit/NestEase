from django.db import models
from accounts.models import User
from properties.models import Property
import uuid

class Application(models.Model):
    STATUS = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('withdrawn', 'Withdrawn'),
    ]
    id               = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    property         = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='applications')
    tenant           = models.ForeignKey(User, on_delete=models.CASCADE, related_name='applications')
    message          = models.TextField(blank=True)
    move_in_date     = models.DateField()
    status           = models.CharField(max_length=20, choices=STATUS, default='pending')
    rejection_reason = models.TextField(null=True, blank=True)
    reviewed_at      = models.DateTimeField(null=True, blank=True)
    created_at       = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['property', 'tenant']

    def __str__(self):
        return f"{self.tenant.mobile} -> {self.property.title}"