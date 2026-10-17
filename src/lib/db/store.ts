import fs from 'fs';
import path from 'path';
import {
  Profile,
  FarmerProfile,
  SellerProfile,
  Market,
  Crop,
  CropListing,
  BuyerOffer,
  NotificationItem,
  VisitBooking,
  Transaction,
  Rating,
} from '@/types/database';

interface DatabaseSchema {
  profiles: Profile[];
  farmerProfiles: FarmerProfile[];
  sellerProfiles: (SellerProfile & { subscribedMarkets: string[] })[];
  markets: Market[];
  crops: Crop[];
  listings: CropListing[];
  offers: BuyerOffer[];
  notifications: NotificationItem[];
  visitBookings: VisitBooking[];
  transactions: Transaction[];
  ratings: Rating[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Initial seed data adhering to Karnataka APMC specifications
const INITIAL_SEED: DatabaseSchema = {
  markets: [
    {
      id: 'm0000001-0000-0000-0000-000000000001',
      name_en: 'Hubballi APMC (Amaragol)',
      name_kn: 'ಹುಬ್ಬಳ್ಳಿ ಎಪಿಎಂಸಿ (ಅಮರಗೋಳ)',
      district: 'Dharwad',
      lat: 15.3921,
      lng: 75.1054,
      is_active: true,
    },
    {
      id: 'm0000001-0000-0000-0000-000000000002',
      name_en: 'Belagavi APMC',
      name_kn: 'ಬೆಳಗಾವಿ ಎಪಿಎಂಸಿ',
      district: 'Belagavi',
      lat: 15.8497,
      lng: 74.4977,
      is_active: true,
    },
    {
      id: 'm0000001-0000-0000-0000-000000000003',
      name_en: 'Bengaluru Yeshwanthpur APMC',
      name_kn: 'ಬೆಂಗಳೂರು ಯಶವಂತಪುರ ಎಪಿಎಂಸಿ',
      district: 'Bengaluru Urban',
      lat: 13.0238,
      lng: 77.5529,
      is_active: true,
    },
    {
      id: 'm0000001-0000-0000-0000-000000000004',
      name_en: 'Mysuru Bandipalya APMC',
      name_kn: 'ಮೈಸೂರು ಬಂಡಿಪಾಳ್ಯ ಎಪಿಎಂಸಿ',
      district: 'Mysuru',
      lat: 12.2829,
      lng: 76.6663,
      is_active: true,
    },
    {
      id: 'm0000001-0000-0000-0000-000000000005',
      name_en: 'Gadag APMC',
      name_kn: 'ಗದಗ ಎಪಿಎಂಸಿ',
      district: 'Gadag',
      lat: 15.4312,
      lng: 75.6358,
      is_active: true,
    },
    {
      id: 'm0000001-0000-0000-0000-000000000006',
      name_en: 'Davanagere APMC',
      name_kn: 'ದಾವಣಗೆರೆ ಎಪಿಎಂಸಿ',
      district: 'Davanagere',
      lat: 14.4644,
      lng: 75.9218,
      is_active: true,
    },
    {
      id: 'm0000001-0000-0000-0000-000000000007',
      name_en: 'Shivamogga APMC',
      name_kn: 'ಶಿವಮೊಗ್ಗ ಎಪಿಎಂಸಿ',
      district: 'Shivamogga',
      lat: 13.9299,
      lng: 75.5681,
      is_active: true,
    },
    {
      id: 'm0000001-0000-0000-0000-000000000008',
      name_en: 'Kalaburagi APMC',
      name_kn: 'ಕಲಬುರಗಿ ಎಪಿಎಂಸಿ',
      district: 'Kalaburagi',
      lat: 17.3297,
      lng: 76.8343,
      is_active: true,
    },
  ],
  crops: [
    {
      id: 'c0000001-0000-0000-0000-000000000001',
      name_en: 'Tomato',
      name_kn: 'ಟೊಮೆಟೊ',
      default_unit: 'quintal',
      icon_name: '🍅',
      category: 'vegetable',
    },
    {
      id: 'c0000001-0000-0000-0000-000000000002',
      name_en: 'Onion',
      name_kn: 'ಈರುಳ್ಳಿ',
      default_unit: 'quintal',
      icon_name: '🧅',
      category: 'vegetable',
    },
    {
      id: 'c0000001-0000-0000-0000-000000000003',
      name_en: 'Potato',
      name_kn: 'ಆಲೂಗಡ್ಡೆ',
      default_unit: 'quintal',
      icon_name: '🥔',
      category: 'vegetable',
    },
    {
      id: 'c0000001-0000-0000-0000-000000000004',
      name_en: 'Rice (Paddy)',
      name_kn: 'ಭತ್ತ / ಅಕ್ಕಿ',
      default_unit: 'quintal',
      icon_name: '🌾',
      category: 'grain',
    },
    {
      id: 'c0000001-0000-0000-0000-000000000005',
      name_en: 'Maize',
      name_kn: 'ಮೆಕ್ಕೆಜೋಳ',
      default_unit: 'quintal',
      icon_name: '🌽',
      category: 'grain',
    },
    {
      id: 'c0000001-0000-0000-0000-000000000006',
      name_en: 'Green Chilli',
      name_kn: 'ಹಸಿ ಮೆಣಸಿನಕಾಯಿ',
      default_unit: 'kg',
      icon_name: '🌶️',
      category: 'vegetable',
    },
    {
      id: 'c0000001-0000-0000-0000-000000000007',
      name_en: 'Cotton',
      name_kn: 'ಹತ್ತಿ',
      default_unit: 'quintal',
      icon_name: '☁️',
      category: 'commercial',
    },
    {
      id: 'c0000001-0000-0000-0000-000000000008',
      name_en: 'Groundnut',
      name_kn: 'ಕಡಲೆಕಾಯಿ',
      default_unit: 'quintal',
      icon_name: '🥜',
      category: 'oilseed',
    },
  ],
  profiles: [
    {
      id: 'u0000001-0000-0000-0000-000000000001',
      role: 'farmer',
      full_name: 'Basavaraj Patil (ಬಸವರಾಜ ಪಾಟೀಲ)',
      phone: '+919845011111',
      language: 'kn',
      is_verified: true,
      is_suspended: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'u0000001-0000-0000-0000-000000000002',
      role: 'farmer',
      full_name: 'Ningappa Gowda (ನಿಂಗಪ್ಪ ಗೌಡ)',
      phone: '+919845022222',
      language: 'kn',
      is_verified: true,
      is_suspended: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'u0000002-0000-0000-0000-000000000001',
      role: 'seller',
      full_name: 'Suresh Kumar',
      phone: '+919845044444',
      language: 'kn',
      is_verified: true,
      is_suspended: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'u0000002-0000-0000-0000-000000000002',
      role: 'seller',
      full_name: 'Anand Kulkarni',
      phone: '+919845055555',
      language: 'kn',
      is_verified: true,
      is_suspended: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  farmerProfiles: [
    {
      id: 'f0000001-0000-0000-0000-000000000001',
      user_id: 'u0000001-0000-0000-0000-000000000001',
      village: 'Konnur',
      taluk: 'Gokak',
      district: 'Belagavi',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'f0000001-0000-0000-0000-000000000002',
      user_id: 'u0000001-0000-0000-0000-000000000002',
      village: 'Annigeri',
      taluk: 'Navalgund',
      district: 'Dharwad',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  sellerProfiles: [
    {
      id: 's0000001-0000-0000-0000-000000000001',
      user_id: 'u0000002-0000-0000-0000-000000000001',
      shop_name: 'Suresh Agro Traders',
      license_no: 'APMC-HUB-2024-88',
      preferred_crops: ['Tomato', 'Onion', 'Potato'],
      rating_avg: 4.8,
      rating_count: 24,
      subscribedMarkets: ['m0000001-0000-0000-0000-000000000001'], // Hubballi APMC
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 's0000001-0000-0000-0000-000000000002',
      user_id: 'u0000002-0000-0000-0000-000000000002',
      shop_name: 'Annapurna Veg Syndicate',
      license_no: 'APMC-HUB-2023-14',
      preferred_crops: ['Tomato', 'Green Chilli'],
      rating_avg: 4.65,
      rating_count: 18,
      subscribedMarkets: ['m0000001-0000-0000-0000-000000000001'], // Hubballi APMC
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  listings: [
    {
      id: 'l0000001-0000-0000-0000-000000000001',
      farmer_id: 'f0000001-0000-0000-0000-000000000001',
      crop_id: 'c0000001-0000-0000-0000-000000000001', // Tomato
      market_id: 'm0000001-0000-0000-0000-000000000001', // Hubballi APMC
      quantity_kg: 500,
      quantity_remaining_kg: 500,
      price_per_kg: 22,
      entered_quantity: 5,
      entered_unit: 'quintal',
      entered_price: 2200,
      entered_price_unit: 'quintal',
      harvest_date: new Date().toISOString().split('T')[0],
      description: 'Grade-A fresh red round tomatoes harvested this morning. Firm and clean.',
      status: 'posted',
      idempotency_key: 'i0000001-0000-0000-0000-000000000001',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      images: [
        {
          id: 'img-1',
          listing_id: 'l0000001-0000-0000-0000-000000000001',
          storage_path: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
          position: 1,
          created_at: new Date().toISOString(),
        },
      ],
    },
  ],
  offers: [],
  notifications: [],
  visitBookings: [],
  transactions: [],
  ratings: [],
};

function ensureDbFile(): DatabaseSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_SEED, null, 2), 'utf-8');
    return INITIAL_SEED;
  }

  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading db.json, falling back to seed:', err);
    return INITIAL_SEED;
  }
}

function saveDb(data: DatabaseSchema) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

export const dbStore = {
  getSnapshot(): DatabaseSchema {
    return ensureDbFile();
  },

  // Users & Profiles
  findProfileByPhone(phone: string): Profile | undefined {
    const db = ensureDbFile();
    return db.profiles.find((p) => p.phone === phone);
  },

  findProfileById(id: string): Profile | undefined {
    const db = ensureDbFile();
    return db.profiles.find((p) => p.id === id);
  },

  getFarmerProfile(userId: string): FarmerProfile | undefined {
    const db = ensureDbFile();
    return db.farmerProfiles.find((f) => f.user_id === userId);
  },

  getSellerProfile(userId: string): (SellerProfile & { subscribedMarkets: string[] }) | undefined {
    const db = ensureDbFile();
    return db.sellerProfiles.find((s) => s.user_id === userId);
  },

  createProfile(profile: Profile, farmerData?: Partial<FarmerProfile>, sellerData?: Partial<SellerProfile> & { subscribedMarkets?: string[] }) {
    const db = ensureDbFile();
    db.profiles.push(profile);

    if (profile.role === 'farmer' && farmerData) {
      db.farmerProfiles.push({
        id: `f-${Date.now()}`,
        user_id: profile.id,
        village: farmerData.village || '',
        taluk: farmerData.taluk || '',
        district: farmerData.district || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }

    if (profile.role === 'seller' && sellerData) {
      db.sellerProfiles.push({
        id: `s-${Date.now()}`,
        user_id: profile.id,
        shop_name: sellerData.shop_name || '',
        license_no: sellerData.license_no || null,
        preferred_crops: sellerData.preferred_crops || [],
        rating_avg: 5.0,
        rating_count: 0,
        subscribedMarkets: sellerData.subscribedMarkets || [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }

    saveDb(db);
    return profile;
  },

  // Master Data
  getMarkets(): Market[] {
    const db = ensureDbFile();
    return db.markets;
  },

  getCrops(): Crop[] {
    const db = ensureDbFile();
    return db.crops;
  },

  // Listings
  getListings(filter?: { farmer_id?: string; market_id?: string; status?: string }): CropListing[] {
    const db = ensureDbFile();
    let res = [...db.listings];

    if (filter?.farmer_id) {
      res = res.filter((l) => l.farmer_id === filter.farmer_id);
    }
    if (filter?.market_id) {
      res = res.filter((l) => l.market_id === filter.market_id);
    }
    if (filter?.status) {
      res = res.filter((l) => l.status === filter.status);
    }

    // Attach joined metadata
    return res.map((l) => {
      const crop = db.crops.find((c) => c.id === l.crop_id);
      const market = db.markets.find((m) => m.id === l.market_id);
      const farmerProf = db.farmerProfiles.find((f) => f.id === l.farmer_id);
      const userProf = farmerProf ? db.profiles.find((p) => p.id === farmerProf.user_id) : undefined;
      const offers = db.offers.filter((o) => o.listing_id === l.id);

      return {
        ...l,
        crop,
        market,
        farmer: farmerProf && userProf ? {
          id: farmerProf.id,
          village: farmerProf.village,
          taluk: farmerProf.taluk,
          district: farmerProf.district,
          profile: {
            full_name: userProf.full_name,
            phone: userProf.phone,
          },
        } : undefined,
        offers,
      };
    }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  getListingById(id: string): CropListing | undefined {
    const listings = this.getListings();
    return listings.find((l) => l.id === id);
  },

  createListing(listingData: Omit<CropListing, 'id' | 'created_at' | 'updated_at' | 'status' | 'quantity_remaining_kg'>): CropListing {
    const db = ensureDbFile();

    // Check duplicate within 10 minutes
    const tenMinutesAgo = Date.now() - 10 * 60 * 1000;
    const isDuplicate = db.listings.some(
      (l) =>
        l.farmer_id === listingData.farmer_id &&
        l.crop_id === listingData.crop_id &&
        l.market_id === listingData.market_id &&
        l.entered_quantity === listingData.entered_quantity &&
        new Date(l.created_at).getTime() > tenMinutesAgo
    );

    if (isDuplicate) {
      throw new Error('Duplicate listing: An identical crop was already posted in the last 10 minutes.');
    }

    const newListing: CropListing = {
      ...listingData,
      id: `l-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      status: 'posted',
      quantity_remaining_kg: listingData.quantity_kg,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    db.listings.push(newListing);

    // Matching Engine (Section 4.3):
    // Find all sellers subscribed to the listing's APMC market
    const matchingSellers = db.sellerProfiles.filter((s) =>
      s.subscribedMarkets.includes(listingData.market_id)
    );

    const cropObj = db.crops.find((c) => c.id === listingData.crop_id);
    const marketObj = db.markets.find((m) => m.id === listingData.market_id);
    const farmerProf = db.farmerProfiles.find((f) => f.id === listingData.farmer_id);
    const farmerUser = farmerProf ? db.profiles.find((p) => p.id === farmerProf.user_id) : undefined;

    // Dispatch in-app notifications to matching sellers
    matchingSellers.forEach((seller) => {
      const isPreferredCrop = cropObj ? seller.preferred_crops.includes(cropObj.name_en) : false;

      const notif: NotificationItem = {
        id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        user_id: seller.user_id,
        type: 'new_crop_listing',
        channel: 'in_app',
        delivery_status: 'sent',
        read_at: null,
        created_at: new Date().toISOString(),
        payload: {
          listing_id: newListing.id,
          crop_name: cropObj ? cropObj.name_en : 'Crop',
          crop_name_kn: cropObj ? cropObj.name_kn : 'ಬೆಳೆ',
          quantity: newListing.entered_quantity,
          unit: newListing.entered_unit,
          expected_price: newListing.entered_price,
          market_name: marketObj ? marketObj.name_en : 'APMC',
          farmer_name: farmerUser ? farmerUser.full_name.split(' ')[0] : 'Farmer',
          village: farmerProf ? farmerProf.village : '',
          is_preferred_crop: isPreferredCrop,
        },
      };

      db.notifications.push(notif);
    });

    saveDb(db);
    return newListing;
  },

  // Offers
  createOffer(offerData: Omit<BuyerOffer, 'id' | 'created_at' | 'updated_at' | 'status'>): BuyerOffer {
    const db = ensureDbFile();
    const listing = db.listings.find((l) => l.id === offerData.listing_id);

    if (!listing) {
      throw new Error('Listing not found');
    }

    if (['sold', 'cancelled', 'expired'].includes(listing.status)) {
      throw new Error(`Cannot submit an offer on a ${listing.status} listing.`);
    }

    const newOffer: BuyerOffer = {
      ...offerData,
      id: `offer-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    db.offers.push(newOffer);

    // Update listing status to 'buyer_interested' if currently 'posted'
    if (listing.status === 'posted') {
      listing.status = 'buyer_interested';
      listing.updated_at = new Date().toISOString();
    }

    // Send notification to the farmer
    const farmerProf = db.farmerProfiles.find((f) => f.id === listing.farmer_id);
    const sellerProf = db.sellerProfiles.find((s) => s.id === offerData.seller_id);

    if (farmerProf) {
      db.notifications.push({
        id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        user_id: farmerProf.user_id,
        type: 'offer_received',
        channel: 'in_app',
        delivery_status: 'sent',
        read_at: null,
        created_at: new Date().toISOString(),
        payload: {
          listing_id: listing.id,
          offer_id: newOffer.id,
          shop_name: sellerProf ? sellerProf.shop_name : 'APMC Trader',
          offered_price_per_kg: offerData.price_per_kg,
          quantity_kg: offerData.quantity_kg,
          proposed_visit_at: offerData.proposed_visit_at,
        },
      });
    }

    saveDb(db);
    return newOffer;
  },

  updateOfferStatus(offerId: string, targetStatus: 'accepted' | 'declined'): BuyerOffer {
    const db = ensureDbFile();
    const offer = db.offers.find((o) => o.id === offerId);

    if (!offer) {
      throw new Error('Offer not found');
    }

    const listing = db.listings.find((l) => l.id === offer.listing_id);
    if (!listing) {
      throw new Error('Associated listing not found');
    }

    if (targetStatus === 'accepted') {
      // Calculate current sum of accepted offers excluding this one
      const currentlyAcceptedKg = db.offers
        .filter((o) => o.listing_id === listing.id && o.status === 'accepted' && o.id !== offer.id)
        .reduce((sum, o) => sum + o.quantity_kg, 0);

      const availableKg = listing.quantity_kg - currentlyAcceptedKg;

      if (offer.quantity_kg > availableKg) {
        throw new Error(
          `Cannot accept offer: requested ${offer.quantity_kg} kg, but only ${availableKg} kg remaining of ${listing.quantity_kg} kg total.`
        );
      }

      offer.status = 'accepted';
      offer.updated_at = new Date().toISOString();

      const newRemainingKg = availableKg - offer.quantity_kg;
      listing.quantity_remaining_kg = newRemainingKg;

      if (newRemainingKg === 0) {
        listing.status = 'visit_confirmed'; // Fully allocated
      } else {
        listing.status = 'partially_sold';
      }
      listing.updated_at = new Date().toISOString();

      // Create Visit Booking if not already present
      if (!db.visitBookings) db.visitBookings = [];
      const existingVisit = db.visitBookings.find((v) => v.offer_id === offer.id);
      if (!existingVisit) {
        db.visitBookings.push({
          id: `visit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          offer_id: offer.id,
          scheduled_at: offer.proposed_visit_at || new Date(Date.now() + 86400000).toISOString(),
          verification_code: `APMC-${Math.floor(1000 + Math.random() * 9000)}`,
          status: 'confirmed',
          notes: 'APMC market yard weighment and inspection scheduled.',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }

      // Notify the accepted seller
      const sellerProf = db.sellerProfiles.find((s) => s.id === offer.seller_id);
      if (sellerProf) {
        db.notifications.push({
          id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          user_id: sellerProf.user_id,
          type: 'offer_accepted',
          channel: 'in_app',
          delivery_status: 'sent',
          read_at: null,
          created_at: new Date().toISOString(),
          payload: {
            listing_id: listing.id,
            offer_id: offer.id,
            accepted_kg: offer.quantity_kg,
            price_per_kg: offer.price_per_kg,
          },
        });
      }
    } else if (targetStatus === 'declined') {
      offer.status = 'declined';
      offer.updated_at = new Date().toISOString();
    }

    saveDb(db);
    return offer;
  },

  // Offers
  getOffers(filter?: { farmer_id?: string; seller_id?: string; listing_id?: string; status?: string }): BuyerOffer[] {
    const db = ensureDbFile();
    let offers = [...db.offers];

    if (filter?.listing_id) {
      offers = offers.filter((o) => o.listing_id === filter.listing_id);
    }
    if (filter?.seller_id) {
      offers = offers.filter((o) => o.seller_id === filter.seller_id);
    }
    if (filter?.status) {
      offers = offers.filter((o) => o.status === filter.status);
    }

    const populated = offers.map((o) => {
      const listing = db.listings.find((l) => l.id === o.listing_id);
      const seller = db.sellerProfiles.find((s) => s.id === o.seller_id);
      const sellerUser = seller ? db.profiles.find((p) => p.id === seller.user_id) : undefined;
      const crop = listing ? db.crops.find((c) => c.id === listing.crop_id) : undefined;
      const market = listing ? db.markets.find((m) => m.id === listing.market_id) : undefined;
      const farmer = listing ? db.farmerProfiles.find((f) => f.id === listing.farmer_id) : undefined;
      const farmerUser = farmer ? db.profiles.find((p) => p.id === farmer.user_id) : undefined;

      return {
        ...o,
        listing: listing
          ? {
              ...listing,
              crop,
              market,
              farmer:
                farmer && farmerUser
                  ? {
                      ...farmer,
                      profile: {
                        full_name: farmerUser.full_name,
                        phone: farmerUser.phone,
                      },
                    }
                  : undefined,
            }
          : undefined,
        seller: seller
          ? {
              id: seller.id,
              shop_name: seller.shop_name,
              rating_avg: seller.rating_avg,
              rating_count: seller.rating_count,
              profile: sellerUser
                ? {
                    full_name: sellerUser.full_name,
                    phone: sellerUser.phone,
                  }
                : undefined,
            }
          : undefined,
      };
    });

    let result = populated;
    if (filter?.farmer_id) {
      result = result.filter((o) => o.listing?.farmer_id === filter.farmer_id);
    }

    return result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  // Visits & Bookings
  getVisits(filter?: { farmer_id?: string; seller_id?: string; status?: string }): VisitBooking[] {
    const db = ensureDbFile();
    if (!db.visitBookings) db.visitBookings = [];

    // Ensure every accepted offer has a visit booking
    db.offers
      .filter((o) => o.status === 'accepted')
      .forEach((offer) => {
        let booking = db.visitBookings.find((v) => v.offer_id === offer.id);
        if (!booking) {
          booking = {
            id: `visit-${offer.id}`,
            offer_id: offer.id,
            scheduled_at: offer.proposed_visit_at || new Date(Date.now() + 86400000).toISOString(),
            verification_code: `APMC-${Math.abs(
              offer.id.split('').reduce((a, b) => (a << 5) - a + b.charCodeAt(0), 0) % 9000
            ) + 1000}`,
            status: 'confirmed',
            notes: 'APMC market yard weighment and inspection scheduled.',
            created_at: offer.updated_at || offer.created_at,
            updated_at: offer.updated_at || offer.created_at,
          };
          db.visitBookings.push(booking);
        }
      });
    saveDb(db);

    const populated: VisitBooking[] = db.visitBookings.map((v) => {
      const offer = db.offers.find((o) => o.id === v.offer_id);
      const listing = offer ? db.listings.find((l) => l.id === offer.listing_id) : undefined;
      const crop = listing ? db.crops.find((c) => c.id === listing.crop_id) : undefined;
      const market = listing ? db.markets.find((m) => m.id === listing.market_id) : undefined;
      const seller = offer ? db.sellerProfiles.find((s) => s.id === offer.seller_id) : undefined;
      const sellerUser = seller ? db.profiles.find((p) => p.id === seller.user_id) : undefined;
      const farmer = listing ? db.farmerProfiles.find((f) => f.id === listing.farmer_id) : undefined;
      const farmerUser = farmer ? db.profiles.find((p) => p.id === farmer.user_id) : undefined;
      const transaction = db.transactions ? db.transactions.find((t) => t.offer_id === v.offer_id) : undefined;

      return {
        ...v,
        offer: offer
          ? {
              ...offer,
              seller: seller
                ? {
                    id: seller.id,
                    shop_name: seller.shop_name,
                    rating_avg: seller.rating_avg,
                    rating_count: seller.rating_count,
                    profile: sellerUser
                      ? {
                          full_name: sellerUser.full_name,
                          phone: sellerUser.phone,
                        }
                      : undefined,
                  }
                : undefined,
            }
          : undefined,
        listing: listing
          ? {
              ...listing,
              crop,
              market,
              farmer:
                farmer && farmerUser
                  ? {
                      ...farmer,
                      profile: {
                        full_name: farmerUser.full_name,
                        phone: farmerUser.phone,
                      },
                    }
                  : undefined,
            }
          : undefined,
        transaction,
      };
    });

    let result = populated;
    if (filter?.farmer_id) {
      result = result.filter((v) => v.listing?.farmer_id === filter.farmer_id);
    }
    if (filter?.seller_id) {
      result = result.filter((v) => v.offer?.seller_id === filter.seller_id);
    }
    if (filter?.status) {
      result = result.filter((v) => v.status === filter.status);
    }

    return result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  confirmPayment(visitId: string, paymentMethod: 'cash' | 'upi' | 'bank_transfer' = 'cash'): Transaction {
    const db = ensureDbFile();
    if (!db.transactions) db.transactions = [];

    const visit = db.visitBookings.find((v) => v.id === visitId);
    if (!visit) throw new Error('Visit booking not found');

    const offer = db.offers.find((o) => o.id === visit.offer_id);
    if (!offer) throw new Error('Associated offer not found');

    let transaction = db.transactions.find((t) => t.offer_id === offer.id);
    if (!transaction) {
      transaction = {
        id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        offer_id: offer.id,
        final_quantity_kg: offer.quantity_kg,
        final_price_per_kg: offer.price_per_kg,
        total_amount: Number((offer.quantity_kg * offer.price_per_kg).toFixed(2)),
        payment_method: paymentMethod,
        completed_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      };
      db.transactions.push(transaction);
      visit.status = 'completed';
      visit.updated_at = new Date().toISOString();
      saveDb(db);
    }
    return transaction;
  },

  // Notifications
  getNotifications(userId: string): NotificationItem[] {
    const db = ensureDbFile();
    return db.notifications
      .filter((n) => n.user_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  markNotificationsAsRead(userId: string) {
    const db = ensureDbFile();
    let updated = false;
    db.notifications.forEach((n) => {
      if (n.user_id === userId && !n.read_at) {
        n.read_at = new Date().toISOString();
        updated = true;
      }
    });
    if (updated) {
      saveDb(db);
    }
  },
};
