from django.test import TestCase

from . import util


class LikedViewTests(TestCase):
    def setUp(self):
        self.author = util.create_author("ZiQing", "zma9216")
        self.post = util.create_post(self.author, "Post")
        self.comment = util.create_comment(self.author, self.post, "Comment")
        self.author_id = self.author.id
        self.post_id = self.post.id
        self.comment_id = self.comment.id

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
        util.create_post_like(self.author, self.post)
        response = self.client.get(f"/api/v1/author/{self.author_id}/liked/")
        d = util.response_to_json(response)
        self.assertEquals(len(d["items"]), 1)
        like_in_response = d["items"][0]
        host = like_in_response["author"]["host"]
        self.assertEquals(
            like_in_response["object"],
            f"{host}/author/{self.author_id}/posts/{self.post_id}",
        )

    def test_comment_like(self):
        """
        Create a comment like and test that it is the only one returned
        """
        util.create_comment_like(self.author, self.post, self.comment)
        response = self.client.get(f"/api/v1/author/{self.author_id}/liked/")
        d = util.response_to_json(response)
        self.assertEqual(d["type"], "liked")
        self.assertEquals(len(d["items"]), 1)
        like_in_response = d["items"][0]
        host = like_in_response["author"]["host"]
        self.assertTrue("http" in host)
        self.assertEquals(
            like_in_response["object"],
            f"{host}/author/{self.author_id}/posts/{self.post_id}/comments/{self.comment_id}",
        )

    def test_multiple_likes(self):
        """
        Create multiple non-unique likes and test that an equal number is returned
        """
        NUM_LIKES = 2
        for i in range(NUM_LIKES):
            util.create_post_like(self.author, self.post)
        response = self.client.get(f"/api/v1/author/{self.author_id}/liked/")
        d = util.response_to_json(response)
        self.assertEquals(len(d["items"]), NUM_LIKES)

    def test_multiple_different_likes(self):
        """
        Create one post like and one comment like,
        then test that an equal number is returned and distinct
        """
        NUM_LIKES = 2
        util.create_post_like(self.author, self.post)
        util.create_comment_like(self.author, self.post, self.comment)
        response = self.client.get(f"/api/v1/author/{self.author_id}/liked/")
        d = util.response_to_json(response)
        post_like = d["items"][0]
        comment_like = d["items"][1]
        post_like_host = post_like["author"]["host"]
        comment_like_host = comment_like["author"]["host"]
        self.assertTrue("http" in post_like_host)
        self.assertTrue("http" in comment_like_host)
        self.assertEquals(
            post_like["object"],
            f"{post_like_host}/author/{self.author_id}/posts/{self.post_id}",
        )
        self.assertEquals(
            comment_like["object"],
            f"{comment_like_host}/author/{self.author_id}/posts/{self.post_id}/comments/{self.comment_id}",
        )
        self.assertEquals(len(d["items"]), NUM_LIKES)
