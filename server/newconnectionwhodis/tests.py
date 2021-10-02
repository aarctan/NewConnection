from django.test import TestCase

from .models import Author

def create_author(displayName, github):
    """
    Create a new author given a name and github username.
    """
    return Author.objects.create(displayName=displayName, github=github)

class AuthorModelTests(TestCase):

    def test_github_url(self):
        """
        Check if get_github_link returns a valid github url.
        """
        author = Author(displayName="Muhammad", github="Exanut")
        self.assertEqual(author.get_github_link(), "https://github.com/Exanut")
