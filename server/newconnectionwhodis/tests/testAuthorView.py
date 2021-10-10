import json

from django.test import TestCase

from . import util


class AuthorViewTests(TestCase):

    def setUp(self):
        self.author = util.create_author("Muhammad", "Exanut")

    def test_author_view(self):
        """
        Test the author response by ensuring code 200 and absolute urls
        """
        id = self.author.id
        request = self.client.get(f'/author/{id}/')
        self.assertEqual(request.status_code, 200)
        d = util.response_to_json(request)
        self.assertEqual(d['type'], 'author')
        host = d['host']
        self.assertIsNotNone(host)
        self.assertEquals(d['url'], f'{host}/author/{id}')
    
    def test_author_update(self):
        """
        Test that an existing author at /author/<id>/ can be updated by
        PUT'ing to /author/<id>/.
        """
        id = self.author.id
        response = self.client.get(f'/author/{id}/')
        d1 = util.response_to_json(response)
        # Note that post will return 405 for an existing resource.
        data = { 'displayName': 'updated_name', 'github': 'updated_github'}
        response = self.client.put(f'/author/{id}/', data=json.dumps(data),
            content_type='application/json')
        self.assertEqual(response.status_code, 200)
        d2 = util.response_to_json(response)
        self.assertEquals(d1['id'], d2['id'])
        self.assertNotEquals(d1['displayName'], d2['displayName'])
        self.assertNotEquals(d1['github'], d2['github'])