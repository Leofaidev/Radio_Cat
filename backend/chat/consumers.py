import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError

User = get_user_model()


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'chat_{self.room_name}'

        # Try to authenticate via query param token
        query_string = self.scope.get('query_string', b'').decode()
        self.user = None
        if 'token=' in query_string:
            try:
                token_str = query_string.split('token=')[1].split('&')[0]
                token = AccessToken(token_str)
                user_id = token['user_id']
                self.user = await self.get_user(user_id)
            except (InvalidToken, TokenError, Exception):
                pass

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        text = data.get('text', '')
        sender_username = data.get('sender', 'anonymous')

        # Save message to DB if we have a valid user
        timestamp_str = ''
        if self.user:
            message = await self.save_message(self.user, text)
            timestamp_str = message.timestamp.isoformat()
            sender_username = self.user.username
        else:
            from datetime import datetime, timezone
            timestamp_str = datetime.now(timezone.utc).isoformat()

        # Broadcast to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'sender': sender_username,
                'text': text,
                'timestamp': timestamp_str,
            }
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'sender': event['sender'],
            'text': event['text'],
            'timestamp': event['timestamp'],
        }))

    @database_sync_to_async
    def get_user(self, user_id):
        try:
            return User.objects.get(id=user_id)
        except User.DoesNotExist:
            return None

    @database_sync_to_async
    def save_message(self, user, text):
        from .models import Message
        return Message.objects.create(
            sender=user,
            text=text,
            room_name=self.room_name
        )
