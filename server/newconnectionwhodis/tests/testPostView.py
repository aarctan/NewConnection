from django.test import TestCase

from . import util
from .. import serializers, models

class PostViewTests(TestCase):

    def setUp(self):
        self.author = util.create_author("Muhammad", "Exanut")
        self.author_id =self.author.id

    def test_no_posts(self):
        """
        Tests that a db with a single author and nothing else has no posts.
        """
        response = self.client.get(f'/author/{self.author_id}/posts/')
        self.assertEqual(response.status_code, 200)
        self.assertListEqual(util.response_to_json(response), [])

    def test_post_id_get(self):
        """
        Tests that /author/<author_id>/posts/<post_id> returns the expected post
        """
        post = util.create_post(self.author, 'Placeholder')
        post_id = post.id
        response = self.client.get(f'/author/{self.author_id}/posts/{post_id}/')
        self.assertEqual(response.status_code, 200)
        d = util.response_to_json(response)
        self.assertEqual(d['type'], 'post')
        self.assertEquals(len(d['author']),7) # author has 6 fields
        host = d['author']['host']
        self.assertTrue('http' in host)
        self.assertEquals(d['id'], f'{host}/author/{self.author_id}/posts/{post_id}')
        # TODO: Test content with various content types

    def test_post_belongs_to_author(self):
        """
        Tests whether /author/<author_id>/posts/ returns ONLY that author's posts
        """
        author2 = util.create_author('Dylan', 'dylandeco')
        util.create_post(self.author, 'post1')
        util.create_post(author2, 'post2')
        util.create_post(author2, 'post3')
        response1 = self.client.get('/author/{}/posts/'.format(self.author_id))
        response2 = self.client.get('/author/{}/posts/'.format(author2.id))
        self.assertEquals(len(util.response_to_json(response1)), 1)
        self.assertEquals(len(util.response_to_json(response2)), 2)

    def test_post_post(self):
        """
        Tests POSTing a post. TODO: require authentication
        """
        response = self.client.get('')
        request = response.wsgi_request
        auth = serializers.AuthorSerializer(self.author, context={'request': request}).data
        data = {
            'author': auth,
            'content': 'Placeholder',
            'title': 'Title',
            'description': 'Description',
        }
        response = self.client.post(
            f'/author/{self.author_id}/posts/',
            data=data,
            format='json',
        )
        print(response.content)
        self.assertEquals(response.status_code, 201)
        response = self.client.post(
            f'/author/{self.author_id}/posts/',
            data=data,
            format='json',
        )
        self.assertEquals(response.status_code, 201)
        response = self.client.get(f'/author/{self.author_id}/posts/')
        self.assertEquals(len(util.response_to_json(response)), 2)

    def test_post_delete(self):
        """
        Test deleting an existing post
        """
        post = util.create_post(self.author, 'Placeholder')
        post_id = post.id
        response = self.client.delete(f'/author/{self.author_id}/posts/{post_id}/')
        self.assertEquals(response.status_code, 204)
        self.assertEquals(len(models.Post.objects.all()), 0)
