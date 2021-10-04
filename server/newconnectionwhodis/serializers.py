from rest_framework import serializers
from rest_framework_nested.serializers import NestedHyperlinkedModelSerializer

from . import models

class AuthorSerializer(serializers.HyperlinkedModelSerializer):
    # https://stackoverflow.com/a/23918960
    id = serializers.SerializerMethodField('get_id_url')
    host = serializers.SerializerMethodField('get_host_url')
    url = serializers.SerializerMethodField('get_id_url')

    class Meta:
        model = models.Author
        fields = ('type', 'id', 'host', 'displayName', 'url', 'github')

    def get_host_url(self, obj):
        return 'http://' + self.context['request'].get_host()

    def get_id_url(self, obj):
        return 'http://' + self.context['request'].get_host() + f"/{obj.type}/{obj.id}"

class PostSerializer(NestedHyperlinkedModelSerializer):
    id = serializers.SerializerMethodField('get_id_url')
    # https://www.py4u.net/discuss/188993
    author = AuthorSerializer(many=False, read_only=True)

    class Meta:
        model = models.Post
        fields = ('type', 'id', 'contentType', 'content', 'author')
    
    def get_id_url(self, obj):
        host = self.context['request'].get_host()
        return f'http://{host}/author/{obj.author.id}/posts/{obj.id}'

class CommentSerializer(NestedHyperlinkedModelSerializer):
    id = serializers.SerializerMethodField('get_id_url')
    author = AuthorSerializer(many=False, read_only=True)
    parent_lookup_kwargs = {
        'post_pk': 'post__pk',
        'author_pk': 'post__author__pk',
    }
    class Meta:
        model = models.Comment
        fields = ('type', 'author', 'comment', 'contentType', 'published', 'id')

    def get_id_url(self, obj):
        host = self.context['request'].get_host()
        return f'http://{host}/author/{obj.author.id}/posts/{obj.post.id}/comments/{obj.id}'
