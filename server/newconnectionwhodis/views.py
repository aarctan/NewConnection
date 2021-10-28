from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import *
from .models import *
from . import view_util


class UserdataViewSet(viewsets.ViewSet):
    http_method_names = ["get"]

    # GET maps user to its author and returns the authors serialized data
    def retrieve(self, request, user):
        author = Author.objects.get(user__username=user)
        serializer = AuthorSerializer(author, context={"request": request})
        return Response(serializer.data)


class AuthorsView(APIView):
    http_method_names = ["get"]

    # GET: retrieve all profiles on the server paginated
    def get(self, request):
        return Response(
            {
                "type": "authors",
                "items": AuthorSerializer(
                    view_util.paginate_queryset(
                        self.request.query_params, Author.objects.all()
                    ),
                    context={"request": request},
                    many=True,
                ).data,
            }
        )


class AuthorView(APIView):
    http_method_names = ["get", "post"]

    # GET: retrieve their profile
    def get(self, request, author_id):
        author = Author.objects.get(pk=author_id)
        serializer = AuthorSerializer(author, context={"request": request})
        return Response(serializer.data)

    # POST: update profile
    def post(self, request, author_id):
        author = Author.objects.get(pk=author_id)
        serializer = AuthorSerializer(author, context={"request": request})
        view_util.model_update(author, request.data)
        return Response(serializer.data)



class FriendRequestView(APIView):
    http_method_names = ['post']

    #POST: send another user a friend request to inbox
    def post(self, request, author_id, receiver_id):
        pass


class FollowerListView(APIView):
    http_method_names = ['get']

    # GET: get a list of authors who are their followers
    def get(self, request, author_id):
        return Response({
            'type': "followers",
            'items': AuthorSerializer(
                Author.objects.filter(sender__receiver=author_id),
                context={'request': request},
                many=True).data})


class FollowerView(APIView):
    http_method_names = ['delete', 'put', 'get']

    # DELETE: remove a follower
    def delete(self, request, author_id, follower_id):
        try:
            follower = Author.objects.get(id=follower_id)
            follower.delete()
            return Response(
                AuthorSerializer(follower, context={"request": request}).data,
                status=status.HTTP_202_ACCEPTED)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)

    # PUT: Add a follower (must be authenticated)
    def put(self, request, author_id, follower_id):
        receiver = Author.objects.get(pk=author_id)
        sender = Author.objects.get(pk=follower_id)
        req = FollowReq.objects.get(requestor=sender, requestee=receiver)
        if not req:
            return Response(status=status.HTTP_404_NOT_FOUND)
        req.delete()
        follow = Follower.objects.create(sender=sender, receiver=receiver)
        follow.save()
        return Response(status=status.HTTP_201_CREATED)

    # GET check if follower
    def get(self, request, author_id, follower_id):
        if not Follower.objects.filter(receiver=author_id, sender=follower_id):
            return Response(status=status.HTTP_404_NOT_FOUND)
        else:
            follower = Author.objects.get(id=follower_id)
            return Response(AuthorSerializer(follower, context={"request": request}).data)


class PostListView(APIView):
    http_method_names = ["get", "post"]

    # GET get recent posts of author (paginated)
    def get(self, request, author_id):
        author = Author.objects.get(pk=author_id)
        return Response(
            PostSerializer(
                view_util.paginate_queryset(
                    self.request.query_params, Post.objects.filter(author=author)
                ),
                context={"request": request},
                many=True,
            ).data
        )

    # POST create a new post but generate a post_id
    def post(self, request, author_id):
        author = Author.objects.get(pk=author_id)
        data = request.data
        post = view_util.create_post_with_id(author, data)
        return Response(
            PostSerializer(post, context={"request": request}).data,
            status=status.HTTP_201_CREATED,
        )


class PostView(APIView):
    http_method_names = ["get", "post", "delete", "put"]

    # GET get the public post
    def get(self, request, author_id, post_id):
        post = Post.objects.get(pk=post_id)
        serializer = PostSerializer(post, context={"request": request})
        return Response(serializer.data)

    # POST update the post (must be authenticated)
    def post(self, request, author_id, post_id):
        post = Post.objects.get(pk=post_id)
        serializer = PostSerializer(post, context={"request": request})
        view_util.model_update(post, request.data)
        return Response(serializer.data)

    # DELETE remove the post
    def delete(self, request, author_id, post_id):
        post = Post.objects.get(pk=post_id)
        post.delete()
        serializer = PostSerializer(post, context={"request": request})
        return Response(serializer.data, status=status.HTTP_204_NO_CONTENT)

    # PUT create a post with that post_id
    def put(self, request, author_id, post_id):
        author = Author.objects.get(pk=author_id)
        data = request.data
        post = view_util.create_post_with_id(author, data, post_id)
        return Response(
            PostSerializer(post, context={"request": request}).data,
            status=status.HTTP_201_CREATED,
        )


class CommentView(APIView):
    http_method_names = ["get", "post"]

    # GET get comments of the post
    def get(self, request, author_id, post_id):
        author = Author.objects.get(pk=author_id)
        post = Post.objects.get(pk=post_id)
        comments = view_util.paginate_queryset(
            self.request.query_params,
            Comment.objects.order_by("-published").filter(post=post),
        )
        return Response(
            {
                "type": "comments",
                "comments": CommentSerializer(
                    comments, context={"request": request}, many=True
                ).data,
            }
        )

    # POST if you post an object of “type”:”comment”, it will add your comment to the post
    def post(self, request, author_id, post_id):
        author = Author.objects.get(pk=author_id)
        post = Post.objects.get(pk=post_id)
        data = request.data
        comment = Comment.objects.create(
            author=author, post=post, comment=data["comment"]
        )
        return Response(
            CommentSerializer(comment, context={"request": request}).data,
            status=status.HTTP_201_CREATED,
        )


class PostLikesView(APIView):
    http_method_names = ["get"]

    # GET a list of likes from other authors on author_id’s post post_id
    def get(self, request, author_id, post_id):
        post = Post.objects.get(pk=post_id)
        return Response(
            LikeSerializer(
                Like.objects.filter(post=post, comment=None), context={"request": request}, many=True
            ).data
        )


class CommentLikesView(APIView):
    http_method_names = ["get"]

    # GET a list of likes from other authors on author_id’s post post_id comment comment_id
    def get(self, request, author_id, post_id, comment_id):
        comment = Comment.objects.get(pk=comment_id)
        return Response(
            LikeSerializer(
                Like.objects.filter(comment=comment),
                context={"request": request},
                many=True,
            ).data
        )


class LikedView(APIView):
    http_method_names = ["get"]

    # GET list what public things author_id liked
    def get(self, request, author_id):
        author = Author.objects.get(pk=author_id)
        return Response(
            {
                "type": "liked",
                "items": LikeSerializer(
                    Like.objects.filter(author=author),
                    context={"request": request},
                    many=True,
                ).data,
            }
        )


class InboxView(APIView):
    http_method_names = ["get", "post", "delete"]

    # GET: if authenticated get a list of posts sent to {AUTHOR_ID}
    def get(self, request, author_id):
        author = Author.objects.get(pk=author_id)
        inbox = Inbox.objects.get(author=author)
        return Response(InboxSerializer(inbox, context={"request": request}).data)

    # POST: send a post to the author
    def post(self, request, author_id):
        author = Author.objects.get(pk=author_id)
        inbox = Inbox.objects.get(author=author)
        items = inbox.get_items()
        data = request.data
        item_type = data['type']
        if item_type == 'Like':
            like_obj_url = data['object']
            post_id = like_obj_url.split('posts/')[-1].split('/')[0]
            post_obj = Post.objects.get(pk=post_id)
            comment_obj = None
            if 'comments' in like_obj_url:
                comment_id = like_obj_url.split('/')[-1]
                comment_obj = Comment.objects.get(pk=comment_id)
            Like.objects.create(author=author, post=post_obj, comment=comment_obj)
        elif item_type == "Follow":
            actor_id = data['actor']['id'].split('/')[-1]
            object_id = data['object']['id'].split('/')[-1]
            sender = Author.objects.get(pk=actor_id)
            receiver = Author.objects.get(pk=object_id)
            FollowReq.objects.create(requestor=sender, requestee=receiver)
        elif item_type == 'post':
            pass
        items.append(data)
        inbox.set_items(items)
        inbox.save()
        return Response(
            InboxSerializer(inbox, context={"request": request}).data,
            status=status.HTTP_201_CREATED)

    # DELETE: clear the inbox
    def delete(self, request, author_id):
        author = Author.objects.get(pk=author_id)
        inbox = Inbox.objects.get(author=author)
        inbox.set_items(json.loads("[]"))
        inbox.save()
        return Response(InboxSerializer(inbox, context={'request': request}).data)
