import json

from django.contrib.auth.models import User

from .. import models

DEFAULT_PASSWORD = 'Thequickbrownfox23'

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

def response_to_json(response):
    """
    Decodes the binary reponse to json
    """
    json_str = response.content.decode('utf-8').replace("'", "\"")
    return json.loads(json_str)

