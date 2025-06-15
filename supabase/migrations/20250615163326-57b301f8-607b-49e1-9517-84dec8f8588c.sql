
-- Drop ALL existing policies on all tables first
DROP POLICY IF EXISTS "Customers can view their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Customers can create bookings" ON public.bookings;
DROP POLICY IF EXISTS "Customers can update their pending bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can manage all bookings" ON public.bookings;
DROP POLICY IF EXISTS "Booking visibility policy" ON public.bookings;
DROP POLICY IF EXISTS "Role-based booking updates" ON public.bookings;

DROP POLICY IF EXISTS "Everyone can view available vehicles" ON public.vehicles;
DROP POLICY IF EXISTS "Admins can manage vehicles" ON public.vehicles;
DROP POLICY IF EXISTS "Agents can update vehicle status" ON public.vehicles;
DROP POLICY IF EXISTS "Anyone can view vehicles" ON public.vehicles;
DROP POLICY IF EXISTS "Agents and admins can insert vehicles" ON public.vehicles;
DROP POLICY IF EXISTS "Agents can update own vehicles, admins any" ON public.vehicles;

-- Create settings table for global configuration
CREATE TABLE IF NOT EXISTS public.settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Insert default settings
INSERT INTO public.settings (key, value) VALUES 
  ('currency', 'USD'),
  ('maintenance_mode', 'false'),
  ('auto_backup', 'true')
ON CONFLICT (key) DO NOTHING;

-- Create backups table to track backup operations
CREATE TABLE IF NOT EXISTS public.backups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  file_url TEXT NOT NULL,
  backup_type TEXT NOT NULL DEFAULT 'manual'
);

-- Add agent_id to vehicles table for agent-created vehicles
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS agent_id UUID REFERENCES profiles(id);

-- Update booking status enum to include missing values
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'awaiting_payment' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'booking_status')) THEN
    ALTER TYPE booking_status ADD VALUE 'awaiting_payment';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'scheduled' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'booking_status')) THEN
    ALTER TYPE booking_status ADD VALUE 'scheduled';
  END IF;
END
$$;

-- Enable RLS on settings table
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Enable RLS on backups table
ALTER TABLE public.backups ENABLE ROW LEVEL SECURITY;

-- Settings policies
CREATE POLICY "Anyone can read settings" ON public.settings
  FOR SELECT USING (true);

CREATE POLICY "Only admins can update settings" ON public.settings
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Only admins can insert settings" ON public.settings
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Backup policies
CREATE POLICY "Only admins can manage backups" ON public.backups
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Vehicle policies
CREATE POLICY "Anyone can view vehicles" ON public.vehicles
  FOR SELECT USING (true);

CREATE POLICY "Agents and admins can insert vehicles" ON public.vehicles
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('agent', 'admin'))
  );

CREATE POLICY "Agents can update own vehicles, admins any" ON public.vehicles
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    OR (agent_id = auth.uid())
  );

-- Booking policies
CREATE POLICY "Booking visibility policy" ON public.bookings
  FOR SELECT USING (
    customer_id = auth.uid() 
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('agent', 'admin'))
  );

CREATE POLICY "Customers can create bookings" ON public.bookings
  FOR INSERT WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Role-based booking updates" ON public.bookings
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    OR 
    (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'agent'))
    OR
    (customer_id = auth.uid())
  );

-- Create storage bucket for backups
INSERT INTO storage.buckets (id, name, public) 
VALUES ('backups', 'backups', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for backups
CREATE POLICY "Admins can upload backups" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'backups' AND
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can view backups" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'backups' AND
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
