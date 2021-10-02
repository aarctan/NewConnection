from rest_framework import viewsets
from rest_framework.response import Response

from .serializers import AuthorSerializer
from .models import Author

class AuthorsViewSet(viewsets.ViewSet):
    def list(self, request):
        page = self.request.query_params.get('page')
        size = self.request.query_params.get('size')
        if page:
            page = int(page)
        if size:
            size = int(size)
        num_authors = len(Author.objects.all())
        if not page:
            page = 1
        page -= 1
        if not size:
            size = num_authors
        response = {}
        response["type"] = "authors"
        response["items"] = AuthorSerializer(
            Author.objects.all()[page*size : page*size+size],
            context={'request': request}, many=True).data
        return Response(response)

class AuthorViewSet(viewsets.ModelViewSet):
    queryset = Author.objects.all().order_by('displayName')
    serializer_class = AuthorSerializer