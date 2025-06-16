
-- Add phone number and signup_source to profiles table if not already there
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS phone TEXT;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS signup_source TEXT;

-- Optionally, update RLS or add constraints as needed.
