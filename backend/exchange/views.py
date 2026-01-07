from rest_framework import viewsets, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db import transaction
from .models import Order, Wallet, Transaction
from .serializers import (
    OrderSerializer,
    WalletSerializer,
    CreateOrderSerializer,
    TransactionSerializer,
)
from .services import match_limit_order


class WalletViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = WalletSerializer

    def get_queryset(self):
        return Wallet.objects.filter(user=self.request.user)


class OrderViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = OrderSerializer

    def get_queryset(self):
        # Users can see all open orders (Order Book) or their own history
        # For simplicity, we return all OPEN orders for the market view
        return Order.objects.filter(status=Order.Status.OPEN).exclude(
            user=self.request.user
        )

    @action(detail=False, methods=["get"], url_path="my-orders")
    def my_orders(self, request):
        """
        Get only the current user's orders.
        """
        orders = Order.objects.filter(user=request.user)
        serializer = self.get_serializer(orders, many=True)
        return Response(serializer.data)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=["post"])
    def fill(self, request, pk=None):
        """
        Endpoint for a User (Taker) to BUY/FILL a specific Order (Maker).
        Payload: { "amount": "100.00" }
        """
        amount = request.data.get("amount")
        if not amount:
            return Response(
                {"error": "Amount is required."}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Call the atomic service function
            # Note: match_limit_order handles locking and validation
            updated_order = match_limit_order(
                taker_user=request.user, order_id=pk, amount_str=amount
            )
            return Response(OrderSerializer(updated_order).data)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
