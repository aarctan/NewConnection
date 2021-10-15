from django.test import TestCase

from ..models import Author, Post, Comment, Like

class AuthorModelTests(TestCase):

    def test_fields(self):
        """
        Verify expected output for all Author fields
        """
        AUTHOR_NAME, AUTHOR_GITHUB = "Dylan", "dylandeco"
        author = Author(displayName=AUTHOR_NAME, github=AUTHOR_GITHUB)
        self.assertEqual(author.type, "author")
        self.assertEqual(author.displayName, AUTHOR_NAME)
        self.assertEqual(author.github, AUTHOR_GITHUB)

class LikeModelTests(TestCase):

    def test_post_like_fields(self):
        """
        Verify expected output for all Post Like fields
        """
        author = Author()
        post = Post(author=author)
        like = Like(author=author, post=post)
        self.assertEqual(like.type, "Like")
        self.assertEqual(like.author, author)
        self.assertEqual(like.post, post)
        self.assertEqual(like.comment, None)

    def test_comment_like_fields(self):
        """
        Verify expected output for all Comment Like fields
        """
        author = Author()
        post = Post(author=author)
        comment = Comment(author=author, post=post)
        like = Like(author=author, post=post, comment=comment)
        self.assertEqual(like.type, "Like")
        self.assertEqual(like.author, author)
        self.assertEqual(like.post, post)
        self.assertEqual(like.comment, comment)
