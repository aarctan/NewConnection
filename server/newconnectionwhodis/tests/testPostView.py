import uuid

from django.test import TestCase
from rest_framework.test import APIClient

from . import util
from .. import serializers, models


class PostViewTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.author = util.create_author("Muhammad", "Exanut")
        self.client.force_authenticate(self.author.user)
        self.author_id = self.author.id

    def test_no_posts(self):
        """
        Tests that a db with a single author and nothing else has no posts.
        """
        response = self.client.get(f"/api/v1/author/{self.author_id}/posts/")
        self.assertEqual(response.status_code, 200)
        self.assertListEqual(util.response_to_json(response), [])

    def test_post_id_get(self):
        """
        Tests that /author/<author_id>/posts/<post_id> returns the expected post
        """
        post = util.create_post(self.author, "Placeholder")
        post_id = post.id
        response = self.client.get(f"/api/v1/author/{self.author_id}/posts/{post_id}/")
        self.assertEqual(response.status_code, 200)
        d = util.response_to_json(response)
        self.assertEqual(d["type"], "post")
        self.assertEquals(len(d["author"]), 7)  # author has 6 fields
        host = d["author"]["host"]
        self.assertTrue("http" in host)
        self.assertEquals(d["id"], f"{host}api/v1/author/{self.author_id}/posts/{post_id}")
        # TODO: Test content with various content types

    def test_post_belongs_to_author(self):
        """
        Tests whether /author/<author_id>/posts/ returns ONLY that author's posts
        """
        author2 = util.create_author("Dylan", "dylandeco")
        util.create_post(self.author, "post1")
        util.create_post(author2, "post2")
        util.create_post(author2, "post3")
        response1 = self.client.get("/api/v1/author/{}/posts/".format(self.author_id))
        response2 = self.client.get("/api/v1/author/{}/posts/".format(author2.id))
        self.assertEquals(len(util.response_to_json(response1)), 1)
        self.assertEquals(len(util.response_to_json(response2)), 2)

    def test_post_post(self):
        """
        Tests POSTing a post.
        """
        data = {
            "author": self.author_id,
            "content": "Placeholder",
            "contentType": "text/plain",
            "title": "Title",
            "description": "Description",
        }
        response = self.client.post(
            f"/api/v1/author/{self.author_id}/posts/",
            data=data,
            format="json",
        )
        self.assertEquals(response.status_code, 201)
        response = self.client.post(
            f"/api/v1/author/{self.author_id}/posts/",
            data=data,
            format="json",
        )
        self.assertEquals(response.status_code, 201)
        response = self.client.get(f"/api/v1/author/{self.author_id}/posts/")
        self.assertEquals(len(util.response_to_json(response)), 2)

    def test_put_with_id(self):
        """
        Create a post with a specified id
        """
        ID = uuid.uuid4()
        data = {
            "id": ID,
            "author": self.author_id,
            "content": "Placeholder",
            "contentType": "text/plain",
            "title": "Title",
            "description": "Description",
        }
        response = self.client.put(
            f"/api/v1/author/{self.author_id}/posts/{ID}/",
            data=data,
            format="json",
        )
        self.assertEquals(response.status_code, 201)
        d = util.response_to_json(response)
        self.assertTrue(str(ID) in d["id"])

    def test_edit_post(self):
        post = util.create_post(self.author, "content")
        post_id = post.id
        data = {"content": "new_content"}
        response = self.client.post(
            f"/api/v1/author/{self.author_id}/posts/{post_id}/",
            data=data,
            format="json",
        )
        d = util.response_to_json(response)
        self.assertEqual(d["content"], "new_content")

    def test_edit_post_unauth(self):
        self.client.force_authenticate(None)
        post = util.create_post(self.author, "content")
        post_id = post.id
        data = {"content": "new_content"}
        response = self.client.post(
            f"/api/v1/author/{self.author_id}/posts/{post_id}/",
            data=data,
            format="json",
        )
        self.assertEqual(response.status_code, 401)

    def test_post_delete(self):
        """
        Test deleting an existing post
        """
        post = util.create_post(self.author, "Placeholder")
        post_id = post.id
        response = self.client.delete(
            f"/api/v1/author/{self.author_id}/posts/{post_id}/"
        )
        self.assertEquals(response.status_code, 204)
        self.assertEquals(len(models.Post.objects.all()), 0)
