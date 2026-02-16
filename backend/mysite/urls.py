from django.contrib import admin
from django.urls import path, include, re_path
from django.http import HttpResponse
from django.conf import settings
import os
import mimetypes

def serve_frontend(request, path='index.html'):
    if not path:
        path = 'index.html'
    
    # Security check to prevent directory traversal outside of project root
    # (Basic check, effectively relying on os.path.join resolving within user space provided setup)
    # The parent of BASE_DIR (backend) is the project root (shopping system)
    project_root = settings.BASE_DIR.parent
    file_path = os.path.join(project_root, path)

    if os.path.isdir(file_path):
        file_path = os.path.join(file_path, 'index.html')

    if os.path.exists(file_path) and os.path.isfile(file_path):
        mime_type, _ = mimetypes.guess_type(file_path)
        if not mime_type:
            mime_type = 'application/octet-stream'
        with open(file_path, 'rb') as f:
            return HttpResponse(f.read(), content_type=mime_type)
    
    return HttpResponse("File not found", status=404)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    re_path(r'^(?P<path>.*)$', serve_frontend),
]
