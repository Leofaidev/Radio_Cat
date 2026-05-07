from rest_framework import serializers
from .models import Message


class MessageSerializer(serializers.ModelSerializer):
    sender_username = serializers.ReadOnlyField(source='sender.username')

    class Meta:
        model = Message
        fields = ['id', 'sender', 'sender_username', 'text', 'timestamp', 'room_name']
        read_only_fields = ['id', 'sender', 'timestamp']
