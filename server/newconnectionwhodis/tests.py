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

    def test_fields(self):
        """
        Verify expected output for all Author fields
        """
        AUTHOR_NAME, AUTHOR_GITHUB = "Dylan", "dylandeco"
        author = Author(displayName=AUTHOR_NAME, github=AUTHOR_GITHUB)
        self.assertEqual(author.type, "author")
        self.assertEqual(author.displayName, AUTHOR_NAME)
        self.assertEqual(author.get_github_link(), f"{GITHUB_PREFIX}{AUTHOR_GITHUB}")

class AuthorViewTests(TestCase):

    def test_author_view(self):
        """
        Test the author response by ensuring code 200 and absolute urls
        """
        AUTHOR_NAME, AUTHOR_GITHUB = "Muhammad", "Exanut"
        author = create_author(AUTHOR_NAME, AUTHOR_GITHUB)
        id = author.id
        response = self.client.get(f'/author/{id}/')
        self.assertEqual(response.status_code, 200)
        json_str = response.content.decode('utf-8').replace("'", "\"")
        d = json.loads(json_str)
        self.assertEqual(d['type'], 'author')
        host = d['host']
        self.assertIsNotNone(host)
        self.assertEquals(d['url'], f'{host}/author/{id}')


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
        """
        Test that the optional page and size query parameters work
        """
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

class PostViewTests(TestCase):

    def test_no_posts(self):
        """
        Tests that a db with a single author and nothing else has no posts.
        """
        author = create_author("Muhammad", "Exanut")
        id = author.id
        response = self.client.get('/author/{id}/posts/')
        self.assertEqual(response.status_code, 200)
        json_str = response.content.decode('utf-8').replace("'", "\"")
        self.assertListEqual(json.loads(json_str), [])

    def test_post_id_get(self):
        """
        Tests /author/<author_id>/posts/<post_id> returns the expected post
        """
    
    def test_post_belongs_to_author(self):
        """
        Tests whether /author/<author_id>/posts/ returns ONLY that author's posts
        """
