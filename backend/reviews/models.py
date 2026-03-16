from django.db import models
from accounts.models import User
from bookings.models import Booking
from properties.models import Property
import uuid

class Review(models.Model):
    id              = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    booking         = models.OneToOneField(Booking, on_delete=models.CASCADE)
    reviewer        = models.ForeignKey(User, on_delete=models.CASCADE)
    property        = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='reviews')
    rating          = models.IntegerField()
    cleanliness     = models.IntegerField(null=True, blank=True)
    owner_behaviour = models.IntegerField(null=True, blank=True)
    value_for_money = models.IntegerField(null=True, blank=True)
    comment         = models.TextField(blank=True)
    is_visible      = models.BooleanField(default=True)
    created_at      = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.reviewer.mobile} - {self.rating} stars"