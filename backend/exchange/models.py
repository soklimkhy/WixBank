from django.db import models
from django.contrib.auth.models import User
from django.utils.translation import gettext_lazy as _

class Wallet(models.Model):
    """
    Represents a user's balance in a specific currency.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='wallets')
    currency = models.CharField(max_length=10, help_text="ISO 4217 Currency Code (e.g., USD, KHR)")
    balance = models.DecimalField(max_digits=20, decimal_places=8, default=0)

    class Meta:
        unique_together = ('user', 'currency')

    def __str__(self):
        return f"{self.user.username} - {self.currency}: {self.balance}"


class Order(models.Model):
    """
    Represents a Limit Order placed by a user efficiently.
    """
    class OrderType(models.TextChoices):
        BUY = 'BUY', _('Buy')   # Maker wants to BUY 'currency' using 'target_currency'
        SELL = 'SELL', _('Sell') # Maker wants to SELL 'currency' for 'target_currency'

    class Status(models.TextChoices):
        OPEN = 'OPEN', _('Open')
        FILLED = 'FILLED', _('Filled')
        CANCELLED = 'CANCELLED', _('Cancelled')

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    order_type = models.CharField(max_length=4, choices=OrderType.choices)
    
    # Example: Sell 100 USD at 4050 KHR
    # currency = USD, target_currency = KHR
    # amount = 100, rate = 4050
    currency = models.CharField(max_length=10) 
    target_currency = models.CharField(max_length=10, default='KHR') # Defaulting for local context, but should be dynamic
    
    amount = models.DecimalField(max_digits=20, decimal_places=8, help_text="Amount of 'currency'")
    rate = models.DecimalField(max_digits=20, decimal_places=8, help_text="Price of 1 unit of 'currency' in 'target_currency'")
    
    filled_amount = models.DecimalField(max_digits=20, decimal_places=8, default=0)
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.OPEN)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.order_type} {self.amount} {self.currency} @ {self.rate} {self.target_currency}"


class Transaction(models.Model):
    """
    Records a successful trade between two users.
    """
    buyer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='buyer_transactions')
    seller = models.ForeignKey(User, on_delete=models.CASCADE, related_name='seller_transactions')
    
    currency = models.CharField(max_length=10)
    target_currency = models.CharField(max_length=10)
    
    amount = models.DecimalField(max_digits=20, decimal_places=8)
    rate = models.DecimalField(max_digits=20, decimal_places=8)
    
    order = models.ForeignKey(Order, on_delete=models.SET_NULL, null=True, related_name='transactions')
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.amount} {self.currency} exchanged for {self.amount * self.rate} {self.target_currency}"
