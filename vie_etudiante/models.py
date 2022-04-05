from django.db import models
from django.conf import settings
from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User


class Asso(models.Model):
    nom_asso = models.CharField(max_length=200)
    text = models.TextField(blank=True, null=True)
    image = models.ImageField(null=True, blank=True, upload_to="../images/")

    def publish(self):
        self.save()

    def __str__(self):
        return self.nom_asso

