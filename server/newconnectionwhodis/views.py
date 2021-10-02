from rest_framework import viewsets
from rest_framework.response import Response

from .serializers import AuthorSerializer
from .models import Author

class AuthorsViewSet(viewsets.ViewSet):
    def list(self, request):
        response = {}
        response["type"] = "authors"
        response["items"] = AuthorSerializer(
            Author.objects.all(), context={'request': request}, many=True).data
        return Response(response)

class AuthorViewSet(viewsets.ModelViewSet):
    queryset = Author.objects.all().order_by('displayName')
    serializer_class = AuthorSerializer