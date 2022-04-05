from django.shortcuts import render


from news.models import Post

#definir requete Post

def news_page(request) : #lien entre model et template
    News=Post.objects.all()
    contain={'News': News}
    return render(request, '../templates/news.html', contain)
