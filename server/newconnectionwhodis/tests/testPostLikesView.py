from django.test import TestCase
from rest_framework.test import APIClient

from . import util


class PostLikesViewTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.author_1 = util.create_author("ZiQing", "zma9216")
        self.author_2 = util.create_author("Dylan", "dylandeco")
        self.post = util.create_post(self.author_1, "Post")
        self.client.force_authenticate(self.author_1.user)
        self.client.force_authenticate(self.author_2.user)

    def test_no_post_likes(self):
        """
        Tests that a db with a post from an author
        and nothing else has no post likes.
        """
        response = self.client.get(
            f"/api/v1/author/{self.author_1.id}/posts/{self.post.id}/likes/"
        )
        self.assertEqual(response.status_code, 200)
        self.assertListEqual(util.response_to_json(response), [])

    def test_post_like_belongs_to_author(self):
        """
        Tests whether /author/<author_id>/posts/<post_id>/likes returns ONLY that author's likes
        """
        post_1 = util.create_post(self.author_1, "Post_1")
        post_2 = util.create_post(self.author_2, "Post_2")
        response_1 = self.client.get(
            f"/api/v1/author/{self.author_1.id}/posts/{post_1.id}/"
        )
        response_2 = self.client.get(
            f"/api/v1/author/{self.author_2.id}/posts/{post_2.id}/"
        )
        author_1 = util.response_to_json(response_1)
        author_2 = util.response_to_json(response_2)
        util.create_post_like(author_1["author"], post_1)
        util.create_post_like(author_2["author"], post_2)
        util.create_post_like(author_2["author"], post_2)
        post_1_likes = self.client.get(
            f"/api/v1/author/{self.author_1.id}/posts/{post_1.id}/likes/"
        )
        post_2_likes = self.client.get(
            f"/api/v1/author/{self.author_2.id}/posts/{post_2.id}/likes/"
        )
        self.assertEquals(len(util.response_to_json(post_1_likes)), 1)
        self.assertEquals(len(util.response_to_json(post_2_likes)), 2)
