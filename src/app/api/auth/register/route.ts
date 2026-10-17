import { NextResponse } from 'next/server';
import { dbStore } from '@/lib/db/store';
import { Profile } from '@/types/database';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { role, full_name, phone, language, village, taluk, district, shop_name, license_no, preferred_crops, subscribedMarkets } = body;

    if (!role || !full_name || !phone) {
      return NextResponse.json({ error: 'Role, name, and phone are required.' }, { status: 400 });
    }

    const existing = dbStore.findProfileByPhone(phone);
    if (existing) {
      return NextResponse.json({ error: 'Phone number already registered. Please login.' }, { status: 400 });
    }

    const newProfile: Profile = {
      id: `u-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      role,
      full_name,
      phone,
      language: language || 'kn',
      is_verified: true,
      is_suspended: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const saved = dbStore.createProfile(
      newProfile,
      role === 'farmer' ? { village, taluk, district } : undefined,
      role === 'seller' ? { shop_name, license_no, preferred_crops, subscribedMarkets } : undefined
    );

    const farmerProfile = role === 'farmer' ? dbStore.getFarmerProfile(saved.id) : null;
    const sellerProfile = role === 'seller' ? dbStore.getSellerProfile(saved.id) : null;

    return NextResponse.json({
      success: true,
      profile: saved,
      farmerProfile,
      sellerProfile,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Registration error' }, { status: 500 });
  }
}
