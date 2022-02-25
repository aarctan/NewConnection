from django.contrib.auth.models import User
from django.test import TestCase


class AuthenticationTests(TestCase):
    def setUp(self):
        response = self.client.get("")
        self.request = response.wsgi_request

    # Tests newly registered user and if they require an admin's approval to log in
    def test_new_user(self):
        data = {
            "username": "Arctan",
            "password1": "Thequickbrownfox23",
            "password2": "Thequickbrownfox23",
        }
        response = self.client.post(
            f"/api/v1/dj-rest-auth/registration/",
            data,
            format="json",
        )
        self.assertEquals(response.status_code, 201)
        self.assertEquals(len(User.objects.all()), 1)
        self.assertEqual(User.objects.get(username="Arctan").is_active, False)
        