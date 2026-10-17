import { NextResponse } from 'next/server';
import { dbStore } from '@/lib/db/store';

export async function GET() {
  try {
    const markets = dbStore.getMarkets();
    const crops = dbStore.getCrops();
    return NextResponse.json({ markets, crops });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
