from django.db import models
import bcrypt


class ProductCategory(models.Model):
    category_name = models.CharField(max_length=100, unique=True)
    category_description = models.TextField(null=True, blank=True)
    category_icon = models.CharField(max_length=50, null=True, blank=True)
    category_status = models.BooleanField(default=True)  # True = active
    created_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.category_name

    class Meta:
        db_table = 'product_category'
        verbose_name = 'Product Category'
        verbose_name_plural = 'Product Categories'
        ordering = ['category_name']


class Product(models.Model):
    STATUS_CHOICES = [('available', 'Available'), ('unavailable', 'Unavailable'), ('discontinued', 'Discontinued')]

    category = models.ForeignKey(ProductCategory, on_delete=models.SET_NULL,
                                  null=True, blank=True, related_name='products', db_column='category_id')
    product_name = models.CharField(max_length=200)
    product_description = models.TextField(null=True, blank=True)
    product_price = models.DecimalField(max_digits=10, decimal_places=2)
    discount_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    product_quantity = models.IntegerField(default=0)  # stock
    product_image = models.URLField(max_length=500, null=True, blank=True)
    product_status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='available')
    expiry_date = models.DateField(null=True, blank=True)
    unit = models.CharField(max_length=20, null=True, blank=True)
    weight = models.CharField(max_length=50, blank=True, default='')
    tags = models.CharField(max_length=500, blank=True, default='')
    is_featured = models.BooleanField(default=False)
    rating = models.DecimalField(max_digits=3, decimal_places=1, default=0)
    review_count = models.IntegerField(default=0)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.product_name

    class Meta:
        db_table = 'product'
        ordering = ['-created_date']


class Customer(models.Model):
    ROLE_CHOICES = [('customer', 'Customer'), ('admin', 'Admin'), ('superadmin', 'Super Admin')]
    STATUS_CHOICES = [('active', 'Active'), ('banned', 'Banned'), ('deleted', 'Deleted')]

    customer_name = models.CharField(max_length=100)
    customer_email = models.EmailField(unique=True)
    customer_phone = models.CharField(max_length=20, null=True, blank=True)
    customer_address = models.TextField(null=True, blank=True)
    customer_password = models.CharField(max_length=200)
    customer_status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='customer')
    avatar = models.URLField(max_length=500, null=True, blank=True)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)

    def set_password(self, raw_password):
        hashed = bcrypt.hashpw(raw_password.encode('utf-8'), bcrypt.gensalt())
        self.customer_password = hashed.decode('utf-8')

    def check_password(self, raw_password):
        pw = self.customer_password
        if pw.startswith('$2b$') or pw.startswith('$2a$'):
            return bcrypt.checkpw(raw_password.encode('utf-8'), pw.encode('utf-8'))
        # Legacy plain-text fallback
        return pw == raw_password

    def upgrade_password_if_needed(self, raw_password):
        """Upgrade legacy plain-text passwords to bcrypt on next login."""
        if not (self.customer_password.startswith('$2b$') or self.customer_password.startswith('$2a$')):
            self.set_password(raw_password)
            self.save(update_fields=['customer_password'])

    def __str__(self):
        return self.customer_email

    class Meta:
        db_table = 'customer'
        ordering = ['-created_date']


class Cart(models.Model):
    STATUS_CHOICES = [('active', 'Active'), ('ordered', 'Ordered'), ('abandoned', 'Abandoned')]

    customer = models.ForeignKey(Customer, on_delete=models.CASCADE,
                                  related_name='cart_items', db_column='customer_id')
    product = models.ForeignKey(Product, on_delete=models.CASCADE,
                                 related_name='cart_items', db_column='product_id')
    quantity = models.IntegerField(default=1)
    added_date = models.DateTimeField(auto_now_add=True)
    cart_status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')

    def __str__(self):
        return f"{self.customer.customer_name}'s cart — {self.product.product_name}"

    class Meta:
        db_table = 'cart'
        unique_together = ('customer', 'product')  # one row per product per customer


class Order(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Processing', 'Processing'),
        ('Shipped', 'Shipped'),
        ('Delivered', 'Delivered'),
        ('Cancelled', 'Cancelled'),
    ]

    customer = models.ForeignKey(Customer, on_delete=models.CASCADE,
                                  related_name='orders', db_column='customer_id')
    order_date = models.DateField(auto_now_add=True)
    order_total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    discount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    coupon_code = models.CharField(max_length=50, blank=True, default='')
    order_status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Processing')
    notes = models.TextField(null=True, blank=True)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Order #{self.id} — {self.customer.customer_name}"

    class Meta:
        db_table = 'order'
        ordering = ['-created_date']


class OrderItems(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE,
                               related_name='order_items', db_column='order_id')
    product = models.ForeignKey(Product, on_delete=models.CASCADE,
                                 related_name='order_items', db_column='product_id')
    quantity = models.IntegerField()
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.quantity} x {self.product.product_name} (Order #{self.order.id})"

    class Meta:
        db_table = 'order_items'


class Payment(models.Model):
    METHOD_CHOICES = [('COD', 'Cash on Delivery'), ('Card', 'Credit/Debit Card'), ('UPI', 'UPI'), ('Wallet', 'Wallet')]
    STATUS_CHOICES = [('Pending', 'Pending'), ('Completed', 'Completed'), ('Failed', 'Failed'), ('Refunded', 'Refunded')]

    order = models.OneToOneField(Order, on_delete=models.CASCADE,
                                  related_name='payment', db_column='order_id')
    payment_date = models.DateTimeField(auto_now_add=True)
    payment_amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_invoice = models.CharField(max_length=100, unique=True)
    payment_method = models.CharField(max_length=20, choices=METHOD_CHOICES, default='COD')
    payment_status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')

    def __str__(self):
        return f"Payment #{self.payment_invoice} for Order #{self.order.id}"

    class Meta:
        db_table = 'payment'


class Delivery(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Dispatched', 'Dispatched'),
        ('Out for Delivery', 'Out for Delivery'),
        ('Delivered', 'Delivered'),
    ]

    order = models.OneToOneField(Order, on_delete=models.CASCADE,
                                  related_name='delivery', db_column='order_id')
    delivery_name = models.CharField(max_length=200)   # recipient name
    delivery_quantity = models.IntegerField(default=1) # number of packages
    delivery_address = models.TextField()
    delivery_date = models.DateField(null=True, blank=True)
    delivery_status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='Pending')
    created_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Delivery for Order #{self.order.id} → {self.delivery_address[:40]}"

    class Meta:
        db_table = 'delivery'


class Coupon(models.Model):
    TYPE_CHOICES = [('percent', 'Percentage'), ('fixed', 'Fixed Amount')]

    code = models.CharField(max_length=50, unique=True)
    coupon_type = models.CharField(max_length=10, choices=TYPE_CHOICES, default='percent')
    value = models.DecimalField(max_digits=10, decimal_places=2)
    min_order_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    max_discount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    expiry_date = models.DateField(null=True, blank=True)
    usage_limit = models.IntegerField(null=True, blank=True)
    used_count = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.code

    class Meta:
        db_table = 'coupon'


class Review(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='reviews')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
    rating = models.IntegerField(default=5)
    comment = models.TextField()
    is_approved = models.BooleanField(default=True)
    created_date = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'review'
        unique_together = ('customer', 'product')

    def __str__(self):
        return f"{self.customer.customer_name}'s review of {self.product.product_name}"
