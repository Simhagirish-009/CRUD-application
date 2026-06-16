from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone

# Create your models here.
from django.contrib.auth.models import AbstractUser
class CustomUser(AbstractUser):
    # Set email as the unique identifier for authentication
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150, unique=False)  # Allow duplicate usernames

    # Update the USERNAME_FIELD
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']  # Username will still be a required field, but not unique

class Category(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class Product(models.Model):
    name = models.CharField(max_length=255)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1,validators=[MinValueValidator(1),MaxValueValidator(1000)])
    description = models.TextField()

class Otp(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)

    def is_valid(self):
        return timezone.now() < self.created_at + timezone.timedelta(seconds=60)

    def __str__(self):
        return f"OTP for {self.user}"

