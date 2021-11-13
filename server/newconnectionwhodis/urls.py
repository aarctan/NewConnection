from django.urls import path, include
from .views import *
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

SERVICE = "api/v1/"

schema_view = get_schema_view(
   openapi.Info(
      title="NewConnenction APIs",
      default_version='v1',
      description="Test description",
      terms_of_service="Apache License 2.0",
      contact=openapi.Contact(email="contact@snippets.local"),
      license=openapi.License(name="Apache License 2.0"),
   ),
   public=True,
   permission_classes=[permissions.AllowAny],
)

urlpatterns = [
    path(
        f"{SERVICE}api-auth/",
        include("rest_framework.urls", namespace="rest_framework"),
    ),
    path(
        f"{SERVICE}dj-rest-auth/registration/",
        include("dj_rest_auth.registration.urls"),
    ),
    path(f"{SERVICE}dj-rest-auth/", include("dj_rest_auth.urls")),
    path(f"{SERVICE}accounts/", include('allauth.urls')),
    path(
        f"{SERVICE}userdata/<str:user>/", UserdataViewSet.as_view({"get": "retrieve"})
    ),
    path(f"{SERVICE}authors/", AuthorsView.as_view(), name="authors"),
    path(f"{SERVICE}author/<str:author_id>/", AuthorView.as_view(), name="author"),
    path(
        f"{SERVICE}author/<str:author_id>/followers/",
        FollowerListView.as_view(),
        name="follower-list",
    ),
    path(
        f"{SERVICE}author/<str:author_id>/followers/<str:follower_id>/",
        FollowerView.as_view(),
        name="follower",
    ),
    path(
        f"{SERVICE}author/<str:author_id>/posts/",
        PostListView.as_view(),
        name="post-list",
    ),
    path(
        f"{SERVICE}author/<str:author_id>/posts/<str:post_id>/",
        PostView.as_view(),
        name="post-list",
    ),
    path(
        f"{SERVICE}author/<str:author_id>/posts/<str:post_id>/comments/",
        CommentView.as_view(),
        name="comment",
    ),
    path(f"{SERVICE}author/<str:author_id>/liked/", LikedView.as_view(), name="liked"),
    path(
        f"{SERVICE}author/<str:author_id>/posts/<str:post_id>/likes/",
        PostLikesView.as_view(),
        name="post-likes",
    ),
    path(
        f"{SERVICE}author/<str:author_id>/posts/<str:post_id>/comments/<str:comment_id>/likes/",
        CommentLikesView.as_view(),
        name="comment-likes",
    ),
    path(f"{SERVICE}author/<str:author_id>/inbox/", InboxView.as_view(), name="inbox"),

    path('swagger', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
]
