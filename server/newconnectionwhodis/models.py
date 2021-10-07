# models.py
import uuid

from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone

class Author(models.Model):
    """
    An author is a basic user. For now, they have a name and a github.
    """
    user = models.OneToOneField(to=User, on_delete=models.CASCADE)
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    type = models.CharField(max_length=6, default='author', editable=False)
    host = models.URLField(max_length=32, editable=False)
    url = models.URLField(max_length=128, editable=False)
    displayName = models.CharField(max_length=32)
    github = models.TextField(max_length=60)
    def __str__(self):
        return self.displayName

# TODO: Visibility settings for posts?
class Post(models.Model):
    """
    A post has a many-to-one relationship with an author.
    For now, there is no content associated with a post.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    type = models.CharField(max_length=4, default='post', editable=False)
    contentType = models.TextField(default="text/plain", editable=False)
    author = models.ForeignKey(Author, on_delete=models.CASCADE)
    content = models.TextField(default="lorem ipsum dolor sit amet")

class Comment(models.Model):
    """
    # TODO: Document this model
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    type = models.CharField(max_length=7, default='comment', editable=False)
    published = models.DateTimeField(default=timezone.now().isoformat(), editable=False)
    contentType = models.TextField(default='text/markdown', editable=False)
    author = models.ForeignKey(Author, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    comment = models.CharField(max_length=280)

class Like(models.Model):
    """
    A like has a many-to-one relationship with a post.
    It can be identified by a post and an author that added a like.
    """
    liker = models.ForeignKey(Author, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)


