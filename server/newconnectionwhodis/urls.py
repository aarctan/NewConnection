from django.urls import include, path
from rest_framework_nested import routers
from . import views

router = routers.SimpleRouter()
router.register(r'authors', views.AuthorsViewSet, basename='authors')
router.register(r'author', views.AuthorViewSet)

# https://github.com/alanjds/drf-nested-routers
posts_router = routers.NestedSimpleRouter(router, r'author', lookup='author')
posts_router.register(r'posts', views.PostViewSet, basename='author-posts')

urlpatterns = [
    path('', include(router.urls)),
    path('', include(posts_router.urls)),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework'))
]