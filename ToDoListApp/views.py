from django.shortcuts import render
from ToDoListApp.models import Item
from ToDoListApp.serializers import ItemSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

'''
Clarify on how to handle different requests
'''


def index(request, template_name='index.html'):
    return render(request, template_name)


'''
Processing GET and POST requests to requesting a list of available objects or creating a new object



'''


@api_view(['GET', 'POST'])
def get_post_items(request):
    # get all items
    if request.method == 'GET':
        puppies = Item.objects.all()
        serializer = ItemSerializer(puppies, many=True)
        return Response(serializer.data, status=status.HTTP_202_ACCEPTED)

    # create a new item
    elif request.method == 'POST':
        serializer = ItemSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


'''
Processing DELETE and PUT requests on a specific item object

argument:
=========
pk: item_id of an item object
'''


@api_view(['DELETE', 'PUT'])
def update_delete_items(request, pk):
    try:
        item = Item.objects.get(pk=pk)
    except Item.DoesNotExist:
        content = {
            'status': 'Not Found'
        }
        return Response(content, status=status.HTTP_400_BAD_REQUEST)

    # update an item
    if request.method == 'PUT':
        serializer = ItemSerializer(item, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    # delete an item
    elif request.method == 'DELETE':
        item.delete()
        return Response('Success', status=status.HTTP_202_ACCEPTED)
