# cmput404-group-project
Group project for cmput404 Fall 2021

## Getting started

To get started with the server, create a virtual environment if it does not exist<br>
`$ virtualenv venv --python=python3`

Start the environment with<br>
`$ source venv/bin/activate`

Install the dependencies if the environment is new<br>
`$ cd server;pip install -r requirements.txt`

Run migrations<br>
`$ python manage.py migrate`

Run tests<br>
`$ python manage.py test`

Run the server with<br>
`$ python manage.py runserver`

Exit the environment with<br>
`$ deactivate`

Instructions above taken from https://uofa-cmput404.github.io/lab-4-django.html

## External Sources
"Writing your first Django app", Django documentation:
https://docs.djangoproject.com/en/3.2/intro/

Writing Django unit tests:
https://docs.djangoproject.com/en/3.2/topics/testing/overview/

Article "Build a REST API in 30 minutes with Django REST Framework" by Bennett Garner:
https://medium.com/swlh/build-your-first-rest-api-with-django-rest-framework-e394e39a482c

Virtualenv instructions by Alexander Wong:
https://uofa-cmput404.github.io/lab-4-django.html

Client side based off of devias-io/material-kit-react
https://github.com/devias-io/material-kit-react

PUT testcase resulting in 415:
https://stackoverflow.com/a/15154163

Decode response to JSON:
https://stackoverflow.com/questions/988228/convert-a-string-representation-of-a-dictionary-to-a-dictionary/19391807#19391807

Nested serialization serializers:
https://www.py4u.net/discuss/188993

Absolute URL serialization:
https://stackoverflow.com/questions/23918619/django-rest-framework-and-filefield-absolute-url/23918960#23918960

POST in ModelViewSet:
https://stackoverflow.com/questions/34797050/django-rest-framework-create-child-of-nested-relationship/34797456#34797456
