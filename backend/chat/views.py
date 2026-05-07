from rest_framework import generics, permissions
from .models import Message
from .serializers import MessageSerializer


class MessageListCreateView(generics.ListCreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        room = self.request.query_params.get('room', 'general')
        return Message.objects.filter(room_name=room)

    def perform_create(self, serializer):
        room = self.request.data.get('room_name', 'general')
        serializer.save(sender=self.request.user, room_name=room)
