import datetime
import uuid
import jwt
from django.conf import settings
from django.db.models import Q, Sum, Avg, F
from functools import wraps
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import (ProductCategory, Product, Customer, Cart, Order, OrderItems,
                     Payment, Delivery, Coupon, Review)
from .serializers import (ProductCategorySerializer, ProductSerializer, CustomerSerializer,
                           CartItemSerializer, OrderSerializer, OrderItemsSerializer,
                           PaymentSerializer, DeliverySerializer, CouponSerializer, ReviewSerializer)


def _to_bool(value):
    """Parse booleans from UI payloads like true/false, 1/0, yes/no."""
    if isinstance(value, bool):
        return value
    if isinstance(value, (int, float)):
        return value != 0
    if isinstance(value, str):
        return value.strip().lower() in ('1', 'true', 'yes', 'y', 'on')
    return False


# ─── JWT helpers ─────────────────────────────────────────────────────────────

def _generate_tokens(customer):
    now = datetime.datetime.utcnow()
    access = jwt.encode({
        'customer_id': customer.id,
        'email': customer.customer_email,
        'role': customer.role,
        'exp': now + datetime.timedelta(hours=24),
        'iat': now,
    }, settings.SECRET_KEY, algorithm='HS256')
    refresh = jwt.encode({
        'customer_id': customer.id,
        'exp': now + datetime.timedelta(days=7),
        'iat': now,
    }, settings.SECRET_KEY, algorithm='HS256')
    return access, refresh


def _get_customer(request):
    auth = request.headers.get('Authorization', '')
    if not auth.startswith('Bearer '):
        return None
    try:
        payload = jwt.decode(auth.split(' ', 1)[1], settings.SECRET_KEY, algorithms=['HS256'])
        return Customer.objects.get(id=payload['customer_id'], customer_status='active')
    except Exception:
        return None


def require_auth(f):
    @wraps(f)
    def wrapper(request, *args, **kwargs):
        customer = _get_customer(request)
        if not customer:
            return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
        request.customer = customer
        return f(request, *args, **kwargs)
    return wrapper


def require_admin(f):
    @wraps(f)
    def wrapper(request, *args, **kwargs):
        customer = _get_customer(request)
        if not customer or customer.role not in ('admin', 'superadmin'):
            return Response({'error': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)
        request.customer = customer
        return f(request, *args, **kwargs)
    return wrapper


# ─── Health ──────────────────────────────────────────────────────────────────

@api_view(['GET'])
def health(request):
    return Response({'status': 'ok', 'timestamp': datetime.datetime.now().isoformat()})


# ─── Auth ────────────────────────────────────────────────────────────────────

@api_view(['POST'])
def login(request):
    email = request.data.get('email', '').strip().lower()
    password = request.data.get('password', '')
    if not email or not password:
        return Response({'error': 'Email and password required'}, status=400)
    try:
        customer = Customer.objects.get(customer_email=email)
        if customer.customer_status == 'banned':
            return Response({'error': 'Your account has been suspended'}, status=403)
        if customer.customer_status == 'deleted':
            return Response({'error': 'Account not found'}, status=401)
        if not customer.check_password(password):
            return Response({'error': 'Invalid email or password'}, status=401)
        customer.upgrade_password_if_needed(password)
        access, refresh = _generate_tokens(customer)
        return Response({
            'message': 'success',
            'data': CustomerSerializer(customer).data,
            'access_token': access,
            'refresh_token': refresh,
        })
    except Customer.DoesNotExist:
        return Response({'error': 'Invalid email or password'}, status=401)


import re

@api_view(['POST'])
def signup(request):
    data = request.data
    name = data.get('customer_name', data.get('name', '')).strip()
    email = data.get('customer_email', data.get('email', '')).strip().lower()
    password = data.get('customer_password', data.get('password', ''))
    phone = data.get('customer_phone', data.get('phone', '')).strip()
    address = data.get('customer_address', data.get('address', '')).strip()

    if not name or not email or not password:
        return Response({'error': 'Name, email and password are required'}, status=400)
    if len(password) < 6:
        return Response({'error': 'Password must be at least 6 characters'}, status=400)

    # Validate email
    if not re.match(r'^[\w\.-]+@[\w\.-]+\.\w+$', email):
        return Response({'error': 'Please provide a valid email address'}, status=400)
    if Customer.objects.filter(customer_email=email).exists():
        return Response({'error': 'Email already registered'}, status=400)
        
    # Validate phone (optional but strict format if provided)
    if phone:
        # Accepts optional +, optional country code, and exactly 10 digits
        if not re.match(r'^(?:\+?\d{1,3}[- ]?)?\d{10}$', phone):
            return Response({'error': 'Please provide a valid 10-digit phone number'}, status=400)

    customer = Customer(customer_name=name, customer_email=email,
                        customer_phone=phone, customer_address=address)
    customer.set_password(password)
    customer.save()
    access, refresh = _generate_tokens(customer)
    return Response({
        'message': 'success',
        'data': CustomerSerializer(customer).data,
        'access_token': access,
        'refresh_token': refresh,
    }, status=201)


@api_view(['POST'])
def refresh_token(request):
    token = request.data.get('refresh_token')
    if not token:
        return Response({'error': 'refresh_token required'}, status=400)
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        customer = Customer.objects.get(id=payload['customer_id'])
        access, new_refresh = _generate_tokens(customer)
        return Response({'access_token': access, 'refresh_token': new_refresh})
    except Exception:
        return Response({'error': 'Invalid or expired refresh token'}, status=401)


@api_view(['GET'])
@require_auth
def me(request):
    return Response({'message': 'success', 'data': CustomerSerializer(request.customer).data})


@api_view(['PUT'])
@require_auth
def update_profile(request):
    c = request.customer
    data = request.data
    
    phone = data.get('customer_phone', c.customer_phone)
    if phone:
        if not re.match(r'^(?:\+?\d{1,3}[- ]?)?\d{10}$', phone.strip()):
            return Response({'error': 'Please provide a valid 10-digit phone number'}, status=400)

    c.customer_name = data.get('customer_name', c.customer_name)
    c.customer_phone = phone.strip() if phone else phone
    c.customer_address = data.get('customer_address', c.customer_address)
    if data.get('password'):
        if len(data['password']) < 6:
            return Response({'error': 'Password min 6 chars'}, status=400)
        c.set_password(data['password'])
    c.save()
    return Response({'message': 'success', 'data': CustomerSerializer(c).data})


# ─── Categories ───────────────────────────────────────────────────────────────

@api_view(['GET'])
def category_list(request):
    cats = ProductCategory.objects.filter(category_status=True)
    return Response({'message': 'success', 'data': ProductCategorySerializer(cats, many=True).data})


# ─── Products ─────────────────────────────────────────────────────────────────

@api_view(['GET'])
def product_list(request):
    qs = Product.objects.filter(product_status='available').select_related('category')
    category = request.GET.get('category')
    search = request.GET.get('search', '').strip()
    featured = request.GET.get('featured')
    min_price = request.GET.get('min_price')
    max_price = request.GET.get('max_price')
    sort = request.GET.get('sort', '-created_date')

    if category:
        qs = qs.filter(category__category_name__iexact=category)
    if search:
        qs = qs.filter(
            Q(product_name__icontains=search) |
            Q(product_description__icontains=search) |
            Q(tags__icontains=search)
        )
    if featured == '1':
        qs = qs.filter(is_featured=True)
    if min_price:
        qs = qs.filter(product_price__gte=float(min_price))
    if max_price:
        qs = qs.filter(product_price__lte=float(max_price))

    valid_sorts = ['product_price', '-product_price', 'product_name', '-product_name',
                   '-created_date', '-rating', '-review_count']
    if sort in valid_sorts:
        qs = qs.order_by(sort)

    page = max(int(request.GET.get('page', 1)), 1)
    page_size = min(int(request.GET.get('page_size', 12)), 50)
    total = qs.count()
    qs = qs[(page - 1) * page_size: page * page_size]

    return Response({
        'message': 'success',
        'data': ProductSerializer(qs, many=True).data,
        'pagination': {
            'total': total, 'page': page, 'page_size': page_size,
            'pages': max((total + page_size - 1) // page_size, 1)
        }
    })


@api_view(['GET'])
def product_detail(request, pk):
    try:
        product = Product.objects.select_related('category').get(pk=pk)
        # Public API: only expose available products; admin endpoint handles all
        if product.product_status != 'available':
            return Response({'error': 'Product not found'}, status=404)
        data = ProductSerializer(product).data
        data['reviews'] = ReviewSerializer(
            product.reviews.filter(is_approved=True).order_by('-created_date')[:20],
            many=True
        ).data
        return Response({'message': 'success', 'data': data})
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=404)


# ─── Cart (server-persisted) ──────────────────────────────────────────────────

@api_view(['GET'])
@require_auth
def cart_get(request):
    items = Cart.objects.filter(customer=request.customer, cart_status='active').select_related('product__category')
    return Response({'message': 'success', 'data': CartItemSerializer(items, many=True).data})


@api_view(['POST'])
@require_auth
def cart_add(request):
    product_id = request.data.get('product_id')
    quantity = int(request.data.get('quantity', 1))
    try:
        product = Product.objects.get(pk=product_id, product_status='available')
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=404)

    cart_item, created = Cart.objects.get_or_create(
        customer=request.customer, product=product,
        defaults={'quantity': quantity}
    )
    if not created:
        cart_item.quantity += quantity
        cart_item.save(update_fields=['quantity'])
    return Response({'message': 'success', 'data': CartItemSerializer(cart_item).data}, status=201)


@api_view(['PUT', 'DELETE'])
@require_auth
def cart_update(request, item_id):
    try:
        item = Cart.objects.get(pk=item_id, customer=request.customer)
    except Cart.DoesNotExist:
        return Response({'error': 'Cart item not found'}, status=404)
    if request.method == 'DELETE':
        item.delete()
        return Response({'message': 'Item removed'})
    quantity = int(request.data.get('quantity', item.quantity))
    if quantity <= 0:
        item.delete()
        return Response({'message': 'Item removed'})
    item.quantity = quantity
    item.save(update_fields=['quantity'])
    return Response({'message': 'success', 'data': CartItemSerializer(item).data})


@api_view(['DELETE'])
@require_auth
def cart_remove(request, item_id):
    Cart.objects.filter(pk=item_id, customer=request.customer).delete()
    return Response({'message': 'Item removed'})


@api_view(['DELETE'])
@require_auth
def cart_clear(request):
    Cart.objects.filter(customer=request.customer, cart_status='active').delete()
    return Response({'message': 'Cart cleared'})


# ─── Coupon ───────────────────────────────────────────────────────────────────

@api_view(['POST'])
@require_auth
def validate_coupon(request):
    code = request.data.get('code', '').strip().upper()
    order_total = float(request.data.get('total', 0))
    try:
        coupon = Coupon.objects.get(code=code, is_active=True)
        today = datetime.date.today()
        if coupon.expiry_date and coupon.expiry_date < today:
            return Response({'error': 'Coupon has expired'}, status=400)
        if coupon.usage_limit and coupon.used_count >= coupon.usage_limit:
            return Response({'error': 'Coupon usage limit reached'}, status=400)
        if order_total < float(coupon.min_order_amount):
            return Response({'error': f'Minimum order amount is ${coupon.min_order_amount}'}, status=400)
        if coupon.coupon_type == 'percent':
            discount = order_total * float(coupon.value) / 100
            if coupon.max_discount:
                discount = min(discount, float(coupon.max_discount))
        else:
            discount = float(coupon.value)
        return Response({'message': 'success', 'discount': round(discount, 2), 'code': code})
    except Coupon.DoesNotExist:
        return Response({'error': 'Invalid coupon code'}, status=404)


# ─── Orders ───────────────────────────────────────────────────────────────────

@api_view(['POST'])
@require_auth
def create_order(request):
    data = request.data
    customer = request.customer
    items_data = data.get('items', [])
    if not items_data:
        return Response({'error': 'No items provided'}, status=400)
    try:
        subtotal = sum(float(i['unit_price']) * int(i['quantity']) for i in items_data)
        discount = float(data.get('discount', 0))
        coupon_code = data.get('coupon_code', '').strip().upper()
        total = max(subtotal - discount, 0)

        order = Order.objects.create(
            customer=customer,
            order_total_amount=round(total, 2),
            subtotal=round(subtotal, 2),
            discount=round(discount, 2),
            coupon_code=coupon_code,
            order_status=data.get('order_status', 'Processing'),
            notes=data.get('notes', ''),
        )

        for item in items_data:
            product = Product.objects.get(id=item['product_id'])
            OrderItems.objects.create(
                order=order, product=product,
                quantity=int(item['quantity']),
                unit_price=float(item['unit_price'])
            )

        # Create Payment record
        invoice = f"INV-{order.id:06d}-{uuid.uuid4().hex[:6].upper()}"
        Payment.objects.create(
            order=order,
            payment_amount=total,
            payment_invoice=invoice,
            payment_method=data.get('payment_method', 'COD'),
            payment_status='Pending',
        )

        # Create Delivery record
        Delivery.objects.create(
            order=order,
            delivery_name=customer.customer_name,
            delivery_quantity=len(items_data),
            delivery_address=data.get('delivery_address', customer.customer_address or ''),
            delivery_date=data.get('delivery_date'),
        )

        # Apply coupon usage (atomic increment)
        if coupon_code:
            Coupon.objects.filter(code=coupon_code).update(used_count=F('used_count') + 1)

        # Clear cart items that were just ordered
        Cart.objects.filter(customer=customer, cart_status='active').update(cart_status='ordered')

        return Response({'message': 'success', 'orderId': order.id,
                         'invoice': invoice}, status=201)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=400)
    except Exception as e:
        return Response({'error': str(e)}, status=400)


@api_view(['GET'])
@require_auth
def my_orders(request):
    orders = Order.objects.filter(customer=request.customer).prefetch_related(
        'order_items__product', 'payment', 'delivery'
    )
    return Response({'message': 'success', 'data': OrderSerializer(orders, many=True).data})


@api_view(['GET'])
@require_auth
def order_detail(request, pk):
    try:
        order = Order.objects.prefetch_related('order_items__product', 'payment', 'delivery').get(pk=pk)
        if order.customer.id != request.customer.id and request.customer.role not in ('admin', 'superadmin'):
            return Response({'error': 'Forbidden'}, status=403)
        return Response({'message': 'success', 'data': OrderSerializer(order).data})
    except Order.DoesNotExist:
        return Response({'error': 'Order not found'}, status=404)


# ─── Reviews ─────────────────────────────────────────────────────────────────

@api_view(['POST'])
@require_auth
def add_review(request, product_id):
    try:
        product = Product.objects.get(pk=product_id)
        rating = max(1, min(5, int(request.data.get('rating', 5))))
        comment = request.data.get('comment', '').strip()
        if not comment:
            return Response({'error': 'Comment is required'}, status=400)
        review, created = Review.objects.update_or_create(
            customer=request.customer, product=product,
            defaults={'rating': rating, 'comment': comment}
        )
        # Refresh product aggregate rating
        agg = product.reviews.filter(is_approved=True).aggregate(avg=Avg('rating'))
        product.rating = round(agg['avg'] or 0, 1)
        product.review_count = product.reviews.filter(is_approved=True).count()
        product.save(update_fields=['rating', 'review_count'])
        return Response({'message': 'success', 'created': created}, status=201 if created else 200)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=404)


# ─── Admin ────────────────────────────────────────────────────────────────────

@api_view(['GET'])
@require_admin
def admin_dashboard(request):
    revenue = Order.objects.filter(order_status='Delivered').aggregate(r=Sum('order_total_amount'))['r'] or 0
    return Response({'message': 'success', 'data': {
        'total_revenue': float(revenue),
        'total_orders': Order.objects.count(),
        'total_customers': Customer.objects.filter(customer_status='active', role='customer').count(),
        'total_products': Product.objects.count(),
        'low_stock_alerts': Product.objects.filter(product_quantity__lte=10, product_status='available').count(),
        'pending_orders': Order.objects.filter(order_status__in=['Pending', 'Processing']).count(),
        'recent_orders': OrderSerializer(
            Order.objects.select_related('customer').order_by('-created_date')[:10], many=True
        ).data,
    }})


@api_view(['GET', 'POST'])
@require_admin
def admin_products(request):
    if request.method == 'GET':
        products = Product.objects.select_related('category').all()
        return Response({'message': 'success', 'data': ProductSerializer(products, many=True).data})
    d = request.data
    product_name = (d.get('product_name') or '').strip()
    if not product_name:
        return Response({'error': 'Product name is required'}, status=400)
    try:
        product_price = float(d.get('product_price', 0))
    except (TypeError, ValueError):
        return Response({'error': 'Invalid product price'}, status=400)
    if product_price < 0:
        return Response({'error': 'Product price must be non-negative'}, status=400)
    try:
        cat = ProductCategory.objects.get(pk=d.get('category')) if d.get('category') else None
    except ProductCategory.DoesNotExist:
        cat = None
    product = Product.objects.create(
        category=cat, product_name=product_name,
        product_description=d.get('product_description', ''),
        product_price=product_price,
        discount_price=d.get('discount_price') or None,
        product_quantity=int(d.get('product_quantity', 0)),
        product_image=d.get('product_image', ''),
        product_status=d.get('product_status', 'available'),
        expiry_date=d.get('expiry_date') or None,
        unit=d.get('unit', ''), tags=d.get('tags', ''),
        weight=d.get('weight', ''),
        is_featured=_to_bool(d.get('is_featured', False)),
    )
    product.refresh_from_db()   # Ensure Decimal fields are properly typed before serializing
    return Response({'message': 'success', 'data': ProductSerializer(product).data}, status=201)


@api_view(['GET', 'PUT', 'DELETE'])
@require_admin
def admin_product_detail(request, pk):
    try:
        product = Product.objects.get(pk=pk)
    except Product.DoesNotExist:
        return Response({'error': 'Not found'}, status=404)
    if request.method == 'GET':
        return Response({'message': 'success', 'data': ProductSerializer(product).data})
    if request.method == 'DELETE':
        product.delete()
        return Response({'message': 'Product deleted'})
    d = request.data
    # Scalar fields — only update if provided
    scalar_fields = ['product_name', 'product_description', 'product_price',
                     'product_quantity', 'product_image', 'product_status',
                     'unit', 'tags', 'weight']
    for field in scalar_fields:
        if field in d:
            val = d[field]
            if field == 'product_name':
                val = (val or '').strip()
                if not val:
                    return Response({'error': 'Product name cannot be empty'}, status=400)
            if field in ['product_description', 'product_image', 'unit', 'tags', 'weight'] and val is None:
                val = ''
            setattr(product, field, val)
    # Nullable fields
    if 'discount_price' in d:
        product.discount_price = d['discount_price'] if d['discount_price'] not in ('', None, 0, '0') else None
    if 'expiry_date' in d:
        product.expiry_date = d['expiry_date'] if d['expiry_date'] else None
    if 'is_featured' in d:
        product.is_featured = _to_bool(d['is_featured'])
    if 'category' in d:
        try:
            product.category = ProductCategory.objects.get(pk=d['category']) if d['category'] else None
        except ProductCategory.DoesNotExist:
            pass
    product.save()
    product.refresh_from_db()  # Ensure Decimal fields are properly typed before serializing
    return Response({'message': 'success', 'data': ProductSerializer(product).data})


@api_view(['GET', 'POST'])
@require_admin
def admin_categories(request):
    if request.method == 'GET':
        cats = ProductCategory.objects.all()
        return Response({'message': 'success', 'data': ProductCategorySerializer(cats, many=True).data})
    cat = ProductCategory.objects.create(
        category_name=request.data.get('category_name', ''),
        category_description=request.data.get('category_description', ''),
        category_icon=request.data.get('category_icon', ''),
    )
    return Response({'message': 'success', 'data': ProductCategorySerializer(cat).data}, status=201)


@api_view(['PUT', 'DELETE'])
@require_admin
def admin_category_detail(request, pk):
    try:
        cat = ProductCategory.objects.get(pk=pk)
    except ProductCategory.DoesNotExist:
        return Response({'error': 'Not found'}, status=404)
    if request.method == 'DELETE':
        cat.delete()
        return Response({'message': 'Category deleted'})
    for f in ['category_name', 'category_description', 'category_icon', 'category_status']:
        if f in request.data:
            setattr(cat, f, request.data[f])
    cat.save()
    return Response({'message': 'success', 'data': ProductCategorySerializer(cat).data})


@api_view(['GET'])
@require_admin
def admin_orders(request):
    qs = Order.objects.select_related('customer').prefetch_related('order_items__product', 'payment', 'delivery')
    if request.GET.get('status'):
        qs = qs.filter(order_status=request.GET['status'])
    return Response({'message': 'success', 'data': OrderSerializer(qs, many=True).data})


@api_view(['PUT'])
@require_admin
def admin_order_update(request, pk):
    try:
        order = Order.objects.get(pk=pk)
        if 'order_status' in request.data:
            order.order_status = request.data['order_status']
            order.save(update_fields=['order_status', 'updated_date'])
        # Update delivery status if provided
        if 'delivery_status' in request.data:
            Delivery.objects.filter(order=order).update(delivery_status=request.data['delivery_status'])
        if 'payment_status' in request.data:
            Payment.objects.filter(order=order).update(payment_status=request.data['payment_status'])
        return Response({'message': 'success', 'data': OrderSerializer(order).data})
    except Order.DoesNotExist:
        return Response({'error': 'Order not found'}, status=404)


@api_view(['GET', 'POST'])
@require_admin
def admin_customers(request):
    if request.method == 'GET':
        customers = Customer.objects.exclude(customer_status='deleted')
        return Response({'message': 'success', 'data': CustomerSerializer(customers, many=True).data})
    # POST — create a new user
    d = request.data
    email = (d.get('customer_email') or '').strip().lower()
    name  = (d.get('customer_name') or '').strip()
    password = (d.get('password') or '').strip()
    if not email or not name or not password:
        return Response({'error': 'Name, email and password are required'}, status=400)
    if Customer.objects.filter(customer_email=email).exists():
        return Response({'error': 'A user with this email already exists'}, status=400)
    c = Customer(
        customer_name=name,
        customer_email=email,
        customer_phone=d.get('customer_phone') or None,
        customer_address=d.get('customer_address') or None,
        role=d.get('role', 'customer'),
        customer_status=d.get('customer_status', 'active'),
        avatar=d.get('avatar') or None,
    )
    c.set_password(password)
    c.save()
    return Response({'message': 'success', 'data': CustomerSerializer(c).data}, status=201)


@api_view(['PUT', 'DELETE'])
@require_admin
def admin_customer_update(request, pk):
    try:
        customer = Customer.objects.get(pk=pk)
    except Customer.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)
    if request.method == 'DELETE':
        customer.customer_status = 'deleted'
        customer.save(update_fields=['customer_status'])
        return Response({'message': 'User deleted'})
    d = request.data
    # Profile fields — any admin can update
    for field in ['customer_name', 'customer_phone', 'customer_address', 'avatar']:
        if field in d:
            setattr(customer, field, d[field] or None)
    if 'customer_status' in d:
        customer.customer_status = d['customer_status']
    if 'role' in d:
        customer.role = d['role']   # any admin can change role
    if d.get('password'):           # optional password reset
        customer.set_password(d['password'])
    customer.save()
    return Response({'message': 'success', 'data': CustomerSerializer(customer).data})


@api_view(['GET', 'POST'])
@require_admin
def admin_coupons(request):
    if request.method == 'GET':
        return Response({'message': 'success', 'data': CouponSerializer(Coupon.objects.all(), many=True).data})
    d = request.data
    code = (d.get('code') or '').strip().upper()
    if not code:
        return Response({'error': 'Coupon code is required'}, status=400)
    coupon = Coupon.objects.create(
        code=code, coupon_type=d.get('coupon_type', 'percent'),
        value=d.get('value', 0), min_order_amount=d.get('min_order_amount', 0),
        max_discount=d.get('max_discount') or None,
        expiry_date=d.get('expiry_date') or None,
        usage_limit=d.get('usage_limit') or None,
        is_active=_to_bool(d.get('is_active', True)),
    )
    return Response({'message': 'success', 'data': CouponSerializer(coupon).data}, status=201)


@api_view(['PUT', 'DELETE'])
@require_admin
def admin_coupon_detail(request, pk):
    try:
        coupon = Coupon.objects.get(pk=pk)
    except Coupon.DoesNotExist:
        return Response({'error': 'Not found'}, status=404)
    if request.method == 'DELETE':
        coupon.delete()
        return Response({'message': 'Deleted'})
    d = request.data
    if 'code' in d:
        code = (d.get('code') or '').strip().upper()
        if not code:
            return Response({'error': 'Coupon code cannot be empty'}, status=400)
        coupon.code = code
    if 'coupon_type' in d and d['coupon_type'] in ('percent', 'fixed'):
        coupon.coupon_type = d['coupon_type']
    for f in ['value', 'expiry_date', 'min_order_amount', 'max_discount']:
        if f in d:
            setattr(coupon, f, d[f] or None if f in ('expiry_date', 'max_discount') else d[f])
    if 'usage_limit' in d:
        coupon.usage_limit = d['usage_limit'] or None
    if 'is_active' in d:
        coupon.is_active = _to_bool(d['is_active'])
    coupon.save()
    return Response({'message': 'success', 'data': CouponSerializer(coupon).data})
