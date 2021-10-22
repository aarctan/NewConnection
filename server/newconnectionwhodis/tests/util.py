import json

from django.contrib.auth.models import User

from .. import models

DEFAULT_PASSWORD = 'Thequickbrownfox23'

def validate_reponse_with_serializer(serialized_obj, response):
    """
    Often times we wish to test a JSON response to make sure it matches
    expected serialization. This utility function takes in such a
    response and the serialization and returns true or false depending
    on if all fields match.
    """
    if (len(response) != len(serialized_obj)):
        return False
    for k in serialized_obj:
        if not k in response:
            return False
        if serialized_obj[k] != response[k]:
            return False
    return True

def create_author(displayName, github):
    """
    Create a new author given a name and github username.
    """
    user = User.objects.create(username=displayName, password=DEFAULT_PASSWORD)
    author = models.Author.objects.filter(user=user).get()
    author.github = github
    author.save()
    return author

def create_post(author, content):
    """
    Create a new post given an author and content
    """
    return models.Post.objects.create(
        author=author,
        content=content,
        title="Title",
        description="Description")

def create_comment(author, post, comment):
    """
    Create a new comment given an author, post, and content
    """
    return models.Comment.objects.create(author=author, post=post, comment=comment)

def create_post_like(author, post):
    """
    Create a new post like given an author and post
    """
    return models.Like.objects.create(author=author, post=post)

def create_comment_like(author, post, comment):
    """
    Create a new comment like given an author, post, and comment
    """
    return models.Like.objects.create(author=author, post=post, comment=comment)

def response_to_json(response):
    """
    Decodes the binary reponse to json
    """
    json_str = response.content.decode('utf-8').replace("'", "\"")
    return json.loads(json_str)

def add_follower(sender, receiver):
    """
    Makes author 'sender' a follower of author 'receiver'
    """
    models.Follower.objects.create(sender=sender, receiver=receiver)
