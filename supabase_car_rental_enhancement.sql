-- =====================================
-- SmartDrive Kenya - Car Rental Enhancement SQL
-- Run this on your Supabase SQL Editor
-- =====================================

-- 1. CREATE ADDITIONAL ENUMS
DO $$ 
BEGIN
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

-- 2. CREATE RENTAL LOCATIONS TABLE
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

-- 3. UPDATE VEHICLES TABLE WITH RENTAL FEATURES
ALTER TABLE public.vehicles 
  ADD COLUMN IF NOT EXISTS location_id UUID REFERENCES rental_locations(id),
  ADD COLUMN IF NOT EXISTS insurance_type insurance_type DEFAULT 'basic',
  ADD COLUMN IF NOT EXISTS daily_rate DECIMAL(10,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS weekly_rate DECIMAL(10,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS monthly_rate DECIMAL(10,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS mileage INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS fuel_level INTEGER DEFAULT 100 CHECK (fuel_level >= 0 AND fuel_level <= 100),
  ADD COLUMN IF NOT EXISTS last_service_date DATE,
  ADD COLUMN IF NOT EXISTS next_service_date DATE,
  ADD COLUMN IF NOT EXISTS deposit_amount DECIMAL(10,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS min_age_requirement INTEGER DEFAULT 21,
  ADD COLUMN IF NOT EXISTS max_daily_distance INTEGER DEFAULT 200,
  ADD COLUMN IF NOT EXISTS available_from DATE DEFAULT CURRENT_DATE,
  ADD COLUMN IF NOT EXISTS available_until DATE;

-- 4. CREATE ENHANCED RENTALS TABLE (replacing simple bookings)
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

-- 5. CREATE PAYMENTS TABLE
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

-- 6. CREATE RENTAL EXTRAS TABLE
CREATE TABLE IF NOT EXISTS public.rental_extras (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  daily_rate DECIMAL(10,2) NOT NULL CHECK (daily_rate >= 0),
  category TEXT NOT NULL, -- 'navigation', 'safety', 'comfort', 'convenience'
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. CREATE RENTAL EXTRA SELECTIONS TABLE (many-to-many)
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

-- 8. CREATE REVIEWS TABLE
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

-- 9. CREATE VEHICLE AVAILABILITY TABLE
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

-- 10. CREATE NOTIFICATIONS TABLE
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

-- 11. INSERT SAMPLE DATA

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

-- 12. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.rental_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rentals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rental_extras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rental_extra_selections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 13. CREATE RLS POLICIES

-- Rental Locations (public read, admin write)
CREATE POLICY "Anyone can view rental locations" ON public.rental_locations
  FOR SELECT USING (true);

CREATE POLICY "Only admins can manage rental locations" ON public.rental_locations
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Rentals (customers see own, agents/admins see all)
CREATE POLICY "Rental visibility policy" ON public.rentals
  FOR SELECT USING (
    customer_id = auth.uid() OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('agent', 'admin'))
  );

CREATE POLICY "Customers can create rentals" ON public.rentals
  FOR INSERT WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Agents and admins can update rentals" ON public.rentals
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('agent', 'admin'))
  );

-- Payments (customers see own, agents/admins see related)
CREATE POLICY "Payment visibility policy" ON public.payments
  FOR SELECT USING (
    customer_id = auth.uid() OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('agent', 'admin'))
  );

CREATE POLICY "System can create payments" ON public.payments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can update payments" ON public.payments
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Rental Extras (public read, admin write)
CREATE POLICY "Anyone can view rental extras" ON public.rental_extras
  FOR SELECT USING (true);

CREATE POLICY "Only admins can manage rental extras" ON public.rental_extras
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Rental Extra Selections (customers see own, agents/admins see all)
CREATE POLICY "Rental extra selections visibility" ON public.rental_extra_selections
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM rentals WHERE id = rental_id AND customer_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('agent', 'admin'))
  );

CREATE POLICY "Customers can select rental extras" ON public.rental_extra_selections
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM rentals WHERE id = rental_id AND customer_id = auth.uid())
  );

-- Reviews (customers see all, but only create own)
CREATE POLICY "Anyone can read reviews" ON public.reviews
  FOR SELECT USING (true);

CREATE POLICY "Customers can create own reviews" ON public.reviews
  FOR INSERT WITH CHECK (
    customer_id = auth.uid() AND
    EXISTS (SELECT 1 FROM rentals WHERE id = rental_id AND customer_id = auth.uid() AND status = 'completed')
  );

CREATE POLICY "Admins can moderate reviews" ON public.reviews
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Vehicle Availability (public read, agents/admins write)
CREATE POLICY "Anyone can view vehicle availability" ON public.vehicle_availability
  FOR SELECT USING (true);

CREATE POLICY "Agents and admins can manage availability" ON public.vehicle_availability
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('agent', 'admin'))
  );

-- Notifications (users see own only)
CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "System can create notifications" ON public.notifications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE USING (user_id = auth.uid());

-- 14. CREATE INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_rentals_customer_id ON public.rentals(customer_id);
CREATE INDEX IF NOT EXISTS idx_rentals_vehicle_id ON public.rentals(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_rentals_pickup_date ON public.rentals(pickup_date);
CREATE INDEX IF NOT EXISTS idx_rentals_status ON public.rentals(status);
CREATE INDEX IF NOT EXISTS idx_payments_rental_id ON public.payments(rental_id);
CREATE INDEX IF NOT EXISTS idx_payments_customer_id ON public.payments(customer_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_vehicle_availability_vehicle_date ON public.vehicle_availability(vehicle_id, date);
CREATE INDEX IF NOT EXISTS idx_reviews_vehicle_id ON public.reviews(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id_read ON public.notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_vehicles_location_status ON public.vehicles(location_id, status);

-- 15. CREATE HELPFUL FUNCTIONS

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

-- Function to calculate rental total
CREATE OR REPLACE FUNCTION calculate_rental_total(
  vehicle_uuid UUID,
  rental_days INTEGER,
  insurance_type_param insurance_type DEFAULT 'basic',
  extras_cost DECIMAL DEFAULT 0
)
RETURNS DECIMAL
LANGUAGE plpgsql
AS $$
DECLARE
  daily_rate DECIMAL;
  insurance_cost DECIMAL := 0;
  tax_rate DECIMAL := 0.16; -- 16% VAT in Kenya
  subtotal DECIMAL;
  total DECIMAL;
BEGIN
  -- Get vehicle daily rate
  SELECT COALESCE(v.daily_rate, v.price_per_day, 5000) INTO daily_rate
  FROM vehicles v WHERE id = vehicle_uuid;
  
  -- Calculate insurance cost
  CASE insurance_type_param
    WHEN 'comprehensive' THEN insurance_cost := daily_rate * 0.15; -- 15% of daily rate
    WHEN 'premium' THEN insurance_cost := daily_rate * 0.25; -- 25% of daily rate
    ELSE insurance_cost := daily_rate * 0.05; -- 5% for basic
  END CASE;
  
  -- Calculate subtotal
  subtotal := (daily_rate + insurance_cost) * rental_days + extras_cost;
  
  -- Add tax
  total := subtotal * (1 + tax_rate);
  
  RETURN ROUND(total, 2);
END;
$$;

-- Success message
SELECT 'SmartDrive Kenya car rental database enhancement completed successfully!' as message;