from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import *
from .models import *
from . import view_util


class UserdataViewSet(viewsets.ViewSet):
    http_method_names = ['get']

    # GET maps user to its author and returns the authors serialized data
    def retrieve(self, request, user):
        author = Author.objects.get(user__username=user)
        serializer = AuthorSerializer(author, context={'request': request})
        return Response(serializer.data)


class AuthorsView(APIView):
    http_method_names = ['get']

    # GET: retrieve all profiles on the server paginated
    def get(self, request):
        return Response({
            'type': "authors",
            'items': AuthorSerializer(
                view_util.paginate_queryset(
                    self.request.query_params,
                    Author.objects.all()),
                context={'request': request},
                many=True).data})


class AuthorView(APIView):
    http_method_names = ['get', 'post']

    # GET: retrieve their profile
    def get(self, request, author_id):
        author = Author.objects.get(pk=author_id)
        serializer = AuthorSerializer(author, context={'request': request})
        return Response(serializer.data)

    # POST: update profile
    def post(self, request, author_id):
        author = Author.objects.get(pk=author_id)
        serializer = AuthorSerializer(author, context={'request': request})
        view_util.model_update(author, request.data)
        return Response(serializer.data)




class PostListView(APIView):
    http_method_names = ['get', 'post']

    # GET get recent posts of author (paginated)
    def get(self, request, author_id):
        author = Author.objects.get(pk=author_id)
        return Response(PostSerializer(
            view_util.paginate_queryset(
                self.request.query_params,
                Post.objects.filter(author=author)),
            context={'request': request},
            many=True).data)

    # POST create a new post but generate a post_id
    def post(self, request, author_id):
        author = Author.objects.get(pk=author_id)
        data = request.data
        post = view_util.create_post_with_id(author, data)
        return Response(
            PostSerializer(post, context={'request': request}).data,
            status=status.HTTP_201_CREATED)


class PostView(APIView):
    http_method_names = ['get', 'post', 'delete', 'put']

    # GET get the public post
    def get(self, request, author_id, post_id):
        post = Post.objects.get(pk=post_id)
        serializer = PostSerializer(post, context={'request': request})
        return Response(serializer.data)

    # POST update the post (must be authenticated)
    def post(self, request, author_id, post_id):
        post = Post.objects.get(pk=post_id)
        serializer = PostSerializer(post, context={'request': request})
        view_util.model_update(post, request.data)
        return Response(serializer.data)

    # DELETE remove the post
    def delete(self, request, author_id, post_id):
        post = Post.objects.get(pk=post_id)
        post.delete()
        serializer = PostSerializer(post, context={'request': request})
        return Response(serializer.data, status=status.HTTP_204_NO_CONTENT)

    # PUT create a post with that post_id
    def put(self, request, author_id, post_id):
        author = Author.objects.get(pk=author_id)
        data = request.data
        post = view_util.create_post_with_id(author, data, post_id)
        return Response(
            PostSerializer(post, context={'request': request}).data,
            status=status.HTTP_201_CREATED)


class CommentView(APIView):
    http_method_names = ['get', 'post']

    # GET get comments of the post
    def get(self, request, author_id, post_id):
        author = Author.objects.get(pk=author_id)
        post = Post.objects.get(pk=post_id)
        comments = view_util.paginate_queryset(
            self.request.query_params,
            Comment.objects.order_by('-published').filter(
                author=author, post=post)) 
        return Response({
            'type': "comments",
            'comments': CommentSerializer(
                comments, context={'request': request}, many=True).data})
    
    # POST if you post an object of “type”:”comment”, it will add your comment to the post
    def post(self, request, author_id, post_id):
        author = Author.objects.get(pk=author_id)
        post = Post.objects.get(pk=post_id)
        data = request.data
        comment = Comment.objects.create(
            author=author,
            post=post,
            comment=data['comment'])
        return Response(
            CommentSerializer(comment, context={'request': request}).data,
            status=status.HTTP_201_CREATED)


class PostLikesView(APIView):
    http_method_names = ['get']

    # GET a list of likes from other authors on author_id’s post post_id
    def get(self, request, author_id, post_id):
        post = Post.objects.get(pk=post_id)
        return Response(
            LikeSerializer(
                Like.objects.filter(post=post),
                context={'request': request}, many=True).data)


class CommentLikesView(APIView):
    http_method_names = ['get']

    # GET a list of likes from other authors on author_id’s post post_id comment comment_id
    def get(self, request, author_id, post_id, comment_id):
        comment = Comment.objects.get(pk=comment_id)
        return Response(
            LikeSerializer(
                Like.objects.filter(comment=comment),
                context={'request': request}, many=True).data)


class LikedView(APIView):
    http_method_names = ['get']

    # GET list what public things author_id liked
    def get(self, request, author_id):
        author = Author.objects.get(pk=author_id)
        return Response({
            'type': "liked",
            'items': LikeSerializer(
                Like.objects.filter(author=author),
                context={'request': request},
                many=True).data})


class InboxView(APIView):
    http_method_names = ['get', 'post', 'delete']

    # GET: if authenticated get a list of posts sent to {AUTHOR_ID}
    def get(self, request, author_id):
        author = Author.objects.get(pk=author_id)
        inbox = Inbox.objects.get(author=author)
        return Response(InboxSerializer(inbox, context={'request': request}).data)

    # POST: send a post to the author
    def post(self, request, author_id):
        author = Author.objects.get(pk=author_id)
        inbox = Inbox.objects.get(author=author)
        items = inbox.get_items()
        data = request.data
        items.append(data)
        inbox.set_items(items)
        inbox.save()
        inbox.refresh_from_db()
        return Response(InboxSerializer(inbox, context={'request': request}).data)

    # DELETE: clear the inbox
    def delete(self, request, author_id):
        author = Author.objects.get(pk=author_id)
        inbox = Inbox.objects.get(author=author)
        inbox.set_items(json.loads('[]'))
        inbox.save()
        inbox.refresh_from_db()
        return Response(InboxSerializer(inbox, context={'request': request}).data)

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
        pass
        '''
        try:
            Follower.objects.get(sender=follower_id, toAuthor=author_id).delete()
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)
        Response(status=status.HTTP_202_ACCEPTED)
        '''


    # PUT: Add a follower (must be authenticated)
    def put(self, request, author_id, follower_id):
        pass
        '''
        #if authorized....:
            
            author = request.user.author
            sender = Author.objects.get(id=follower_id)
            follow = Follower.objects.create(sender=sender, receiver=author)
            follow.save()
            return Response(status=status.HTTP_201_CREATED)
        
        #else:
            # wasnt authorized
            #eturn Response(status=status.HTTP_401_UNAUTHORIZED)
        '''

    # GET check if follower
    def get(self, request, author_id, follower_id):
        pass
        '''
        if (Follower.objects.filter(receiver=author_id, sender = follower_id) == None):
            return Response(status=status.HTTP_404_NOT_FOUND)
        else:
            follower = Author.objects.get(id=follower_id)
            return Response(FollowerSerializer(), status=status.HTTP_200_OK)
        '''
