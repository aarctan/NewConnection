from django.test import TestCase
from rest_framework.test import APIClient

from . import util
from .. import serializers

from django.db.utils import IntegrityError


class FollowerViewTests(TestCase):
    def setUp(self):
        response = self.client.get("")
        self.request = response.wsgi_request
        self.client = APIClient()
        self.receiver = util.create_author("Muhammad", "Exanut")
        self.follower1 = util.create_author("Dylan", "dylandeco")
        self.follower2 = util.create_author("jennie", "jennierubyjane")
        self.follower3 = util.create_author("Carter", "tetelows")
        self.client.force_authenticate(self.receiver.user)

    def test_get_followers(self):
        """
        Tests that a list of followers can be returned from <author_id>/followers/
        """
        util.add_follower(self.follower1, self.receiver)
        util.add_follower(self.follower2, self.receiver)
        response = self.client.get(
            f"/api/v1/author/{self.receiver.id}/followers/")
        self.assertEqual(response.status_code, 200)
        d = util.response_to_json(response)
        self.assertEqual(d["type"], "followers")
        self.assertEqual(len(d["items"]), 2)
        expected1 = serializers.AuthorSerializer(
            self.follower1, context={"request": self.request}
        ).data
        expected2 = serializers.AuthorSerializer(
            self.follower2, context={"request": self.request}
        ).data
        self.assertTrue(util.validate_reponse_with_serializer(
            expected1, d["items"][0]))
        self.assertTrue(util.validate_reponse_with_serializer(
            expected2, d["items"][1]))

    def test_get_follower_by_id(self):
        """
        Test that a follower can be returned from <author_id>/followers/<follower_id>
        """
        util.add_follower(self.follower1, self.receiver)
        response = self.client.get(
            f"/api/v1/author/{self.receiver.id}/followers/{self.follower1.id}/"
        )
        d = util.response_to_json(response)
        self.assertTrue(d, "true")

    def test_follower_not_found(self):
        """
        Test that an author that is not following another author does not get returned as a follower
        """
        response = self.client.get(
            f"/api/v1/author/{self.receiver.id}/followers/{self.follower1.id}/")
        d = util.response_to_json(response)
        self.assertTrue(d, "false")

    def test_delete_follower(self):
        """
        Test that an existing follower can be removed as a follower
        """
        util.add_follower(self.follower1, self.receiver)
        util.add_follower(self.follower2, self.receiver)
        response = self.client.delete(
            f"/api/v1/author/{self.receiver.id}/followers/{self.follower1.id}/"
        )
        self.assertEqual(response.status_code, 202)
        response = self.client.get(
            f"/api/v1/author/{self.receiver.id}/followers/")
        d = util.response_to_json(response)
        self.assertEquals(len(d["items"]), 1)

    def test_unique_follower(self):
        """
        Test that a follower can only be a follower once and not be repeated
        """
        util.add_follower(self.follower3, self.receiver)

        with self.assertRaises(IntegrityError) as raised:
            util.add_follower(self.follower3, self.receiver)
        self.assertEqual(IntegrityError, type(raised.exception))
