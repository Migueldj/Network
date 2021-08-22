from django.contrib import admin
from .models import Post, User 
# Register your models here.

class UserAdmin(admin.ModelAdmin):
    filter_horizontal = ("followers","following")

class PostAdmin(admin.ModelAdmin):
    filter_horizontal = ("likes",)

admin.site.register(User,UserAdmin)
admin.site.register(Post,PostAdmin)