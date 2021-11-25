!/bin/bash

# Make sure to run this in a venv and in newconnection/server (where the script is located)

#pip freeze | xargs pip uninstall -y
#pip install -r requirements.txt

rm -rf ./db.sqlite3 ./newconnectionwhodis/migrations/0*.py
python manage.py makemigrations;python manage.py migrate

# https://stackoverflow.com/a/42812446
./manage.py shell -c "from django.contrib.auth.models import User; User.objects.create_superuser('admin', '', 'NewConnectionAdmin')"
./manage.py shell -c "from django.contrib.auth.models import User; User.objects.create_superuser('Muhammad', '', 'admin')"
./manage.py shell -c "from newconnectionwhodis import models; a = models.Author.objects.get(displayName='Muhammad'); a.profileImage='https://avatars.githubusercontent.com/u/83198532?v=4'; a.github='https://github.com/Exanut'; a.save();"
./manage.py shell -c "from django.contrib.auth.models import User; User.objects.create_superuser('Dylan', '', 'admin')"
./manage.py shell -c "from newconnectionwhodis import models; a = models.Author.objects.get(displayName='Dylan'); a.profileImage='https://avatars.githubusercontent.com/u/69830467?v=4'; a.github='https://github.com/dylandeco'; a.save();"
./manage.py shell -c "from django.contrib.auth.models import User; User.objects.create_superuser('Zi', '', 'admin')"
./manage.py shell -c "from django.contrib.auth.models import User; User.objects.create_superuser('Neel', '', 'admin')"
./manage.py shell -c "from newconnectionwhodis import models; a = models.Author.objects.get(displayName='Neel'); a.profileImage='https://avatars.githubusercontent.com/u/44443467?v=4'; a.save();"
./manage.py shell -c "from django.contrib.auth.models import User; User.objects.create_superuser('Carter', '', 'admin')"

# Add all the groups we are connected to
./manage.py shell -c "from newconnectionwhodis.models import Node; Node.objects.create(host_uri='https://cmput404-vgt-socialdist.herokuapp.com/', username='VeryGoodAuth', password='CoolPassword');"
./manage.py shell -c "from newconnectionwhodis.models import Node; Node.objects.create(host_uri='https://i-connect.herokuapp.com/', username='admin', password='admin');"
./manage.py shell -c "from newconnectionwhodis.models import Node; Node.objects.create(host_uri='https://i-connect.herokuapp.com', username='admin', password='admin');"
./manage.py shell -c "from newconnectionwhodis.models import Node; Node.objects.create(host_uri='https://newconnection-server.herokuapp.com/', username='admin', password='NewConnectionAdmin');"
./manage.py shell -c "from newconnectionwhodis.models import Node; Node.objects.create(host_uri='http://127.0.0.1:8000/', username='admin', password='NewConnectionAdmin');"


python manage.py test
python manage.py runserver
