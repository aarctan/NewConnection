import json

from django.test import TestCase

from . import util
from .. import models, serializers


class FollowReqViewTests(TestCase):
    def setUp(self):
        response = self.client.get("")
        self.request = response.wsgi_request
        self.author = util.create_author("Muhammad", "Exanut")

    def test_accept_follow(self):
        follower = util.create_author("jennie", "jennierubyjane")
        data = {
            "summary": "test",
            "type": "Follow",
            "actor": serializers.AuthorSerializer(
                follower, context={"request": self.request}).data,
            "object": serializers.AuthorSerializer(
                self.author, context={"request": self.request}).data,
        }
        # send the friend request
        self.client.post(
            f"/api/v1/author/{self.author.id}/inbox/",
            data=json.dumps(data),
            content_type="application/json",
        )
        self.assertEquals(len(models.FollowReq.objects.all()), 1)
        self.assertEquals(len(models.Follower.objects.all()), 0)
        # accept the friend request
        self.client.put(f'/api/v1/author/{self.author.id}/followers/{follower.id}/')
        self.assertEquals(len(models.FollowReq.objects.all()), 0)
        self.assertEquals(len(models.Follower.objects.all()), 1)

