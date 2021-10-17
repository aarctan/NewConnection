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
            f'/author/{self.author_id}/posts/{self.post_id}/comments/'
        )
        self.assertEqual(response.status_code, 200)
        self.assertListEqual(util.response_to_json(response), [])
    
    def test_comment_id_get(self):
        COMMENT_CONTENT = "Comment_Placeholder"
        comment = util.create_comment(self.author, self.post, COMMENT_CONTENT)
        comment_id = comment.id
        response = self.client.get(
            f'/author/{self.author_id}/posts/{self.post_id}/comments/{comment_id}/'
        )
        self.assertEqual(response.status_code, 200)
        d = util.response_to_json(response)
        self.assertEqual(d['type'], 'comment')
        self.assertEqual(len(d['author']), 7) # author has 6 fields
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
            util.create_comment(self.author, self.post, f"Comment_{i}")
        response = self.client.get(
            f'/author/{self.author_id}/posts/{self.post_id}/comments/?page={PAGE}&size={SIZE}'
        )
        d = util.response_to_json(response)
        self.assertEquals(len(d), SIZE)
        for i in range(SIZE):
            self.assertEquals(d[i]["comment"], f"Comment_{(PAGE - 1) * SIZE + i}")

    def test_comment_push(self):    
        response = self.client.get('')
        request = response.wsgi_request
        auth = serializers.AuthorSerializer(self.author, context={'request': request}).data
        post = serializers.PostSerializer(self.post, context={'request': request}).data
        data = {
            'author': auth,
            'post': post,
            'comment': 'very post much wow',
        }
        response = self.client.post(
            f'/author/{self.author_id}/posts/{self.post_id}/comments/',
            data,
            format='json',
        )
        self.assertEquals(response.status_code, 201)
