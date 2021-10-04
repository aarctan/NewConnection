import json
from django.http import request, response

from django.test import TestCase

from .models import Author, Post, Comment
from . import serializers

GITHUB_PREFIX = "https://github.com/"

def create_author(displayName, github):
    """
    Create a new author given a name and github username.
    """
    return Author.objects.create(displayName=displayName, github=github)

def create_post(author, content):
    """
    Create a new post given an author and content
    """
    return Post.objects.create(author=author, content=content)

def create_comment(author, post, comment):
    """
    Create a new comment given an author, post, and content
    """
    return Comment.objects.create(author=author, post=post, comment=comment)

def response_to_json(response):
    """
    Decodes the binary reponse to json
    """
    # https://stackoverflow.com/a/19391807
    json_str = response.content.decode('utf-8').replace("'", "\"")
    return json.loads(json_str)

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
        d = response_to_json(response)
        self.assertEqual(d['type'], 'author')
        host = d['host']
        self.assertIsNotNone(host)
        self.assertEquals(d['url'], f'{host}/author/{id}')
    
    def test_author_update(self):
        """
        Test that an existing author at /author/<id>/ can be updated by
        PUT'ing to /author/<id>/.
        """
        AUTHOR_NAME, AUTHOR_GITHUB = "Muhammad", "Exanut"
        author = create_author(AUTHOR_NAME, AUTHOR_GITHUB)
        id = author.id
        response = self.client.get(f'/author/{id}/')
        d1 = response_to_json(response)
        # Fix for 415 unsupported media type: https://stackoverflow.com/a/15154163
        # Note that post will return 405 for an existing resource.
        data = { 'displayName': 'updated_name', 'github': 'updated_github'}
        response = self.client.put(f'/author/{id}/', data=json.dumps(data),
            content_type='application/json')
        self.assertEqual(response.status_code, 200)
        d2 = response_to_json(response)
        self.assertEquals(d1['id'], d2['id'])
        self.assertNotEquals(d1['displayName'], d2['displayName'])
        self.assertNotEquals(d1['github'], d2['github'])

class AuthorsViewTests(TestCase):

    def test_no_authors(self):
        """
        If no authors exist, the response should have no authors.
        """
        response = self.client.get('/authors/')
        self.assertEqual(response.status_code, 200)
        d = response_to_json(response)
        self.assertEqual(d['type'], 'authors')
        self.assertListEqual(d['items'], [])

    def test_author(self):
        """
        Create an author and test that it is the only one returned
        """
        AUTHOR_NAME, AUTHOR_GITHUB = "Muhammad", "Exanut"
        create_author(AUTHOR_NAME, AUTHOR_GITHUB)
        response = self.client.get('/authors/')
        d = response_to_json(response)
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
            create_author(f"Author_{i}", f"Github_{i}")
        response = self.client.get('/authors/')
        d = response_to_json(response)
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
        d = response_to_json(response)
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
        response = self.client.get(f'/author/{id}/posts/')
        self.assertEqual(response.status_code, 200)
        self.assertListEqual(response_to_json(response), [])

    def test_post_id_get(self):
        """
        Tests that /author/<author_id>/posts/<post_id> returns the expected post
        """
        AUTHOR_NAME, AUTHOR_GITHUB, POST_CONTENT = "Muhammad", "Exanut", 'Placeholder'
        author = create_author(AUTHOR_NAME, AUTHOR_GITHUB)
        author_id = author.id
        post = create_post(author, POST_CONTENT)
        post_id = post.id
        response = self.client.get(f'/author/{author_id}/posts/{post_id}/')
        self.assertEqual(response.status_code, 200)
        d = response_to_json(response)
        self.assertEqual(d['type'], 'post')
        self.assertEquals(len(d['author']), 6) # author has 6 fields
        host = d['author']['host']
        self.assertTrue('http' in host)
        self.assertEquals(d['id'], f'{host}/author/{author_id}/posts/{post_id}')
        # TODO: Test content with various content types
    
    def test_post_belongs_to_author(self):
        """
        Tests whether /author/<author_id>/posts/ returns ONLY that author's posts
        """
        author1 = create_author('Muhammad', 'Exanut')
        author2 = create_author('Dylan', 'dylandeco')
        create_post(author1, 'post1')
        create_post(author2, 'post2')
        create_post(author2, 'post3')
        response1 = self.client.get('/author/{}/posts/'.format(author1.id))
        response2 = self.client.get('/author/{}/posts/'.format(author2.id))
        self.assertEquals(len(response_to_json(response1)), 1)
        self.assertEquals(len(response_to_json(response2)), 2)


    def test_post_post(self):
        """
        Tests POSTing a post
        """
        AUTHOR_NAME, AUTHOR_GITHUB, POST_CONTENT = "Muhammad", "Exanut", 'Placeholder'
        author = create_author(AUTHOR_NAME, AUTHOR_GITHUB)
        author_id = author.id
        response = self.client.get('')
        request = response.wsgi_request
        auth = serializers.AuthorSerializer(author, context={'request': request}).data
        data = {
            'author': auth,
            'content': POST_CONTENT
        }
        response = self.client.post(
            f'/author/{author_id}/posts/',
            data,
            format='json',
        )
        self.assertEquals(response.status_code, 201)
        response = self.client.post(
            f'/author/{author_id}/posts/',
            {'author': auth, 'content': 'blah'},
            format='json',
        )
        self.assertEquals(response.status_code, 201)
        response = self.client.get(f'/author/{author_id}/posts/')
        self.assertEquals(len(response_to_json(response)), 2)

class CommentViewTests(TestCase):
    # https://docs.djangoproject.com/en/3.2/topics/testing/overview/
    def setUp(self):
        """
        Create a new post from a new author
        """
        AUTHOR_NAME, AUTHOR_GITHUB, POST_CONTENT = "Muhammad", "Exanut", 'Placeholder'
        self.author = create_author(AUTHOR_NAME, AUTHOR_GITHUB)
        self.author_id = self.author.id
        self.post = create_post(self.author, POST_CONTENT)
        self.post_id = self.post.id

    def test_no_comments(self):
        """
        Tests that a db with a single author and post has no comments
        """
        response = self.client.get(
            f'/author/{self.author_id}/posts/{self.post_id}/comments/'
        )
        self.assertEqual(response.status_code, 200)
        self.assertListEqual(response_to_json(response), [])
    
    def test_comment_id_get(self):
        COMMENT_CONTENT = "Comment_Placeholder"
        comment = create_comment(self.author, self.post, COMMENT_CONTENT)
        comment_id = comment.id
        response = self.client.get(
            f'/author/{self.author_id}/posts/{self.post_id}/comments/{comment_id}/'
        )
        self.assertEqual(response.status_code, 200)
        d = response_to_json(response)
        self.assertEqual(d['type'], 'comment')
        self.assertEqual(len(d['author']), 6) # author has 6 fields
        self.assertEqual(d['comment'], COMMENT_CONTENT)
        self.assertEqual(d['contentType'], 'text/markdown')

        # TODO: Check that the published date is ISO 8601

        host = d['author']['host']
        self.assertTrue('http' in host)
        self.assertEquals(
            d['id'],
            f'{host}/author/{self.author_id}/posts/{self.post_id}/comments/{comment_id}')
    
    # TODO: More comment tests including pagination tests
    def test_comments_pagination(self):
        """
        Test that the optional page and size query parameters work
        """
        NUM_COMMENTS = 20
        PAGE, SIZE = 4, 3
        for i in range(NUM_COMMENTS):
            create_comment(self.author, self.post, f"Comment_{i}")
        response = self.client.get(
            f'/author/{self.author_id}/posts/{self.post_id}/comments/?page={PAGE}&size={SIZE}'
        )
        d = response_to_json(response)
        self.assertEquals(len(d), SIZE)
        for i in range(SIZE):
            self.assertEquals(d[i]["comment"], f"Comment_{(PAGE - 1) * SIZE + i}")
