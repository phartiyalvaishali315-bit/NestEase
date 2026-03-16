from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
import uuid

class UserManager(BaseUserManager):
    def create_user(self, mobile, role='tenant', **extra_fields):
        user = self.model(mobile=mobile, role=role, **extra_fields)
        user.set_unusable_password()
        user.save(using=self._db)
        return user

    def create_superuser(self, mobile, **extra_fields):
        extra_fields.setdefault('role', 'admin')
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_mobile_verified', True)
        return self.create_user(mobile, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    ROLES = [
        ('owner', 'Owner'),
        ('tenant', 'Tenant'),
        ('admin', 'Admin'),
    ]
    id                 = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    mobile             = models.CharField(max_length=15, unique=True)
    email              = models.EmailField(unique=True, null=True, blank=True)
    full_name          = models.CharField(max_length=255, blank=True)
    role               = models.CharField(max_length=20, choices=ROLES, default='tenant')
    is_mobile_verified = models.BooleanField(default=False)
    is_email_verified  = models.BooleanField(default=False)
    is_kyc_verified    = models.BooleanField(default=False)
    is_active          = models.BooleanField(default=True)
    is_blocked         = models.BooleanField(default=False)
    is_staff           = models.BooleanField(default=False)
    trust_score        = models.FloatField(default=0.0)
    language           = models.CharField(max_length=5, default='en')
    created_at         = models.DateTimeField(auto_now_add=True)
    updated_at         = models.DateTimeField(auto_now=True)

    USERNAME_FIELD  = 'mobile'
    REQUIRED_FIELDS = []
    objects = UserManager()

    def __str__(self):
        return f"{self.full_name} ({self.mobile})"


class OTPToken(models.Model):
    PURPOSES = [
        ('register', 'Register'),
        ('login', 'Login'),
    ]
    mobile     = models.CharField(max_length=15)
    otp_code   = models.CharField(max_length=6)
    purpose    = models.CharField(max_length=20, choices=PURPOSES)
    expires_at = models.DateTimeField()
    is_used    = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.mobile} - {self.otp_code}"