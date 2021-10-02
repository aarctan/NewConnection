from django.test import TestCase

from .models import Author

def create_author(displayName, github):
    """
    Create a new author given a name and github username.
    """
    return Author.objects.create(displayName=displayName, github=github)

class AuthorModelTests(TestCase):

    def test_type(self):
        """
        Check if type is equal to author.
        """
        author = Author(displayName="Dylan", github="dylandeco")
        self.assertEqual(author.type, "author")

    def test_displayName(self):
        """
        Check if name is equal to displayName.
        """
        author = Author(displayName="Dylan", github="dylandeco")
        self.assertEqual(author.displayName, "Dylan")


    def test_github_url(self):
        """
        Check if get_github_link returns a valid github url.
        """
        author = Author(displayName="Muhammad", github="Exanut")
        self.assertEqual(author.get_github_link(), "https://github.com/Exanut")
