from rest_framework import serializers, relations

from . import models

class AuthorSerializer(serializers.HyperlinkedModelSerializer):
    # https://stackoverflow.com/a/23918960
    id = serializers.SerializerMethodField('get_id_url')
    host = serializers.SerializerMethodField('get_host_url')
    url = serializers.SerializerMethodField('get_id_url')
    github = serializers.SerializerMethodField('get_github_url')

    class Meta:
        model = models.Author
        fields = ('type', 'id', 'host', 'displayName', 'url', 'github')

    def get_host_url(self, obj):
        self.context['request']
        return 'http://' + self.context['request'].get_host()

    def get_id_url(self, obj):
        return 'http://' + self.context['request'].get_host() + f"/{obj.type}/{obj.id}"
    
    def get_github_url(self, obj):
        return f"https://github.com/{obj.github}"

class PostSerializer(serializers.HyperlinkedModelSerializer):
    id = serializers.SerializerMethodField('get_id_url')
    author = AuthorSerializer(many=False)

    class Meta:
        model = models.Post
        fields = ('type', 'id', 'contentType', 'content', 'author')
    
    def get_id_url(self, obj):
        host = self.context['request'].get_host()
        return f'http://{host}/author/{obj.author.id}/posts/{obj.id}'
