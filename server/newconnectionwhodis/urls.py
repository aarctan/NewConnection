from django.urls import path, include
from .views import *

SERVICE = "api/v1/"

urlpatterns = [
    # Login and registration endpoints only for NewConnection clients
    path(f"{SERVICE}api-auth/", include("rest_framework.urls", namespace="rest_framework")),
    path(f"{SERVICE}dj-rest-auth/registration/", include("dj_rest_auth.registration.urls")),
    path(f"{SERVICE}dj-rest-auth/", include("dj_rest_auth.urls")),
    path(f"{SERVICE}accounts/", include('allauth.urls')),

    # Endpoints only for NewConnection clients
    path(f"{SERVICE}userdata/<str:user>/", UserdataViewSet.as_view({"get": "retrieve"})),
    path(f"{SERVICE}nodes/", NodesListViewSet.as_view()),

    # API endpoints, as per the spec outlined in:
    # https://github.com/abramhindle/CMPUT404-project-socialdistribution/blob/master/project.org
    path(f"{SERVICE}authors/", AuthorsView.as_view(), name="authors"),
    path(f"{SERVICE}author/<str:author_id>/", AuthorView.as_view(), name="author"),
    path(f"{SERVICE}author/<str:author_id>/followers/", FollowerListView.as_view(), name="follower-list"),
    path(f"{SERVICE}author/<str:author_id>/followers/<str:follower_id>/", FollowerView.as_view(), name="follower"),
    path(f"{SERVICE}author/<str:author_id>/posts/", PostListView.as_view(), name="post-list"),
    path(f"{SERVICE}author/<str:author_id>/posts/<str:post_id>/", PostView.as_view(), name="post-list"),
    path(f"{SERVICE}author/<str:author_id>/posts/<str:post_id>/comments/", CommentView.as_view(), name="comment"),
    path(f"{SERVICE}author/<str:author_id>/liked/", LikedView.as_view(), name="liked"),
    path(f"{SERVICE}author/<str:author_id>/posts/<str:post_id>/likes/", PostLikesView.as_view(), name="post-likes"),
    path(f"{SERVICE}author/<str:author_id>/posts/<str:post_id>/comments/<str:comment_id>/likes/", CommentLikesView.as_view(), name="comment-likes",),
    path(f"{SERVICE}author/<str:author_id>/inbox/", InboxView.as_view(), name="inbox"),

    path(f"{SERVICE}authors", AuthorsView.as_view(), name="authors"),
    path(f"{SERVICE}author/<str:author_id>", AuthorView.as_view(), name="author"),
    path(f"{SERVICE}author/<str:author_id>/followers", FollowerListView.as_view(), name="follower-list"),
    path(f"{SERVICE}author/<str:author_id>/followers/<str:follower_id>", FollowerView.as_view(), name="follower"),
    path(f"{SERVICE}author/<str:author_id>/posts", PostListView.as_view(), name="post-list"),
    path(f"{SERVICE}author/<str:author_id>/posts/<str:post_id>", PostView.as_view(), name="post-list"),
    path(f"{SERVICE}author/<str:author_id>/posts/<str:post_id>/comments", CommentView.as_view(), name="comment"),
    path(f"{SERVICE}author/<str:author_id>/liked", LikedView.as_view(), name="liked"),
    path(f"{SERVICE}author/<str:author_id>/posts/<str:post_id>/likes", PostLikesView.as_view(), name="post-likes"),
    path(f"{SERVICE}author/<str:author_id>/posts/<str:post_id>/comments/<str:comment_id>/likes", CommentLikesView.as_view(), name="comment-likes",),
    path(f"{SERVICE}author/<str:author_id>/inbox", InboxView.as_view(), name="inbox"),
]
