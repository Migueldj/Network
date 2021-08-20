from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.http.response import JsonResponse
from django.shortcuts import render
from django.urls import reverse

from .models import Post, User
from django.forms import ModelForm
from django.forms.widgets import Textarea
from django.contrib.auth.decorators import login_required

def index(request):
    return render(request, "network/index.html", {
        "form":PostForm(),
    })


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")

class PostForm(ModelForm):
    class Meta:
        model = Post
        fields = ['content']

        widgets = {
            'content': Textarea(attrs={'class':'form-control', 'placeholder':'Add a post', 'rows':2})
        }
        
@login_required(login_url = 'login') 
def post(request):
    if request.method == 'POST':
        postForm = PostForm(request.POST)
        if postForm.is_valid:
            newPost = postForm.save(commit=False)
            newPost.user = request.user
            newPost.save()
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/index.html",{
                "form":postForm,
            })
    return render(request,"network/index.html", {
        "form":PostForm(),
    })

@login_required(login_url='login')
def userPosts(request):
    #Filter posts of the user using related name
    user = request.user
    posts = user.user_posts.all()

    #Return posts in reverse chronological order
    posts = posts.order_by("-timestamp").all()
    return JsonResponse([post.serialize() for post in posts], safe=False)