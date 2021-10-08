from django.dispatch import receiver
from django.contrib.auth.models import User
from django.db.models.signals import post_save

# https://stackoverflow.com/a/59669317
@receiver(post_save, sender=User)
def new_user_created(sender, instance, created, **kwargs):
    if created:
        print("user created")
        print(instance)