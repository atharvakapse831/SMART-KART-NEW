import os, uuid, datetime
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mysite.settings')
django.setup()

from api.models import Customer, Product, Order, OrderItems, Payment, Delivery, Coupon

customer = Customer.objects.filter(role='customer').first()
products = list(Product.objects.all()[:6])

statuses = ['Delivered', 'Delivered', 'Shipped', 'Processing', 'Pending', 'Cancelled', 'Delivered']
pay_statuses = ['Completed', 'Completed', 'Pending', 'Pending', 'Pending', 'Failed', 'Completed']
del_statuses = ['Delivered', 'Delivered', 'Out for Delivery', 'Dispatched', 'Pending', 'Pending', 'Delivered']
methods = ['COD', 'UPI', 'Card', 'COD', 'UPI', 'Card', 'COD']

for i, (os_, ps_, ds_, method_) in enumerate(zip(statuses, pay_statuses, del_statuses, methods)):
    p1 = products[i % len(products)]
    p2 = products[(i+1) % len(products)]
    subtotal = float(p1.product_price) + float(p2.product_price)
    order = Order.objects.create(
        customer=customer,
        order_total_amount=round(subtotal, 2),
        subtotal=round(subtotal, 2),
        discount=0,
        order_status=os_,
    )
    OrderItems.objects.create(order=order, product=p1, quantity=1, unit_price=p1.product_price)
    OrderItems.objects.create(order=order, product=p2, quantity=2, unit_price=p2.product_price)
    invoice = f"INV-{order.id:06d}-{uuid.uuid4().hex[:6].upper()}"
    Payment.objects.create(order=order, payment_amount=subtotal, payment_invoice=invoice,
                           payment_method=method_, payment_status=ps_)
    Delivery.objects.create(order=order, delivery_name=customer.customer_name,
                            delivery_quantity=2, delivery_address='123 Test Street, Mumbai',
                            delivery_date=datetime.date.today(), delivery_status=ds_)

print(f"Created {len(statuses)} sample orders")

# Coupons
coupons = [
    {'code': 'FRESH50', 'coupon_type': 'percent', 'value': 50, 'min_order_amount': 0, 'max_discount': 100},
    {'code': 'SAVE10', 'coupon_type': 'fixed', 'value': 10, 'min_order_amount': 50},
    {'code': 'WELCOME20', 'coupon_type': 'percent', 'value': 20, 'min_order_amount': 0},
]
for c in coupons:
    Coupon.objects.get_or_create(code=c['code'], defaults={
        'coupon_type': c['coupon_type'], 'value': c['value'],
        'min_order_amount': c.get('min_order_amount', 0),
        'max_discount': c.get('max_discount'),
        'expiry_date': datetime.date(2026, 12, 31),
    })
print(f"Created {len(coupons)} coupons")
print("Done!")
