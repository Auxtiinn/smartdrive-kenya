-- =====================================
-- SmartDrive Kenya - Complete Database Setup
-- Run this FIRST to create all tables from scratch
-- =====================================

-- 1. CREATE BASE ENUMS FIRST
DO $$ 
BEGIN
  -- User role enum
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM ('admin', 'agent', 'customer');
  END IF;

  -- Vehicle status enum
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'vehicle_status') THEN
    CREATE TYPE vehicle_status AS ENUM ('available', 'rented', 'maintenance', 'unavailable');
  END IF;

  -- Fuel type enum
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'fuel_type') THEN
    CREATE TYPE fuel_type AS ENUM ('petrol', 'diesel', 'electric', 'hybrid');
  END IF;

  -- Transmission enum
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'transmission') THEN
    CREATE TYPE transmission AS ENUM ('manual', 'automatic');
  END IF;

  -- Booking status enum
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'booking_status') THEN
    CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'active', 'completed', 'cancelled');
  END IF;

  -- Payment status enum
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status') THEN
    CREATE TYPE payment_status AS ENUM (
      'pending',
      'processing', 
      'completed',
      'failed',
      'refunded',
      'cancelled'
    );
  END IF;

  -- Payment method enum  
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_method') THEN
    CREATE TYPE payment_method AS ENUM (
      'mpesa',
      'card',
      'bank_transfer',
      'cash',
      'wallet'
    );
  END IF;

  -- Rental status enum
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'rental_status') THEN
    CREATE TYPE rental_status AS ENUM (
      'pending',
      'confirmed', 
      'active',
      'completed',
      'cancelled',
      'overdue'
    );
  END IF;

  -- Insurance type enum
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'insurance_type') THEN
    CREATE TYPE insurance_type AS ENUM (
      'basic',
      'comprehensive',
      'premium',
      'none'
    );
  END IF;
END $$;

-- 2. CREATE PROFILES TABLE (for users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  role user_role DEFAULT 'customer',
  phone TEXT,
  signup_source TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ
);

-- 3. CREATE RENTAL LOCATIONS TABLE
CREATE TABLE IF NOT EXISTS public.rental_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT 'Nairobi',
  county TEXT NOT NULL DEFAULT 'Nairobi',
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  phone TEXT,
  email TEXT,
  operating_hours JSONB DEFAULT '{"monday": "08:00-18:00", "tuesday": "08:00-18:00", "wednesday": "08:00-18:00", "thursday": "08:00-18:00", "friday": "08:00-18:00", "saturday": "09:00-17:00", "sunday": "closed"}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ
);

-- 4. CREATE VEHICLES TABLE
CREATE TABLE IF NOT EXISTS public.vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL CHECK (year >= 1990 AND year <= EXTRACT(YEAR FROM NOW()) + 2),
  license_plate TEXT NOT NULL UNIQUE,
  color TEXT,
  fuel_type fuel_type DEFAULT 'petrol',
  transmission transmission DEFAULT 'manual',
  seating_capacity INTEGER NOT NULL CHECK (seating_capacity > 0),
  price_per_day DECIMAL(10,2) NOT NULL CHECK (price_per_day >= 0),
  image_url TEXT,
  status vehicle_status DEFAULT 'available',
  features TEXT[] DEFAULT '{}',
  
  -- Rental-specific fields
  location_id UUID REFERENCES rental_locations(id),
  insurance_type insurance_type DEFAULT 'basic',
  daily_rate DECIMAL(10,2) DEFAULT 0,
  weekly_rate DECIMAL(10,2) DEFAULT 0,
  monthly_rate DECIMAL(10,2) DEFAULT 0,
  mileage INTEGER DEFAULT 0,
  fuel_level INTEGER DEFAULT 100 CHECK (fuel_level >= 0 AND fuel_level <= 100),
  last_service_date DATE,
  next_service_date DATE,
  deposit_amount DECIMAL(10,2) DEFAULT 0,
  min_age_requirement INTEGER DEFAULT 21,
  max_daily_distance INTEGER DEFAULT 200,
  available_from DATE DEFAULT CURRENT_DATE,
  available_until DATE,
  
  agent_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ
);

-- 5. CREATE ENHANCED RENTALS TABLE
CREATE TABLE IF NOT EXISTS public.rentals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE RESTRICT,
  pickup_location_id UUID NOT NULL REFERENCES rental_locations(id),
  return_location_id UUID NOT NULL REFERENCES rental_locations(id),
  
  -- Rental dates and times
  pickup_date DATE NOT NULL,
  pickup_time TIME NOT NULL DEFAULT '09:00',
  return_date DATE NOT NULL,
  return_time TIME NOT NULL DEFAULT '17:00',
  actual_pickup_datetime TIMESTAMPTZ,
  actual_return_datetime TIMESTAMPTZ,
  
  -- Pricing
  daily_rate DECIMAL(10,2) NOT NULL,
  total_days INTEGER NOT NULL CHECK (total_days > 0),
  subtotal DECIMAL(10,2) NOT NULL,
  insurance_cost DECIMAL(10,2) DEFAULT 0,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  deposit_amount DECIMAL(10,2) NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  
  -- Status and details
  status rental_status DEFAULT 'pending',
  insurance_type insurance_type DEFAULT 'basic',
  special_requests TEXT,
  
  -- Vehicle condition tracking
  pickup_mileage INTEGER,
  return_mileage INTEGER,
  pickup_fuel_level INTEGER,
  return_fuel_level INTEGER,
  
  -- Admin notes
  admin_notes TEXT,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ,
  
  CONSTRAINT valid_rental_period CHECK (return_date >= pickup_date),
  CONSTRAINT valid_mileage CHECK (return_mileage IS NULL OR pickup_mileage IS NULL OR return_mileage >= pickup_mileage)
);

-- 6. CREATE PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rental_id UUID NOT NULL REFERENCES rentals(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Payment details
  amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
  payment_method payment_method NOT NULL,
  status payment_status DEFAULT 'pending',
  
  -- External payment references
  transaction_id TEXT UNIQUE,
  mpesa_receipt_number TEXT,
  mpesa_phone_number TEXT,
  card_last_four TEXT,
  
  -- Payment metadata
  currency TEXT DEFAULT 'KES',
  exchange_rate DECIMAL(10,4) DEFAULT 1.0000,
  payment_date TIMESTAMPTZ,
  description TEXT,
  
  -- Refund information
  refunded_amount DECIMAL(10,2) DEFAULT 0,
  refund_reason TEXT,
  refunded_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ
);

-- 7. CREATE RENTAL EXTRAS TABLE
CREATE TABLE IF NOT EXISTS public.rental_extras (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  daily_rate DECIMAL(10,2) NOT NULL CHECK (daily_rate >= 0),
  category TEXT NOT NULL, -- 'navigation', 'safety', 'comfort', 'convenience'
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. CREATE RENTAL EXTRA SELECTIONS TABLE
CREATE TABLE IF NOT EXISTS public.rental_extra_selections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rental_id UUID NOT NULL REFERENCES rentals(id) ON DELETE CASCADE,
  rental_extra_id UUID NOT NULL REFERENCES rental_extras(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1 CHECK (quantity > 0),
  daily_rate DECIMAL(10,2) NOT NULL,
  total_cost DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  UNIQUE(rental_id, rental_extra_id)
);

-- 9. CREATE REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rental_id UUID NOT NULL REFERENCES rentals(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  
  -- Ratings (1-5 scale)
  overall_rating INTEGER NOT NULL CHECK (overall_rating >= 1 AND overall_rating <= 5),
  vehicle_condition_rating INTEGER CHECK (vehicle_condition_rating >= 1 AND vehicle_condition_rating <= 5),
  service_rating INTEGER CHECK (service_rating >= 1 AND service_rating <= 5),
  value_for_money_rating INTEGER CHECK (value_for_money_rating >= 1 AND value_for_money_rating <= 5),
  
  -- Review content
  title TEXT,
  comment TEXT,
  
  -- Moderation
  is_approved BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  moderated_by UUID REFERENCES profiles(id),
  moderated_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ,
  
  UNIQUE(rental_id) -- One review per rental
);

-- 10. CREATE VEHICLE AVAILABILITY TABLE
CREATE TABLE IF NOT EXISTS public.vehicle_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  is_available BOOLEAN DEFAULT true,
  reason TEXT, -- 'maintenance', 'booked', 'damaged', 'other'
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  UNIQUE(vehicle_id, date)
);

-- 11. CREATE NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL, -- 'rental_confirmed', 'payment_received', 'rental_reminder', 'maintenance_due'
  related_rental_id UUID REFERENCES rentals(id) ON DELETE CASCADE,
  is_read BOOLEAN DEFAULT false,
  is_sent BOOLEAN DEFAULT false,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 12. INSERT SAMPLE DATA

-- Sample rental locations
INSERT INTO public.rental_locations (name, address, city, county, latitude, longitude, phone, email) VALUES
('Nairobi CBD Branch', 'Kenyatta Avenue, Nairobi', 'Nairobi', 'Nairobi', -1.2864, 36.8172, '+254700123456', 'nairobi@smartdrive.co.ke'),
('Westlands Branch', 'Westlands Mall, Nairobi', 'Nairobi', 'Nairobi', -1.2672, 36.8103, '+254700123457', 'westlands@smartdrive.co.ke'),
('JKIA Airport Branch', 'Jomo Kenyatta Airport, Nairobi', 'Nairobi', 'Nairobi', -1.3192, 36.9278, '+254700123458', 'airport@smartdrive.co.ke'),
('Mombasa Branch', 'Moi Avenue, Mombasa', 'Mombasa', 'Mombasa', -4.0435, 39.6682, '+254700123459', 'mombasa@smartdrive.co.ke'),
('Kisumu Branch', 'Oginga Odinga Street, Kisumu', 'Kisumu', 'Kisumu', -0.0917, 34.7680, '+254700123460', 'kisumu@smartdrive.co.ke')
ON CONFLICT DO NOTHING;

-- Sample rental extras
INSERT INTO public.rental_extras (name, description, daily_rate, category) VALUES
('GPS Navigation', 'Garmin GPS with Kenya maps', 500.00, 'navigation'),
('Child Car Seat', 'Safety car seat for children', 300.00, 'safety'),
('WiFi Hotspot', 'Mobile WiFi device with 5GB daily data', 800.00, 'convenience'),
('Extra Driver', 'Additional authorized driver', 200.00, 'convenience'),
('Baby Seat (0-1 year)', 'Infant car seat for babies', 400.00, 'safety'),
('Booster Seat (4-12 years)', 'Booster seat for older children', 250.00, 'safety'),
('Roof Box', 'Additional luggage storage', 1000.00, 'convenience'),
('Snow Chains', 'For mountain driving', 600.00, 'safety'),
('Phone Mount', 'Smartphone holder for dashboard', 100.00, 'convenience'),
('First Aid Kit', 'Emergency medical supplies', 150.00, 'safety')
ON CONFLICT DO NOTHING;

-- Sample vehicles
INSERT INTO public.vehicles (
    make, model, year, license_plate, color, fuel_type, transmission, 
    seating_capacity, price_per_day, status, features, daily_rate, deposit_amount,
    created_at
) VALUES
('Toyota', 'Corolla', 2022, 'KCA 123A', 'White', 'petrol', 'automatic', 5, 3500.00, 'available', 
 ARRAY['Air Conditioning', 'Power Steering', 'Radio'], 3500.00, 1000.00, NOW()),
('Nissan', 'Note', 2021, 'KCB 456B', 'Silver', 'petrol', 'manual', 5, 3000.00, 'available',
 ARRAY['Air Conditioning', 'Power Windows'], 3000.00, 900.00, NOW()),
('Honda', 'Fit', 2023, 'KCC 789C', 'Blue', 'petrol', 'automatic', 5, 3200.00, 'available',
 ARRAY['Air Conditioning', 'Bluetooth', 'USB Port'], 3200.00, 950.00, NOW()),
('Toyota', 'Prado', 2022, 'KCD 101D', 'Black', 'diesel', 'automatic', 7, 8000.00, 'available',
 ARRAY['4WD', 'Leather Seats', 'Sunroof', 'Navigation'], 8000.00, 2400.00, NOW()),
('Subaru', 'Forester', 2021, 'KCE 202E', 'Green', 'petrol', 'automatic', 5, 5500.00, 'available',
 ARRAY['AWD', 'Roof Rails', 'Backup Camera'], 5500.00, 1650.00, NOW())
ON CONFLICT (license_plate) DO NOTHING;

-- 13. ENABLE ROW LEVEL SECURITY
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rental_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rentals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rental_extras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rental_extra_selections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 14. CREATE RLS POLICIES

-- Profiles (users see own profile, admins see all)
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id OR auth.uid() = id);

DROP POLICY IF EXISTS "Anyone can create profile" ON public.profiles;
CREATE POLICY "Anyone can create profile" ON public.profiles
  FOR INSERT WITH CHECK (true);

-- Rental Locations (public read, admin write)
DROP POLICY IF EXISTS "Anyone can view rental locations" ON public.rental_locations;
CREATE POLICY "Anyone can view rental locations" ON public.rental_locations
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Only admins can manage rental locations" ON public.rental_locations;
CREATE POLICY "Only admins can manage rental locations" ON public.rental_locations
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Vehicles (public read, agents/admins write)
DROP POLICY IF EXISTS "Anyone can view vehicles" ON public.vehicles;
CREATE POLICY "Anyone can view vehicles" ON public.vehicles
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Agents and admins can insert vehicles" ON public.vehicles;
CREATE POLICY "Agents and admins can insert vehicles" ON public.vehicles
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('agent', 'admin'))
  );

DROP POLICY IF EXISTS "Agents can update own vehicles, admins any" ON public.vehicles;
CREATE POLICY "Agents can update own vehicles, admins any" ON public.vehicles
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    OR (agent_id = auth.uid())
  );

-- Rentals (customers see own, agents/admins see all)
DROP POLICY IF EXISTS "Rental visibility policy" ON public.rentals;
CREATE POLICY "Rental visibility policy" ON public.rentals
  FOR SELECT USING (
    customer_id = auth.uid() OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('agent', 'admin'))
  );

DROP POLICY IF EXISTS "Customers can create rentals" ON public.rentals;
CREATE POLICY "Customers can create rentals" ON public.rentals
  FOR INSERT WITH CHECK (customer_id = auth.uid());

DROP POLICY IF EXISTS "Agents and admins can update rentals" ON public.rentals;
CREATE POLICY "Agents and admins can update rentals" ON public.rentals
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('agent', 'admin'))
  );

-- Payments (customers see own, agents/admins see related)
DROP POLICY IF EXISTS "Payment visibility policy" ON public.payments;
CREATE POLICY "Payment visibility policy" ON public.payments
  FOR SELECT USING (
    customer_id = auth.uid() OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('agent', 'admin'))
  );

DROP POLICY IF EXISTS "System can create payments" ON public.payments;
CREATE POLICY "System can create payments" ON public.payments
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can update payments" ON public.payments;
CREATE POLICY "Admins can update payments" ON public.payments
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Rental Extras (public read, admin write)
DROP POLICY IF EXISTS "Anyone can view rental extras" ON public.rental_extras;
CREATE POLICY "Anyone can view rental extras" ON public.rental_extras
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Only admins can manage rental extras" ON public.rental_extras;
CREATE POLICY "Only admins can manage rental extras" ON public.rental_extras
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Reviews (public read, customers create own)
DROP POLICY IF EXISTS "Anyone can read reviews" ON public.reviews;
CREATE POLICY "Anyone can read reviews" ON public.reviews
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Customers can create own reviews" ON public.reviews;
CREATE POLICY "Customers can create own reviews" ON public.reviews
  FOR INSERT WITH CHECK (
    customer_id = auth.uid() AND
    EXISTS (SELECT 1 FROM rentals WHERE id = rental_id AND customer_id = auth.uid() AND status = 'completed')
  );

-- Notifications (users see own only)
DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "System can create notifications" ON public.notifications;
CREATE POLICY "System can create notifications" ON public.notifications
  FOR INSERT WITH CHECK (true);

-- 15. CREATE INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_vehicles_status ON public.vehicles(status);
CREATE INDEX IF NOT EXISTS idx_vehicles_location ON public.vehicles(location_id);
CREATE INDEX IF NOT EXISTS idx_rentals_customer_id ON public.rentals(customer_id);
CREATE INDEX IF NOT EXISTS idx_rentals_vehicle_id ON public.rentals(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_rentals_pickup_date ON public.rentals(pickup_date);
CREATE INDEX IF NOT EXISTS idx_rentals_status ON public.rentals(status);
CREATE INDEX IF NOT EXISTS idx_payments_rental_id ON public.payments(rental_id);
CREATE INDEX IF NOT EXISTS idx_payments_customer_id ON public.payments(customer_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_reviews_vehicle_id ON public.reviews(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id_read ON public.notifications(user_id, is_read);

-- 16. CREATE HELPFUL FUNCTIONS

-- Function to check vehicle availability for a date range
CREATE OR REPLACE FUNCTION is_vehicle_available(
  vehicle_uuid UUID,
  start_date DATE,
  end_date DATE
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
BEGIN
  -- Check if vehicle exists and is active
  IF NOT EXISTS (SELECT 1 FROM vehicles WHERE id = vehicle_uuid AND status = 'available') THEN
    RETURN FALSE;
  END IF;
  
  -- Check for conflicting rentals
  IF EXISTS (
    SELECT 1 FROM rentals 
    WHERE vehicle_id = vehicle_uuid 
    AND status NOT IN ('cancelled', 'completed')
    AND (
      (pickup_date <= end_date AND return_date >= start_date)
    )
  ) THEN
    RETURN FALSE;
  END IF;
  
  -- Check availability calendar
  IF EXISTS (
    SELECT 1 FROM vehicle_availability 
    WHERE vehicle_id = vehicle_uuid 
    AND date BETWEEN start_date AND end_date 
    AND is_available = false
  ) THEN
    RETURN FALSE;
  END IF;
  
  RETURN TRUE;
END;
$$;

-- Success message
SELECT 'SmartDrive Kenya complete database setup completed successfully!' as message;