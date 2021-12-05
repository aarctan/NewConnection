from django.test import TestCase
from rest_framework.test import APIClient

from . import util


class CommentLikesViewTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.author = util.create_author("ZiQing", "zma9216")
        self.client.force_authenticate(self.author.user)
        self.post = util.create_post(self.author, "Post")

    def test_no_comment_likes(self):
        """
        Tests that a db with a single comment from an author's post
        and nothing else has no comment likes.
        """
        post_response = self.client.get(
            f"/api/v1/author/{self.author.id}/posts/{self.post.id}/"
        )
        author = util.response_to_json(post_response)["author"]
        comment = util.create_comment(author, self.post, "Comment")
        response = self.client.get(
            f"/api/v1/author/{self.author.id}/posts/{self.post.id}/comments/{comment.id}/likes/"
        )
        self.assertEqual(response.status_code, 200)
        self.assertListEqual(util.response_to_json(response), [])

    def test_comment_like_belongs_to_author(self):
        """
        Tests whether /author/<author_id>/posts/<post_id>/comments/<comment_id>/likes
        returns ONLY that author's likes
        """
        post_response_1 = self.client.get(
            f"/api/v1/author/{self.author.id}/posts/{self.post.id}/"
        )
        author_1 = util.response_to_json(post_response_1)["author"]
        post_1 = util.create_post(self.author, "post1")
        comment_1 = util.create_comment(author_1, post_1, "comment1")
        util.create_comment_like(author_1, post_1, comment_1)

        other_author = util.create_author("Dylan", "dylandeco")
        self.client.force_authenticate(other_author.user)
        post_2 = util.create_post(other_author, "post2")
        post_response_2 = self.client.get(
            f"/api/v1/author/{other_author.id}/posts/{post_2.id}/"
        )
        author_2 = util.response_to_json(post_response_2)["author"]
        comment_2 = util.create_comment(author_2, post_2, "comment2")
        util.create_comment_like(author_2, post_2, comment_2)
        util.create_comment_like(author_2, post_2, comment_2)
        response_1 = self.client.get(
            "/api/v1/author/{}/posts/{}/comments/{}/likes/".format(
                self.author.id, post_1.id, comment_1.id
            )
        )
        response_2 = self.client.get(
            "/api/v1/author/{}/posts/{}/comments/{}/likes/".format(
                other_author.id, post_2.id, comment_2.id
            )
        )
        self.assertEquals(len(util.response_to_json(response_1)), 1)
        self.assertEquals(len(util.response_to_json(response_2)), 2)
