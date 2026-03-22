from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from cloudinary_storage.storage import MediaCloudinaryStorage
import uuid


class UserManager(BaseUserManager):
    def create_user(self, mobile, password=None, **extra_fields):
        if not mobile:
            raise ValueError('Mobile number required')
        user = self.model(mobile=mobile, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, mobile, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'admin')
        return self.create_user(mobile, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    ROLES = [('owner', 'Owner'), ('tenant', 'Tenant'), ('admin', 'Admin')]

    id                  = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    mobile              = models.CharField(max_length=15, unique=True)
    email               = models.EmailField(null=True, blank=True)
    full_name           = models.CharField(max_length=255, null=True, blank=True)
    role                = models.CharField(max_length=20, choices=ROLES, default='tenant')
    is_mobile_verified  = models.BooleanField(default=False)
    is_email_verified   = models.BooleanField(default=False)
    is_kyc_verified     = models.BooleanField(default=False)
    is_active           = models.BooleanField(default=True)
    is_blocked          = models.BooleanField(default=False)
    is_staff            = models.BooleanField(default=False)
    trust_score         = models.IntegerField(default=0)
    language            = models.CharField(max_length=10, default='en')
    profile_photo       = models.ImageField(
                            upload_to='profiles/',
                            storage=MediaCloudinaryStorage(),
                            null=True, blank=True
                          )
    created_at          = models.DateTimeField(auto_now_add=True)
    updated_at          = models.DateTimeField(auto_now=True)

    objects = UserManager()

    USERNAME_FIELD  = 'mobile'
    REQUIRED_FIELDS = []

    def __str__(self):
        return f"{self.full_name or self.mobile} ({self.role})"


class OTPToken(models.Model):
    PURPOSES = [('login', 'Login'), ('register', 'Register'), ('reset', 'Reset')]

    mobile     = models.CharField(max_length=15)
    otp        = models.CharField(max_length=6)
    purpose    = models.CharField(max_length=20, choices=PURPOSES)
    is_used    = models.BooleanField(default=False)
    expires_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.mobile} - {self.otp}"