import { NextResponse } from 'next/server';
import { dbStore } from '@/lib/db/store';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { listing_id, seller_id, quantity_kg, price_per_kg, proposed_visit_at, message } = body;

    if (!listing_id || !seller_id || !quantity_kg || !price_per_kg) {
      return NextResponse.json({ error: 'Listing, seller, quantity, and price are required.' }, { status: 400 });
    }

    const offer = dbStore.createOffer({
      listing_id,
      seller_id,
      quantity_kg: Number(quantity_kg),
      price_per_kg: Number(price_per_kg),
      proposed_visit_at,
      message: message || '',
    });

    return NextResponse.json({ success: true, offer });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to submit offer' }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { offer_id, status } = body;

    if (!offer_id || !['accepted', 'declined'].includes(status)) {
      return NextResponse.json({ error: 'Valid offer_id and status (accepted | declined) required.' }, { status: 400 });
    }

    const updated = dbStore.updateOfferStatus(offer_id, status);
    return NextResponse.json({ success: true, offer: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update offer' }, { status: 400 });
  }
}
