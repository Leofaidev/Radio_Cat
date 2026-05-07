from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ('Breeder Info', {'fields': ('is_breeder', 'city', 'photo')}),
    )
    list_display = ['username', 'email', 'is_breeder', 'city', 'is_staff']
