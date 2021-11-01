import json

from django.test import TestCase
from rest_framework.test import APIClient

from . import util
from ..serializers import *


class AuthorViewTests(TestCase):
    def setUp(self):
        response = self.client.get("")
        self.request = response.wsgi_request
        self.client = APIClient()
        self.author = util.create_author("Muhammad", "Exanut")
        self.client.force_authenticate(self.author.user)

    def test_author_view(self):
        """
        Test the author response by ensuring code 200 and absolute urls
        """
        id = self.author.id
        request = self.client.get(f"/api/v1/author/{id}/")
        self.assertEqual(request.status_code, 200)
        d = util.response_to_json(request)
        self.assertEqual(d["type"], "author")
        host = d["host"]
        self.assertIsNotNone(host)
        self.assertEquals(d["url"], f"{host}api/v1/author/{id}")

    def test_author_update(self):
        """
        Test that an existing author at /author/<id>/ can be updated by
        PUT'ing to /author/<id>/.
        """
        id = self.author.id
        response = self.client.get(f"/api/v1/author/{id}/")
        # Note that post will return 405 for an existing resource.
        data = {"displayName": "updated_name", "github": "updated_github"}
        response = self.client.post(
            f"/api/v1/author/{id}/",
            data=json.dumps(data),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 200)
        d = util.response_to_json(response)
        self.author.refresh_from_db()
        expected = AuthorSerializer(self.author, context={"request": self.request}).data
        self.assertTrue(util.validate_reponse_with_serializer(expected, d))

    def test_single_field_update(self):
        """
        Test that an existing author can have a single field updated and
        the rest untouched.
        """
        id = self.author.id
        response = self.client.get(f"/api/v1/author/{id}/")
        # Note that post will return 405 for an existing resource.
        data = {"displayName": "updated_name"}
        response = self.client.post(
            f"/api/v1/author/{id}/",
            data=json.dumps(data),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 200)
        d = util.response_to_json(response)
        self.author.refresh_from_db()
        expected = AuthorSerializer(self.author, context={"request": self.request}).data
        self.assertTrue(util.validate_reponse_with_serializer(expected, d))

    def test_author_update_unauth(self):
        """
        Test that an unauthenticated author at /author/<id>/ can be updated by
        PUT'ing to /author/<id>/.
        """
        self.client.force_authenticate(None)
        id = self.author.id
        response = self.client.get(f"/api/v1/author/{id}/")
        # Note that post will return 405 for an existing resource.
        data = {"displayName": "updated_name", "github": "updated_github"}
        response = self.client.post(
            f"/api/v1/author/{id}/",
            data=json.dumps(data),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 401)

    def test_single_field_update_unauth(self):
        """
        Test that an unauthenticated author can have a single field updated and
        the rest untouched.
        """
        self.client.force_authenticate(None)
        id = self.author.id
        response = self.client.get(f"/api/v1/author/{id}/")
        # Note that post will return 405 for an existing resource.
        data = {"displayName": "updated_name"}
        response = self.client.post(
            f"/api/v1/author/{id}/",
            data=json.dumps(data),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 401)
