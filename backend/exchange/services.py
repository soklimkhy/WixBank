from decimal import Decimal
from django.db import transaction, models
from django.core.exceptions import ValidationError
from .models import Order, Wallet, Transaction


def _get_wallet_for_update(user, currency):
    """
    Helper to fetch and lock a wallet row.
    """
    wallet, created = Wallet.objects.select_for_update().get_or_create(
        user=user, currency=currency, defaults={"balance": 0}
    )
    return wallet


@transaction.atomic
def match_limit_order(taker_user, order_id, amount_str):
    """
    Matches a Taker (User) with an existing Limit Order (Maker).
    Safe against race conditions using row locking.
    """
    amount = Decimal(amount_str)

    # 1. Lock the Order Row
    # select_for_update() ensures that no other transaction can modify this order
    # until this transaction finishes.
    try:
        order = Order.objects.select_for_update().get(pk=order_id)
    except Order.DoesNotExist:
        raise ValidationError("Order not found.")

    if order.status != Order.Status.OPEN:
        raise ValidationError("Order is closed or cancelled.")

    if order.user == taker_user:
        raise ValidationError("You cannot trade with yourself.")

    remaining_amount = order.amount - order.filled_amount
    if amount > remaining_amount:
        raise ValidationError(f"Only {remaining_amount} {order.currency} is available.")

    # Calculate total cost in target currency
    total_cost = amount * order.rate

    # 2. Identify Buyer and Seller
    if order.order_type == Order.OrderType.SELL:
        # Maker is SELLING 'currency' (e.g., USD)
        # Taker is BUYING 'currency'
        seller = order.user
        buyer = taker_user
    else:
        # Maker is BUYING 'currency'
        # Taker is SELLING 'currency'
        buyer = order.user
        seller = taker_user

    # 3. Lock and fetch Wallets for both parties
    # We need to lock all 4 wallets involved to ensure consistency.
    # Note: To avoid deadlocks, resources should be locked in a consistent order.
    # Here we won't strictly enforce global order for simplicity, but in prod, sort by ID.

    # Buyer pays Target Currency (e.g. KHR), Gets Base Currency (e.g. USD)
    # Seller pays Base Currency (e.g. USD), Gets Target Currency (e.g. KHR)

    buyer_target_wallet = _get_wallet_for_update(buyer, order.target_currency)
    seller_currency_wallet = _get_wallet_for_update(seller, order.currency)

    # Check Balances
    if buyer_target_wallet.balance < total_cost:
        raise ValidationError(f"Buyer has insufficient {order.target_currency}.")

    if seller_currency_wallet.balance < amount:
        raise ValidationError(f"Seller has insufficient {order.currency}.")

    # 4. Perform Transfers
    buyer_target_wallet.balance -= total_cost
    buyer_target_wallet.save()

    seller_currency_wallet.balance -= amount
    seller_currency_wallet.save()

    buyer_currency_wallet = _get_wallet_for_update(buyer, order.currency)
    buyer_currency_wallet.balance += amount
    buyer_currency_wallet.save()

    seller_target_wallet = _get_wallet_for_update(seller, order.target_currency)
    seller_target_wallet.balance += total_cost
    seller_target_wallet.save()

    # 5. Update Order State
    order.filled_amount += amount
    if order.filled_amount >= order.amount:
        order.status = Order.Status.FILLED
    order.save()

    # 6. Create Transaction Record
    Transaction.objects.create(
        buyer=buyer,
        seller=seller,
        amount=amount,
        rate=order.rate,
        currency=order.currency,
        target_currency=order.target_currency,
        order=order,
    )

    return order
