
from django.core.exceptions import ViewDoesNotExist
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("post", views.post, name="post"),
    path("user/<str:username>", views.userPage, name="userPage"),
    path("follow/<str:username>", views.follow, name="follow"),
    path("following", views.followingView, name="followingView"),

    # API routes
    path("allPosts",views.allPosts, name="allPosts"),
    path("allFollowing", views.allFollowing, name="allFollowing"),
    path("userPosts/<str:username>", views.userPosts, name="userPosts"),
    path("post/<int:post_id>", views.setpost, name="setpost")
 
]
