#!/bin/bash

# Make sure to run this in a venv and in newconnection/server (where the script is located)

#pip freeze | xargs pip uninstall -y
#pip install -r requirements.txt

rm -rf ./db.sqlite3 ./newconnectionwhodis/migrations/0*.py
python manage.py makemigrations;python manage.py migrate

# https://stackoverflow.com/a/42812446
./manage.py shell -c "from django.contrib.auth.models import User; User.objects.create_superuser('admin', '', 'admin')"
./manage.py shell -c "from django.contrib.auth.models import User; User.objects.create_superuser('Exanut', '', 'admin')"
./manage.py shell -c "from django.contrib.auth.models import User; User.objects.create_superuser('jisoo', '', 'admin')"

python manage.py test
python manage.py runserver
