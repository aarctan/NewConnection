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

    # Tests if newly registered user is approved by an admin and can log in
    def test_approved_user(self):
        registration_data = {
            "username": "new_user",
            "password1": "Password123!",
            "password2": "Password123!",
        }
        registration_response = self.client.post(
            f"/api/v1/dj-rest-auth/registration/",
            registration_data,
            format="json",
        )
        new_user = User.objects.get(username="new_user")
        self.assertEquals(registration_response.status_code, 201)
        self.assertEqual(new_user.is_active, False)
        self.assertEquals(len(User.objects.all()), 1)

        login_data = {
            "username": "new_user",
            "password": "Password123!"
        }
        login_response = self.client.post(
            f"/api/v1/dj-rest-auth/login/",
            login_data,
            format="json",
        )
        self.assertEquals(login_response.status_code, 400)
        new_user.is_active = True
        new_user.save()
        login_response = self.client.post(
            f"/api/v1/dj-rest-auth/login/",
            login_data,
            format="json",
        )
        self.assertEquals(login_response.status_code, 200)
        