from rest_framework import serializers
from rest_framework_nested.serializers import NestedHyperlinkedModelSerializer

from dj_rest_auth.serializers import LoginSerializer
from dj_rest_auth.registration.serializers import RegisterSerializer

from .models import *

SERVICE = '/api/v1/'

# https://stackoverflow.com/a/55128035
class LoginSerializer(LoginSerializer):
    email = None

class CustomRegisterSerializer(RegisterSerializer):
    email = None


class AuthorSerializer(serializers.HyperlinkedModelSerializer):
    id = serializers.SerializerMethodField('get_id_url')
    host = serializers.SerializerMethodField('get_host_url')
    url = serializers.SerializerMethodField('get_id_url')

    class Meta:
        model = Author
        fields = ('type', 'id', 'host', 'displayName', 'url', 'github', 'profileImage')

    def get_host_url(self, obj):
        host = self.context['request'].get_host()
        return f'http://{host}'

    def get_id_url(self, obj):
        host = self.context['request'].get_host()
        return f'http://{host}{SERVICE}author/{obj.id}'


class PostSerializer(NestedHyperlinkedModelSerializer):
    id = serializers.SerializerMethodField('get_id_url')
    author = AuthorSerializer(many=False, read_only=True)
    # TODO: source and origin probably need to be changed
    source = serializers.SerializerMethodField('get_origin_url')
    origin = serializers.SerializerMethodField('get_origin_url')

    class Meta:
        model = Post
        fields = ('type', 'id', 'contentType',
            'content', 'author', 'title', 'description',
            'source', 'origin')
    
    def get_id_url(self, obj):
        host = self.context['request'].get_host()
        return f'http://{host}/author/{obj.author.id}/posts/{obj.id}'
    
    def get_origin_url(self, obj):
        return 'http://' + self.context['request'].get_host()


class CommentSerializer(NestedHyperlinkedModelSerializer):
    id = serializers.SerializerMethodField('get_id_url')
    author = AuthorSerializer(many=False, read_only=True)

    class Meta:
        model = Comment
        fields = ('type', 'author', 'comment', 'contentType', 'published', 'id')

    def get_id_url(self, obj):
        host = self.context['request'].get_host()
        return f'http://{host}/author/{obj.author.id}/posts/{obj.post.id}/comments/{obj.id}'
        
        
class LikeSerializer(NestedHyperlinkedModelSerializer):
    summary = serializers.SerializerMethodField('get_liker')
    object = serializers.SerializerMethodField('get_id_url')
    author = AuthorSerializer(many=False, read_only=True)
    class Meta:
        model = Like
        fields = ('summary', 'type', 'author', 'object')

    def get_id_url(self, obj):
        host = self.context['request'].get_host()
        if obj.comment:
            return f'http://{host}/author/{obj.author.id}/posts/{obj.post.id}/comments/{obj.comment.id}'
        elif obj.post:
            return f'http://{host}/author/{obj.author.id}/posts/{obj.post.id}'

    def get_liker(self, obj):
        if obj.comment:
            return obj.author.displayName + " likes your %s" % (obj.comment.type)
        elif obj.post:
            return obj.author.displayName + " likes your %s" % (obj.post.type)
