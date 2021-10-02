# models.py
import uuid

from django.db import models


class Author(models.Model):
    """
    An author is a basic user. For now, they have a name and a github.
    """ 
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    type = models.CharField(max_length=6, default='author', editable=False)
    host = models.URLField(max_length=32, editable=False)
    displayName = models.CharField(max_length=32)
    url = models.URLField(max_length=128, editable=False)
    github = models.CharField(max_length=40)
    def __str__(self):
        return self.displayName
    def get_github_link(self):
        return f"https://github.com/{self.github}"


# TODO: Visibility settings for posts?
class Post(models.Model):
    """
    A post has a many-to-one relationship with an author.
    For now, there is no content associated with a post.
    """
    author = models.ForeignKey(Author, on_delete=models.CASCADE)


class Like(models.Model):
    """
    A like has a many-to-one relationship with a post.
    It can be identified by a post and an author that added a like.
    """
    liker = models.ForeignKey(Author, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)


class Comment(models.Model):
    """
    A comment has a many-to-one relationship with a post.
    It can be identified by a post and an author that commented.
    A comment contains a char text field.
    """
    commentor = models.ForeignKey(Author, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    comment = models.CharField(max_length=280)
