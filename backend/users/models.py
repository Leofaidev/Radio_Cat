from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    is_breeder = models.BooleanField(default=True)
    city = models.CharField(max_length=100, blank=True)
    photo = models.ImageField(upload_to='avatars/', blank=True, null=True)

    def __str__(self):
        return self.username
