import { createClient } from '@supabase/supabase-js';

// 1. ENVIRONMENT VARIABLES
// In a real build pipeline (Vite), these would be import.meta.env.VITE_SUPABASE_URL
// For this environment, we are using the constants provided.
const SUPABASE_URL = 'https://xadyyczbbprrgyijlbsj.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_yZwisUVo0zsSUeWb2u3ITg_zggeM6z9';

// 2. SUPABASE CLIENT SETUP
// This is the singleton client for browser usage.
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Database Types
export type Car = {
  id: string;
  title: string;
  slug: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  currency: string;
  mileage?: number;
  fuel_type?: string;
  transmission?: string;
  doors?: number;
  color?: string;
  engine_cc?: number;
  first_registration?: string; // YYYY-MM
  last_mfk?: string; // YYYY-MM
  description?: string;
  images?: string[];
  status: 'available' | 'reserved' | 'sold';
  created_at: string;
};

export type Profile = {
  id: string;
  role: 'owner' | 'worker';
  first_name?: string;
  last_name?: string;
};

export type Lead = {
  id: string;
  brand: string;
  model: string;
  status: 'new' | 'reviewed' | 'accepted' | 'rejected';
  expected_price: number;
  created_at: string;
  owner_firstname: string;
  owner_lastname: string;
};

export type QRCode = {
  id: string;
  label: string; // e.g., "Summer Sale Flyer" or "Aston Martin DBX Window Sticker"
  target_url: string; // The destination, e.g., "/cars/aston-martin-dbx"
  scan_count: number;
  created_at: string;
};