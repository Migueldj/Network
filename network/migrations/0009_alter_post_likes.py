# Generated by Django 3.2.6 on 2021-08-22 04:58

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0008_alter_post_likes'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='likes',
            field=models.ManyToManyField(blank=True, null=True, related_name='post_likers', to=settings.AUTH_USER_MODEL),
        ),
    ]