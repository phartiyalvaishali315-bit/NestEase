from django.db import models
from accounts.models import User
import uuid

class KYCDetail(models.Model):
    STATUS = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]
    id               = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user             = models.OneToOneField(User, on_delete=models.CASCADE, related_name='kyc')
    aadhaar_front    = models.ImageField(upload_to='kyc/')
    aadhaar_back     = models.ImageField(upload_to='kyc/')
    selfie_with_doc  = models.ImageField(upload_to='kyc/', null=True, blank=True)
    status           = models.CharField(max_length=20, choices=STATUS, default='pending')
    rejection_reason = models.TextField(null=True, blank=True)
    verified_by      = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name='kyc_verified')
    verified_at      = models.DateTimeField(null=True, blank=True)
    created_at       = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.mobile} - {self.status}"