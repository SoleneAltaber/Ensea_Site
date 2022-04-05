from django.shortcuts import render
from vie_etudiante.models import Asso

#definir requete Post

def vie_etudiante_page(request) : #lien entre model et template
    Presentation=Asso.objects.all()
    contain={'Presentation': Presentation}
    return render(request, '../templates/vie_etudiante.html', contain)

