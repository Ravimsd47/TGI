from django.shortcuts import get_object_or_404
from django.db.models import Sum, Count, Q
from django.utils import timezone
from datetime import datetime, timedelta
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from rest_framework import status, viewsets
from .models import Room, Coupon, Booking, Payment
from .serializers import RoomSerializer, CouponSerializer, BookingSerializer, PaymentSerializer

# ----------------- ROOMS VIEWS -----------------
class RoomViewSet(viewsets.ModelViewSet):
    queryset = Room.objects.all()
    serializer_name = 'Room'
    serializer_class = RoomSerializer

    @action(detail=False, methods=['get'], url_path='search')
    def search_rooms(self, request):
        check_in_str = request.query_params.get('check_in')
        check_out_str = request.query_params.get('check_out')
        max_occupancy = request.query_params.get('occupancy')

        rooms = Room.objects.exclude(status='Maintenance')

        if max_occupancy:
            try:
                rooms = rooms.filter(max_occupancy__gte=int(max_occupancy))
            except ValueError:
                pass

        if check_in_str and check_out_str:
            try:
                check_in = datetime.strptime(check_in_str, '%Y-%m-%d').date()
                check_out = datetime.strptime(check_out_str, '%Y-%m-%d').date()
                
                # Exclude rooms that have overlapping active bookings
                overlapping_bookings = Booking.objects.filter(
                    status__in=['Pending', 'Confirmed', 'Completed']
                ).filter(
                    Q(check_in__lt=check_out) & Q(check_out__gt=check_in)
                )
                booked_room_ids = overlapping_bookings.values_list('room_id', flat=True)
                rooms = rooms.exclude(id__in=booked_room_ids)
            except ValueError:
                return Response({"error": "Invalid date format. Use YYYY-MM-DD"}, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(rooms, many=True)
        return Response(serializer.data)

# ----------------- COUPONS VIEWS -----------------
class CouponViewSet(viewsets.ModelViewSet):
    queryset = Coupon.objects.all()
    serializer_class = CouponSerializer

    @action(detail=False, methods=['post'], url_path='validate')
    def validate_coupon(self, request):
        code = request.data.get('code')
        if not code:
            return Response({"error": "Coupon code is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            coupon = Coupon.objects.get(code__iexact=code)
            today = timezone.localdate()
            if not coupon.active:
                return Response({"error": "Coupon is inactive"}, status=status.HTTP_400_BAD_REQUEST)
            if coupon.expiry_date < today:
                return Response({"error": "Coupon has expired"}, status=status.HTTP_400_BAD_REQUEST)
            
            serializer = self.get_serializer(coupon)
            return Response({
                "valid": True,
                "coupon": serializer.data
            })
        except Coupon.DoesNotExist:
            return Response({"error": "Coupon not found"}, status=status.HTTP_404_NOT_FOUND)

# ----------------- BOOKINGS VIEWS -----------------
class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all().order_by('-created_at')
    serializer_class = BookingSerializer

    def create(self, request, *args, **kwargs):
        room_id = request.data.get('room')
        guest_name = request.data.get('guest_name')
        guest_email = request.data.get('guest_email')
        guest_phone = request.data.get('guest_phone')
        check_in_str = request.data.get('check_in')
        check_out_str = request.data.get('check_out')
        coupon_code = request.data.get('coupon_code')

        if not all([room_id, guest_name, guest_email, guest_phone, check_in_str, check_out_str]):
            return Response({"error": "Missing required fields"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            check_in = datetime.strptime(check_in_str, '%Y-%m-%d').date()
            check_out = datetime.strptime(check_out_str, '%Y-%m-%d').date()
            if check_in >= check_out:
                return Response({"error": "Check-out date must be after check-in date"}, status=status.HTTP_400_BAD_REQUEST)
            if check_in < timezone.localdate():
                return Response({"error": "Check-in date cannot be in the past"}, status=status.HTTP_400_BAD_REQUEST)
        except ValueError:
            return Response({"error": "Invalid date format. Use YYYY-MM-DD"}, status=status.HTTP_400_BAD_REQUEST)

        room = get_object_or_404(Room, id=room_id)
        if room.status == 'Maintenance':
            return Response({"error": "Room is currently under maintenance"}, status=status.HTTP_400_BAD_REQUEST)

        # Double check overlap
        overlap = Booking.objects.filter(
            room=room,
            status__in=['Pending', 'Confirmed', 'Completed']
        ).filter(
            Q(check_in__lt=check_out) & Q(check_out__gt=check_in)
        ).exists()

        if overlap:
            return Response({"error": "Room is already booked for these dates"}, status=status.HTTP_400_BAD_REQUEST)

        # Calculations
        nights = (check_out - check_in).days
        total_price = room.price_per_night * nights
        discount_amount = 0.0
        coupon_obj = None

        if coupon_code:
            try:
                coupon = Coupon.objects.get(code__iexact=coupon_code)
                today = timezone.localdate()
                if coupon.active and coupon.expiry_date >= today:
                    coupon_obj = coupon
                    discount_amount = float(total_price) * (coupon.discount_percentage / 100.0)
            except Coupon.DoesNotExist:
                pass

        final_price = float(total_price) - discount_amount

        booking = Booking.objects.create(
            room=room,
            guest_name=guest_name,
            guest_email=guest_email,
            guest_phone=guest_phone,
            check_in=check_in,
            check_out=check_out,
            total_price=total_price,
            coupon=coupon_obj,
            discount_amount=discount_amount,
            final_price=final_price,
            status='Pending'
        )

        serializer = self.get_serializer(booking)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

# ----------------- PAYMENTS VIEWS -----------------
class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all().order_by('-created_at')
    serializer_class = PaymentSerializer

    def create(self, request, *args, **kwargs):
        booking_id = request.data.get('booking')
        cardholder_name = request.data.get('cardholder_name')
        card_number = request.data.get('card_number')
        expiry_date = request.data.get('expiry_date')
        cvv = request.data.get('cvv')
        payment_method = request.data.get('payment_method', 'Card')

        if not all([booking_id, cardholder_name, card_number, expiry_date, cvv]):
            return Response({"error": "Card credentials are required for payment"}, status=status.HTTP_400_BAD_REQUEST)

        booking = get_object_or_404(Booking, id=booking_id)
        if booking.status in ['Cancelled', 'Completed']:
            return Response({"error": f"Cannot make payment for booking in {booking.status} status"}, status=status.HTTP_400_BAD_REQUEST)

        # Simulation: transaction successful if card is entered correctly
        import uuid
        transaction_id = "TXN-" + str(uuid.uuid4().hex[:12]).upper()

        payment = Payment.objects.create(
            booking=booking,
            amount=booking.final_price,
            transaction_id=transaction_id,
            payment_method=payment_method,
            status='Success'
        )

        booking.status = 'Confirmed'
        booking.save()

        # Update room status to Booked if check-in is today
        if booking.check_in <= timezone.localdate() <= booking.check_out:
            booking.room.status = 'Booked'
            booking.room.save()

        serializer = self.get_serializer(payment)
        return Response({
            "success": True,
            "payment": serializer.data
        }, status=status.HTTP_201_CREATED)

# ----------------- ADMIN DASHBOARD & REPORTS VIEWS -----------------
@api_view(['GET'])
def admin_dashboard_summary(request):
    # Total Rooms
    total_rooms = Room.objects.count()
    
    # Active Bookings
    active_bookings = Booking.objects.filter(status__in=['Pending', 'Confirmed', 'Completed']).count()
    
    # Total Revenue (Paid bookings)
    total_revenue = Payment.objects.filter(status='Success').aggregate(total=Sum('amount'))['total'] or 0.0
    
    # Occupancy Rate (Booked rooms today / Total rooms)
    today = timezone.localdate()
    occupied_rooms = Booking.objects.filter(
        status__in=['Confirmed', 'Completed'],
        check_in__lte=today,
        check_out__gte=today
    ).values('room_id').distinct().count()
    
    occupancy_rate = round((occupied_rooms / total_rooms * 100), 1) if total_rooms > 0 else 0.0

    # Recent Bookings
    recent_bookings_qs = Booking.objects.all().order_by('-created_at')[:10]
    recent_bookings = BookingSerializer(recent_bookings_qs, many=True).data

    return Response({
        "stats": {
            "total_rooms": total_rooms,
            "active_bookings": active_bookings,
            "total_revenue": float(total_revenue),
            "occupancy_rate": occupancy_rate
        },
        "recent_bookings": recent_bookings
    })

@api_view(['GET'])
def admin_reports(request):
    today = timezone.localdate()
    
    # Monthly Revenue Aggregate for the last 6 months
    monthly_revenue = []
    # Generate labels for last 6 months
    for i in range(5, -1, -1):
        target_date = today - timedelta(days=i*30)
        year = target_date.year
        month = target_date.month
        month_label = target_date.strftime('%b %Y')
        
        revenue_sum = Payment.objects.filter(
            status='Success',
            created_at__year=year,
            created_at__month=month
        ).aggregate(total=Sum('amount'))['total'] or 0.0
        
        monthly_revenue.append({
            "month": month_label,
            "revenue": float(revenue_sum)
        })

    # Booking Status Breakdown
    status_counts = Booking.objects.values('status').annotate(count=Count('id'))
    status_breakdown = {item['status']: item['count'] for item in status_counts}
    for s in ['Pending', 'Confirmed', 'Cancelled', 'Completed']:
        if s not in status_breakdown:
            status_breakdown[s] = 0

    # Occupancy rate by Room Type
    room_types_stats = []
    for rt, label in Room.ROOM_TYPES:
        total_type_rooms = Room.objects.filter(room_type=rt).count()
        occupied_type_rooms = Booking.objects.filter(
            room__room_type=rt,
            status__in=['Confirmed', 'Completed'],
            check_in__lte=today,
            check_out__gte=today
        ).values('room_id').distinct().count()
        
        rate = round((occupied_type_rooms / total_type_rooms * 100), 1) if total_type_rooms > 0 else 0.0
        room_types_stats.append({
            "room_type": rt,
            "total": total_type_rooms,
            "occupied": occupied_type_rooms,
            "occupancy_rate": rate
        })

    # Room Type Popularity (Number of bookings made per room type)
    popularity = Booking.objects.values('room__room_type').annotate(count=Count('id'))
    room_popularity = [{
        "room_type": item['room__room_type'] or "Standard",
        "bookings_count": item['count']
    } for item in popularity]

    return Response({
        "monthly_revenue": monthly_revenue,
        "status_breakdown": status_breakdown,
        "room_types_occupancy": room_types_stats,
        "room_popularity": room_popularity
    })
