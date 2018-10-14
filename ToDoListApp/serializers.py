from rest_framework import serializers
from ToDoListApp.models import Item

# Serializer which is used for transforming objects to JSON and vice versa


class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ('item_id', 'title', 'description', 'start_date', 'comp_date', 'status')

