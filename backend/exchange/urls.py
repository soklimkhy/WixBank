from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OrderViewSet, WalletViewSet

router = DefaultRouter()
router.register(r"orders", OrderViewSet, basename="order")
router.register(r"wallets", WalletViewSet, basename="wallet")

urlpatterns = [
    path("", include(router.urls)),
]
