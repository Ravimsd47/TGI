from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RoomViewSet, CouponViewSet, BookingViewSet, PaymentViewSet, admin_dashboard_summary, admin_reports

router = DefaultRouter()
router.register(r'rooms', RoomViewSet, basename='room')
router.register(r'coupons', CouponViewSet, basename='coupon')
router.register(r'bookings', BookingViewSet, basename='booking')
router.register(r'payments', PaymentViewSet, basename='payment')

urlpatterns = [
    path('', include(router.urls)),
    path('admin/dashboard/', admin_dashboard_summary, name='admin-dashboard-summary'),
    path('admin/reports/', admin_reports, name='admin-reports'),
]
