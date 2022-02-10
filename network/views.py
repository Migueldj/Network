from unicodedata import name
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
from django.views.decorators.csrf import csrf_exempt
import json

from django.core.paginator import Paginator #Paginator

def index(request):
    posts = Post.objects.all()
    posts= posts.order_by("-timestamp").all()

    paginator = Paginator(posts, 10)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    return render(request, "network/index.html", {
        "form":PostForm(),
        "page_obj":page_obj,
    })

def getPosts(request):
    posts = Post.objects.all()
    posts= posts.order_by("-timestamp").all()

    paginator = Paginator(posts, 10)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    return JsonResponse([post.serialize() for post in page_obj], safe=False)

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
        labels = {
            'content':''
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

def follows(follower,followed):
    return follower.following.filter(username=followed.username).exists()

@login_required(login_url='login')
def userPage(request, username):
    reqUser = request.user
    user = User.objects.get(username=username)
    followers = user.followers.all()
    following = user.following.all()
    posts = user.user_posts.all()
    posts = posts.order_by("-timestamp").all()
    followBool = follows(reqUser, user)

    paginator = Paginator(posts, 10)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    return render(request, "network/userPage.html",{
        "followers": len(followers),
        "form":PostForm(),
        "following":len(following),
        "page_obj":page_obj,
        "userPage":user,
        "followBool":followBool,
    })

@login_required(login_url='login')
def follow(request, username):
    user = request.user #El que va a seguir
    follow = User.objects.get(username=username) #Al que va a seguir 

    if follows(user,follow): #si el que va a seguir ya sigue
        user.following.remove(follow) #quitalo de su following
        follow.followers.remove(user) #y deja de ser follower
    else:
        user.following.add(follow) #agregalo a sus following
        follow.followers.add(user) #agregalo a sus followers
    
    return HttpResponseRedirect(reverse("userPage",kwargs={'username': follow.username}))

@login_required(login_url='login')
def followingView(request):
    '''
    Add some conditionals if the user doesn't follow any other users and if the followed users haven't post anything
    '''
    user = request.user
    print(user)
    users = user.following.all()
    print(users)
    empty = Post.objects.none() #this created an empty QuerySet to add the posts of every followed user to it
    for user in users:
        posts = user.user_posts.all()
        empty = empty | posts
        q = empty

    # Aquí sale un error porque falta validar cuando el usuario no sigue a nadie.

    q = q.order_by("-timestamp").all()

    paginator = Paginator(q, 10)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    return render(request, "network/index.html", {
        "form":PostForm(),
        "page_obj":page_obj,
    })

# @login_required(login_url='login')
# def userPosts(request):
#     #Filter posts of the user using related name
#     user = request.user
#     posts = user.user_posts.all()

#     #Return posts in reverse chronological order
#     posts = posts.order_by("-timestamp").all()
#     return JsonResponse([post.serialize() for post in posts], safe=False)

def allPosts(request):
    posts = Post.objects.all()
    posts = posts.order_by("-timestamp").all()
    return  JsonResponse([post.serialize() for post in posts], safe=False)

@login_required(login_url='login')
def allFollowing(request):
    user = request.user
    users = user.following.all()
    empty = Post.objects.none() #this created an empty QuerySet to add the posts of every followed user to it
    for user in users:
        posts = user.user_posts.all()
        empty = empty | posts
        q = empty
    if len(empty) != 0:
        return  JsonResponse([post.serialize() for post in q], safe=False)
    else:
        return JsonResponse({}, safe=False)

@login_required(login_url='login')
def userPosts(request, username):
    user = User.objects.get(username=username)
    posts = user.user_posts.all()
    return JsonResponse([post.serialize() for post in posts], safe=False)

# @login_required(login_url='login')
# def userInfo(request, userName):
#     user = request.user
#     return JsonResponse(user.serialize())

@csrf_exempt
@login_required
def setpost(request, post_id):

    user = request.user
    # Query for requested post
    try:
        post = Post.objects.get(pk=post_id)
    except Post.DoesNotExist:
        return JsonResponse({"error": "Post not found."}, status=404)

    # Return email contents
    if request.method == "GET":
        info = post.serialize()
        isLiked = f"{user}" in post.serialize()["likes"]
        info.update(isLiked=isLiked)
        return JsonResponse(info)

    # Update whether email is read or should be archived
    elif request.method == "PUT":
        if f"{user}" in post.serialize()["likes"] :
            post.likes.remove(user)
        else:
            post.likes.add(user)
        post.save()
        return HttpResponse(status=204)

    # Email must be via GET or PUT
    else:
        return JsonResponse({
            "error": "GET or PUT request required."
        }, status=400)
