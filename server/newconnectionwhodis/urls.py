from django.urls import include, path
from rest_framework_nested import routers
from . import views

router = routers.SimpleRouter()
router.register(r'authors', views.AuthorsViewSet, basename='authors')
router.register(r'author', views.AuthorViewSet, basename='author')

author_router = routers.NestedSimpleRouter(router, r'author', lookup='author')
author_router.register(r'posts', views.PostViewSet, basename='posts')
author_router.register(r'liked', views.LikedViewSet, basename='liked')
author_router.register(r'followers', views.FollowersViewSet, basename='followers')

posts_router = routers.NestedSimpleRouter(author_router, r'posts', lookup='posts')
posts_router.register(r'likes', views.PostLikesViewSet, basename='likes')
posts_router.register(r'comments', views.CommentViewSet, basename='comments')

comments_router = routers.NestedSimpleRouter(posts_router, r'comments', lookup='comments')
comments_router.register(r'likes', views.CommentLikesViewSet, basename='likes')

urlpatterns = [
    path('', include(router.urls)),
    path('', include(author_router.urls)),
    path('', include(posts_router.urls)),
    path('', include(comments_router.urls)),
    path('userdata/<str:user>/', views.UserdataViewSet.as_view({'get': 'retrieve'})),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('dj-rest-auth/', include('dj_rest_auth.urls')),
    path('dj-rest-auth/registration/', include('dj_rest_auth.registration.urls')),
]
