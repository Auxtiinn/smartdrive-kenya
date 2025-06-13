
-- Create enum for user roles
CREATE TYPE user_role AS ENUM ('customer', 'admin', 'agent');

-- Create enum for vehicle types
CREATE TYPE vehicle_type AS ENUM ('economy', 'compact', 'midsize', 'fullsize', 'luxury', 'suv', 'truck', 'van');

-- Create enum for booking status
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'active', 'completed', 'cancelled');

-- Create enum for vehicle status
CREATE TYPE vehicle_status AS ENUM ('available', 'rented', 'maintenance', 'out_of_service');

-- Create enum for condition status
CREATE TYPE condition_status AS ENUM ('excellent', 'good', 'fair', 'poor', 'damaged');

-- Update profiles table to include role
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role user_role DEFAULT 'customer';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS address TEXT;

-- Create vehicles table
CREATE TABLE public.vehicles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    make TEXT NOT NULL,
    model TEXT NOT NULL,
    year INTEGER NOT NULL,
    type vehicle_type NOT NULL,
    license_plate TEXT UNIQUE NOT NULL,
    color TEXT NOT NULL,
    seats INTEGER NOT NULL DEFAULT 5,
    transmission TEXT NOT NULL DEFAULT 'automatic',
    fuel_type TEXT NOT NULL DEFAULT 'gasoline',
    mileage INTEGER DEFAULT 0,
    daily_rate DECIMAL(10,2) NOT NULL,
    status vehicle_status NOT NULL DEFAULT 'available',
    location TEXT,
    features JSONB DEFAULT '[]'::jsonb,
    images JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bookings table
CREATE TABLE public.bookings (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID REFERENCES public.profiles(id) NOT NULL,
    vehicle_id UUID REFERENCES public.vehicles(id) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    pickup_location TEXT NOT NULL,
    return_location TEXT NOT NULL,
    total_cost DECIMAL(10,2) NOT NULL,
    status booking_status NOT NULL DEFAULT 'pending',
    booking_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create booking locks table (for preventing double booking)
CREATE TABLE public.booking_locks (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    vehicle_id UUID REFERENCES public.vehicles(id) NOT NULL,
    customer_id UUID REFERENCES public.profiles(id) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '10 minutes'),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create vehicle conditions table
CREATE TABLE public.vehicle_conditions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    vehicle_id UUID REFERENCES public.vehicles(id) NOT NULL,
    booking_id UUID REFERENCES public.bookings(id),
    reporter_id UUID REFERENCES public.profiles(id) NOT NULL,
    condition_type TEXT NOT NULL CHECK (condition_type IN ('pre_rental', 'post_rental', 'maintenance', 'damage_report')),
    overall_condition condition_status NOT NULL,
    exterior_condition condition_status NOT NULL,
    interior_condition condition_status NOT NULL,
    mechanical_condition condition_status NOT NULL,
    fuel_level INTEGER CHECK (fuel_level >= 0 AND fuel_level <= 100),
    mileage INTEGER,
    notes TEXT,
    images JSONB DEFAULT '[]'::jsonb,
    damage_details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create maintenance logs table
CREATE TABLE public.maintenance_logs (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    vehicle_id UUID REFERENCES public.vehicles(id) NOT NULL,
    performed_by UUID REFERENCES public.profiles(id) NOT NULL,
    maintenance_type TEXT NOT NULL,
    description TEXT NOT NULL,
    cost DECIMAL(10,2),
    scheduled_date DATE,
    completed_date DATE,
    status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create cost breakdowns table for transparency
CREATE TABLE public.cost_breakdowns (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    booking_id UUID REFERENCES public.bookings(id) NOT NULL,
    base_cost DECIMAL(10,2) NOT NULL,
    insurance_cost DECIMAL(10,2) DEFAULT 0,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    additional_fees JSONB DEFAULT '{}'::jsonb,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    total_cost DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_locks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_conditions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cost_breakdowns ENABLE ROW LEVEL SECURITY;

-- Create security definer function to get user role (fixed return type)
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID DEFAULT auth.uid())
RETURNS user_role 
LANGUAGE plpgsql
SECURITY DEFINER 
STABLE
AS $$
DECLARE
    user_role_value user_role;
BEGIN
    SELECT role INTO user_role_value FROM public.profiles WHERE id = user_id;
    RETURN user_role_value;
END;
$$;

-- RLS Policies for vehicles
CREATE POLICY "Everyone can view available vehicles" ON public.vehicles
    FOR SELECT USING (status = 'available' OR get_user_role() IN ('admin', 'agent'));

CREATE POLICY "Admins can manage vehicles" ON public.vehicles
    FOR ALL USING (get_user_role() = 'admin');

CREATE POLICY "Agents can update vehicle status" ON public.vehicles
    FOR UPDATE USING (get_user_role() IN ('admin', 'agent'));

-- RLS Policies for bookings
CREATE POLICY "Customers can view their own bookings" ON public.bookings
    FOR SELECT USING (customer_id = auth.uid() OR get_user_role() IN ('admin', 'agent'));

CREATE POLICY "Customers can create bookings" ON public.bookings
    FOR INSERT WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Customers can update their pending bookings" ON public.bookings
    FOR UPDATE USING (customer_id = auth.uid() AND status = 'pending');

CREATE POLICY "Admins can manage all bookings" ON public.bookings
    FOR ALL USING (get_user_role() = 'admin');

-- RLS Policies for booking locks
CREATE POLICY "Users can manage their own booking locks" ON public.booking_locks
    FOR ALL USING (customer_id = auth.uid() OR get_user_role() = 'admin');

-- RLS Policies for vehicle conditions
CREATE POLICY "Users can view vehicle conditions" ON public.vehicle_conditions
    FOR SELECT USING (
        reporter_id = auth.uid() OR 
        get_user_role() IN ('admin', 'agent') OR
        EXISTS (SELECT 1 FROM public.bookings WHERE id = booking_id AND customer_id = auth.uid())
    );

CREATE POLICY "Authenticated users can create condition reports" ON public.vehicle_conditions
    FOR INSERT WITH CHECK (reporter_id = auth.uid());

CREATE POLICY "Admins and agents can manage condition reports" ON public.vehicle_conditions
    FOR ALL USING (get_user_role() IN ('admin', 'agent'));

-- RLS Policies for maintenance logs
CREATE POLICY "Admins and agents can view maintenance logs" ON public.maintenance_logs
    FOR SELECT USING (get_user_role() IN ('admin', 'agent'));

CREATE POLICY "Admins and agents can manage maintenance logs" ON public.maintenance_logs
    FOR ALL USING (get_user_role() IN ('admin', 'agent'));

-- RLS Policies for cost breakdowns
CREATE POLICY "Users can view cost breakdowns for their bookings" ON public.cost_breakdowns
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.bookings WHERE id = booking_id AND customer_id = auth.uid()) OR
        get_user_role() = 'admin'
    );

CREATE POLICY "System can create cost breakdowns" ON public.cost_breakdowns
    FOR INSERT WITH CHECK (true);

-- Create storage buckets for images
INSERT INTO storage.buckets (id, name, public) VALUES 
    ('vehicle-images', 'vehicle-images', true),
    ('condition-reports', 'condition-reports', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for vehicle images
CREATE POLICY "Public can view vehicle images" ON storage.objects
    FOR SELECT USING (bucket_id = 'vehicle-images');

CREATE POLICY "Admins can upload vehicle images" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'vehicle-images' AND get_user_role() = 'admin');

CREATE POLICY "Admins can update vehicle images" ON storage.objects
    FOR UPDATE USING (bucket_id = 'vehicle-images' AND get_user_role() = 'admin');

CREATE POLICY "Admins can delete vehicle images" ON storage.objects
    FOR DELETE USING (bucket_id = 'vehicle-images' AND get_user_role() = 'admin');

-- Storage policies for condition reports
CREATE POLICY "Users can view condition reports" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'condition-reports' AND 
        (get_user_role() IN ('admin', 'agent') OR 
         auth.uid()::text = (storage.foldername(name))[1])
    );

CREATE POLICY "Authenticated users can upload condition reports" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'condition-reports' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- Create function to clean up expired booking locks
CREATE OR REPLACE FUNCTION public.cleanup_expired_booking_locks()
RETURNS void AS $$
BEGIN
    DELETE FROM public.booking_locks WHERE expires_at < now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create indexes for better performance
CREATE INDEX idx_vehicles_status ON public.vehicles(status);
CREATE INDEX idx_vehicles_type ON public.vehicles(type);
CREATE INDEX idx_bookings_customer_id ON public.bookings(customer_id);
CREATE INDEX idx_bookings_vehicle_id ON public.bookings(vehicle_id);
CREATE INDEX idx_bookings_dates ON public.bookings(start_date, end_date);
CREATE INDEX idx_booking_locks_expires_at ON public.booking_locks(expires_at);
CREATE INDEX idx_vehicle_conditions_vehicle_id ON public.vehicle_conditions(vehicle_id);
CREATE INDEX idx_maintenance_logs_vehicle_id ON public.maintenance_logs(vehicle_id);

-- Insert sample data for testing
INSERT INTO public.vehicles (make, model, year, type, license_plate, color, seats, daily_rate, location, features) VALUES
    ('Toyota', 'Camry', 2023, 'midsize', 'ABC-123', 'Silver', 5, 45.00, 'Downtown Branch', '["Air Conditioning", "Bluetooth", "Backup Camera"]'::jsonb),
    ('Honda', 'Civic', 2022, 'compact', 'DEF-456', 'White', 5, 35.00, 'Airport Branch', '["Air Conditioning", "Bluetooth"]'::jsonb),
    ('Ford', 'Explorer', 2023, 'suv', 'GHI-789', 'Black', 7, 65.00, 'Downtown Branch', '["Air Conditioning", "Bluetooth", "Third Row Seating", "4WD"]'::jsonb),
    ('Chevrolet', 'Spark', 2022, 'economy', 'JKL-012', 'Red', 4, 25.00, 'Airport Branch', '["Air Conditioning"]'::jsonb),
    ('BMW', 'X5', 2023, 'luxury', 'MNO-345', 'Blue', 5, 95.00, 'Downtown Branch', '["Leather Seats", "Navigation", "Premium Sound", "Sunroof"]'::jsonb);
