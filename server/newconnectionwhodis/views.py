from django.db.models import query
from django.http import response
from rest_framework import viewsets
from rest_framework.response import Response
from django.core.paginator import Paginator

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
    serializer_class = serializers.PostSerializer
    def get_queryset(self):
        return models.Post.objects.filter(author=self.kwargs['author_pk'])

class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.CommentSerializer

    def get_queryset(self):
        author_post_comments = models.Comment.objects.order_by('-published').filter(
            author=self.kwargs['author_pk'],
            post=self.kwargs['posts_pk'])
        num_comments = len(author_post_comments)
        if num_comments <= 1:
            return author_post_comments
        page = self.request.query_params.get('page')
        size = self.request.query_params.get('size')
        if page:
            page = int(page)
        if size:
            size = int(size)
        if not page:
            page = 1
        page -= 1
        if not size:
            size = num_comments
        return author_post_comments[page*size : page*size+size]