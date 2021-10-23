from django.test import TestCase

from . import util
from .. import serializers

class CommentViewTests(TestCase):
    def setUp(self):
        """
        Create a new post from a new author
        """
        AUTHOR_NAME, AUTHOR_GITHUB, POST_CONTENT = "Muhammad", "Exanut", 'Placeholder'
        self.author = util.create_author(AUTHOR_NAME, AUTHOR_GITHUB)
        self.author_id = self.author.id
        self.post = util.create_post(self.author, POST_CONTENT)
        self.post_id = self.post.id

    def test_no_comments(self):
        """
        Tests that a db with a single author and post has no comments
        """
        response = self.client.get(
            f'/api/v1/author/{self.author_id}/posts/{self.post_id}/comments/'
        )
        self.assertEqual(response.status_code, 200)
        d = util.response_to_json(response)
        self.assertEqual(d['type'], 'comments')
        self.assertListEqual(d['comments'], [])

    # TODO: More comment tests including pagination tests
    def test_comments_pagination(self):
        """
        Test that the optional page and size query parameters work
        """
        NUM_COMMENTS = 20
        PAGE, SIZE = 4, 3
        for i in range(NUM_COMMENTS):
            util.create_comment(self.author, self.post, f"Comment_{i}")
        response = self.client.get(
            f'/api/v1/author/{self.author_id}/posts/{self.post_id}/comments/?page={PAGE}&size={SIZE}'
        )
        d = util.response_to_json(response)
        self.assertEquals(d['type'], 'comments')
        comments = d['comments']
        self.assertEquals(len(comments), SIZE)
        for i in range(SIZE):
            self.assertEquals(comments[i]["comment"], f"Comment_{(PAGE - 1) * SIZE + i}")

    def test_comment_push(self):    
        data = {
            'author': self.author_id,
            'post': self.post_id,
            'comment': 'very post much wow',
        }
        response = self.client.post(
            f'/api/v1/author/{self.author_id}/posts/{self.post_id}/comments/',
            data,
            format='json',
        )
        self.assertEquals(response.status_code, 201)
        d = util.response_to_json(response)

