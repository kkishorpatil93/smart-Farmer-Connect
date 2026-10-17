import { NextResponse } from 'next/server';
import { dbStore } from '@/lib/db/store';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const farmer_id = searchParams.get('farmer_id') || undefined;
    const seller_id = searchParams.get('seller_id') || undefined;
    const status = searchParams.get('status') || undefined;

    const visits = dbStore.getVisits({ farmer_id, seller_id, status });
    return NextResponse.json({ success: true, visits });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch visits' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { visit_id, payment_method = 'cash', action } = body;

    if (!visit_id) {
      return NextResponse.json({ error: 'visit_id is required' }, { status: 400 });
    }

    if (action === 'confirm_payment') {
      const transaction = dbStore.confirmPayment(visit_id, payment_method);
      return NextResponse.json({ success: true, transaction });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update visit' }, { status: 400 });
  }
}
