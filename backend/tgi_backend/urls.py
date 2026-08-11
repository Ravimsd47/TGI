"""
URL configuration for tgi_backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path
from django.http import FileResponse, HttpResponse
from pathlib import Path
import traceback
from django.db import connection

BASE_DIR = Path(__file__).resolve().parent.parent
FRONTEND_DIR = BASE_DIR.parent / "frontend" / "dist"


def frontend(request):
    return FileResponse(open(FRONTEND_DIR / "index.html", "rb"))


def test_db(request):
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            row = cursor.fetchone()
        return HttpResponse(f"Connection successful: {row}", content_type="text/plain")
    except Exception as e:
        return HttpResponse(traceback.format_exc(), content_type="text/plain")


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/test-db/", test_db),
    path("api/", include("booking_system.urls")),
    re_path(r"^(?!api/|admin/).*$", frontend),
]