'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Navbar } from '@/components/common/Navbar';
import { CropListing, BuyerOffer } from '@/types/database';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Phone,
  Calendar,
  Store,
  MapPin,
  Clock,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  Info,
  CalendarDays,
  IndianRupee,
  Scale,
  Award,
} from 'lucide-react';

export default function FarmerListingDetailPage() {
  const params = useParams();
  const listingId = params.id as string;

  const { user, loading } = useAuth();
  const { language } = useLanguage();
  const router = useRouter();

  const [listing, setListing] = useState<CropListing | null>(null);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [fetching, setFetching] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!loading && (!user || user.profile.role !== 'farmer')) {
      router.push('/auth/login?role=farmer');
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
      }
    } catch (e) {
      console.error('Failed to load listing', e);
    } finally {
      setFetching(false);
    }
  };

  const handleOfferStatus = async (offerId: string, status: 'accepted' | 'declined') => {
    setActionLoading(true);
    try {
      const res = await fetch('/api/offers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ offer_id: offerId, status }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update offer');
      }

      alert(
        status === 'accepted'
          ? (language === 'en'
              ? 'Offer accepted! Mandi trader phone number unlocked. Visit confirmed.'
              : 'ಆಫರ್ ಒಪ್ಪಿಕೊಳ್ಳಲಾಗಿದೆ! ವ್ಯಾಪಾರಿಯ ಫೋನ್ ನಂಬರ್ ತೆರೆದಿದೆ.')
          : (language === 'en' ? 'Offer declined.' : 'ಆಫರ್ ತಿರಸ್ಕರಿಸಲಾಗಿದೆ.')
      );

      loadListing();
    } catch (err: any) {
      alert(err.message || 'Action failed');
    } finally {
      setActionLoading(false);
    }
  };

  if (fetching || !listing) {
    return (
      <div className="min-h-screen bg-[#FFF8E5] flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-stone-500 font-semibold space-y-3">
          <div className="w-10 h-10 border-4 border-[#17652B] border-t-transparent rounded-full animate-spin" />
          <p>{language === 'en' ? 'Loading crop lot details...' : 'ವಿವರಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...'}</p>
        </div>
      </div>
    );
  }

  const remainingKg = listing.quantity_remaining_kg ?? listing.quantity_kg;
  const totalKg = listing.quantity_kg;
  const allocatedKg = totalKg - remainingKg;

  const images = listing.images && listing.images.length > 0
    ? listing.images
    : [{ id: 'default', listing_id: listing.id, storage_path: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80', position: 1, created_at: '' }];

  const currentPhoto = images[activePhotoIdx] || images[0];

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF8E5] text-[#17251B]">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center space-x-3">
          <Link
            href="/farmer/dashboard"
            className="p-2.5 bg-white rounded-2xl border border-stone-200 text-stone-700 hover:bg-stone-50 transition shadow-xs"
          >
            <ArrowLeft className="w-5 h-5 text-stone-800" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-[#17652B]">
              {language === 'en' ? listing.crop?.name_en : listing.crop?.name_kn}
            </h1>
            <p className="text-xs text-stone-500">
              {language === 'en' ? 'Pre-Harvest Lot & Buyer Offers' : 'ಬೆಳೆ ಗುಣಮಟ್ಟ ಮತ್ತು ಖರೀದಿದಾರರ ಆಫರ್‌ಗಳು'}
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
                          ? 'border-[#17652B] ring-2 ring-[#17652B] scale-105'
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
                    <MapPin className="w-3.5 h-3.5 text-[#17652B]" />
                    <span>
                      {listing.farmer?.profile?.full_name?.split(' ')[0] || 'Farmer'}, {listing.farmer?.village || 'Village'}, {listing.farmer?.district || 'Karnataka'}
                    </span>
                  </div>
                </div>

                <span className="text-xs font-black uppercase tracking-wider bg-green-100 text-[#17652B] px-3.5 py-1.5 rounded-full border border-green-300">
                  {listing.status}
                </span>
              </div>

              {/* Price & Quantity Breakdown */}
              <div className="grid grid-cols-2 gap-3 bg-[#FFF8E5] p-4 rounded-2xl border border-stone-200 text-xs">
                <div>
                  <div className="text-stone-500 font-bold uppercase text-[10px]">Total Lot Quantity:</div>
                  <div className="font-black text-stone-900 text-base mt-0.5">
                    {listing.entered_quantity} {listing.entered_unit}{' '}
                    <span className="text-xs font-semibold text-stone-500">
                      ({(totalKg / 100).toFixed(1)} qtl / {totalKg} kg)
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-stone-500 font-bold uppercase text-[10px]">Farmer Expected Rate:</div>
                  <div className="font-black text-[#17652B] text-base mt-0.5">
                    ₹{listing.price_per_kg}/kg{' '}
                    <span className="text-xs font-semibold text-stone-500">
                      (₹{listing.entered_price}/{listing.entered_price_unit})
                    </span>
                  </div>
                </div>
                <div className="col-span-2 pt-2 border-t border-stone-200/80 flex items-center justify-between text-xs">
                  <span className="text-stone-600 font-medium">Estimated Total Lot Value:</span>
                  <span className="font-black text-[#17652B] text-sm">
                    ₹{(totalKg * listing.price_per_kg).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Verified Mandi Benchmark Rate */}
              {listing.market_reference && (
                <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200 text-xs space-y-1">
                  <div className="font-extrabold text-amber-950 flex items-center space-x-1.5">
                    <TrendingUp className="w-4 h-4 text-amber-700" />
                    <span>Verified APMC Reference Modal Rate: ₹{listing.market_reference.modal_price_per_kg}/kg</span>
                  </div>
                  <div className="text-[11px] text-stone-600">
                    Mandatory APMC yard range: ₹{listing.market_reference.min_price_per_kg} - ₹{listing.market_reference.max_price_per_kg}/kg • {listing.market_reference.source_market} ({listing.market_reference.price_date})
                  </div>
                </div>
              )}

              {listing.description && (
                <p className="text-xs text-stone-600 italic bg-stone-50 p-3 rounded-xl border border-stone-200">
                  "{listing.description}"
                </p>
              )}

              {/* Allocation Progress Bar */}
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-stone-600">Quantity Sold vs Available:</span>
                  <span className="text-[#17652B]">
                    {allocatedKg} kg confirmed / {remainingKg} kg available
                  </span>
                </div>
                <div className="w-full bg-stone-200 h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-[#17652B] h-full transition-all duration-500 rounded-full"
                    style={{ width: `${(allocatedKg / totalKg) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Visual Quality Assessment Card with Clear Explanation */}
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
              <span className="bg-[#17652B] text-[#FFBF24] text-xs font-black px-4 py-1.5 rounded-full shadow-sm">
                {listing.quality_assessment.grade}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-[#FFF8E5] p-3.5 rounded-2xl border border-stone-200">
                <span className="text-stone-500 block font-bold uppercase text-[10px]">Freshness & Ripeness:</span>
                <span className="font-extrabold text-stone-900 text-sm mt-0.5 block">{listing.quality_assessment.freshness}</span>
              </div>
              <div className="bg-[#FFF8E5] p-3.5 rounded-2xl border border-stone-200">
                <span className="text-stone-500 block font-bold uppercase text-[10px]">Size Uniformity:</span>
                <span className="font-extrabold text-stone-900 text-sm mt-0.5 block">{listing.quality_assessment.uniformity}</span>
              </div>
              <div className="bg-[#FFF8E5] p-3.5 rounded-2xl border border-stone-200">
                <span className="text-stone-500 block font-bold uppercase text-[10px]">Pest / Damage Condition:</span>
                <span className="font-extrabold text-stone-900 text-sm mt-0.5 block">{listing.quality_assessment.defects}</span>
              </div>
            </div>

            <div className="bg-green-50/80 p-4 rounded-2xl border border-green-200 text-xs text-stone-800 leading-relaxed">
              <strong className="text-[#17652B]">Grade Explanation: </strong>
              {listing.quality_assessment.explanation}
            </div>

            <div className="text-[11px] text-stone-500 flex items-start space-x-2 pt-1 bg-stone-50 p-2.5 rounded-xl border border-stone-200">
              <Info className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
              <span>
                <strong>Preliminary Quality Notice:</strong> This preliminary grade is derived from camera photos to provide baseline guidance. Final grade is officially confirmed at the APMC weighbridge yard upon delivery.
              </span>
            </div>
          </section>
        )}

        {/* 3. Compare Buyer Offers with Accept / Decline */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-black text-xl text-stone-900">
                {language === 'en' ? 'Direct APMC Trader Bids on this Lot' : 'ಬಂದಿರುವ ವ್ಯಾಪಾರಿಗಳ ಆಫರ್‌ಗಳು'}
              </h3>
              <p className="text-xs text-stone-500">
                {language === 'en'
                  ? 'Accepting an offer locks the deal, confirms the visit, and unlocks the trader phone number.'
                  : 'ಆಫರ್ ಒಪ್ಪಿಕೊಂಡರೆ ವ್ಯಾಪಾರಿಯ ಫೋನ್ ಸಂಖ್ಯೆ ಲಭ್ಯವಾಗುತ್ತದೆ ಮತ್ತು ಭೇಟಿ ಖಚಿತಗೊಳ್ಳುತ್ತದೆ.'}
              </p>
            </div>

            <span className="text-xs font-black bg-amber-100 text-amber-950 px-3 py-1 rounded-full border border-amber-300">
              {listing.offers?.length || 0} {language === 'en' ? 'Bids Received' : 'ಆಫರ್‌ಗಳು'}
            </span>
          </div>

          {(!listing.offers || listing.offers.length === 0) ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-stone-200 space-y-3">
              <Clock className="w-12 h-12 text-amber-500 mx-auto" />
              <h4 className="font-extrabold text-stone-800 text-base">
                {language === 'en' ? 'Waiting for APMC Trader Bids' : 'ವ್ಯಾಪಾರಿಗಳ ಆಫರ್‌ಗೆ ಕಾಯಲಾಗುತ್ತಿದೆ'}
              </h4>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                {language === 'en'
                  ? 'Traders in your APMC market have been alerted. Received bids will be listed here side-by-side with prices and requested quantities.'
                  : 'ಮಾರುಕಟ್ಟೆ ವ್ಯಾಪಾರಿಗಳಿಗೆ ಮಾಹಿತಿ ತಲುಪಿದೆ. ಆಫರ್‌ಗಳು ಬಂದ ತಕ್ಷಣ ಇಲ್ಲಿ ಕಾಣಿಸುತ್ತವೆ.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {listing.offers.map((offer) => {
                const isAccepted = offer.status === 'accepted';
                const isDeclined = offer.status === 'declined';
                const canAccept = offer.quantity_kg <= remainingKg;
                const priceDiff = Number((offer.price_per_kg - listing.price_per_kg).toFixed(2));

                return (
                  <div
                    key={offer.id}
                    className={`bg-white rounded-3xl p-6 shadow-sm border transition-all ${
                      isAccepted
                        ? 'border-emerald-500 bg-emerald-50/30 ring-2 ring-emerald-500/20'
                        : isDeclined
                        ? 'border-stone-200 opacity-60'
                        : 'border-stone-200 hover:border-amber-400'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center space-x-2">
                          <Store className="w-4 h-4 text-[#17652B]" />
                          <h4 className="font-black text-lg text-stone-900">
                            {offer.seller?.shop_name || 'APMC Commission Shop'}
                          </h4>
                          <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                            ★ {offer.seller?.rating_avg || 4.8}
                          </span>
                        </div>

                        <div className="text-xs text-stone-700 flex flex-wrap gap-x-3 gap-y-1.5 items-center">
                          <span className="text-xl font-black text-[#17652B]">
                            ₹{offer.price_per_kg}/kg
                          </span>
                          <span className={`font-black px-2 py-0.5 rounded-md text-[11px] ${
                            priceDiff >= 0 ? 'bg-green-100 text-[#17652B]' : 'bg-amber-100 text-amber-950'
                          }`}>
                            {priceDiff >= 0 ? `+₹${priceDiff} vs asking` : `-₹${Math.abs(priceDiff)} vs asking`}
                          </span>
                          <span>•</span>
                          <span className="font-extrabold text-stone-900">
                            Offered: {offer.quantity_kg} kg (₹{(offer.quantity_kg * offer.price_per_kg).toLocaleString('en-IN')})
                          </span>
                          <span>•</span>
                          <span className="text-stone-500 flex items-center">
                            <Calendar className="w-3.5 h-3.5 mr-1" />
                            Visit: {offer.proposed_visit_at ? new Date(offer.proposed_visit_at).toLocaleDateString() : 'Tomorrow'}
                          </span>
                        </div>

                        {offer.message && (
                          <p className="text-xs text-stone-600 italic bg-[#FFF8E5] p-2.5 rounded-xl border border-stone-200">
                            "{offer.message}"
                          </p>
                        )}
                      </div>

                      {/* Action Bar */}
                      <div className="w-full sm:w-auto flex items-center justify-end space-x-2">
                        {isAccepted ? (
                          <div className="text-right space-y-1.5">
                            <span className="inline-flex items-center text-xs font-black text-emerald-800 bg-emerald-100 px-3.5 py-1.5 rounded-full border border-emerald-300">
                              <CheckCircle2 className="w-4 h-4 mr-1 text-emerald-700" />
                              Deal Confirmed
                            </span>
                            <div className="flex items-center text-xs font-bold text-stone-950 bg-white p-2.5 rounded-xl border border-emerald-300 shadow-sm">
                              <Phone className="w-4 h-4 mr-1 text-emerald-700" />
                              <a href={`tel:${offer.seller?.profile?.phone || '+919845044444'}`} className="hover:underline">
                                {offer.seller?.profile?.phone || '+91 98450 44444'}
                              </a>
                            </div>
                            <Link
                              href="/visits"
                              className="inline-flex items-center text-[11px] font-bold text-[#17652B] hover:underline pt-0.5"
                            >
                              <span>View Mandi Gate QR Pass →</span>
                            </Link>
                          </div>
                        ) : isDeclined ? (
                          <span className="text-xs font-semibold text-stone-500 bg-stone-100 px-3 py-1.5 rounded-full">
                            Declined
                          </span>
                        ) : (
                          <div className="flex space-x-2">
                            <button
                              disabled={actionLoading || !canAccept}
                              onClick={() => handleOfferStatus(offer.id, 'accepted')}
                              className="min-h-[46px] px-5 py-2.5 bg-gradient-to-r from-[#17652B] to-[#2E8B43] hover:from-[#1F7D37] hover:to-[#3FA657] text-white text-xs font-bold rounded-xl shadow-md transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center space-x-1.5 cursor-pointer border border-green-800"
                            >
                              <CheckCircle2 className="w-4 h-4 text-[#FFBF24]" />
                              <span>Accept Deal</span>
                            </button>

                            <button
                              disabled={actionLoading}
                              onClick={() => handleOfferStatus(offer.id, 'declined')}
                              className="min-h-[46px] px-3.5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl border border-stone-300 transition cursor-pointer"
                              title="Decline"
                            >
                              <XCircle className="w-4 h-4 text-red-500" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {!canAccept && !isAccepted && !isDeclined && (
                      <div className="mt-3 text-xs text-amber-900 bg-amber-50 p-2.5 rounded-xl border border-amber-200 flex items-center space-x-1.5">
                        <AlertTriangle className="w-4 h-4 shrink-0 text-amber-700" />
                        <span>
                          Cannot accept: requested {offer.quantity_kg} kg, but only {remainingKg} kg remains available.
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
