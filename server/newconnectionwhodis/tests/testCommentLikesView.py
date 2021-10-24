from django.test import TestCase

from . import util


class CommentLikesViewTests(TestCase):
    def setUp(self):
        self.author = util.create_author("ZiQing", "zma9216")
        self.post = util.create_post(self.author, "Post")
        self.comment = util.create_comment(self.author, self.post, "Comment")
        self.author_id = self.author.id
        self.post_id = self.post.id
        self.comment_id = self.comment.id

    def test_no_comment_likes(self):
        """
        Tests that a db with a single comment from an author's post
        and nothing else has no comment likes.
        """
        response = self.client.get(
            f"/api/v1/author/{self.author_id}/posts/{self.post_id}/comments/{self.comment_id}/likes/"
        )
        self.assertEqual(response.status_code, 200)
        self.assertListEqual(util.response_to_json(response), [])

    def test_comment_like_belongs_to_author(self):
        """
        Tests whether /author/<author_id>/posts/<post_id>/comments/<comment_id>/likes
        returns ONLY that author's likes
        """
        author_2 = util.create_author("Dylan", "dylandeco")
        post_1 = util.create_post(self.author, "post1")
        comment_1 = util.create_comment(self.author, post_1, "comment1")
        util.create_comment_like(self.author, post_1, comment_1)
        post_2 = util.create_post(author_2, "post2")
        comment_2 = util.create_comment(self.author, post_2, "comment2")
        util.create_comment_like(author_2, post_2, comment_2)
        util.create_comment_like(author_2, post_2, comment_2)
        response_1 = self.client.get(
            "/api/v1/author/{}/posts/{}/comments/{}/likes/".format(
                self.author_id, post_1.id, comment_1.id
            )
        )
        response_2 = self.client.get(
            "/api/v1/author/{}/posts/{}/comments/{}/likes/".format(
                author_2.id, post_2.id, comment_2.id
            )
        )
        self.assertEquals(len(util.response_to_json(response_1)), 1)
        self.assertEquals(len(util.response_to_json(response_2)), 2)
