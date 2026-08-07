from django.test import TestCase, Client
from django.urls import reverse
from datetime import datetime, timedelta
from .models import Room, Coupon, Booking

class HotelBookingSystemTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.room = Room.objects.create(
            room_number="999",
            room_type="Deluxe Suite",
            price_per_night=100.00,
            max_occupancy=2,
            amenities="WiFi, AC",
            status="Available",
            description="Test Room"
        )
        self.coupon = Coupon.objects.create(
            code="TEST20",
            discount_percentage=20,
            active=True,
            expiry_date=datetime.now().date() + timedelta(days=5)
        )

    def test_room_creation(self):
        self.assertEqual(Room.objects.count(), 1)
        room = Room.objects.get(room_number="999")
        self.assertEqual(room.room_type, "Deluxe Suite")
        self.assertEqual(float(room.price_per_night), 100.00)

    def test_coupon_validation_api(self):
        url = reverse('coupon-validate-coupon')
        response = self.client.post(url, {'code': 'TEST20'}, content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()['valid'])
        self.assertEqual(response.json()['coupon']['discount_percentage'], 20)

    def test_booking_creation_api(self):
        url = reverse('booking-list')
        check_in = (datetime.now() + timedelta(days=1)).strftime('%Y-%m-%d')
        check_out = (datetime.now() + timedelta(days=3)).strftime('%Y-%m-%d')
        
        booking_data = {
            'room': self.room.id,
            'guest_name': 'Test Guest',
            'guest_email': 'test@example.com',
            'guest_phone': '1234567890',
            'check_in': check_in,
            'check_out': check_out,
            'coupon_code': 'TEST20'
        }
        
        response = self.client.post(url, booking_data, content_type='application/json')
        self.assertEqual(response.status_code, 201)
        booking = Booking.objects.get(guest_name='Test Guest')
        
        # Room price is 100. 2 nights = 200. Discount 20% = 40. Final = 160.
        self.assertEqual(float(booking.total_price), 200.00)
        self.assertEqual(float(booking.discount_amount), 40.00)
        self.assertEqual(float(booking.final_price), 160.00)
        self.assertEqual(booking.status, 'Pending')
