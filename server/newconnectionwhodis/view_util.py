import uuid

from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import *
from .models import *

def paginate_queryset(query_params, queryset):
    """
    Utility function to slice a queryset if pagination parameters
    'page' and 'size' are provided.
    """
    num_models = len(queryset)
    # slicing empty or singleton querysets does not return queryset.
    if num_models <= 1:
        return queryset
    page = query_params.get('page')
    size = query_params.get('size')
    page = int(page) - 1 if page else 0
    size = int(size) if size else num_models
    return queryset[page * size : page * size + size]

def model_update(model, update_fields):
    """
    Utility function to update a model given a dict of fields to replace
    existing ones in the model. Allows for partial updating.
    Assumes all fields are valid.
    """
    for k in update_fields:
        setattr(model, k, update_fields[k])
    model.save()
    model.refresh_from_db()

def create_post_with_id(author, data, id=None):
    """
    A post can be created with a given uuid or be randomly generated.
    """
    if not id:
        id = uuid.uuid4()
    post = Post.objects.create(
        id=id,
        author=author,
        content=data['content'],
        title=data['title'],
        description=data['description'])
    return post