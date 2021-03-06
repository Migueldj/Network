from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models.deletion import CASCADE


class User(AbstractUser):
    followers = models.ManyToManyField("self", blank=True, symmetrical=False, related_name="follower_users") #symmetrical=False to break the one on one relation
    following = models.ManyToManyField("self", blank=True, symmetrical=False, related_name="following_users") #probably it would be better to use an intermediary model 

    def serialize(self):
        return{
            "id": self.id,
            "username":self.username,
            "followers": [follower.username for follower in self.followers.all()],
            "following": [follow.username for follow in self.following.all()],
        }

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




