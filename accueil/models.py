from django.db import models
from django.conf import settings
from django.utils import timezone

class Accueil(models.Model):
	name =  models.CharField(max_length=30)

	def __str__(self):
		return self.name

class Accueil_Display(models.Model):
	list_display=('name')



