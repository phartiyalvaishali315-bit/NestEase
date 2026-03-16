from django.db import models
from accounts.models import User
from applications.models import Application
import uuid

class ChatRoom(models.Model):
    id          = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    application = models.OneToOneField(Application, on_delete=models.CASCADE)
    owner       = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owner_rooms')
    tenant      = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tenant_rooms')
    created_at  = models.DateTimeField(auto_now_add=True)

class Message(models.Model):
    id        = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    room      = models.ForeignKey(ChatRoom, on_delete=models.CASCADE, related_name='messages')
    sender    = models.ForeignKey(User, on_delete=models.CASCADE)
    text      = models.TextField()
    is_read   = models.BooleanField(default=False)
    sent_at   = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sender.mobile}: {self.text[:30]}"