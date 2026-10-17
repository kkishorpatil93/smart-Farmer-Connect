/**
 * Complete End-to-End Workflow Verification Script
 * Simulates:
 * 1. Farmer login (Basavaraj Patil)
 * 2. Farmer posting a new crop lot (Bellary Pink Onion, 10 quintals at ₹2800/quintal)
 * 3. Seller login (Suresh Agro Traders)
 * 4. Seller receiving notification & finding the listing in matching feed
 * 5. Seller making a bid (600 kg at ₹29/kg)
 * 6. Farmer accepting the bid, unlocking contact details, updating status to partially_sold
 * 7. Attempting over-allocation (trying to accept more than available quantity) to verify safety.
 */

async function runE2ETest() {
  const baseUrl = 'http://localhost:3000';
  console.log('🚀 Starting Smart Farmer Connect End-to-End Test...\n');

  // Step 1: Farmer Login
  console.log('1️⃣ Logging in as Farmer (Basavaraj Patil)...');
  const farmerLoginRes = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone: '+919845011111', otp: '123456' }),
  });
  const farmerData = await farmerLoginRes.json();
  if (!farmerLoginRes.ok || !farmerData.farmerProfile) {
    throw new Error(`Farmer login failed: ${JSON.stringify(farmerData)}`);
  }
  const farmerId = farmerData.farmerProfile.id;
  console.log(`✅ Farmer logged in: ${farmerData.profile.full_name} (Farmer ID: ${farmerId})`);

  // Step 2: Farmer Posts a New Crop Lot
  const testQuantity = Math.floor(Math.random() * 20) + 5;
  console.log(`\n2️⃣ Farmer posting new crop lot: Potato (${testQuantity} Quintals at ₹1,900/quintal)...`);
  const postRes = await fetch(`${baseUrl}/api/listings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      farmer_id: farmerId,
      crop_id: 'c0000001-0000-0000-0000-000000000003', // Potato
      market_id: 'm0000001-0000-0000-0000-000000000001', // Hubballi APMC
      entered_quantity: testQuantity,
      entered_unit: 'quintal',
      entered_price: 1900,
      entered_price_unit: 'quintal',
      harvest_date: new Date().toISOString().split('T')[0],
      description: 'Jyoti variety table potato, uniform medium size, minimal mud.',
    }),
  });
  const postData = await postRes.json();
  if (!postRes.ok) {
    throw new Error(`Post listing failed: ${JSON.stringify(postData)}`);
  }
  const newListingId = postData.listing.id;
  console.log(`✅ Listing created successfully! ID: ${newListingId}`);
  console.log(`   Normalized Quantity: ${postData.listing.quantity_kg} kg`);
  console.log(`   Normalized Price: ₹${postData.listing.price_per_kg}/kg`);

  // Step 3: Seller Login
  console.log('\n3️⃣ Logging in as APMC Trader (Suresh Agro Traders)...');
  const sellerLoginRes = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone: '+919845044444', otp: '123456' }),
  });
  const sellerData = await sellerLoginRes.json();
  if (!sellerLoginRes.ok || !sellerData.sellerProfile) {
    throw new Error(`Seller login failed: ${JSON.stringify(sellerData)}`);
  }
  const sellerId = sellerData.sellerProfile.id;
  console.log(`✅ Trader logged in: ${sellerData.sellerProfile.shop_name} (Trader ID: ${sellerId})`);

  // Step 4: Verify Seller Received In-App Notification
  console.log('\n4️⃣ Checking in-app notifications for Suresh Agro Traders...');
  const notifRes = await fetch(`${baseUrl}/api/notifications?userId=${sellerData.profile.id}`);
  const notifData = await notifRes.json();
  const matchingNotif = notifData.notifications.find(
    (n) => n.payload?.listing_id === newListingId
  );
  if (!matchingNotif) {
    throw new Error('❌ Notification not found for matching seller!');
  }
  console.log(`✅ Notification received by seller!`);
  console.log(`   Alert: New ${matchingNotif.payload.crop_name} (${matchingNotif.payload.quantity} ${matchingNotif.payload.unit}) in ${matchingNotif.payload.market_name}`);

  const totalKg = testQuantity * 100;
  const firstOfferKg = Math.floor(totalKg * 0.6);
  const expectedRemaining = totalKg - firstOfferKg;

  // Step 5: Seller Submits an Offer
  console.log(`\n5️⃣ Seller submitting purchase offer: ${firstOfferKg} kg at ₹29.00/kg...`);
  const offerRes = await fetch(`${baseUrl}/api/offers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      listing_id: newListingId,
      seller_id: sellerId,
      quantity_kg: firstOfferKg,
      price_per_kg: 29.0,
      proposed_visit_at: new Date(Date.now() + 86400000).toISOString(),
      message: 'Can pick up tomorrow morning from Hubballi yard with our transport.',
    }),
  });
  const offerData = await offerRes.json();
  if (!offerRes.ok) {
    throw new Error(`Offer submission failed: ${JSON.stringify(offerData)}`);
  }
  const offerId = offerData.offer.id;
  console.log(`✅ Offer created successfully! Offer ID: ${offerId}`);

  // Step 6: Farmer Accepts Offer
  console.log('\n6️⃣ Farmer reviewing and accepting offer from Suresh Agro Traders...');
  const acceptRes = await fetch(`${baseUrl}/api/offers`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ offer_id: offerId, status: 'accepted' }),
  });
  const acceptData = await acceptRes.json();
  if (!acceptRes.ok) {
    throw new Error(`Accepting offer failed: ${JSON.stringify(acceptData)}`);
  }
  console.log(`✅ Offer accepted by farmer! Offer status: ${acceptData.offer.status}`);

  // Step 7: Check Listing Updated State
  console.log('\n7️⃣ Verifying listing state after acceptance...');
  const listingCheckRes = await fetch(`${baseUrl}/api/listings/${newListingId}`);
  const listingCheck = await listingCheckRes.json();
  console.log(`   Listing Status: ${listingCheck.listing.status}`);
  console.log(`   Remaining Quantity: ${listingCheck.listing.quantity_remaining_kg} kg (out of ${totalKg} kg total)`);

  if (listingCheck.listing.quantity_remaining_kg !== expectedRemaining) {
    throw new Error(`Expected ${expectedRemaining} kg remaining, got ${listingCheck.listing.quantity_remaining_kg}`);
  }
  console.log(`✅ Allocation math verified: ${firstOfferKg} kg allocated, exactly ${expectedRemaining} kg remaining.`);

  // Step 8: Test Over-Allocation Protection
  console.log('\n8️⃣ Testing Over-Allocation Protection...');
  // Submit second offer exceeding remaining
  const excessiveKg = expectedRemaining + 100;
  const secondOfferRes = await fetch(`${baseUrl}/api/offers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      listing_id: newListingId,
      seller_id: 's0000001-0000-0000-0000-000000000002', // Anand Kulkarni
      quantity_kg: excessiveKg,
      price_per_kg: 28.5,
    }),
  });
  const secondOfferData = await secondOfferRes.json();
  const secondOfferId = secondOfferData.offer.id;

  // Try to accept second offer of 500 kg when only 400 kg remains
  const overAllocRes = await fetch(`${baseUrl}/api/offers`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ offer_id: secondOfferId, status: 'accepted' }),
  });
  const overAllocData = await overAllocRes.json();

  if (overAllocRes.status === 400 && (overAllocData.error?.includes('remaining') || overAllocData.error?.includes('available'))) {
    console.log(`✅ Over-allocation blocked as expected: "${overAllocData.error}"`);
  } else {
    throw new Error(`Over-allocation check failed! Res: ${JSON.stringify(overAllocData)}`);
  }

  console.log('\n🎉 ALL 8 WORKFLOW TESTS PASSED PERFECTLY!\n');
}

runE2ETest().catch((err) => {
  console.error('\n❌ Test failed:', err);
  process.exit(1);
});
