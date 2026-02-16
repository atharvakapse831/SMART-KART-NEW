from django.urls import path
from . import views

urlpatterns = [
    path('health', views.health, name='health'),
    path('products', views.product_list, name='product_list'),
    path('products/<int:pk>', views.product_detail, name='product_detail'),
    path('categories', views.category_list, name='category_list'),
    path('login', views.login, name='login'),
    path('signup', views.signup, name='signup'),
    path('orders', views.create_order, name='create_order'),
    path('orders/<int:userId>', views.user_orders, name='user_orders'),
    path('order/<int:pk>', views.order_detail, name='order_detail'),
]
