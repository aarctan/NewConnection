import json

from django.test import TestCase

from . import util
from .. import serializers


class InboxViewTests(TestCase):

    def setUp(self):
        response = self.client.get('')
        self.request = response.wsgi_request
        self.author = util.create_author("Muhammad", "Exanut")

    def test_get_empty_inbox(self):
        """
        Tests whether upon creation of a new user, their inbox is empty, i.e., [].
        """
        response = self.client.get(f'/api/v1/author/{self.author.id}/inbox/')
        d = util.response_to_json(response)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(d['items'], [])
    
    def test_receive_like(self):
        """
        Test whether a like on an author's post goes to that author's inbox.
        """
        liker = util.create_author("jennie", "jennierubyjane")
        post = util.create_post(self.author, 'content')
        like = util.create_post_like(liker, post)
        data = serializers.LikeSerializer(like, context={'request': self.request}).data
        response = self.client.post(f'/api/v1/author/{self.author.id}/inbox/',
            data=json.dumps(data), content_type='application/json')
        d = util.response_to_json(response)
        self.assertEqual(len(d['items']), 1)