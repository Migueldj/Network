from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models.deletion import CASCADE


class User(AbstractUser):
    followers = models.ManyToManyField("self", blank=True)
    following = models.ManyToManyField("self", blank=True)

class Post(models.Model):
    user = models.ForeignKey(User, on_delete=CASCADE, related_name="user_posts", null=False)
    content = models.CharField(max_length = 100)
    timestamp = models.DateTimeField(auto_now_add=True, editable=True)
    likes = models.ManyToManyField(User, blank=True, null=True, related_name="post_likers")

    def serialize(self):
        return{
            "id": self.id,
            "content":self.content,
            "user": self.user.username,
            "timestamp": self.timestamp.strftime("%b %d %Y, %I:%M %p"),
            "likes": [user.username for user in self.likes.all()]
        }
    
    def __str__(self):
        return f"{self.user} posted: {self.content} at: {self.timestamp}"




