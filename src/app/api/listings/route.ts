import { NextResponse } from 'next/server';
import { dbStore } from '@/lib/db/store';
import { normalizeToKg, normalizePricePerKg } from '@/lib/utils/units';
import { assessCropQuality } from '@/lib/services/quality';
import { getMarketReferencePrice } from '@/lib/services/mandi-price';
import { CropImage } from '@/types/database';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const farmer_id = searchParams.get('farmer_id') || undefined;
    const market_id = searchParams.get('market_id') || undefined;
    const status = searchParams.get('status') || undefined;

    const listings = dbStore.getListings({ farmer_id, market_id, status });
    return NextResponse.json({ listings });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      farmer_id,
      crop_id,
      market_id,
      entered_quantity,
      entered_unit,
      entered_price,
      entered_price_unit,
      min_price,
      is_negotiable,
      harvest_date,
      description,
      photos, // Array of 1-5 photos (base64 or URLs)
      image_url, // Legacy fallback
      farmer_confirmed_grade,
    } = body;

    if (!farmer_id || !crop_id || !market_id || !entered_quantity || !entered_price || !entered_unit || !entered_price_unit || !harvest_date) {
      return NextResponse.json({ error: 'All fields marked * are required.' }, { status: 400 });
    }

    const quantity_kg = normalizeToKg(Number(entered_quantity), entered_unit);
    const price_per_kg = normalizePricePerKg(Number(entered_price), entered_price_unit);

    let min_price_per_kg: number | undefined = undefined;
    if (min_price) {
      min_price_per_kg = normalizePricePerKg(Number(min_price), entered_price_unit);
    }

    // Get crop & market metadata for price prediction & quality assessment
    const crops = dbStore.getCrops();
    const markets = dbStore.getMarkets();
    const crop = crops.find((c) => c.id === crop_id);
    const market = markets.find((m) => m.id === market_id);

    const cropName = crop ? crop.name_en : 'Crop';
    const marketName = market ? market.name_en : 'APMC';

    // 1. Photo Array Normalization (1-5 photos)
    const rawPhotos: string[] = Array.isArray(photos) && photos.length > 0 
      ? photos.slice(0, 5) 
      : (image_url ? [image_url] : ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80']);

    const images: CropImage[] = rawPhotos.map((photoUrl, index) => ({
      id: `img-${Date.now()}-${index}`,
      listing_id: '',
      storage_path: photoUrl,
      position: index + 1,
      created_at: new Date().toISOString(),
    }));

    // 2. Crop Quality Assessment
    const quality_assessment = await assessCropQuality({
      cropName,
      photos: rawPhotos,
      userNotes: description,
      farmerConfirmedGrade: farmer_confirmed_grade,
    });

    // 3. Mandi Market Price Intelligence (Verified Agmarknet / APMC Data)
    const market_reference = getMarketReferencePrice(cropName, marketName) || undefined;

    const idempotency_key = `key-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

    const newListing = dbStore.createListing({
      farmer_id,
      crop_id,
      market_id,
      entered_quantity: Number(entered_quantity),
      entered_unit,
      entered_price: Number(entered_price),
      entered_price_unit,
      quantity_kg,
      price_per_kg,
      min_price_per_kg,
      is_negotiable: Boolean(is_negotiable),
      harvest_date,
      description: description || '',
      idempotency_key,
      images,
      quality_assessment,
      market_reference,
    });

    return NextResponse.json({ success: true, listing: newListing });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create listing' }, { status: 400 });
  }
}
