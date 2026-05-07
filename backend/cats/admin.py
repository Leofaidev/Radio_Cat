from django.contrib import admin
from .models import Cat


@admin.register(Cat)
class CatAdmin(admin.ModelAdmin):
    list_display = ['name', 'breed', 'age', 'color', 'is_hairy', 'owner', 'created_at']
    list_filter = ['breed', 'is_hairy']
    search_fields = ['name', 'breed', 'owner__username']
