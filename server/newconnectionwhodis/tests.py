from django.test import TestCase

from .models import Author

def create_author(name, github_username):
    """
    Create a new author given a name and github username.
    """
    return Author.objects.create(name=name, github_username=github_username)

class AuthorModelTests(TestCase):

    def test_github_url(self):
        """
        Check if get_github_link returns a valid github url.
        """
        author = Author(name="Muhammad", github_username="Exanut")
        self.assertEqual(author.get_github_link(), "https://github.com/Exanut")
