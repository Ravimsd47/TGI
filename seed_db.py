import os
import sys
import django
from datetime import datetime, timedelta
import random

# Add backend to python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'tgi_backend.settings')
django.setup()

# pyrefly: ignore [missing-import]
from booking_system.models import Room, Coupon, Booking, Payment
from django.utils import timezone

def seed_database():
    print("Clearing database...")
    Payment.objects.all().delete()
    Booking.objects.all().delete()
    Coupon.objects.all().delete()
    Room.objects.all().delete()

    print("Seeding Rooms...")
    rooms_data = [
        {
            "room_number": "101",
            "room_type": "Deluxe Suite",
            "price_per_night": 150.00,
            "max_occupancy": 2,
            "amenities": "WiFi, HD Smart TV, AC, Minibar, Coffee Maker, Ocean View",
            "image_url": "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=600&q=80",
            "status": "Available",
            "description": "Indulge in our beautifully designed Deluxe Suite featuring floor-to-ceiling glass windows, a private seating area, and custom handcrafted mahogany furniture."
        },
        {
            "room_number": "102",
            "room_type": "Deluxe Suite",
            "price_per_night": 160.00,
            "max_occupancy": 2,
            "amenities": "WiFi, HD Smart TV, AC, Minibar, Ocean View",
            "image_url": "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80",
            "status": "Available",
            "description": "Elegant comfort with modern aesthetic, featuring plush king-size bed, frosted-glass bathroom, and high-speed working desk."
        },
        {
            "room_number": "201",
            "room_type": "Executive Suite",
            "price_per_night": 250.00,
            "max_occupancy": 3,
            "amenities": "WiFi, HD Smart TV, AC, Minibar, Private Balcony, Desk Workspace, Bath Tub",
            "image_url": "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=600&q=80",
            "status": "Available",
            "description": "Ideal for business travelers or couples looking for extra space. It contains a separate parlor, workspace, and a beautiful panoramic balcony."
        },
        {
            "room_number": "202",
            "room_type": "Executive Suite",
            "price_per_night": 270.00,
            "max_occupancy": 3,
            "amenities": "WiFi, HD Smart TV, AC, Minibar, Private Balcony, Bath Tub, Espresso Machine",
            "image_url": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80",
            "status": "Available",
            "description": "Stunning executive floor suite offering premium views of TGI Fortuna, high-quality bedsheets, and automated ambient lighting systems."
        },
        {
            "room_number": "301",
            "room_type": "Club Room",
            "price_per_night": 380.00,
            "max_occupancy": 2,
            "amenities": "WiFi, 4K Smart TV, AC, Premium Minibar, Club Lounge Access, Jacuzzi, Wine Cooler",
            "image_url": "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=600&q=80",
            "status": "Available",
            "description": "Exclusive Club Room offering VIP access to the premium Club Lounge, complimentary evening cocktails, and a gorgeous en-suite jacuzzi."
        },
        {
            "room_number": "401",
            "room_type": "Presidential Suite",
            "price_per_night": 650.00,
            "max_occupancy": 4,
            "amenities": "WiFi, 4K Smart TV, Central AC, Walk-in Bar, Private Terrace, Personal Butler, Kitchenette, Private Infinity Pool",
            "image_url": "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=600&q=80",
            "status": "Available",
            "description": "The ultimate luxury statement at TGI Fortuna. Two master bedrooms, a private dining room, fully equipped kitchenette, and private access to an infinity pool."
        }
    ]

    rooms = []
    for r_data in rooms_data:
        room = Room.objects.create(**r_data)
        rooms.append(room)
    print(f"Created {len(rooms)} rooms.")

    print("Seeding Coupons...")
    coupons_data = [
        {"code": "TGIFORTUNA", "discount_percentage": 20, "active": True, "expiry_date": datetime.now().date() + timedelta(days=90)},
        {"code": "WELCOME10", "discount_percentage": 10, "active": True, "expiry_date": datetime.now().date() + timedelta(days=60)},
        {"code": "FESTIVE25", "discount_percentage": 25, "active": True, "expiry_date": datetime.now().date() + timedelta(days=45)},
        {"code": "EXPIRED15", "discount_percentage": 15, "active": True, "expiry_date": datetime.now().date() - timedelta(days=5)},
        {"code": "DISABLED5", "discount_percentage": 5, "active": False, "expiry_date": datetime.now().date() + timedelta(days=30)},
    ]
    
    coupons = []
    for c_data in coupons_data:
        coupon = Coupon.objects.create(**c_data)
        coupons.append(coupon)
    print(f"Created {len(coupons)} coupons.")

    print("Seeding Booking & Payment History (for Reports)...")
    names = ["Amit Sharma", "Priya Patel", "Vikram Singh", "Sarah Connor", "John Doe", "Jane Smith", "Rajesh Kumar", "Anjali Gupta", "Michael Scott", "Pam Beesly"]
    emails = ["amit@gmail.com", "priya@gmail.com", "vikram@yahoo.com", "sarah@gmail.com", "john@gmail.com", "jane@gmail.com", "rajesh@hotmail.com", "anjali@gmail.com", "michael@dundermifflin.com", "pam@dundermifflin.com"]
    phones = ["+91 98765 43210", "+91 91234 56789", "+91 95432 10987", "+1 555-0199", "+1 555-0142", "+1 555-0177", "+91 88888 77777", "+91 99999 88888", "+1 555-0100", "+1 555-0101"]

    today = datetime.now().date()
    
    # Let's seed 15-20 bookings distributed over the last 5 months
    booking_count = 0
    
    for i in range(25):
        # Pick a random room
        room = random.choice(rooms)
        
        # Decide how many months ago
        # 0 = this month, 1 = 1 month ago, 2 = 2 months ago, etc.
        months_ago = random.choice([0, 0, 1, 1, 2, 2, 3, 3, 4, 4])
        
        # Calculate random dates in that month
        start_day_offset = random.randint(1, 25)
        # Create start date
        start_date = today - timedelta(days=months_ago * 30 + start_day_offset)
        nights = random.randint(1, 5)
        end_date = start_date + timedelta(days=nights)
        
        # Create user details
        idx = random.randint(0, len(names)-1)
        name = names[idx]
        email = emails[idx]
        phone = phones[idx]
        
        # Prices
        total_price = room.price_per_night * nights
        discount = 0.0
        applied_coupon = None
        
        # Maybe apply a valid coupon
        if random.random() > 0.4:
            applied_coupon = random.choice(coupons[:3]) # Use active ones
            discount = float(total_price) * (applied_coupon.discount_percentage / 100.0)
            
        final_price = float(total_price) - discount
        
        # Booking Status
        # If the booking is in the past, it should be Completed or Cancelled.
        # If it overlaps with today, Confirmed.
        # If it is in the future, Pending or Confirmed.
        if end_date < today:
            status_choice = random.choice(['Completed', 'Completed', 'Completed', 'Cancelled'])
        elif start_date <= today <= end_date:
            status_choice = 'Confirmed'
        else:
            status_choice = random.choice(['Pending', 'Confirmed'])
            
        booking = Booking.objects.create(
            room=room,
            guest_name=name,
            guest_email=email,
            guest_phone=phone,
            check_in=start_date,
            check_out=end_date,
            total_price=total_price,
            coupon=applied_coupon,
            discount_amount=discount,
            final_price=final_price,
            status=status_choice
        )
        
        # If status is Completed or Confirmed, create a success payment
        if status_choice in ['Completed', 'Confirmed']:
            # Mock payment
            txn_id = f"TXN-{random.randint(100000, 999999)}-{random.randint(100000, 999999)}"
            
            # Backdate payment creation close to booking creation
            # In Django, auto_now_add makes it created_at today, but we can update it manually
            payment = Payment.objects.create(
                booking=booking,
                amount=final_price,
                transaction_id=txn_id,
                payment_method=random.choice(['Card', 'UPI', 'NetBanking']),
                status='Success'
            )
            
            # Manually shift payment.created_at to the month it occurred so reports graphs render historically
            # We must use timezone.make_aware to avoid naive datetime warning
            payment_datetime = datetime.combine(start_date, datetime.min.time())
            payment.created_at = timezone.make_aware(payment_datetime)
            payment.save()
            
            # Also adjust booking.created_at
            booking.created_at = timezone.make_aware(payment_datetime)
            booking.save()
            
        booking_count += 1
        
    print(f"Created {booking_count} mock bookings and payments.")
    print("Database seeding completed successfully!")

if __name__ == "__main__":
    seed_database()
