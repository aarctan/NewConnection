# cmput404-group-project

Group project for cmput404 Fall 2021

## API / Webservice

Our Webservice is deployed on heroku:<br>
`https://newconnection-server.herokuapp.com/api/v1/`

Here is an example GET request:<br>
`https://newconnection-server.herokuapp.com/api/v1/author/{AUTHOR_ID}/posts/`

All URLs match the specification outlined [here](https://github.com/abramhindle/CMPUT404-project-socialdistribution/blob/master/project.org)<br>

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
Author:unknown<br>
Link:https://docs.djangoproject.com/en/3.2/intro/<br>
Source: https://docs.djangoproject.com/en/3.2/intro/<br>

Writing Django unit tests:
Author: unknown<br>
Link: https://docs.djangoproject.com/en/3.2/topics/testing/overview/<br>
Source:https://docs.djangoproject.com/en/3.2/topics/testing/overview/<br>

Article "Build a REST API in 30 minutes with Django REST Framework" by Bennett Garner:<br>
Author:https://bennettgarner.medium.com/?source=post_page-----e394e39a482c--------------------------------<br>
Link: https://medium.com/swlh/build-your-first-rest-api-with-django-rest-framework-e394e39a482c<br>
Source: https://medium.com/swlh/build-your-first-rest-api-with-django-rest-framework-e394e39a482c<br>

Virtualenv instructions by Alexander Wong:<br>
Author: https://uofa-cmput404.github.io/author/alexander-wong.html<br>
Link: https://uofa-cmput404.github.io/lab-4-django.html<br>
Source: https://uofa-cmput404.github.io/lab-4-django.html<br>

PUT testcase resulting in 415:<br>
Author:https://stackoverflow.com/users/596689/tom-christie<br>
Link:https://stackoverflow.com/a/15154163<br>
Source:https://stackoverflow.com/questions/15153048/django-rest-framework-http-put-failing-with-415-on-django-1-5/15154163#15154163<br>

Decode response to JSON:<br>
Author: https://stackoverflow.com/users/1406532/0x539<br>
Link: https://stackoverflow.com/a/19391807<br>
Source: https://stackoverflow.com/questions/988228/convert-a-string-representation-of-a-dictionary-to-a-dictionary/19391807#19391807<br>

Nested serialization serializers:<br>
Author: https://stackoverflow.com/users/2719875/user2719875<br>
Link:https://www.py4u.net/discuss/188993<br>
Source:https://www.py4u.net/discuss/188993<br>

Absolute URL serialization:<br>
Author:https://stackoverflow.com/users/143880/johntellsall<br>
Link: https://stackoverflow.com/a/23918960<br>
Source:https://stackoverflow.com/questions/23918619/django-rest-framework-and-filefield-absolute-url/23918960#23918960<br>


POST in ModelViewSet:<br>
Author: https://stackoverflow.com/users/5017015/tristan<br>
Link:https://stackoverflow.com/questions/34797050/django-rest-framework-create-child-of-nested-relationship/34797456#34797456<br>
Source: https://stackoverflow.com/a/34797050/<br>


Button Text Styling<br>
Author:https://stackoverflow.com/users/644589/marc-steffens<br>
Link: https://stackoverflow.com/a/57226626 <br>
Source: https://stackoverflow.com/questions/39297616/how-to-left-align-the-label-in-a-button/65034457#65034457<br>
Author:https://stackoverflow.com/users/644589/marc-steffens<br>
Link: https://stackoverflow.com/a/65034457<br>
Source: https://stackoverflow.com/questions/39297616/how-to-left-align-the-label-in-a-button/65034457#65034457<br>


Removing Items from list React<br>
Author:  ROBIN WIERUCH<br>
Link:https://www.robinwieruch.de/react-remove-item-from-list<br>
Source: https://www.robinwieruch.de/react-remove-item-from-list<br>

DjangoSuperuser Bash<br>
Author: https://stackoverflow.com/users/2532408/marcel-wilson<br>
Link: https://stackoverflow.com/a/42812446<br>
Source:https://stackoverflow.com/questions/6244382/how-to-automate-createsuperuser-on-django/42812446#42812446<br>

Django Signals<br>
Author: https://stackoverflow.com/users/1224827/blairg23<br>
Link: https://stackoverflow.com/a/28135149<br>
Source: https://stackoverflow.com/questions/28135029/why-django-model-signals-are-not-working/28135149#28135149<br>

Django Lists<br>
Author: https://stackoverflow.com/questions/1110153/what-is-the-most-efficient-way-to-store-a-list-in-the-django-models/7151813#7151813<br>
Link: https://stackoverflow.com/a/7151813<br>
Source:https://stackoverflow.com/users/323874/mindthief<br>

Removing userfield from login<br>
Author: https://stackoverflow.com/users/2704544/yofee<br>
Link: https://stackoverflow.com/a/55128035<br>
Source: https://stackoverflow.com/questions/55120215/how-to-remove-username-field-from-login-page-in-django-userchangeform/55128035#55128035<br>

Django is Active Userform<br>
Author:https://stackoverflow.com/users/11852581/tommy-neeld<br>
Link:https://stackoverflow.com/a/59669317<br>
Source:https://stackoverflow.com/questions/48049247/how-to-set-is-active-false-in-django-usercreationform/59669317#59669317<br>

Layout Sourcing:<br>

MainLayout - Client side based off of devias-io/material-kit-react<br>
Arthor: https://github.com/devias-io<br>
Link: https://github.com/devias-io/material-kit-react.git<br>
Source:https://github.com/devias-io/material-kit-react<br>

