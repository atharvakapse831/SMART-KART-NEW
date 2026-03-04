from rest_framework import serializers
from .models import ProductCategory, Product, Customer, Cart, Order, OrderItems, Payment, Delivery, Coupon, Review


class ProductCategorySerializer(serializers.ModelSerializer):
    product_count = serializers.SerializerMethodField()

    def get_product_count(self, obj):
        return obj.products.filter(product_status='available').count()

    class Meta:
        model = ProductCategory
        fields = ['id', 'category_name', 'category_description', 'category_icon',
                  'category_status', 'created_date', 'product_count']


class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.SerializerMethodField()
    category_icon = serializers.SerializerMethodField()
    discount_percent = serializers.SerializerMethodField()

    def get_category_name(self, obj):
        return obj.category.category_name if obj.category else ''

    def get_category_icon(self, obj):
        return obj.category.category_icon if obj.category else ''

    def get_discount_percent(self, obj):
        try:
            price = float(obj.product_price or 0)
            disc  = float(obj.discount_price or 0)
            if disc and price > 0:
                return round((price - disc) / price * 100)
        except (TypeError, ValueError):
            pass
        return None

    class Meta:
        model = Product
        fields = ['id', 'category', 'category_name', 'category_icon', 'product_name',
                  'product_description', 'product_price', 'discount_price', 'discount_percent',
                  'product_quantity', 'product_image', 'product_status', 'expiry_date',
                  'unit', 'weight', 'tags', 'is_featured', 'rating', 'review_count',
                  'created_date']


class CustomerSerializer(serializers.ModelSerializer):
    """Safe serializer — never exposes password"""
    class Meta:
        model = Customer
        fields = ['id', 'customer_name', 'customer_email', 'customer_phone',
                  'customer_address', 'customer_status', 'role', 'avatar', 'created_date']


class CartItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.product_name', read_only=True)
    product_image = serializers.URLField(source='product.product_image', read_only=True)
    product_price = serializers.DecimalField(source='product.product_price',
                                              max_digits=10, decimal_places=2, read_only=True)
    discount_price = serializers.DecimalField(source='product.discount_price',
                                               max_digits=10, decimal_places=2, read_only=True)
    unit = serializers.CharField(source='product.unit', read_only=True)
    category_name = serializers.CharField(source='product.category.category_name', read_only=True)

    class Meta:
        model = Cart
        fields = ['id', 'product', 'product_name', 'product_image', 'product_price',
                  'discount_price', 'unit', 'category_name', 'quantity', 'added_date', 'cart_status']


class OrderItemsSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.product_name', read_only=True)
    product_image = serializers.URLField(source='product.product_image', read_only=True)

    class Meta:
        model = OrderItems
        fields = ['id', 'product', 'product_name', 'product_image', 'quantity', 'unit_price']


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['id', 'payment_date', 'payment_amount', 'payment_invoice',
                  'payment_method', 'payment_status']


class DeliverySerializer(serializers.ModelSerializer):
    class Meta:
        model = Delivery
        fields = ['id', 'delivery_name', 'delivery_quantity', 'delivery_address',
                  'delivery_date', 'delivery_status', 'created_date']


class OrderSerializer(serializers.ModelSerializer):
    order_items = OrderItemsSerializer(many=True, read_only=True)
    customer_name = serializers.CharField(source='customer.customer_name', read_only=True)
    customer_email = serializers.EmailField(source='customer.customer_email', read_only=True)
    customer_phone = serializers.CharField(source='customer.customer_phone', read_only=True)
    payment = PaymentSerializer(read_only=True)
    delivery = DeliverySerializer(read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'customer', 'customer_name', 'customer_email', 'customer_phone',
                  'order_date', 'order_total_amount', 'subtotal', 'discount', 'coupon_code',
                  'order_status', 'notes', 'created_date', 'order_items', 'payment', 'delivery']


class ReviewSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='customer.customer_name', read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'customer_name', 'rating', 'comment', 'is_approved', 'created_date']


class CouponSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coupon
        fields = '__all__'
