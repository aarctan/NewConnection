# models.py
import json
import uuid

from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone

BLANK_PIC_URL = "https://i.imgur.com/7MUSXf9.png"


class Author(models.Model):
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
    """
    The requestor cannot be a foreign key since authors from other nodes do
    not exist in our database. Instead, model the follow requesting initiator
    as a json object.
    """
    requestor = models.JSONField()
    requestee = models.ForeignKey(
        Author, on_delete=models.CASCADE, related_name="requestee")

    def __str__(self):
        return f'{self.requestor} wants to follow {self.requestee}'


class Follower(models.Model):
    """
    This model represents a sending author following a receiving author.
    If the receiving author also follows the sending author, we consider it a friendship.
    """
    sender = models.JSONField()
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


class Post(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    type = models.TextField(default="post", editable=False)
    source = models.URLField(editable=False)
    origin = models.URLField(editable=False)
    author = models.ForeignKey(Author, on_delete=models.CASCADE)
    published = models.DateTimeField(default=timezone.now)
    visibility = models.TextField(default="PUBLIC")
    categories = models.JSONField()  # just a list
    unlisted = models.BooleanField(default=False)
    contentType = models.TextField()
    title = models.TextField()
    description = models.TextField()
    content = models.TextField()
    count = models.IntegerField(default=0)
    comments = models.TextField(editable=False)


class Comment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    type = models.TextField(default="comment", editable=False)
    published = models.DateTimeField(default=timezone.now)
    contentType = models.TextField(default="text/markdown", editable=False)
    author = models.JSONField()
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    comment = models.TextField()


class Like(models.Model):
    """
    A like has a many-to-one relationship with a post and a comment.
    It can be identified by either a post or a comment and the author that added the like.
    Cannot use foreign key for author since foreign authors do not exist in our
    database. Instead, model the author as a json object as per the spec.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    context = models.TextField(
        default="https://www.w3.org/ns/activitystreams", editable=False)
    type = models.TextField(default="Like", editable=False)
    author = models.JSONField()
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    comment = models.ForeignKey(
        Comment, on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        print(self.author)
        return ""


class Inbox(models.Model):
    type = models.TextField(default="inbox", editable=False)
    author = models.ForeignKey(Author, on_delete=models.CASCADE)
    items = models.TextField(default="[]")

    def get_items(self):
        return json.loads(self.items)

    def set_items(self, items):
        self.items = json.dumps(items)


class Node(models.Model):
    """
    A node is a host URI as well as username/password credentials that will
    be sent by the NewConnection client in basic-authenticated requests sent
    to that host.
    """
    host_uri = models.TextField(primary_key=True)
    username = models.TextField()
    password = models.TextField()
