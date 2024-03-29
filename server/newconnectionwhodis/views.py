from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView

from rest_framework.authentication import TokenAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly

from .serializers import *
from .models import *
from . import view_util


class UserdataViewSet(viewsets.ViewSet):
    http_method_names = ["get"]

    # GET: maps user to its author and returns the authors serialized data
    def retrieve(self, request, user):
        author = Author.objects.get(user__username=user)
        serializer = AuthorSerializer(author, context={"request": request})
        return Response(serializer.data)


class NodesListViewSet(APIView):
    http_method_names = ["get"]

    # GET: retrieve all nodes (host & credentials)
    def get(self, request):
        return Response(NodeSerializer(Node.objects.all(), many=True).data)


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
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly]
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

    # POST: send another user a friend request to inbox
    def post(self, request, author_id, receiver_id):
        pass


class FollowerListView(APIView):
    http_method_names = ['get']

    # GET: get a list of authors who are their followers
    def get(self, request, author_id):
        x = Follower.objects.filter(receiver=author_id)
        return Response({
            'type': "followers",
            'items': [followerobj.sender for followerobj in x]})


class FollowerView(APIView):
    authentication_classes = [TokenAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly]
    http_method_names = ['delete', 'put', 'get']

    # DELETE: remove a follower
    def delete(self, request, author_id, follower_id):
        receiver = Author.objects.get(pk=author_id)
        try:
            Follower.objects.get(
                receiver=receiver, sender__id__endswith=follower_id).delete()
            return Response(status=status.HTTP_202_ACCEPTED)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)

    # PUT: Add a follower (must be authenticated)
    def put(self, request, author_id, follower_id):
        receiver = Author.objects.get(pk=author_id)
        req = FollowReq.objects.get(
            requestor__id__endswith=follower_id, requestee=receiver)
        if not req:
            return Response(status=status.HTTP_404_NOT_FOUND)
        req.delete()
        follow = Follower.objects.create(
            sender=req.requestor, receiver=receiver)
        follow.save()
        return Response(status=status.HTTP_201_CREATED)

    # GET: check if follower
    def get(self, request, author_id, follower_id):
        receiver = Author.objects.get(pk=author_id)
        if not Follower.objects.filter(receiver=receiver, sender__id__endswith=follower_id):
            # return Response(status=status.HTTP_404_NOT_FOUND)
            return Response("false")
        else:
            #follower = Author.objects.get(id=follower_id)
            # return Response(AuthorSerializer(follower, context={"request": request}).data)
            return Response("true")


class PostListView(APIView):
    http_method_names = ["get", "post"]

    # GET: get recent posts of author (paginated)
    def get(self, request, author_id):
        author = Author.objects.get(pk=author_id)
        public_posts = Post.objects.filter(author=author, visibility='PUBLIC')

        return Response(
            PostSerializer(
                view_util.paginate_queryset(
                    self.request.query_params, public_posts
                ),
                context={"request": request},
                many=True,
            ).data
        )

    # POST: create a new post but generate a post_id
    def post(self, request, author_id):
        author = Author.objects.get(pk=author_id)
        data = request.data
        post = view_util.create_post_with_id(author, data)
        return Response(
            PostSerializer(post, context={"request": request}).data,
            status=status.HTTP_201_CREATED,
        )


class PostView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly]
    http_method_names = ["get", "post", "delete", "put"]

    # GET: get the public post
    def get(self, request, author_id, post_id):
        post = Post.objects.get(pk=post_id)
        serializer = PostSerializer(post, context={"request": request})
        return Response(serializer.data)

    # POST: update the post (must be authenticated)
    def post(self, request, author_id, post_id):
        post = Post.objects.get(pk=post_id)
        serializer = PostSerializer(post, context={"request": request})
        view_util.model_update(post, request.data)
        return Response(serializer.data)

    # DELETE: remove the post
    def delete(self, request, author_id, post_id):
        post = Post.objects.get(pk=post_id)
        post.delete()
        serializer = PostSerializer(post, context={"request": request})
        return Response(serializer.data, status=status.HTTP_204_NO_CONTENT)

    # PUT: create a post with that post_id
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

    # GET: get comments of the post
    def get(self, request, author_id, post_id):
        post = Post.objects.get(pk=post_id)
        comments = view_util.paginate_queryset(
            self.request.query_params,
            Comment.objects.order_by(
                "-published").filter(post=post, post__visibility="PUBLIC"),
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
        """
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
        """
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)


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

    # GET: list what public things author_id liked
    def get(self, request, author_id):
        # author_id is only the uuid, it is not a uri. However, our schema
        # stores the full uri, so it needs to be stripped
        return Response(
            {
                "type": "liked",
                "items": LikeSerializer(
                    Like.objects.filter(author__id__endswith=author_id),
                    context={"request": request},
                    many=True,
                ).data,
            }
        )


class InboxView(APIView):
    authentication_classes = [BasicAuthentication]
    permission_classes = [IsAuthenticated]
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
        item_type = data['type'].lower()

        save_inbox = True
        if item_type == 'like':
            liker = data['author']
            like_obj_url = data['object']
            post_id = like_obj_url.split('posts/')[-1].split('/')[0]
            post_obj = Post.objects.get(pk=post_id)
            comment_obj = None
            if 'comments' in like_obj_url:
                comment_id = like_obj_url.split('/')[-1]
                comment_obj = Comment.objects.get(pk=comment_id)
            Like.objects.create(author=liker, post=post_obj,
                                comment=comment_obj)
        elif item_type == "comment":
            post_id = data['id'].split('posts/')[-1].split('/')[0]
            post_obj = Post.objects.get(pk=post_id)
            Comment.objects.create(
                author=data['author'], post=post_obj, comment=data['comment'])
        elif item_type == "follow":
            object_id = data['object']['id'].split('/')[-1]
            receiver = Author.objects.get(pk=object_id)
            sender = data['actor']
            try:
                FollowReq.objects.get(requestor=sender, requestee=receiver)
                save_inbox = False
            except:
                FollowReq.objects.create(requestor=sender, requestee=receiver)

        if save_inbox:
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
