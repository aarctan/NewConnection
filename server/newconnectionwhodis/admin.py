from django.contrib import admin
from .models import Author, Post, Like, Comment

admin.site.register(Author)
admin.site.register(Post)
admin.site.register(Like)
admin.site.register(Comment)