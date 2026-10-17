import { NextResponse } from 'next/server';
import { dbStore } from '@/lib/db/store';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone, otp } = body;

    if (!phone) {
      return NextResponse.json({ error: 'Mobile phone number is required.' }, { status: 400 });
    }

    const devOtp = process.env.DEV_OTP_CODE || '123456';
    if (otp && otp !== devOtp) {
      return NextResponse.json({ error: 'Invalid OTP code. Please use 123456 in demo mode.' }, { status: 401 });
    }

    const profile = dbStore.findProfileByPhone(phone);
    if (!profile) {
      return NextResponse.json(
        { error: 'User not registered. Please register first.' },
        { status: 404 }
      );
    }

    const farmerProfile = profile.role === 'farmer' ? dbStore.getFarmerProfile(profile.id) : null;
    const sellerProfile = profile.role === 'seller' ? dbStore.getSellerProfile(profile.id) : null;

    return NextResponse.json({
      success: true,
      profile,
      farmerProfile,
      sellerProfile,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Login error' }, { status: 500 });
  }
}
