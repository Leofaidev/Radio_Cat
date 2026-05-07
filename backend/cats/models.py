from django.conf import settings
from django.db import models


class Cat(models.Model):
    name = models.CharField(max_length=100)
    age = models.PositiveIntegerField()
    breed = models.CharField(max_length=100)
    is_hairy = models.BooleanField(default=False)
    color = models.CharField(max_length=50, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='cats'
    )

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.name} ({self.breed}) - {self.owner.username}'
