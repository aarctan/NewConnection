# models.py
import json, uuid

from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone

BLANK_PIC_URL = "https://i.imgur.com/7MUSXf9.png"


class Author(models.Model):
    """
    An author is a basic user. For now, they have a name and a github.
    """

    user = models.OneToOneField(to=User, on_delete=models.CASCADE)
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    type = models.TextField(default="author", editable=False)
    host = models.TextField()
    url = models.TextField()
    displayName = models.TextField()
    github = models.TextField()
    profileImage = models.URLField(default=BLANK_PIC_URL)

    def __str__(self):
        return self.displayName


class FollowReq(models.Model):
    requestor = models.ForeignKey(
        Author, on_delete=models.CASCADE, related_name="requestor"
    )
    requestee = models.ForeignKey(
        Author, on_delete=models.CASCADE, related_name="requestee"
    )

    def __str__(self):
        return f'{self.requestor} wants to follow {self.requestee}'


class Follower(models.Model):
    """
    This model represents a sending author following a receiving author.
    If the receiving author also follows the sending author, we consider it a friendship.
    """

    sender = models.ForeignKey(
        Author, on_delete=models.CASCADE, related_name="sender"
        )
    receiver = models.ForeignKey(
        Author, on_delete=models.CASCADE, related_name="receiver"
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["sender", "receiver"], name="userFollowedUnique"
            )
        ]
    
    def __str__(self):
        return f'{self.sender} follows {self.receiver}'


# TODO: Visibility settings for posts?
class Post(models.Model):
    """
    A post has a many-to-one relationship with an author.
    For now, there is no content associated with a post.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    type = models.TextField(default="post", editable=False)
    source = models.URLField(editable=False)
    origin = models.URLField(editable=False)
    published = models.DateTimeField(default=timezone.now().isoformat(), editable=False)
    contentType = models.TextField()
    author = models.ForeignKey(Author, on_delete=models.CASCADE)
    visibility = models.TextField(default="PUBLIC")
    title = models.TextField()
    description = models.TextField()
    content = models.TextField()
    # https://stackoverflow.com/a/7151813
    # categories = models.TextField(null=True)
    # unlisted = models.BooleanField(default=False)


class Comment(models.Model):
    """
    # TODO: Document this model
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    type = models.TextField(default="comment", editable=False)
    published = models.DateTimeField(auto_now_add=True)
    contentType = models.TextField(default="text/markdown", editable=False)
    author = models.ForeignKey(Author, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    comment = models.TextField()


class Like(models.Model):
    """
    A like has a many-to-one relationship with a post and a comment.
    It can be identified by either a post or a comment and the author that added the like.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    context = models.TextField(
        default="https://www.w3.org/ns/activitystreams", editable=False
    )
    type = models.TextField(default="Like", editable=False)
    author = models.ForeignKey(Author, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    comment = models.ForeignKey(
        Comment, on_delete=models.CASCADE, null=True, blank=True
    )


class Inbox(models.Model):
    type = models.TextField(default="inbox", editable=False)
    author = models.ForeignKey(Author, on_delete=models.CASCADE)
    items = models.TextField(default="[]")

    def get_items(self):
        return json.loads(self.items)

    def set_items(self, items):
        self.items = json.dumps(items)
