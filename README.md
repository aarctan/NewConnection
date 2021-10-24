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
Author:unknown
Link:https://docs.djangoproject.com/en/3.2/intro/
Source: https://docs.djangoproject.com/en/3.2/intro/

Writing Django unit tests:
Author: unknown
Link: https://docs.djangoproject.com/en/3.2/topics/testing/overview/
Source:https://docs.djangoproject.com/en/3.2/topics/testing/overview/

Article "Build a REST API in 30 minutes with Django REST Framework" by Bennett Garner:
Author:https://bennettgarner.medium.com/?source=post_page-----e394e39a482c--------------------------------
Link: https://medium.com/swlh/build-your-first-rest-api-with-django-rest-framework-e394e39a482c
Source: https://medium.com/swlh/build-your-first-rest-api-with-django-rest-framework-e394e39a482c

Virtualenv instructions by Alexander Wong:
Author: https://uofa-cmput404.github.io/author/alexander-wong.html
Link: https://uofa-cmput404.github.io/lab-4-django.html
Source: https://uofa-cmput404.github.io/lab-4-django.html

PUT testcase resulting in 415:
Author:https://stackoverflow.com/users/596689/tom-christie
Link:https://stackoverflow.com/a/15154163
Source:https://stackoverflow.com/questions/15153048/django-rest-framework-http-put-failing-with-415-on-django-1-5/15154163#15154163

Decode response to JSON:
Author: https://stackoverflow.com/users/1406532/0x539
Link: https://stackoverflow.com/a/19391807
Source: https://stackoverflow.com/questions/988228/convert-a-string-representation-of-a-dictionary-to-a-dictionary/19391807#19391807

Nested serialization serializers:
Author: https://stackoverflow.com/users/2719875/user2719875
Link:https://www.py4u.net/discuss/188993
Source:https://www.py4u.net/discuss/188993

Absolute URL serialization:
Author:https://stackoverflow.com/users/143880/johntellsall
Link: https://stackoverflow.com/a/23918960
Source:https://stackoverflow.com/questions/23918619/django-rest-framework-and-filefield-absolute-url/23918960#23918960


POST in ModelViewSet:
Author: https://stackoverflow.com/users/5017015/tristan
Link:https://stackoverflow.com/questions/34797050/django-rest-framework-create-child-of-nested-relationship/34797456#34797456
Source: https://stackoverflow.com/a/34797050/


Button Text Styling
Author:https://stackoverflow.com/users/644589/marc-steffens
Link: https://stackoverflow.com/a/57226626 
Source: https://stackoverflow.com/questions/39297616/how-to-left-align-the-label-in-a-button/65034457#65034457
Author:https://stackoverflow.com/users/644589/marc-steffens
Link: https://stackoverflow.com/a/65034457
Source: https://stackoverflow.com/questions/39297616/how-to-left-align-the-label-in-a-button/65034457#65034457


Removing Items from list React
Author:  ROBIN WIERUCH
Link:https://www.robinwieruch.de/react-remove-item-from-list
Source: https://www.robinwieruch.de/react-remove-item-from-list

DjangoSuperuser Bash
Author: https://stackoverflow.com/users/2532408/marcel-wilson
Link: https://stackoverflow.com/a/42812446
Source:https://stackoverflow.com/questions/6244382/how-to-automate-createsuperuser-on-django/42812446#42812446

Django Signals
Author: https://stackoverflow.com/users/1224827/blairg23
Link: https://stackoverflow.com/a/28135149
Source: https://stackoverflow.com/questions/28135029/why-django-model-signals-are-not-working/28135149#28135149

Django Lists
Author: https://stackoverflow.com/questions/1110153/what-is-the-most-efficient-way-to-store-a-list-in-the-django-models/7151813#7151813
Link: https://stackoverflow.com/a/7151813
Source:https://stackoverflow.com/users/323874/mindthief

Removing userfield from login
Author: https://stackoverflow.com/users/2704544/yofee
Link: https://stackoverflow.com/a/55128035
Source: https://stackoverflow.com/questions/55120215/how-to-remove-username-field-from-login-page-in-django-userchangeform/55128035#55128035

Django is Active Userform
Author:https://stackoverflow.com/users/11852581/tommy-neeld
Link:https://stackoverflow.com/a/59669317
Source:https://stackoverflow.com/questions/48049247/how-to-set-is-active-false-in-django-usercreationform/59669317#59669317

Layout Sourcing:

MainLayout - Client side based off of devias-io/material-kit-react
Arthor: https://github.com/devias-io
Link: https://github.com/devias-io/material-kit-react.git
Source:https://github.com/devias-io/material-kit-react

