from rest_framework import serializers
from .models import Cat


class CatSerializer(serializers.ModelSerializer):
    owner_username = serializers.ReadOnlyField(source='owner.username')

    class Meta:
        model = Cat
        fields = [
            'id', 'name', 'age', 'breed', 'is_hairy', 'color',
            'created_at', 'updated_at', 'owner', 'owner_username'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'owner']
