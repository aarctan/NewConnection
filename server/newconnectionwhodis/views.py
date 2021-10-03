from django.db.models import query
from rest_framework import viewsets
from rest_framework.response import Response

from . import serializers
from . import models

class AuthorsViewSet(viewsets.ViewSet):
    def list(self, request):
        page = self.request.query_params.get('page')
        size = self.request.query_params.get('size')
        if page:
            page = int(page)
        if size:
            size = int(size)
        num_authors = len(models.Author.objects.all())
        if not page:
            page = 1
        page -= 1
        if not size:
            size = num_authors
        response = {}
        response["type"] = "authors"
        response["items"] = serializers.AuthorSerializer(
            models.Author.objects.all()[page*size : page*size+size],
            context={'request': request}, many=True).data
        return Response(response)

class AuthorViewSet(viewsets.ModelViewSet):
    queryset = models.Author.objects.all().order_by('displayName')
    serializer_class = serializers.AuthorSerializer

class PostViewSet(viewsets.ModelViewSet):
    queryset = models.Post.objects.all() # TODO: filter to get posts by author
    serializer_class = serializers.PostSerializer
