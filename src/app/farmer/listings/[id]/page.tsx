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
      <div className="min-h-screen bg-[#FFF8E1] flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-8 text-gray-500 font-semibold">
          {language === 'en' ? 'Loading crop lot details...' : 'ವಿವರಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...'}
        </div>
      </div>
    );
  }

  const remainingKg = listing.quantity_remaining_kg;
  const totalKg = listing.quantity_kg;
  const allocatedKg = totalKg - remainingKg;

  const images = listing.images && listing.images.length > 0
    ? listing.images
    : [{ id: 'default', listing_id: listing.id, storage_path: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80', position: 1, created_at: '' }];

  const currentPhoto = images[activePhotoIdx] || images[0];

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF8E1]">
      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-6 space-y-6">
        {/* Navigation */}
        <div className="flex items-center space-x-2">
          <Link
            href="/farmer/dashboard"
            className="p-2 bg-white rounded-full border border-stone-200 text-gray-700 hover:bg-stone-50"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h2 className="text-xl font-extrabold text-[#1B5E20]">
              {language === 'en' ? listing.crop?.name_en : listing.crop?.name_kn}
            </h2>
            <p className="text-xs text-gray-500">
              {language === 'en' ? 'Crop Quality & Buyer Offers' : 'ಬೆಳೆ ಗುಣಮಟ್ಟ ಮತ್ತು ಖರೀದಿದಾರರ ಆಫರ್‌ಗಳು'}
            </p>
          </div>
        </div>

        {/* 1. Crop Lot Card with 1-5 Photos Gallery */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-200 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Gallery Section */}
            <div className="w-full sm:w-64 space-y-2 shrink-0">
              <div className="aspect-square w-full rounded-2xl bg-amber-50 border border-amber-200 overflow-hidden shadow-inner flex items-center justify-center">
                <img
                  src={currentPhoto.storage_path}
                  alt="Crop main"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Thumbnails if multiple photos */}
              {images.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto pb-1">
                  {images.map((img, idx) => (
                    <button
                      key={img.id || idx}
                      type="button"
                      onClick={() => setActivePhotoIdx(idx)}
                      className={`w-14 h-14 rounded-xl overflow-hidden border-2 shrink-0 transition ${
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

            {/* Details Section */}
            <div className="space-y-3 flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-extrabold text-xl text-gray-900">
                    {language === 'en' ? listing.crop?.name_en : listing.crop?.name_kn}
                  </h3>
                  <div className="text-xs text-gray-600 flex items-center space-x-1.5 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-[#1B5E20]" />
                    <span>
                      {listing.farmer?.profile?.full_name?.split(' ')[0] || 'Farmer'}, {listing.farmer?.village || 'Village'}, {listing.farmer?.district || 'Karnataka'}
                    </span>
                  </div>
                </div>

                <span className="text-xs font-bold uppercase tracking-wide bg-green-100 text-[#1B5E20] px-3 py-1 rounded-full border border-green-300">
                  {listing.status}
                </span>
              </div>

              {/* Price & Quantity Grid */}
              <div className="grid grid-cols-2 gap-2 bg-stone-50 p-3 rounded-xl border border-stone-200 text-xs">
                <div>
                  <div className="text-gray-500 font-semibold">Total Quantity:</div>
                  <div className="font-bold text-gray-900 text-sm">
                    {listing.entered_quantity} {listing.entered_unit} ({totalKg} kg)
                  </div>
                </div>
                <div>
                  <div className="text-gray-500 font-semibold">Farmer Expected Rate:</div>
                  <div className="font-extrabold text-[#1B5E20] text-sm">
                    ₹{listing.entered_price} / {listing.entered_price_unit} (₹{listing.price_per_kg}/kg)
                  </div>
                </div>
                <div className="col-span-2 pt-1 border-t border-gray-200 flex items-center justify-between">
                  <span className="text-gray-500 font-medium">Estimated Total Value:</span>
                  <span className="font-bold text-gray-900">
                    ₹{(totalKg * listing.price_per_kg).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Market Reference Rate */}
              {listing.market_reference && (
                <div className="bg-amber-50/80 p-2.5 rounded-xl border border-amber-200 text-xs space-y-0.5">
                  <div className="font-bold text-amber-950 flex items-center space-x-1">
                    <TrendingUp className="w-3.5 h-3.5 text-amber-700" />
                    <span>APMC Reference Market Rate: ₹{listing.market_reference.modal_price_per_kg}/kg</span>
                  </div>
                  <div className="text-[11px] text-gray-600">
                    Range: ₹{listing.market_reference.min_price_per_kg} - ₹{listing.market_reference.max_price_per_kg}/kg • {listing.market_reference.source_market} ({listing.market_reference.price_date})
                  </div>
                </div>
              )}

              {listing.description && (
                <p className="text-xs text-gray-600 italic">"{listing.description}"</p>
              )}
            </div>
          </div>

          {/* Allocation Progress */}
          <div className="pt-2 border-t border-gray-100 space-y-1.5">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-gray-700">Quantity Allocation:</span>
              <span className="text-[#1B5E20]">
                {allocatedKg} kg allocated / {remainingKg} kg remaining
              </span>
            </div>
            <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-[#1B5E20] h-full transition-all duration-500"
                style={{ width: `${(allocatedKg / totalKg) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* 2. Visual Quality Assessment Card */}
        {listing.quality_assessment && (
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-200 space-y-3">
            <div className="flex items-center justify-between border-b pb-2.5">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-[#1B5E20]" />
                <h3 className="font-extrabold text-base text-gray-900">
                  {language === 'en' ? 'Crop Quality Assessment' : 'ಬೆಳೆ ಗುಣಮಟ್ಟ ಮೌಲ್ಯಮಾಪನ'}
                </h3>
              </div>
              <span className="bg-[#1B5E20] text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-sm">
                {listing.quality_assessment.grade}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                <span className="text-gray-500 block font-semibold">Freshness & Colour:</span>
                <span className="font-bold text-gray-900">{listing.quality_assessment.freshness}</span>
              </div>
              <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                <span className="text-gray-500 block font-semibold">Size & Uniformity:</span>
                <span className="font-bold text-gray-900">{listing.quality_assessment.uniformity}</span>
              </div>
              <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                <span className="text-gray-500 block font-semibold">Visible Condition:</span>
                <span className="font-bold text-gray-900">{listing.quality_assessment.defects}</span>
              </div>
            </div>

            <p className="text-xs text-gray-700 bg-green-50 p-3 rounded-xl border border-green-200 leading-relaxed">
              <strong>Assessment Summary:</strong> {listing.quality_assessment.explanation}
            </p>

            <div className="text-[11px] text-gray-500 flex items-start space-x-1 pt-1">
              <Info className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
              <span>
                Preliminary visual inspection. A photo cannot determine pesticide residues, internal damage, or official lab parameters. Confirmed by farmer.
              </span>
            </div>
          </div>
        )}

        {/* 3. Compare Buyer Offers */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-lg text-gray-900">
              {language === 'en' ? 'Compare Buyer Offers' : 'ಖರೀದಿದಾರರ ಆಫರ್‌ಗಳು'}
            </h3>
            <span className="text-xs font-bold bg-amber-100 text-amber-900 px-2.5 py-1 rounded-full">
              {listing.offers?.length || 0} {language === 'en' ? 'Offers' : 'ಆಫರ್‌ಗಳು'}
            </span>
          </div>

          {(!listing.offers || listing.offers.length === 0) ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-stone-200 space-y-2">
              <Clock className="w-10 h-10 text-amber-500 mx-auto animate-spin" />
              <h4 className="font-bold text-gray-800">
                {language === 'en' ? 'Waiting for Mandi Trader Bids' : 'ವ್ಯಾಪಾರಿಗಳ ಆಫರ್‌ಗೆ ಕಾಯಲಾಗುತ್ತಿದೆ'}
              </h4>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                {language === 'en'
                  ? 'Traders in your APMC market have been alerted. Received bids will be listed here side-by-side with prices and requested quantities.'
                  : 'ಮಾರುಕಟ್ಟೆ ವ್ಯಾಪಾರಿಗಳಿಗೆ ಮಾಹಿತಿ ತಲುಪಿದೆ. ಆಫರ್‌ಗಳು ಬಂದ ತಕ್ಷಣ ಇಲ್ಲಿ ಕಾಣಿಸುತ್ತವೆ.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {listing.offers.map((offer) => {
                const isAccepted = offer.status === 'accepted';
                const isDeclined = offer.status === 'declined';
                const canAccept = offer.quantity_kg <= remainingKg;

                // Price difference vs farmer expected price
                const priceDiff = Number((offer.price_per_kg - listing.price_per_kg).toFixed(2));

                return (
                  <div
                    key={offer.id}
                    className={`bg-white rounded-2xl p-5 shadow-sm border transition ${
                      isAccepted
                        ? 'border-green-500 bg-green-50/40'
                        : isDeclined
                        ? 'border-gray-200 opacity-60'
                        : 'border-stone-200'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center space-x-2">
                          <Store className="w-4 h-4 text-[#1B5E20]" />
                          <h4 className="font-bold text-base text-gray-900">
                            {offer.seller?.shop_name || 'APMC Commission Shop'}
                          </h4>
                          <span className="text-xs font-semibold text-amber-600">
                            ★ {offer.seller?.rating_avg || 4.8}
                          </span>
                        </div>

                        <div className="text-xs text-gray-700 flex flex-wrap gap-x-3 gap-y-1 pt-1 items-center">
                          <span className="text-base font-extrabold text-[#1B5E20]">
                            ₹{offer.price_per_kg}/kg
                          </span>
                          <span className={`font-bold px-1.5 py-0.5 rounded text-[11px] ${
                            priceDiff >= 0 ? 'bg-green-100 text-green-900' : 'bg-amber-100 text-amber-900'
                          }`}>
                            {priceDiff >= 0 ? `+₹${priceDiff} vs expected` : `-₹${Math.abs(priceDiff)} vs expected`}
                          </span>
                          <span>•</span>
                          <span className="font-bold text-gray-900">
                            Quantity: {offer.quantity_kg} kg
                          </span>
                          <span>•</span>
                          <span className="text-gray-500 flex items-center">
                            <Calendar className="w-3.5 h-3.5 mr-1" />
                            {offer.proposed_visit_at
                              ? new Date(offer.proposed_visit_at).toLocaleDateString()
                              : 'Tomorrow'}
                          </span>
                        </div>

                        {offer.message && (
                          <p className="text-xs text-gray-600 italic bg-stone-50 p-2 rounded-lg mt-1">
                            "{offer.message}"
                          </p>
                        )}
                      </div>

                      {/* Action / Phone Unlock */}
                      <div className="w-full sm:w-auto flex items-center justify-end space-x-2 pt-2 sm:pt-0">
                        {isAccepted ? (
                          <div className="text-right space-y-1">
                            <span className="inline-flex items-center text-xs font-bold text-green-800 bg-green-100 px-3 py-1 rounded-full border border-green-300">
                              <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-green-700" />
                              Offer Accepted
                            </span>
                            {/* UNLOCKED PHONE NUMBER */}
                            <div className="flex items-center text-xs font-bold text-green-950 bg-white p-2 rounded-lg border border-green-300 shadow-sm">
                              <Phone className="w-3.5 h-3.5 mr-1 text-green-700" />
                              <a href={`tel:${offer.seller?.profile?.phone || '+919845044444'}`} className="hover:underline">
                                {offer.seller?.profile?.phone || '+91 98450 44444'}
                              </a>
                            </div>
                          </div>
                        ) : isDeclined ? (
                          <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                            Declined
                          </span>
                        ) : (
                          <div className="flex space-x-2">
                            <button
                              disabled={actionLoading || !canAccept}
                              onClick={() => handleOfferStatus(offer.id, 'accepted')}
                              className="min-h-[44px] px-4 py-2 bg-[#1B5E20] hover:bg-green-900 text-white text-xs font-bold rounded-xl shadow transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center space-x-1 cursor-pointer"
                            >
                              <CheckCircle2 className="w-4 h-4 text-amber-300" />
                              <span>Accept Offer</span>
                            </button>

                            <button
                              disabled={actionLoading}
                              onClick={() => handleOfferStatus(offer.id, 'declined')}
                              className="min-h-[44px] px-3 py-2 bg-stone-100 hover:bg-stone-200 text-gray-700 text-xs font-semibold rounded-xl border border-stone-300 transition cursor-pointer"
                            >
                              <XCircle className="w-4 h-4 text-red-500" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {!canAccept && !isAccepted && !isDeclined && (
                      <div className="mt-2 text-[11px] text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200 flex items-center space-x-1">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        <span>
                          Cannot accept: requests {offer.quantity_kg} kg, but only {remainingKg} kg remains available.
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
