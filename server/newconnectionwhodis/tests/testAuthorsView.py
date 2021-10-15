from django.test import TestCase

from . import util


class AuthorsViewTests(TestCase):

    def test_no_authors(self):
        """
        If no authors exist, the response should have no authors.
        """
        response = self.client.get('/authors/')
        self.assertEqual(response.status_code, 200)
        d = util.response_to_json(response)
        self.assertEqual(d['type'], 'authors')
        self.assertListEqual(d['items'], [])

    def test_author(self):
        """
        Create an author and test that it is the only one returned
        """
        AUTHOR_NAME, AUTHOR_GITHUB = "Muhammad", "Exanut"
        util.create_author(AUTHOR_NAME, AUTHOR_GITHUB)
        response = self.client.get('/authors/')
        d = util.response_to_json(response)
        self.assertEquals(len(d['items']), 1)
        author_in_response = d['items'][0]
        self.assertEquals(author_in_response['displayName'], AUTHOR_NAME)
        self.assertEquals(author_in_response['github'], AUTHOR_GITHUB)
    
    def test_multiple_authors(self):
        """
        Create multiple authors and test that an equal number are returned
        """
        NUM_AUTHORS = 2
        for i in range(NUM_AUTHORS):
            util.create_author(f"Author_{i}", f"Github_{i}")
        response = self.client.get('/authors/')
        d = util.response_to_json(response)
        self.assertEquals(len(d['items']), NUM_AUTHORS)

    def test_page_and_size(self):
        """
        Test that the optional page and size query parameters work
        """
        NUM_AUTHORS = 17
        PAGE, SIZE = 4, 3
        for i in range(NUM_AUTHORS):
            util.create_author(f"Author_{i}", f"Github_{i}")
        response = self.client.get(f"/authors/?page={PAGE}&size={SIZE}")
        d = util.response_to_json(response)
        self.assertEquals(len(d['items']), SIZE)
        for i in range(SIZE):
            self.assertEquals(d['items'][i]["displayName"], f"Author_{(PAGE - 1) * SIZE + i}")