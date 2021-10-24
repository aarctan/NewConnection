from django.apps import AppConfig


class NewconnectionwhodisConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "newconnectionwhodis"

    # https://stackoverflow.com/a/28135149
    def ready(self):
        import newconnectionwhodis.signals.handlers
