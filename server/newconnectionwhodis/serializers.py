from rest_framework import serializers, relations

from .models import Author

class AuthorSerializer(serializers.HyperlinkedModelSerializer):
    # https://stackoverflow.com/a/23918960
    id = serializers.SerializerMethodField('get_id_url')
    host = serializers.SerializerMethodField('get_host_url')
    url = serializers.SerializerMethodField('get_id_url')
    github = serializers.SerializerMethodField('get_github_url')

    class Meta:
        model = Author
        fields = ('type', 'id', 'host', 'displayName', 'url', 'github')

    def get_host_url(self, obj):
        self.context['request']
        return 'http://' + self.context['request'].get_host()

    def get_id_url(self, obj):
        return 'http://' + self.context['request'].get_host() + f"/{obj.type}/{obj.id}"
    
    def get_github_url(self, obj):
        return f"https://github.com/{obj.github}"


class AuthorsSerializer(serializers.Serializer):
    type = serializers.CharField(max_length=6, default='authors')
    items = AuthorSerializer()