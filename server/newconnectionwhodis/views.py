from rest_framework import viewsets
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response

from django.http import Http404

from . import serializers
from . import models

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

class UserdataViewSet(viewsets.ViewSet):
    """
    Maps user to its author and returns the authors serialized data
    """
    http_method_names = ['get']
    def retrieve(self, request, user):
        author = models.Author.objects.get(user__username=user)
        serializer = serializers.AuthorSerializer(
            author,context={'request': request})
        return Response(serializer.data)

class AuthorsViewSet(viewsets.ViewSet):
    http_method_names = ['get']
    def list(self, request):
        return Response({
            'type': "authors",
            'items': serializers.AuthorSerializer(
                paginate_queryset(
                    self.request.query_params,
                    models.Author.objects.all()),
                context={'request': request},
                many=True).data})

class AuthorViewSet(viewsets.ModelViewSet):
    http_method_names = ['get', 'put']
    queryset = models.Author.objects.all().order_by('displayName')
    serializer_class = serializers.AuthorSerializer
    def list(self, request, *args, **kwargs):
        return Http404("Cannot list /author/")

class PostViewSet(viewsets.ModelViewSet):
    http_method_names = ['get', 'post', 'delete']
    serializer_class = serializers.PostSerializer
    def get_queryset(self):
        return models.Post.objects.filter(
            author=self.kwargs['author_pk'])
    def perform_create(self, serializer):
        author_pk = self.kwargs['author_pk']
        author = models.Author.objects.filter(pk=author_pk).get()
        serializer.save(author=author)

class CommentViewSet(viewsets.ModelViewSet):
    http_method_names = ['get', 'post']
    serializer_class = serializers.CommentSerializer
    def get_queryset(self):
        return paginate_queryset(
            self.request.query_params,
            models.Comment.objects.order_by('-published').filter(
                author=self.kwargs['author_pk'],
                post=self.kwargs['posts_pk']))
    def perform_create(self, serializer):
        author_pk = self.kwargs['author_pk']
        posts_pk = self.kwargs['posts_pk']
        author = models.Author.objects.filter(pk=author_pk).get()
        post = models.Post.objects.filter(pk=posts_pk).get()
        serializer.save(author=author, post=post)

class PostLikesViewSet(viewsets.ModelViewSet):
    http_method_names = ['get', 'post']
    serializer_class = serializers.LikeSerializer
    def get_queryset(self):
        return paginate_queryset(
            self.request.query_params,
            models.Like.objects.filter(comment=None,
                author=self.kwargs['author_pk'],
                post=self.kwargs['posts_pk']))
    def perform_create(self, serializer):
        author_pk = self.kwargs['author_pk']
        posts_pk = self.kwargs['posts_pk']
        author = models.Author.objects.filter(pk=author_pk).get()
        post = models.Post.objects.filter(pk=posts_pk).get()
        serializer.save(author=author, post=post)

class CommentLikesViewSet(viewsets.ModelViewSet):
    http_method_names = ['get', 'post']
    serializer_class = serializers.LikeSerializer
    def get_queryset(self):
        return paginate_queryset(
            self.request.query_params,
            models.Like.objects.filter(
                author=self.kwargs['author_pk'],
                comment=self.kwargs['comments_pk']))
    def perform_create(self, serializer):
        author_pk = self.kwargs['author_pk']
        posts_pk = self.kwargs['posts_pk']
        comments_pk = self.kwargs['comments_pk']
        author = models.Author.objects.filter(pk=author_pk).get()
        post = models.Post.objects.filter(pk=posts_pk).get()
        comment = models.Comment.objects.filter(pk=comments_pk).get()
        serializer.save(author=author, post=post, comment=comment)

class LikedViewSet(viewsets.ModelViewSet):
    http_method_names = ['get']
    def list(self, request, **kwargs):
        return Response({
            'type': "Liked",
            'items': serializers.LikeSerializer(
                paginate_queryset(
                    self.request.query_params,
                    models.Like.objects.filter(
                author=kwargs.get("author_pk"))),
                context={'request': request},
                many=True).data})

class FollowersViewSet(viewsets.ViewSet):
    http_method_names = ['get', 'delete', 'post', 'put']

    # GET /author/{AUTHOR_ID}/followers
    def list(self, request, **kwargs):
        receiver = models.Author.objects.get(pk=kwargs.get("author_pk"))
        return Response({
            'type': "followers",
            'items': serializers.AuthorSerializer(
                    models.Author.objects.filter(sender__receiver=receiver),
                    context={'request': request},
                    many=True).data})
