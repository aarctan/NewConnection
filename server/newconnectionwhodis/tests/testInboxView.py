import json

from django.test import TestCase

from . import util
from .. import models, serializers


class InboxViewTests(TestCase):
    def setUp(self):
        response = self.client.get("")
        self.request = response.wsgi_request
        self.author = util.create_author("Muhammad", "Exanut")

    def test_get_empty_inbox(self):
        """
        Tests whether upon creation of a new user, their inbox is empty, i.e., [].
        """
        response = self.client.get(f"/api/v1/author/{self.author.id}/inbox/")
        d = util.response_to_json(response)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(d["items"], [])

    def test_post_like(self):
        """
        Test posting a post like to the inbox and having a Like object created.
        """
        liker = util.create_author("jennie", "jennierubyjane")
        post = util.create_post(self.author, "content")
        data = {
            "summary": f"{liker.displayName} Likes your post",
            "type": "Like",
            "actor": serializers.AuthorSerializer(
                self.author, context={"request": self.request}).data,
            "object": serializers.PostSerializer(
                post, context={"request": self.request}).data['id'],
        }
        response = self.client.post(
            f"/api/v1/author/{self.author.id}/inbox/",
            data=json.dumps(data),
            content_type="application/json",
        )
        self.assertEquals(response.status_code, 201)
        response = self.client.get(f"/api/v1/author/{self.author.id}/inbox/")
        d = util.response_to_json(response)
        self.assertEquals(len(d['items']), 1)
        response = self.client.get(f"/api/v1/author/{self.author.id}/posts/{post.id}/likes/")
        d = util.response_to_json(response)
        self.assertEquals(len(d), 1)
    
    def test_comment_like(self):
        liker = util.create_author("jennie", "jennierubyjane")
        post = util.create_post(self.author, "content")
        comment = util.create_comment(self.author, post, "comment")
        data = {
            "summary": f"{liker.displayName} Likes your comment",
            "type": "Like",
            "actor": serializers.AuthorSerializer(
                self.author, context={"request": self.request}).data,
            "object": serializers.CommentSerializer(
                comment, context={"request": self.request}).data['id'],
        }
        response = self.client.post(
            f"/api/v1/author/{self.author.id}/inbox/",
            data=json.dumps(data),
            content_type="application/json",
        )
        self.assertEquals(response.status_code, 201)
        response = self.client.get(f"/api/v1/author/{self.author.id}/inbox/")
        d = util.response_to_json(response)
        self.assertEquals(len(d['items']), 1)
        response = self.client.get(f"/api/v1/author/{self.author.id}/posts/{post.id}/comments/{comment.id}/likes/")
        d = util.response_to_json(response)
        self.assertEquals(len(d), 1)

    def test_follow_request(self):
        follower = util.create_author("jennie", "jennierubyjane")
        data = {
            "summary": "test",
            "type": "Follow",
            "actor": serializers.AuthorSerializer(
                follower, context={"request": self.request}).data,
            "object": serializers.AuthorSerializer(
                self.author, context={"request": self.request}).data,
        }
        response = self.client.post(
            f"/api/v1/author/{self.author.id}/inbox/",
            data=json.dumps(data),
            content_type="application/json",
        )
        response = self.client.get(f"/api/v1/author/{self.author.id}/inbox/")
        d = util.response_to_json(response)
        self.assertEquals(len(d['items']), 1)
        self.assertEquals(len(models.FollowReq.objects.all()), 1)

    '''
    def test_receive_multiple_items(self):
        """
        Test multiple entries in the inbox
        """
        liker1 = util.create_author("jennie", "jennierubyjane")
        liker2 = util.create_author("jisoo", "sooyaa__")
        post = util.create_post(self.author, "content")
        like1 = util.create_post_like(liker1, post)
        like2 = util.create_post_like(liker2, post)
        data1 = serializers.LikeSerializer(
            like1, context={"request": self.request}
        ).data
        data2 = serializers.LikeSerializer(
            like2, context={"request": self.request}
        ).data
        self.client.post(
            f"/api/v1/author/{self.author.id}/inbox/",
            data=json.dumps(data1),
            content_type="application/json",
        )
        self.client.post(
            f"/api/v1/author/{self.author.id}/inbox/",
            data=json.dumps(data2),
            content_type="application/json",
        )
        response = self.client.get(f"/api/v1/author/{self.author.id}/inbox/")
        d = util.response_to_json(response)
        self.assertEqual(len(d["items"]), 2)
    '''

    def test_clear_inbox(self):
        """
        Test DELETE on the inbox
        """
        liker = util.create_author("jennie", "jennierubyjane")
        post = util.create_post(self.author, "content")
        data = {
            "summary": f"{liker.displayName} Likes your post",
            "type": "Like",
            "actor": serializers.AuthorSerializer(
                self.author, context={"request": self.request}).data,
            "object": serializers.PostSerializer(
                post, context={"request": self.request}).data['id'],
        }
        response = self.client.post(
            f"/api/v1/author/{self.author.id}/inbox/",
            data=json.dumps(data),
            content_type="application/json",
        )
        response = self.client.delete(f"/api/v1/author/{self.author.id}/inbox/")
        d = util.response_to_json(response)
        self.assertEqual(d["items"], [])
