from django.urls import path
from . import views

urlpatterns = [
    path('health', views.health),

    # Auth
    path('auth/login', views.login),
    path('auth/signup', views.signup),
    path('auth/refresh', views.refresh_token),
    path('auth/me', views.me),
    path('auth/profile', views.update_profile),

    # Catalogue
    path('categories', views.category_list),
    path('products', views.product_list),
    path('products/<int:pk>', views.product_detail),

    # Cart (requires auth)
    path('cart', views.cart_get),
    path('cart/add', views.cart_add),
    path('cart/clear', views.cart_clear),
    path('cart/<int:item_id>', views.cart_update),  # PUT to update qty; DELETE to remove

    # Coupon
    path('validate-coupon', views.validate_coupon),

    # Orders
    path('orders', views.create_order),        # POST to create
    path('orders/my', views.my_orders),        # GET my orders
    path('orders/<int:pk>', views.order_detail),  # GET single order

    # Reviews
    path('products/<int:product_id>/reviews', views.add_review),

    # Admin
    path('admin/dashboard', views.admin_dashboard),
    path('admin/products', views.admin_products),
    path('admin/products/<int:pk>', views.admin_product_detail),
    path('admin/categories', views.admin_categories),
    path('admin/categories/<int:pk>', views.admin_category_detail),
    path('admin/orders', views.admin_orders),
    path('admin/orders/<int:pk>', views.admin_order_update),
    path('admin/customers', views.admin_customers),
    path('admin/customers/<int:pk>', views.admin_customer_update),
    path('admin/coupons', views.admin_coupons),
    path('admin/coupons/<int:pk>', views.admin_coupon_detail),
]
