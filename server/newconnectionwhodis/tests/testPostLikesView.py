from django.test import TestCase

from . import util

class PostLikesViewTests(TestCase):

    def setUp(self):
        self.author = util.create_author("ZiQing", "zma9216")
        self.post = util.create_post(self.author, "Post")
        self.author_id = self.author.id
        self.post_id = self.post.id

    def test_no_post_likes(self):
        """
        Tests that a db with a post from an author
        and nothing else has no post likes.
        """
        response = self.client.get(f'/api/v1/author/{self.author_id}/posts/{self.post_id}/likes/')
        self.assertEqual(response.status_code, 200)
        self.assertListEqual(util.response_to_json(response), [])

    def test_post_like_belongs_to_author(self):
        """
        Tests whether /author/<author_id>/posts/<post_id>/likes returns ONLY that author's likes
        """
        author_2 = util.create_author('Dylan', 'dylandeco')
        post_1 = util.create_post(self.author, 'post1')
        util.create_post_like(self.author, post_1)
        post_2 = util.create_post(author_2, 'post2')
        util.create_post_like(author_2, post_2)
        util.create_post_like(author_2, post_2)
        response_1 = self.client.get('/api/v1/author/{}/posts/{}/likes/'.format(self.author_id, post_1.id))
        response_2 = self.client.get('/api/v1/author/{}/posts/{}/likes/'.format(author_2.id, post_2.id))
        self.assertEquals(len(util.response_to_json(response_1)), 1)
        self.assertEquals(len(util.response_to_json(response_2)), 2)
