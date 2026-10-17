export type UserRole = 'farmer' | 'seller' | 'admin';
export type PreferredLanguage = 'en' | 'kn';
export type WeightUnit = 'kg' | 'quintal' | 'tonne';

export type ListingStatus =
  | 'draft'
  | 'posted'
  | 'buyer_interested'
  | 'visit_confirmed'
  | 'partially_sold'
  | 'sold'
  | 'cancelled'
  | 'expired';

export type OfferStatus = 'pending' | 'accepted' | 'declined' | 'withdrawn' | 'expired';
export type VisitStatus = 'proposed' | 'confirmed' | 'completed' | 'no_show' | 'cancelled';
export type NotificationChannel = 'in_app' | 'sms' | 'whatsapp' | 'push';
export type DeliveryStatus = 'queued' | 'sent' | 'failed' | 'mock';
export type PaymentMethod = 'cash' | 'upi' | 'bank_transfer' | 'other';
export type ReportStatus = 'pending' | 'investigating' | 'resolved' | 'dismissed';

export interface Profile {
  id: string;
  role: UserRole;
  full_name: string;
  phone: string;
  language: PreferredLanguage;
  is_verified: boolean;
  is_suspended: boolean;
  created_at: string;
  updated_at: string;
}

export interface FarmerProfile {
  id: string;
  user_id: string;
  village: string;
  taluk: string;
  district: string;
  lat?: number | null;
  lng?: number | null;
  created_at: string;
  updated_at: string;
}

export interface SellerProfile {
  id: string;
  user_id: string;
  shop_name: string;
  license_no?: string | null;
  preferred_crops: string[];
  rating_avg: number;
  rating_count: number;
  created_at: string;
  updated_at: string;
}

export interface Market {
  id: string;
  name_en: string;
  name_kn: string;
  district: string;
  lat: number;
  lng: number;
  is_active: boolean;
}

export interface Crop {
  id: string;
  name_en: string;
  name_kn: string;
  default_unit: WeightUnit;
  icon_name?: string;
  category: string;
}

export interface QualityAssessment {
  grade: 'Grade A' | 'Grade B' | 'Grade C';
  freshness: string;
  uniformity: string;
  defects: string;
  explanation: string;
  is_preliminary: boolean;
  assessed_by: string;
  confirmed_by_farmer: boolean;
}

export interface MarketReferencePrice {
  modal_price_per_kg: number;
  min_price_per_kg: number;
  max_price_per_kg: number;
  price_date: string;
  source_market: string;
  is_available: boolean;
}

export interface CropListing {
  id: string;
  farmer_id: string;
  crop_id: string;
  market_id: string;
  quantity_kg: number;
  quantity_remaining_kg: number;
  price_per_kg: number;
  min_price_per_kg?: number;
  is_negotiable?: boolean;
  entered_quantity: number;
  entered_unit: WeightUnit;
  entered_price: number;
  entered_price_unit: WeightUnit;
  harvest_date: string;
  description?: string;
  status: ListingStatus;
  idempotency_key: string;
  created_at: string;
  updated_at: string;
  
  quality_assessment?: QualityAssessment;
  market_reference?: MarketReferencePrice;

  // Joined relation fields
  crop?: Crop;
  market?: Market;
  farmer?: {
    id: string;
    village: string;
    taluk: string;
    district: string;
    profile: {
      full_name: string;
      phone?: string;
    };
  };
  images?: CropImage[];
  offers?: BuyerOffer[];
}

export interface CropImage {
  id: string;
  listing_id: string;
  storage_path: string;
  position: number;
  created_at: string;
}

export interface BuyerOffer {
  id: string;
  listing_id: string;
  seller_id: string;
  quantity_kg: number;
  price_per_kg: number;
  proposed_visit_at?: string;
  status: OfferStatus;
  message?: string;
  created_at: string;
  updated_at: string;
  
  seller?: {
    id: string;
    shop_name: string;
    rating_avg: number;
    rating_count: number;
    profile: {
      full_name: string;
      phone?: string;
    };
  };
}

export interface VisitBooking {
  id: string;
  offer_id: string;
  scheduled_at: string;
  verification_code: string;
  status: VisitStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  type: string;
  payload: Record<string, unknown>;
  channel: NotificationChannel;
  delivery_status: DeliveryStatus;
  read_at?: string | null;
  created_at: string;
}

export interface Transaction {
  id: string;
  offer_id: string;
  final_quantity_kg: number;
  final_price_per_kg: number;
  total_amount: number;
  payment_method: PaymentMethod;
  completed_at: string;
  created_at: string;
}

export interface Rating {
  id: string;
  transaction_id: string;
  rater_id: string;
  ratee_id: string;
  stars: number;
  comment?: string;
  created_at: string;
}
