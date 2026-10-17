import { NextResponse } from 'next/server';
import { dbStore } from '@/lib/db/store';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const listing = dbStore.getListingById(params.id);
    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }
    return NextResponse.json({ listing });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
