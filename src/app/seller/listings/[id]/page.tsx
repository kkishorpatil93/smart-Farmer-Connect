'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Navbar } from '@/components/common/Navbar';
import { CropListing } from '@/types/database';
import {
  ArrowLeft,
  Store,
  MapPin,
  Calendar,
  Clock,
  Send,
  Lock,
  Sparkles,
  TrendingUp,
  Info,
  CheckCircle2,
} from 'lucide-react';

export default function SellerListingView() {
  const params = useParams();
  const listingId = params.id as string;

  const { user, loading } = useAuth();
  const { language } = useLanguage();
  const router = useRouter();

  const [listing, setListing] = useState<CropListing | null>(null);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [fetching, setFetching] = useState(true);

  // Offer form fields
  const [quantityKg, setQuantityKg] = useState<number | ''>('');
  const [pricePerKg, setPricePerKg] = useState<number | ''>('');
  const [visitDate, setVisitDate] = useState<string>(
    new Date(Date.now() + 24 * 3600 * 1000).toISOString().split('T')[0]
  );
  const [message, setMessage] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedOffer, setSubmittedOffer] = useState<boolean>(false);

  useEffect(() => {
    if (!loading && (!user || user.profile.role !== 'seller')) {
      router.push('/auth/login?role=seller');
      return;
    }

    if (listingId) {
      loadListing();
    }
  }, [listingId, user, loading]);

  const loadListing = async () => {
    try {
      const res = await fetch(`/api/listings/${listingId}`);
      const data = await res.json();
      if (data.listing) {
        setListing(data.listing);
        setQuantityKg(data.listing.quantity_remaining_kg);
        setPricePerKg(data.listing.price_per_kg);
      }
    } catch (e) {
      console.error('Failed to load listing', e);
    } finally {
      setFetching(false);
    }
  };

  const handleOfferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.sellerProfile?.id) {
      alert('Seller profile not loaded. Please re-login.');
      return;
    }

    if (!quantityKg || !pricePerKg) {
      alert('Please enter valid quantity and price.');
      return;
    }

    if (Number(quantityKg) > (listing?.quantity_remaining_kg || 0)) {
      alert(`Cannot offer more than available ${listing?.quantity_remaining_kg} kg.`);
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        listing_id: listingId,
        seller_id: user.sellerProfile.id,
        quantity_kg: Number(quantityKg),
        price_per_kg: Number(pricePerKg),
        proposed_visit_at: new Date(visitDate).toISOString(),
        message,
      };

      const res = await fetch('/api/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit offer');
      }

      setSubmittedOffer(true);
      alert(
        language === 'en'
          ? 'Offer sent to farmer successfully! You will be notified when accepted.'
          : 'ರೈತರಿಗೆ ಆಫರ್ ತಲುಪಿದೆ! ಅವರು ಒಪ್ಪಿಗೆ ನೀಡಿದಾಗ ನಿಮಗೆ ಸಂದೇಶ ಬರಲಿದೆ.'
      );
    } catch (err: any) {
      alert(err.message || 'Error submitting offer');
    } finally {
      setSubmitting(false);
    }
  };

  if (fetching || !listing) {
    return (
      <div className="min-h-screen bg-[#FFF8E1] flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-8 text-gray-500 font-semibold">
          {language === 'en' ? 'Loading lot...' : 'ಲೋಡ್ ಆಗುತ್ತಿದೆ...'}
        </div>
      </div>
    );
  }

  const images = listing.images && listing.images.length > 0
    ? listing.images
    : [{ id: 'default', listing_id: listing.id, storage_path: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80', position: 1, created_at: '' }];

  const currentPhoto = images[activePhotoIdx] || images[0];

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF8E1]">
      <Navbar />

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center space-x-2">
          <Link
            href="/seller/dashboard"
            className="p-2 bg-white rounded-full border border-stone-200 text-gray-700 hover:bg-stone-50"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h2 className="text-xl font-extrabold text-[#1B5E20]">
              {language === 'en' ? listing.crop?.name_en : listing.crop?.name_kn}
            </h2>
            <p className="text-xs text-gray-500">
              {language === 'en' ? 'Inspect Photos, Quality & Submit Mandi Bid' : 'ಫೋಟೋ, ಗುಣಮಟ್ಟ ಪರಿಶೀಲಿಸಿ ಆಫರ್ ನೀಡಿ'}
            </p>
          </div>
        </div>

        {/* 1. Lot Overview Card with Photos Gallery */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-200 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Gallery */}
            <div className="w-full sm:w-60 space-y-2 shrink-0">
              <div className="aspect-square w-full rounded-2xl bg-amber-50 border border-amber-200 overflow-hidden flex items-center justify-center shadow-inner">
                <img
                  src={currentPhoto.storage_path}
                  alt="Crop"
                  className="w-full h-full object-cover"
                />
              </div>

              {images.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto pb-1">
                  {images.map((img, idx) => (
                    <button
                      key={img.id || idx}
                      type="button"
                      onClick={() => setActivePhotoIdx(idx)}
                      className={`w-12 h-12 rounded-xl overflow-hidden border-2 shrink-0 transition ${
                        activePhotoIdx === idx
                          ? 'border-[#1B5E20] ring-2 ring-green-600'
                          : 'border-gray-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img.storage_path} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="space-y-2 flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-extrabold text-lg text-gray-900">
                    {language === 'en' ? listing.crop?.name_en : listing.crop?.name_kn}
                  </h3>
                  <div className="text-xs text-gray-600 flex items-center space-x-1.5 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-[#1B5E20]" />
                    <span>
                      Farmer: <strong>{listing.farmer?.profile?.full_name?.split(' ')[0] || 'Farmer'}</strong>, {listing.farmer?.village || 'Karnataka'}
                    </span>
                  </div>
                </div>

                <span className="text-xs font-bold uppercase bg-stone-100 text-stone-700 px-2.5 py-0.5 rounded-full">
                  {listing.status}
                </span>
              </div>

              {/* Privacy Notice: Phone is locked */}
              <div className="text-[11px] text-amber-900 bg-amber-50 px-2.5 py-1.5 rounded-lg border border-amber-200 flex items-center space-x-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                <span>Phone number unlocks as soon as farmer accepts your offer.</span>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-stone-50 p-2.5 rounded-xl border border-stone-200 text-center text-xs">
                <div>
                  <div className="text-gray-500 font-semibold">Available Quantity</div>
                  <div className="text-sm font-extrabold text-gray-900">
                    {listing.quantity_remaining_kg} kg
                  </div>
                </div>
                <div>
                  <div className="text-gray-500 font-semibold">Farmer Asking Rate</div>
                  <div className="text-sm font-extrabold text-[#1B5E20]">
                    ₹{listing.price_per_kg}/kg {listing.is_negotiable && '(Negotiable)'}
                  </div>
                </div>
              </div>

              {listing.market_reference && (
                <div className="bg-amber-50 p-2 rounded-lg border border-amber-200 text-[11px] text-gray-700">
                  <span className="font-bold text-amber-950">APMC Reference Modal Rate:</span> ₹{listing.market_reference.modal_price_per_kg}/kg
                  <div className="text-gray-500 text-[10px]">
                    {listing.market_reference.source_market} ({listing.market_reference.price_date})
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 2. Shared Quality Assessment Details */}
        {listing.quality_assessment && (
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-200 space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center space-x-1.5 font-extrabold text-sm text-gray-900">
                <Sparkles className="w-4 h-4 text-[#1B5E20]" />
                <span>Crop Quality Assessment</span>
              </div>
              <span className="bg-[#1B5E20] text-white text-xs font-extrabold px-3 py-0.5 rounded-full">
                {listing.quality_assessment.grade}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="bg-stone-50 p-2 rounded-lg border border-stone-200">
                <span className="text-gray-400 block text-[10px]">Freshness:</span>
                <span className="font-bold text-gray-800">{listing.quality_assessment.freshness}</span>
              </div>
              <div className="bg-stone-50 p-2 rounded-lg border border-stone-200">
                <span className="text-gray-400 block text-[10px]">Size/Uniformity:</span>
                <span className="font-bold text-gray-800">{listing.quality_assessment.uniformity}</span>
              </div>
              <div className="bg-stone-50 p-2 rounded-lg border border-stone-200">
                <span className="text-gray-400 block text-[10px]">Visible Defects:</span>
                <span className="font-bold text-gray-800">{listing.quality_assessment.defects}</span>
              </div>
            </div>

            <p className="text-xs text-gray-700 bg-stone-50 p-2.5 rounded-xl border border-stone-200">
              <strong>Quality Explanation:</strong> {listing.quality_assessment.explanation}
            </p>
          </div>
        )}

        {/* 3. Offer Form */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200 space-y-4">
          <div className="border-b pb-3">
            <h3 className="font-extrabold text-base text-gray-900">
              {language === 'en' ? 'Submit Your Purchase Offer' : 'ನಿಮ್ಮ ಖರೀದಿ ಆಫರ್ ಸಲ್ಲಿಸಿ'}
            </h3>
            <p className="text-xs text-gray-500">
              {language === 'en'
                ? 'Specify the quantity you want, your bid rate per kg, and proposed visit date.'
                : 'ಅಗತ್ಯವಿರುವ ಪ್ರಮಾಣ, ಪ್ರತಿ ಕೆ.ಜಿ ದರ ಮತ್ತು ಮಂಡಿ ಭೇಟಿಯ ದಿನಾಂಕ ನಮೂದಿಸಿ.'}
            </p>
          </div>

          {submittedOffer ? (
            <div className="p-6 text-center space-y-3 bg-green-50 rounded-xl border border-green-200">
              <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto" />
              <h4 className="font-bold text-green-950 text-base">Offer Submitted Successfully!</h4>
              <p className="text-xs text-green-800">
                The farmer has been notified. As soon as the farmer accepts, contact details will unlock.
              </p>
              <Link
                href="/seller/dashboard"
                className="inline-block mt-2 px-5 py-2 bg-[#1B5E20] text-white text-xs font-bold rounded-xl shadow"
              >
                Back to Mandi Feed
              </Link>
            </div>
          ) : (
            <form onSubmit={handleOfferSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {language === 'en' ? 'Proposed Purchase Quantity (kg) *' : 'ಖರೀದಿಸಲಿಚ್ಛಿಸುವ ಪ್ರಮಾಣ (ಕೆ.ಜಿ) *'}
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    max={listing.quantity_remaining_kg}
                    value={quantityKg}
                    onChange={(e) => setQuantityKg(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="300"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl font-bold text-gray-900 focus:ring-2 focus:ring-[#1B5E20] outline-none"
                  />
                  <span className="text-[11px] text-gray-400">
                    Max: {listing.quantity_remaining_kg} kg
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {language === 'en' ? 'Your Proposed Rate (₹ / kg) *' : 'ನಿಮ್ಮ ಆಫರ್ ದರ (₹ / ಕೆ.ಜಿ) *'}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3.5 text-gray-500 font-bold">₹</span>
                    <input
                      type="number"
                      required
                      min="1"
                      step="0.5"
                      value={pricePerKg}
                      onChange={(e) => setPricePerKg(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="23"
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl font-bold text-[#1B5E20] focus:ring-2 focus:ring-[#1B5E20] outline-none"
                    />
                  </div>
                  <span className="text-[11px] text-gray-400">
                    Asking: ₹{listing.price_per_kg}/kg
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {language === 'en' ? 'Intended Visit Date *' : 'ಉದ್ದೇಶಿತ ಭೇಟಿ ದಿನಾಂಕ *'}
                </label>
                <input
                  type="date"
                  required
                  value={visitDate}
                  onChange={(e) => setVisitDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl font-medium focus:ring-2 focus:ring-[#1B5E20] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {language === 'en' ? 'Message to Farmer (Optional)' : 'ರೈತರಿಗೆ ಸಂದೇಶ (ಐಚ್ಛಿಕ)'}
                </label>
                <textarea
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="e.g. Can take delivery tomorrow morning at Amaragol APMC Yard."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#1B5E20] outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full min-h-[50px] bg-[#1B5E20] hover:bg-green-900 active:scale-[0.99] text-white font-bold rounded-xl shadow transition flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4 text-amber-300" />
                <span>
                  {submitting
                    ? 'Submitting Offer...'
                    : (language === 'en' ? 'Send Offer to Farmer' : 'ರೈತರಿಗೆ ಆಫರ್ ಕಳುಹಿಸಿ')}
                </span>
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
