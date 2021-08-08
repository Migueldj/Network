from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models.deletion import CASCADE


class User(AbstractUser):
    followers = models.ManyToManyField("self", blank=True)
    following = models.ManyToManyField("self", blank=True)

class Post(models.Model):
    user = models.ForeignKey(User, on_delete=CASCADE, related_name="user_posts")
    content = models.CharField(max_length = 100)
    likes = models.ManyToManyField(User, blank=True)




