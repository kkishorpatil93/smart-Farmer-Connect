import { describe, it, expect } from 'vitest';
import { dbStore } from '@/lib/db/store';

describe('Smart Farmer Connect - 4 Simple Steps Workflow Store Integration', () => {
  it('Step 1 & 2: Lists active listings for sellers in matching markets', () => {
    const listings = dbStore.getListings();
    expect(listings.length).toBeGreaterThan(0);
    const first = listings[0];
    expect(first.crop).toBeDefined();
    expect(first.market).toBeDefined();
    expect(first.price_per_kg).toBeGreaterThan(0);
  });

  it('Step 3: Compares real offers and populates seller details', () => {
    const offers = dbStore.getOffers();
    expect(offers.length).toBeGreaterThan(0);
    const offer = offers[0];
    expect(offer.id).toBeDefined();
    expect(offer.price_per_kg).toBeGreaterThan(0);
    expect(offer.seller?.shop_name).toBeDefined();
    expect(offer.listing?.crop?.name_en).toBeDefined();
  });

  it('Step 4: Confirmed visits contain APMC verification codes and payment tracking', () => {
    const visits = dbStore.getVisits();
    expect(visits.length).toBeGreaterThan(0);
    const visit = visits[0];
    expect(visit.verification_code).toMatch(/^APMC-\d+/);
    expect(visit.status).toBeDefined();
    expect(visit.offer).toBeDefined();
    expect(visit.listing).toBeDefined();
  });

  it('Step 4: Confirming payment records transaction and completes deal', () => {
    const visits = dbStore.getVisits();
    expect(visits.length).toBeGreaterThan(0);
    const visitId = visits[0].id;
    const tx = dbStore.confirmPayment(visitId, 'upi');
    expect(tx.id).toBeDefined();
    expect(tx.payment_method).toBe('upi');
    expect(tx.total_amount).toBeGreaterThan(0);

    // Re-fetch visits and verify completed status
    const updatedVisits = dbStore.getVisits();
    const updatedVisit = updatedVisits.find((v) => v.id === visitId);
    expect(updatedVisit?.status).toBe('completed');
  });
});
