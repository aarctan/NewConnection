from rest_framework.serializers import *
from django.db import transaction
from dj_rest_auth.serializers import LoginSerializer
from dj_rest_auth.registration.serializers import RegisterSerializer

from .models import *

SERVICE = 'api/v1/'


# https://stackoverflow.com/a/55128035
class LoginSerializer(LoginSerializer):
    email = None


# https://stackoverflow.com/a/55537624
class CustomRegisterSerializer(RegisterSerializer):
    email = None

    @transaction.atomic
    def save(self, request):
        user = super().save(request)
        user.is_active = False
        user.save()
        return user


class NodeSerializer(HyperlinkedModelSerializer):
    class Meta:
        model = Node
        fields = ["host_uri", "username", "password"]

class AuthorSerializer(HyperlinkedModelSerializer):
    id = SerializerMethodField('get_id_url')
    host = SerializerMethodField('get_host_url')
    url = SerializerMethodField('get_id_url')

    class Meta:
        model = Author
        fields = ('type', 'id', 'host', 'displayName', 'url', 'github', 'profileImage')

    def get_host_url(self, obj):
        uri = self.context['request'].build_absolute_uri('/')
        return f'{uri}'

    def get_id_url(self, obj):
        uri = self.context['request'].build_absolute_uri('/')
        return f'{uri}{SERVICE}author/{obj.id}'


class PostSerializer(HyperlinkedModelSerializer):
    id = SerializerMethodField('get_id_url')
    author = AuthorSerializer(many=False, read_only=True)
    source = SerializerMethodField('get_origin_url')
    origin = SerializerMethodField('get_origin_url')

    class Meta:
        model = Post
        fields = ('type', 'id', 'contentType',
            'content', 'author', 'title', 'description',
            'source', 'origin', 'published', 'categories', 'visibility', 'unlisted')
    
    def get_id_url(self, obj):
        uri = self.context['request'].build_absolute_uri('/')
        return f'{uri}{SERVICE}author/{obj.author.id}/posts/{obj.id}'
    
    def get_origin_url(self, obj):
        return self.context['request'].get_host()


class CommentSerializer(HyperlinkedModelSerializer):
    id = SerializerMethodField('get_id_url')
    author = AuthorSerializer(many=False, read_only=True)

    class Meta:
        model = Comment
        fields = ('type', 'author', 'comment', 'contentType', 'published', 'id')

    def get_id_url(self, obj):
        uri = self.context['request'].build_absolute_uri('/')
        return f'{uri}{SERVICE}author/{obj.author.id}/posts/{obj.post.id}/comments/{obj.id}'
        
        
class LikeSerializer(HyperlinkedModelSerializer):
    summary = SerializerMethodField('get_liker')
    object = SerializerMethodField('get_id_url')
    author = AuthorSerializer(many=False, read_only=True)

    class Meta:
        model = Like
        fields = ('context', 'summary', 'type', 'author', 'object')

    def get_id_url(self, obj):
        uri = self.context['request'].build_absolute_uri('/')
        if obj.comment:
            return f'{uri}{SERVICE}author/{obj.author.id}/posts/{obj.post.id}/comments/{obj.comment.id}'
        elif obj.post:
            return f'{uri}{SERVICE}author/{obj.author.id}/posts/{obj.post.id}'

    def get_liker(self, obj):
        if obj.comment:
            return obj.author.displayName + " likes your %s" % (obj.comment.type)
        elif obj.post:
            return obj.author.displayName + " likes your %s" % (obj.post.type)


class InboxSerializer(HyperlinkedModelSerializer):
    author = SerializerMethodField('get_id_url')
    items = SerializerMethodField('get_items')

    class Meta:
        model = Inbox
        fields = ('type', 'author', 'items')
    
    def get_id_url(self, obj):
        uri = self.context['request'].build_absolute_uri('/')
        return f'{uri}{SERVICE}author/{obj.author.id}'

    def get_items(self, obj):
        return obj.get_items()
        