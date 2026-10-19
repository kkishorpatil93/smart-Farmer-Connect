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
  Award,
  IndianRupee,
  Scale,
  ShieldCheck,
  ChevronRight,
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
        setQuantityKg(data.listing.quantity_remaining_kg ?? data.listing.quantity_kg);
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

    const availableKg = listing?.quantity_remaining_kg ?? listing?.quantity_kg ?? 0;
    if (Number(quantityKg) > availableKg) {
      alert(`Cannot offer more than available ${availableKg} kg.`);
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
          ? 'Direct offer submitted to farmer successfully! You will be notified upon confirmation.'
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
      <div className="min-h-screen bg-[#FCFAF2] flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-stone-500 font-semibold space-y-3">
          <div className="w-10 h-10 border-4 border-[#0E3911] border-t-transparent rounded-full animate-spin" />
          <p>{language === 'en' ? 'Loading lot details...' : 'ಬೆಳೆ ವಿವರ ಲೋಡ್ ಆಗುತ್ತಿದೆ...'}</p>
        </div>
      </div>
    );
  }

  const images = listing.images && listing.images.length > 0
    ? listing.images
    : [{ id: 'default', listing_id: listing.id, storage_path: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80', position: 1, created_at: '' }];

  const currentPhoto = images[activePhotoIdx] || images[0];
  const calculatedTotal = (Number(quantityKg) || 0) * (Number(pricePerKg) || 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#FCFAF2] text-stone-900">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center space-x-3">
          <Link
            href="/seller/dashboard"
            className="p-2.5 bg-white rounded-2xl border border-stone-200 text-stone-700 hover:bg-stone-50 transition shadow-xs"
          >
            <ArrowLeft className="w-5 h-5 text-stone-800" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-[#0E3911]">
              {language === 'en' ? listing.crop?.name_en : listing.crop?.name_kn}
            </h1>
            <p className="text-xs text-stone-500">
              {language === 'en' ? 'APMC Trader Procurement & Direct Bidding' : 'ಎಪಿಎಂಸಿ ಖರೀದಿ ಮತ್ತು ಬಿಡ್ ಸಲ್ಲಿಕೆ'}
            </p>
          </div>
        </div>

        {/* 1. Large Photo Gallery and Crop Profile */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Gallery Section */}
            <div className="md:col-span-5 space-y-3">
              <div className="aspect-[4/3] w-full rounded-3xl bg-stone-100 border border-stone-200 overflow-hidden shadow-inner flex items-center justify-center relative">
                <img
                  src={currentPhoto.storage_path}
                  alt="Crop preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-stone-950/70 backdrop-blur-xs text-white text-[11px] font-bold px-3 py-1 rounded-full">
                  Photo {activePhotoIdx + 1} of {images.length}
                </div>
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex space-x-2.5 overflow-x-auto pb-1">
                  {images.map((img, idx) => (
                    <button
                      key={img.id || idx}
                      type="button"
                      onClick={() => setActivePhotoIdx(idx)}
                      className={`w-16 h-16 rounded-2xl overflow-hidden border-2 shrink-0 transition cursor-pointer ${
                        activePhotoIdx === idx
                          ? 'border-[#0E3911] ring-2 ring-green-600 scale-105'
                          : 'border-stone-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img.storage_path} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details Section */}
            <div className="md:col-span-7 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-black text-stone-900">
                    {language === 'en' ? listing.crop?.name_en : listing.crop?.name_kn}
                  </h2>
                  <div className="text-xs text-stone-600 flex items-center space-x-2 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-[#14532D]" />
                    <span>
                      {listing.farmer?.profile?.full_name?.split(' ')[0] || 'Farmer'}, {listing.farmer?.village || 'Village'}, {listing.farmer?.district || 'Karnataka'}
                    </span>
                  </div>
                </div>

                <span className="text-xs font-black uppercase tracking-wider bg-green-100 text-[#0E3911] px-3.5 py-1.5 rounded-full border border-green-300">
                  {listing.status}
                </span>
              </div>

              {/* Price & Quantity Breakdown */}
              <div className="grid grid-cols-2 gap-3 bg-[#FCFAF2] p-4 rounded-2xl border border-stone-200 text-xs">
                <div>
                  <div className="text-stone-500 font-bold uppercase text-[10px]">Available for Procurement:</div>
                  <div className="font-black text-stone-900 text-base mt-0.5">
                    {listing.quantity_remaining_kg ?? listing.quantity_kg} kg{' '}
                    <span className="text-xs font-semibold text-stone-500">
                      ({((listing.quantity_remaining_kg ?? listing.quantity_kg) / 100).toFixed(1)} qtl)
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-stone-500 font-bold uppercase text-[10px]">Farmer Asking Rate:</div>
                  <div className="font-black text-[#0E3911] text-base mt-0.5">
                    ₹{listing.price_per_kg}/kg{' '}
                    <span className="text-xs font-semibold text-stone-500">
                      (₹{listing.entered_price}/{listing.entered_price_unit})
                    </span>
                  </div>
                </div>
                <div className="col-span-2 pt-2 border-t border-stone-200/80 flex items-center justify-between text-xs">
                  <span className="text-stone-600 font-medium">Harvest Dispatch Date:</span>
                  <span className="font-black text-[#0E3911] text-sm">
                    {listing.harvest_date}
                  </span>
                </div>
              </div>

              {/* Verified Mandi Benchmark Rate */}
              {listing.market_reference && (
                <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200 text-xs space-y-1">
                  <div className="font-extrabold text-amber-950 flex items-center space-x-1.5">
                    <TrendingUp className="w-4 h-4 text-amber-700" />
                    <span>APMC Daily Benchmark: Modal ₹{listing.market_reference.modal_price_per_kg}/kg</span>
                  </div>
                  <div className="text-[11px] text-stone-600">
                    Mandi Range: ₹{listing.market_reference.min_price_per_kg} - ₹{listing.market_reference.max_price_per_kg}/kg • {listing.market_reference.source_market} ({listing.market_reference.price_date})
                  </div>
                </div>
              )}

              {listing.description && (
                <p className="text-xs text-stone-600 italic bg-stone-50 p-3 rounded-xl border border-stone-200">
                  "{listing.description}"
                </p>
              )}
            </div>
          </div>
        </section>

        {/* 2. Visual Quality Assessment Card */}
        {listing.quality_assessment && (
          <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-4">
              <div className="flex items-center space-x-2.5">
                <Award className="w-6 h-6 text-amber-500" />
                <div>
                  <h3 className="font-black text-lg text-stone-900">
                    {language === 'en' ? 'Quality Grade & Visual Analysis' : 'ಬೆಳೆ ಗುಣಮಟ್ಟ ಮತ್ತು ಗ್ರೇಡ್ ವಿವರ'}
                  </h3>
                  <p className="text-xs text-stone-500">
                    Preliminary AI quality assessment based on uploaded farm photos
                  </p>
                </div>
              </div>
              <span className="bg-[#0E3911] text-amber-300 text-xs font-black px-4 py-1.5 rounded-full shadow-sm">
                {listing.quality_assessment.grade}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-[#FCFAF2] p-3.5 rounded-2xl border border-stone-200">
                <span className="text-stone-500 block font-bold uppercase text-[10px]">Freshness & Ripeness:</span>
                <span className="font-extrabold text-stone-900 text-sm mt-0.5 block">{listing.quality_assessment.freshness}</span>
              </div>
              <div className="bg-[#FCFAF2] p-3.5 rounded-2xl border border-stone-200">
                <span className="text-stone-500 block font-bold uppercase text-[10px]">Size Uniformity:</span>
                <span className="font-extrabold text-stone-900 text-sm mt-0.5 block">{listing.quality_assessment.uniformity}</span>
              </div>
              <div className="bg-[#FCFAF2] p-3.5 rounded-2xl border border-stone-200">
                <span className="text-stone-500 block font-bold uppercase text-[10px]">Pest / Damage Condition:</span>
                <span className="font-extrabold text-stone-900 text-sm mt-0.5 block">{listing.quality_assessment.defects}</span>
              </div>
            </div>

            <div className="bg-green-50/80 p-4 rounded-2xl border border-green-200 text-xs text-stone-800 leading-relaxed">
              <strong className="text-[#0E3911]">Grade Explanation: </strong>
              {listing.quality_assessment.explanation}
            </div>

            <div className="text-[11px] text-stone-500 flex items-start space-x-2 pt-1 bg-stone-50 p-2.5 rounded-xl border border-stone-200">
              <Info className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
              <span>
                <strong>Preliminary Visual Assessment:</strong> Photos provide lot guidance. Mandi gate weighment and moisture/refraction checks apply upon physical lot arrival.
              </span>
            </div>
          </section>
        )}

        {/* 3. Direct Offer Submission Form */}
        <section className="bg-gradient-to-br from-white to-[#FBF8EE] rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200 space-y-6">
          <div className="flex items-center space-x-3 border-b border-stone-200 pb-4">
            <div className="w-12 h-12 rounded-2xl bg-[#0E3911] text-amber-300 flex items-center justify-center font-bold text-xl shadow">
              💰
            </div>
            <div>
              <h3 className="text-xl font-black text-[#0E3911]">
                {language === 'en' ? 'Submit Pre-Harvest Purchase Offer' : 'ಖರೀದಿ ಆಫರ್ ಸಲ್ಲಿಸಿ'}
              </h3>
              <p className="text-xs text-stone-500">
                {language === 'en'
                  ? 'Your offer is sent directly to the farmer. Once accepted, visit booking is confirmed with gate pass.'
                  : 'ನಿಮ್ಮ ಆಫರ್ ನೇರವಾಗಿ ರೈತರಿಗೆ ತಲುಪುತ್ತದೆ. ಅವರು ಒಪ್ಪಿಕೊಂಡಾಗ ಗೇಟ್ ಪಾಸ್ ಸೃಷ್ಟಿಯಾಗುತ್ತದೆ.'}
              </p>
            </div>
          </div>

          {submittedOffer ? (
            <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-6 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h4 className="font-black text-lg text-emerald-950">
                {language === 'en' ? 'Offer Successfully Sent to Farmer' : 'ಆಫರ್ ರೈತರಿಗೆ ತಲುಪಿದೆ'}
              </h4>
              <p className="text-xs text-emerald-800 max-w-md mx-auto">
                {language === 'en'
                  ? 'You proposed ₹' + pricePerKg + '/kg for ' + quantityKg + ' kg. When the farmer accepts, you will receive an alert to view their confirmed phone number and APMC gate pass.'
                  : 'ನಿಮ್ಮ ಆಫರ್ ದಾಖಲಾಗಿದೆ. ರೈತರು ಒಪ್ಪಿಕೊಂಡಾಗ ನಿಮಗೆ ಸೂಚನೆ ಬರಲಿದೆ.'}
              </p>
              <Link
                href="/visits"
                className="inline-flex items-center space-x-2 bg-[#0E3911] text-white px-5 py-2.5 rounded-xl font-bold text-xs"
              >
                <span>{language === 'en' ? 'View Confirmed Deals & Visits' : 'ಖಚಿತ ಭೇಟಿಗಳನ್ನು ನೋಡಿ'}</span>
                <ChevronRight className="w-4 h-4 text-amber-300" />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleOfferSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Quantity */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-extrabold text-stone-800 uppercase tracking-wider">
                    {language === 'en' ? 'Offered Quantity (kg)' : 'ಖರೀದಿಸುವ ಪ್ರಮಾಣ (ಕೆಜಿ)'} *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={listing.quantity_remaining_kg ?? listing.quantity_kg}
                    value={quantityKg}
                    onChange={(e) => setQuantityKg(e.target.value === '' ? '' : Number(e.target.value))}
                    required
                    className="w-full px-4 py-3 rounded-2xl border border-stone-200 bg-white font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                  <span className="text-[11px] text-stone-500">
                    Max available: {listing.quantity_remaining_kg ?? listing.quantity_kg} kg
                  </span>
                </div>

                {/* Price per kg */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-extrabold text-stone-800 uppercase tracking-wider">
                    {language === 'en' ? 'Offered Price (₹/kg)' : 'ಆಫರ್ ದರ (₹/ಕೆಜಿ)'} *
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    value={pricePerKg}
                    onChange={(e) => setPricePerKg(e.target.value === '' ? '' : Number(e.target.value))}
                    required
                    className="w-full px-4 py-3 rounded-2xl border border-stone-200 bg-white font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                  <span className="text-[11px] text-stone-500">
                    Farmer expected: ₹{listing.price_per_kg}/kg
                  </span>
                </div>

                {/* Visit / Delivery Date */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-extrabold text-stone-800 uppercase tracking-wider">
                    {language === 'en' ? 'Proposed Mandi Arrival Date' : 'ಮಂಡಿ ಆಗಮನದ ದಿನಾಂಕ'} *
                  </label>
                  <input
                    type="date"
                    value={visitDate}
                    onChange={(e) => setVisitDate(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-2xl border border-stone-200 bg-white font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>

                {/* Live Value Calculation Preview */}
                <div className="bg-[#FCFAF2] p-4 rounded-2xl border border-stone-200 flex flex-col justify-center">
                  <span className="text-[10px] font-bold uppercase text-stone-500">
                    Total Estimated Transaction:
                  </span>
                  <div className="text-2xl font-black text-[#0E3911] mt-0.5">
                    ₹{calculatedTotal.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[11px] text-stone-500">
                    Full payment settled upon yard weighment verification
                  </span>
                </div>
              </div>

              {/* Note / Message */}
              <div className="space-y-1.5">
                <label className="block text-xs font-extrabold text-stone-800 uppercase tracking-wider">
                  {language === 'en' ? 'Message to Farmer (Optional)' : 'ರೈತರಿಗೆ ಸಂದೇಶ (ಐಚ್ಛಿಕ)'}
                </label>
                <textarea
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={
                    language === 'en'
                      ? 'e.g. Prompt payment at Hubballi APMC Yard Gate 2, immediate weighment.'
                      : 'ಉದಾ: ಹುಬ್ಬಳ್ಳಿ ಎಪಿಎಂಸಿ ಗೇಟ್ 2 ರಲ್ಲಿ ತಕ್ಷಣ ತೂಕ ಮತ್ತು ಹಣ ಪಾವತಿ ಮಾಡಲಾಗುವುದು.'
                  }
                  className="w-full px-4 py-3 rounded-2xl border border-stone-200 bg-white text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full min-h-[52px] bg-gradient-to-r from-[#0E3911] to-[#1B5E20] hover:from-[#14532D] hover:to-[#2E7D32] text-white font-black text-sm rounded-2xl shadow-md hover:shadow-lg transition flex items-center justify-center space-x-2 cursor-pointer border border-green-800 disabled:opacity-50"
              >
                <Send className="w-4 h-4 text-amber-300" />
                <span>
                  {submitting
                    ? (language === 'en' ? 'Submitting Offer...' : 'ಸಲ್ಲಿಸಲಾಗುತ್ತಿದೆ...')
                    : (language === 'en' ? 'Send Offer to Farmer' : 'ರೈತರಿಗೆ ಆಫರ್ ಕಳುಹಿಸಿ')}
                </span>
              </button>
            </form>
          )}
        </section>
      </main>
    </div>
  );
}
