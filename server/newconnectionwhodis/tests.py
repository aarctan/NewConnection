import json, ast

from django.test import TestCase
from django.urls import reverse

from .models import Author

GITHUB_PREFIX = "https://github.com/"

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
        self.assertEqual(author.get_github_link(), f"{GITHUB_PREFIX}Exanut")

class AuthorsViewTests(TestCase):

    def test_no_authors(self):
        """
        If no authors exist, the response should have no authors.
        """
        # https://stackoverflow.com/a/19391807
        response = self.client.get('/authors/')
        self.assertEqual(response.status_code, 200)
        json_str = response.content.decode('utf-8').replace("'", "\"")
        d = json.loads(json_str)
        self.assertEqual(d['type'], 'authors')
        self.assertListEqual(d['items'], [])

    def test_author(self):
        """
        Create an author and test that it is the only one returned
        """
        AUTHOR_NAME, AUTHOR_GITHUB = "Muhammad", "Exanut"
        create_author(AUTHOR_NAME, AUTHOR_GITHUB)
        response = self.client.get('/authors/')
        json_str = response.content.decode('utf-8').replace("'", "\"")
        d = json.loads(json_str)
        self.assertEquals(len(d['items']), 1)
        author_in_response = d['items'][0]
        self.assertEquals(author_in_response['displayName'], AUTHOR_NAME)
        self.assertEquals(author_in_response['github'], f"{GITHUB_PREFIX}{AUTHOR_GITHUB}")
    
    def test_multiple_authors(self):
        """
        Create multiple authors and test that an equal number are returned
        """
        NUM_AUTHORS = 2
        for i in range(NUM_AUTHORS):
            create_author(f"Author_{i}", f"Github_{i}")
        response = self.client.get('/authors/')
        json_str = response.content.decode('utf-8').replace("'", "\"")
        d = json.loads(json_str)
        self.assertEquals(len(d['items']), NUM_AUTHORS)

    def test_page_and_size(self):
        NUM_AUTHORS = 17
        PAGE, SIZE = 4, 3
        for i in range(NUM_AUTHORS):
            create_author(f"Author_{i}", f"Github_{i}")
        response = self.client.get(f"/authors/?page={PAGE}&size={SIZE}")
        json_str = response.content.decode('utf-8').replace("'", "\"")
        d = json.loads(json_str)
        self.assertEquals(len(d['items']), SIZE)
        for i in range(SIZE):
            self.assertEquals(d['items'][i]["displayName"], f"Author_{(PAGE - 1) * SIZE + i}")
