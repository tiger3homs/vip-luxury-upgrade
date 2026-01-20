import { createClient } from '@supabase/supabase-js';

// 1. ENVIRONMENT VARIABLES
const SUPABASE_URL = 'https://xadyyczbbprrgyijlbsj.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_yZwisUVo0zsSUeWb2u3ITg_zggeM6z9';

// 2. SUPABASE CLIENT SETUP
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============================================
// ENHANCED DATABASE TYPES (AutoScout24-style)
// ============================================

// Body Types
export type BodyType = 
  | 'sedan' 
  | 'suv' 
  | 'coupe' 
  | 'convertible' 
  | 'wagon' 
  | 'hatchback' 
  | 'van' 
  | 'pickup' 
  | 'sports';

// Fuel Types
export type FuelType = 
  | 'petrol' 
  | 'diesel' 
  | 'electric' 
  | 'hybrid' 
  | 'plug-in-hybrid' 
  | 'lpg' 
  | 'hydrogen';

// Transmission Types
export type TransmissionType = 'automatic' | 'manual' | 'semi-automatic';

// Drive Types
export type DriveType = 'fwd' | 'rwd' | 'awd' | '4wd';

// Car Status
export type CarStatus = 'available' | 'reserved' | 'sold' | 'coming_soon';

// Car Condition
export type CarCondition = 'new' | 'used' | 'certified_pre_owned';

// Enhanced Car Type
export type Car = {
  id: string;
  title: string;
  slug: string;
  
  // Basic Info
  brand: string;
  model: string;
  variant?: string;
  year: number;
  vin?: string;
  license_plate?: string;
  
  // Pricing
  price: number;
  original_price?: number;
  currency: string;
  price_type?: 'fixed' | 'negotiable' | 'upon_request';
  
  // Classification
  body_type?: BodyType;
  condition?: CarCondition;
  status: CarStatus;
  
  // Technical Specs
  mileage?: number;
  fuel_type?: string;
  transmission?: string;
  drive_type?: DriveType;
  engine_cc?: number;
  power_hp?: number;
  power_kw?: number;
  cylinders?: number;
  
  // Efficiency
  co2_emissions?: number;
  fuel_consumption_combined?: number;
  fuel_consumption_city?: number;
  fuel_consumption_highway?: number;
  efficiency_class?: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
  
  // Appearance
  exterior_color?: string;
  interior_color?: string;
  interior_material?: string;
  color?: string; // Legacy field
  
  // Dimensions
  doors?: number;
  seats?: number;
  trunk_volume?: number;
  weight?: number;
  
  // History
  first_registration?: string;
  last_mfk?: string;
  previous_owners?: number;
  accident_free?: boolean;
  service_history?: boolean;
  
  // Warranty
  warranty_months?: number;
  warranty_km?: number;
  
  // Features (JSONB arrays)
  features?: string[];
  safety_features?: string[];
  comfort_features?: string[];
  technology_features?: string[];
  highlights?: string[];
  
  // Media
  images?: string[];
  thumbnail_url?: string;
  video_url?: string;
  
  // Content
  description?: string;
  
  // Analytics
  views_count?: number;
  favorites_count?: number;
  inquiries_count?: number;
  
  // Timestamps
  created_at: string;
  updated_at?: string;
  published_at?: string;
};

// User Profile
export type Profile = {
  id: string;
  role: 'owner' | 'worker';
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  avatar_url?: string;
};

// Inquiry Types
export type InquiryType = 'general' | 'test_drive' | 'financing' | 'trade_in';
export type InquiryStatus = 'new' | 'contacted' | 'scheduled' | 'converted' | 'closed';

// Enhanced Inquiry/Lead
export type Inquiry = {
  id: string;
  car_id?: string;
  car?: Car; // Joined data
  
  // Customer Info
  customer_name: string;
  email: string;
  phone?: string;
  
  // Inquiry Details
  inquiry_type: InquiryType;
  message?: string;
  
  // Test Drive specific
  preferred_date?: string;
  preferred_time?: string;
  
  // Financing specific
  monthly_budget?: number;
  down_payment?: number;
  
  // Trade-in specific
  trade_in_brand?: string;
  trade_in_model?: string;
  trade_in_year?: number;
  trade_in_mileage?: number;
  
  // Status
  status: InquiryStatus;
  priority?: 'low' | 'medium' | 'high';
  notes?: string;
  
  // Timestamps
  created_at: string;
  updated_at?: string;
  contacted_at?: string;
};

// Legacy Lead type for backwards compatibility
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

// Favorites
export type Favorite = {
  id: string;
  user_id: string;
  car_id: string;
  created_at: string;
};

// Test Drive Booking
export type TestDriveBooking = {
  id: string;
  car_id: string;
  customer_name: string;
  email: string;
  phone: string;
  preferred_date: string;
  preferred_time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  created_at: string;
};

// Financing Request
export type FinancingRequest = {
  id: string;
  car_id: string;
  customer_name: string;
  email: string;
  phone: string;
  monthly_budget?: number;
  down_payment?: number;
  loan_term_months?: number;
  trade_in_value?: number;
  employment_status?: string;
  annual_income?: number;
  status: 'pending' | 'approved' | 'rejected' | 'processing';
  notes?: string;
  created_at: string;
};

// QR Code
export type QRCode = {
  id: string;
  label: string;
  target_url: string;
  scan_count: number;
  created_at: string;
};

// Dealer Settings
export type DealerSettings = {
  id: string;
  business_name: string;
  address: string;
  city: string;
  postal_code: string;
  country: string;
  phone: string;
  email: string;
  website?: string;
  opening_hours?: {
    [key: string]: { open: string; close: string; closed?: boolean };
  };
  about?: string;
  logo_url?: string;
  social_links?: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    linkedin?: string;
  };
};

// ============================================
// FILTER TYPES
// ============================================

export type CarFilters = {
  brand?: string;
  model?: string;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  minMileage?: number;
  maxMileage?: number;
  bodyType?: BodyType[];
  fuelType?: string[];
  transmission?: string[];
  color?: string[];
  features?: string[];
  status?: CarStatus;
  sortBy?: 'price_asc' | 'price_desc' | 'year_desc' | 'year_asc' | 'mileage_asc' | 'mileage_desc' | 'newest';
};

// ============================================
// CONSTANTS
// ============================================

export const CAR_BRANDS = [
  'Aston Martin', 'Audi', 'Bentley', 'BMW', 'Bugatti', 'Chevrolet', 
  'Ferrari', 'Ford', 'Jaguar', 'Lamborghini', 'Land Rover', 'Lexus',
  'Maserati', 'McLaren', 'Mercedes-Benz', 'Porsche', 'Rolls-Royce', 
  'Tesla', 'Volkswagen', 'Volvo'
] as const;

export const BODY_TYPES: { value: BodyType; label: string }[] = [
  { value: 'sedan', label: 'Sedan' },
  { value: 'suv', label: 'SUV' },
  { value: 'coupe', label: 'Coupé' },
  { value: 'convertible', label: 'Convertible' },
  { value: 'wagon', label: 'Wagon' },
  { value: 'hatchback', label: 'Hatchback' },
  { value: 'van', label: 'Van' },
  { value: 'pickup', label: 'Pickup' },
  { value: 'sports', label: 'Sports Car' },
];

export const FUEL_TYPES = [
  { value: 'petrol', label: 'Petrol' },
  { value: 'diesel', label: 'Diesel' },
  { value: 'electric', label: 'Electric' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'plug-in-hybrid', label: 'Plug-in Hybrid' },
];

export const TRANSMISSION_TYPES = [
  { value: 'automatic', label: 'Automatic' },
  { value: 'manual', label: 'Manual' },
  { value: 'semi-automatic', label: 'Semi-Automatic' },
];

export const EXTERIOR_COLORS = [
  'Black', 'White', 'Silver', 'Gray', 'Blue', 'Red', 'Green', 
  'Yellow', 'Orange', 'Brown', 'Beige', 'Gold', 'Purple'
];

// Common Features
export const CAR_FEATURES = [
  'Leather Seats', 'Navigation System', 'Sunroof/Moonroof', 'Heated Seats',
  'Ventilated Seats', 'Parking Sensors', 'Backup Camera', '360° Camera',
  'Blind Spot Monitor', 'Lane Departure Warning', 'Adaptive Cruise Control',
  'Apple CarPlay', 'Android Auto', 'Bluetooth', 'Premium Audio', 
  'Keyless Entry', 'Push Button Start', 'Remote Start', 'Heads-Up Display',
  'LED Headlights', 'Ambient Lighting', 'Power Tailgate', 'Tow Package'
];

// ============================================
// HELPER FUNCTIONS
// ============================================

export const getImageUrl = (imagePath: string): string => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  return supabase.storage.from('car-images').getPublicUrl(imagePath).data.publicUrl;
};

export const formatPrice = (price: number, currency: string = 'CHF'): string => {
  return new Intl.NumberFormat('de-CH', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export const formatMileage = (mileage: number): string => {
  return new Intl.NumberFormat('de-CH').format(mileage) + ' km';
};