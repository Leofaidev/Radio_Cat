from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied

from .models import Cat
from .serializers import CatSerializer


class CatListCreateView(generics.ListCreateAPIView):
    serializer_class = CatSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Cat.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class CatDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CatSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Cat.objects.all()

    def get_object(self):
        obj = super().get_object()
        if obj.owner != self.request.user:
            raise PermissionDenied('You do not have permission to access this cat.')
        return obj
