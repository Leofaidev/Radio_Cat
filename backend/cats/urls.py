from django.urls import path
from .views import CatListCreateView, CatDetailView

urlpatterns = [
    path('cats/', CatListCreateView.as_view(), name='cat_list_create'),
    path('cats/<int:pk>/', CatDetailView.as_view(), name='cat_detail'),
]
