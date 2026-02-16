from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Category, Product, User, Order, OrderItem
from .serializers import CategorySerializer, ProductSerializer, UserSerializer, OrderSerializer
import datetime

@api_view(['GET'])
def health(request):
    return Response({'status': 'ok', 'timestamp': datetime.datetime.now().isoformat()})

@api_view(['GET'])
def product_list(request):
    category = request.GET.get('category')
    if category:
        products = Product.objects.filter(category=category)
    else:
        products = Product.objects.all()
    serializer = ProductSerializer(products, many=True)
    return Response({'message': 'success', 'data': serializer.data})

@api_view(['GET'])
def product_detail(request, pk):
    try:
        product = Product.objects.get(pk=pk)
        serializer = ProductSerializer(product)
        return Response({'message': 'success', 'data': serializer.data})
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def category_list(request):
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response({'message': 'success', 'data': serializer.data})

@api_view(['POST'])
def login(request):
    email = request.data.get('email')
    password = request.data.get('password')
    try:
        # Insecure plain text password check to match legacy system
        user = User.objects.get(email=email, password=password)
        serializer = UserSerializer(user)
        return Response({'message': 'success', 'data': serializer.data})
    except User.DoesNotExist:
        return Response({'message': 'Invalid email or password'}, status=status.HTTP_401_UNAUTHORIZED)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def signup(request):
    data = request.data
    # Map 'address' if it's passed
    try:
        # Check if email exists
        if User.objects.filter(email=data.get('email')).exists():
             return Response({'error': 'Email already registered'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create(
            name=data.get('name'),
            email=data.get('email'),
            password=data.get('password'),
            address=data.get('address', '')
        )
        serializer = UserSerializer(user)
        return Response({'message': 'success', 'data': serializer.data}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def create_order(request):
    data = request.data
    try:
        user_id = data.get('userId')
        items_data = data.get('items', [])
        total = data.get('total')
        date = data.get('date')
        status_val = data.get('status', 'Processing')

        if not user_id:
             return Response({'error': 'User ID required'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.get(id=user_id)
        order = Order.objects.create(
            user=user,
            total=total,
            date=date,
            status=status_val
        )

        for item in items_data:
            product = Product.objects.get(id=item['productId'])
            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=item['quantity'],
                price=item['price']
            )
        
        return Response({'message': 'success', 'orderId': order.id}, status=status.HTTP_201_CREATED)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_400_BAD_REQUEST)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def user_orders(request, userId):
    orders = Order.objects.filter(user=userId).order_by('-id') # descending order
    # The existing backend grouped items. OrderSerializer handles this with `items` field.
    serializer = OrderSerializer(orders, many=True)
    return Response({'message': 'success', 'data': serializer.data})

@api_view(['GET'])
def order_detail(request, pk):
    try:
        order = Order.objects.get(pk=pk)
        serializer = OrderSerializer(order)
        return Response({'message': 'success', 'data': serializer.data})
    except Order.DoesNotExist:
        return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)
