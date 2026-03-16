from django.db import models
from accounts.models import User
import uuid

class Property(models.Model):
    TYPES  = [('room','Room'), ('pg','PG'), ('hostel','Hostel')]
    AVAIL  = [('available','Available'), ('engaged','Engaged')]
    STATUS = [('pending','Pending'), ('approved','Approved'), ('rejected','Rejected')]
    BATH   = [('attached','Attached'), ('shared','Shared')]
    SHARE  = [('single','Single'), ('double','Double'), ('triple','Triple')]

    id               = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner            = models.ForeignKey(User, on_delete=models.CASCADE, related_name='properties')
    title            = models.CharField(max_length=255)
    description      = models.TextField()
    property_type    = models.CharField(max_length=20, choices=TYPES)
    address          = models.TextField()
    city             = models.CharField(max_length=100)
    state            = models.CharField(max_length=100)
    pincode          = models.CharField(max_length=10)
    latitude         = models.DecimalField(max_digits=10, decimal_places=7)
    longitude        = models.DecimalField(max_digits=10, decimal_places=7)
    monthly_rent     = models.DecimalField(max_digits=10, decimal_places=2)
    security_deposit = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    has_kitchen      = models.BooleanField(default=False)
    bathroom_type    = models.CharField(max_length=20, choices=BATH)
    sharing_type     = models.CharField(max_length=20, choices=SHARE)
    is_women_only    = models.BooleanField(default=False)
    is_pet_friendly  = models.BooleanField(default=False)
    availability     = models.CharField(max_length=20, choices=AVAIL, default='available')
    admin_status     = models.CharField(max_length=20, choices=STATUS, default='pending')
    rejection_reason = models.TextField(null=True, blank=True)
    is_active        = models.BooleanField(default=True)
    created_at       = models.DateTimeField(auto_now_add=True)
    updated_at       = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} - {self.city}"


class PropertyMedia(models.Model):
    TYPES = [('photo','Photo'), ('video','Video')]
    CATS  = [('room','Room'), ('kitchen','Kitchen'),
             ('bathroom','Bathroom'), ('outside','Outside'), ('other','Other')]

    id            = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    property      = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='media')
    media_type    = models.CharField(max_length=10, choices=TYPES)
    media_category= models.CharField(max_length=30, choices=CATS)
    file          = models.FileField(upload_to='properties/')
    is_flagged    = models.BooleanField(default=False)
    sort_order    = models.IntegerField(default=0)
    created_at    = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.property.title} - {self.media_category}"