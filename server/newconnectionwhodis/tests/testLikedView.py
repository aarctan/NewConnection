from django.test import TestCase
from rest_framework.test import APIClient

from . import util


class LikedViewTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.author = util.create_author("ZiQing", "zma9216")
        self.post = util.create_post(self.author, "Post")
        self.client.force_authenticate(self.author.user)

    def test_no_likes(self):
        """
        If no likes exist, the response should have no likes.
        """
        response = self.client.get(f"/api/v1/author/{self.author.id}/liked/")
        self.assertEqual(response.status_code, 200)
        d = util.response_to_json(response)
        self.assertEqual(d["type"], "liked")
        self.assertListEqual(d["items"], [])

    def test_post_like(self):
        """
        Create a post like and test that it is the only one returned
        """
        post_response = self.client.get(
            f"/api/v1/author/{self.author.id}/posts/{self.post.id}/"
        )
        author = util.response_to_json(post_response)["author"]
        util.create_post_like(author, self.post)
        new_response = self.client.get(
            f"/api/v1/author/{self.author.id}/liked/")
        d = util.response_to_json(new_response)
        self.assertEquals(len(d["items"]), 1)
        like_in_response = d["items"][0]
        host = like_in_response["author"]["host"]
        self.assertEquals(
            like_in_response["object"][32:],
            f"{host}api/v1/author/{self.author.id}/posts/{self.post.id}",
        )

    def test_comment_like(self):
        """
        Create a comment like and test that it is the only one returned
        """
        post_response = self.client.get(
            f"/api/v1/author/{self.author.id}/posts/{self.post.id}/"
        )
        author = util.response_to_json(post_response)["author"]
        comment = util.create_comment(author, self.post, "Comment")
        util.create_comment_like(author, self.post, comment)
        response = self.client.get(f"/api/v1/author/{self.author.id}/liked/")
        d = util.response_to_json(response)
        self.assertEqual(d["type"], "liked")
        self.assertEquals(len(d["items"]), 1)
        like_in_response = d["items"][0]
        host = like_in_response["author"]["host"]
        self.assertTrue("http" in host)
        self.assertEquals(
            like_in_response["object"][32:],
            f"{host}api/v1/author/{self.author.id}/posts/{self.post.id}/comments/{comment.id}",
        )

    def test_multiple_likes(self):
        """
        Create multiple non-unique likes and test that an equal number is returned
        """
        NUM_LIKES = 2
        post_response = self.client.get(
            f"/api/v1/author/{self.author.id}/posts/{self.post.id}/"
        )
        author = util.response_to_json(post_response)["author"]
        for i in range(NUM_LIKES):
            util.create_post_like(author, self.post)
        response = self.client.get(f"/api/v1/author/{self.author.id}/liked/")
        d = util.response_to_json(response)
        self.assertEquals(len(d["items"]), NUM_LIKES)

    def test_multiple_different_likes(self):
        """
        Create one post like and one comment like,
        then test that an equal number is returned and distinct
        """
        NUM_LIKES = 2
        post_response = self.client.get(
            f"/api/v1/author/{self.author.id}/posts/{self.post.id}/"
        )
        author = util.response_to_json(post_response)["author"]
        util.create_post_like(author, self.post)
        comment = util.create_comment(author, self.post, "Comment")
        util.create_comment_like(author, self.post, comment)
        response = self.client.get(f"/api/v1/author/{self.author.id}/liked/")
        d = util.response_to_json(response)
        post_like = d["items"][0]
        comment_like = d["items"][1]
        post_like_host = post_like["author"]["host"]
        comment_like_host = comment_like["author"]["host"]
        self.assertTrue("http" in post_like_host)
        self.assertTrue("http" in comment_like_host)
        self.assertEquals(
            post_like["object"][32:],
            f"{post_like_host}api/v1/author/{self.author.id}/posts/{self.post.id}",
        )
        self.assertEquals(
            comment_like["object"][32:],
            f"{comment_like_host}api/v1/author/{self.author.id}/posts/{self.post.id}/comments/{comment.id}",
        )
        self.assertEquals(len(d["items"]), NUM_LIKES)
