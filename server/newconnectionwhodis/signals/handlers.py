from django.dispatch import receiver
from django.contrib.auth.models import User
from django.db.models.signals import post_save

@receiver(post_save, sender=User)
def default_to_non_active(sender, instance, created, **kwargs):
    if created:
        print("user created")
        print(instance)