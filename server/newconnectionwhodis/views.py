from rest_framework import viewsets

from .serializers import AuthorSerializer
from .models import Author


class AuthorViewSet(viewsets.ModelViewSet):
    queryset = Author.objects.all().order_by('displayName')
    serializer_class = AuthorSerializer
