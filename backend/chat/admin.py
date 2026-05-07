from django.contrib import admin
from .models import Message


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ['sender', 'room_name', 'text', 'timestamp']
    list_filter = ['room_name']
    search_fields = ['sender__username', 'text']
