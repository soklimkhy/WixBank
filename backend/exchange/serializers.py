from rest_framework import serializers
from .models import Wallet, Order, Transaction


class WalletSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wallet
        fields = ["id", "currency", "balance"]


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = [
            "id",
            "user",
            "order_type",
            "currency",
            "target_currency",
            "amount",
            "rate",
            "filled_amount",
            "status",
            "created_at",
        ]
        read_only_fields = ["user", "filled_amount", "status", "created_at"]


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = [
            "id",
            "buyer",
            "seller",
            "amount",
            "rate",
            "currency",
            "target_currency",
            "timestamp",
        ]


class CreateOrderSerializer(serializers.Serializer):
    """
    Serializer for creating a new Limit Order (Maker).
    """

    order_type = serializers.ChoiceField(choices=Order.OrderType.choices)
    currency = serializers.CharField(max_length=10)
    target_currency = serializers.CharField(max_length=10, default="KHR")
    amount = serializers.DecimalField(max_digits=20, decimal_places=8)
    rate = serializers.DecimalField(max_digits=20, decimal_places=8)
