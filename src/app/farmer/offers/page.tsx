'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Navbar } from '@/components/common/Navbar';
import { BuyerOffer } from '@/types/database';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Phone,
  Calendar,
  Store,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  ShieldCheck,
  IndianRupee,
  Scale,
  CalendarDays,
  Filter,
} from 'lucide-react';

export default function FarmerOffersPage() {
  const { user, loading } = useAuth();
  const { language } = useLanguage();
  const router = useRouter();

  const [offers, setOffers] = useState<BuyerOffer[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'accepted' | 'declined'>('all');
  const [fetching, setFetching] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!loading && (!user || user.profile.role !== 'farmer')) {
      router.push('/auth/login?role=farmer&redirect=/farmer/offers');
      return;
    }

    if (user?.farmerProfile?.id) {
      loadOffers();
    }
  }, [user, loading]);

  const loadOffers = async () => {
    if (!user?.farmerProfile?.id) return;
    try {
      setFetching(true);
      const res = await fetch(`/api/offers?farmer_id=${user.farmerProfile.id}`);
      const data = await res.json();
      if (data.offers) {
        setOffers(data.offers);
      }
    } catch (e) {
      console.error('Failed to load offers', e);
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
          ? language === 'en'
            ? 'Deal Confirmed! Trader phone number unlocked. Mandi visit booking created.'
            : 'ವ್ಯಾಪಾರ ದೃಢಪಟ್ಟಿದೆ! ವ್ಯಾಪಾರಿಯ ಫೋನ್ ಸಂಖ್ಯೆ ತೆರೆದಿದೆ. ಮಂಡಿ ಭೇಟಿ ಬುಕಿಂಗ್ ಸೃಷ್ಟಿಯಾಗಿದೆ.'
          : language === 'en'
          ? 'Offer declined.'
          : 'ಆಫರ್ ತಿರಸ್ಕರಿಸಲಾಗಿದೆ.'
      );

      loadOffers();
    } catch (err: any) {
      alert(err.message || 'Action failed');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredOffers = offers.filter((o) => {
    if (activeTab === 'all') return true;
    return o.status === activeTab;
  });

  if (loading || fetching) {
    return (
      <div className="min-h-screen bg-[#FFF8E5] flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-stone-500 font-semibold space-y-3">
          <div className="w-10 h-10 border-4 border-[#17652B] border-t-transparent rounded-full animate-spin" />
          <p>{language === 'en' ? 'Loading buyer offers...' : 'ಖರೀದಿದಾರರ ಆಫರ್‌ಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF8E5] text-[#17251B]">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <Link
              href="/farmer/dashboard"
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#17652B] hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{language === 'en' ? 'Back to Farmer Dashboard' : 'ರೈತರ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಹಿಂತಿರುಗಿ'}</span>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-black text-[#17652B]">
              {language === 'en' ? 'Compare Real Buyer Offers' : 'ಖರೀದಿದಾರರ ನೇರ ಆಫರ್‌ಗಳು'}
            </h1>
            <p className="text-xs sm:text-sm text-stone-600">
              {language === 'en'
                ? 'Review verified offers from licensed APMC commission traders before travelling to the mandi.'
                : 'ಮಂಡಿಗೆ ಹೋಗುವ ಮುನ್ನ ಅಧಿಕೃತ ಎಪಿಎಂಸಿ ವ್ಯಾಪಾರಿಗಳ ನೈಜ ದರಗಳನ್ನು ಹೋಲಿಸಿ ನೋಡಿ.'}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Link
              href="/visits"
              className="min-h-[46px] px-5 py-2.5 bg-gradient-to-r from-[#17652B] to-[#2E8B43] hover:from-[#1F7D37] hover:to-[#3FA657] text-white text-xs font-black rounded-2xl shadow-md flex items-center space-x-2 transition border border-green-800"
            >
              <CalendarDays className="w-4 h-4 text-[#FFBF24]" />
              <span>
                {language === 'en' ? 'Confirmed Deals & Gate Pass' : 'ಖಚಿತ ಭೇಟಿಗಳು & ಗೇಟ್ ಪಾಸ್'}
              </span>
            </Link>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'all', en: 'All Bids', kn: 'ಎಲ್ಲಾ ಆಫರ್‌ಗಳು' },
            { id: 'pending', en: 'Pending Decision', kn: 'ನಿರ್ಧಾರ ಬಾಕಿ' },
            { id: 'accepted', en: 'Accepted Deals', kn: 'ಒಪ್ಪಿಕೊಂಡ ಆಫರ್‌ಗಳು' },
            { id: 'declined', en: 'Declined', kn: 'ತಿರಸ್ಕರಿಸಿದವು' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`min-h-[40px] px-4 py-2 rounded-2xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#17652B] text-[#FFBF24] shadow-sm'
                  : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              <span>{language === 'en' ? tab.en : tab.kn}</span>
              <span className="ml-1.5 px-2 py-0.5 rounded-full text-[10px] bg-stone-100 text-stone-800">
                {tab.id === 'all'
                  ? offers.length
                  : offers.filter((o) => o.status === tab.id).length}
              </span>
            </button>
          ))}
        </div>

        {/* Offers Feed */}
        {filteredOffers.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-stone-200 space-y-3">
            <Store className="w-12 h-12 text-stone-300 mx-auto" />
            <h3 className="text-lg font-bold text-stone-800">
              {language === 'en' ? 'No offers in this category' : 'ಯಾವುದೇ ಆಫರ್‌ಗಳು ಕಂಡುಬಂದಿಲ್ಲ'}
            </h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              {language === 'en'
                ? 'Registered APMC traders in Hubballi and Belagavi receive instant alerts when you post crops.'
                : 'ಬೆಳೆ ಪೋಸ್ಟ್ ಮಾಡಿದಾಗ ನೊಂದಾಯಿತ ವ್ಯಾಪಾರಿಗಳಿಗೆ ಮಾಹಿತಿ ತಲುಪುತ್ತದೆ.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOffers.map((offer) => {
              const isAccepted = offer.status === 'accepted';
              const isDeclined = offer.status === 'declined';
              const listing = offer.listing;
              const remainingKg = listing?.quantity_remaining_kg ?? listing?.quantity_kg ?? 0;
              const canAccept = offer.quantity_kg <= remainingKg;
              const priceDiff = listing
                ? Number((offer.price_per_kg - listing.price_per_kg).toFixed(2))
                : 0;

              return (
                <div
                  key={offer.id}
                  className={`bg-white rounded-3xl p-6 shadow-sm border transition-all ${
                    isAccepted
                      ? 'border-emerald-500 bg-emerald-50/20 ring-2 ring-emerald-500/20'
                      : isDeclined
                      ? 'border-stone-200 opacity-60'
                      : 'border-stone-200 hover:border-amber-400'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      {/* Shop Name & Crop Tag */}
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="flex items-center space-x-1.5 font-black text-lg text-stone-900">
                          <Store className="w-5 h-5 text-[#17652B]" />
                          <span>{offer.seller?.shop_name || 'APMC Commission Trader'}</span>
                        </div>
                        <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                          ★ {offer.seller?.rating_avg || 4.8} APMC Verified
                        </span>

                        {listing?.crop && (
                          <span className="text-xs font-extrabold bg-[#FFF8E5] text-stone-800 px-3 py-0.5 rounded-full border border-stone-200">
                            {language === 'en' ? listing.crop.name_en : listing.crop.name_kn}
                          </span>
                        )}
                      </div>

                      {/* Financial & Quantity Numbers */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-stone-700 pt-1">
                        <div className="flex items-center space-x-1">
                          <span className="text-xs font-bold text-stone-500 uppercase">Offer:</span>
                          <span className="text-xl font-black text-[#17652B]">
                            ₹{offer.price_per_kg}/kg
                          </span>
                        </div>

                        {listing && (
                          <span
                            className={`font-black px-2.5 py-0.5 rounded-md text-[11px] ${
                              priceDiff >= 0
                                ? 'bg-green-100 text-[#17652B]'
                                : 'bg-amber-100 text-amber-950'
                            }`}
                          >
                            {priceDiff >= 0 ? `+₹${priceDiff} vs asking` : `-₹${Math.abs(priceDiff)} vs asking`}
                          </span>
                        )}

                        <span>•</span>

                        <div>
                          <span className="text-xs font-bold text-stone-500 uppercase">Quantity:</span>{' '}
                          <strong className="text-stone-900">{offer.quantity_kg} kg</strong>{' '}
                          <span className="text-[11px] text-stone-500">
                            (₹{(offer.quantity_kg * offer.price_per_kg).toLocaleString('en-IN')})
                          </span>
                        </div>

                        <span>•</span>

                        <div className="flex items-center space-x-1 text-stone-500">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>
                            Visit: {offer.proposed_visit_at ? new Date(offer.proposed_visit_at).toLocaleDateString() : 'Tomorrow'}
                          </span>
                        </div>
                      </div>

                      {offer.message && (
                        <p className="text-xs text-stone-600 italic bg-[#FFF8E5] p-2.5 rounded-xl border border-stone-200">
                          "{offer.message}"
                        </p>
                      )}
                    </div>

                    {/* Actions / Phone Unlock */}
                    <div className="w-full sm:w-auto flex items-center justify-end space-x-2">
                      {isAccepted ? (
                        <div className="text-right space-y-1.5">
                          <span className="inline-flex items-center text-xs font-black text-emerald-800 bg-emerald-100 px-3.5 py-1 rounded-full border border-emerald-300">
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-700" />
                            Offer Confirmed
                          </span>
                          <div className="flex items-center text-xs font-bold text-stone-950 bg-white p-2.5 rounded-xl border border-emerald-300 shadow-sm">
                            <Phone className="w-4 h-4 mr-1 text-emerald-700" />
                            <a href={`tel:${offer.seller?.profile?.phone || '+919845044444'}`} className="hover:underline">
                              {offer.seller?.profile?.phone || '+91 98450 44444'}
                            </a>
                          </div>
                        </div>
                      ) : isDeclined ? (
                        <span className="text-xs font-semibold text-stone-500 bg-stone-100 px-3.5 py-1.5 rounded-full">
                          Declined
                        </span>
                      ) : (
                        <div className="flex space-x-2">
                          <button
                            disabled={actionLoading || !canAccept}
                            onClick={() => handleOfferStatus(offer.id, 'accepted')}
                            className="min-h-[46px] px-5 py-2.5 bg-gradient-to-r from-[#17652B] to-[#2E8B43] hover:from-[#1F7D37] hover:to-[#3FA657] text-white text-xs font-bold rounded-2xl shadow-md transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center space-x-1.5 cursor-pointer border border-green-800"
                          >
                            <CheckCircle2 className="w-4 h-4 text-[#FFBF24]" />
                            <span>Accept Offer</span>
                          </button>

                          <button
                            disabled={actionLoading}
                            onClick={() => handleOfferStatus(offer.id, 'declined')}
                            className="min-h-[46px] px-3.5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-2xl border border-stone-300 transition cursor-pointer"
                            title="Decline"
                          >
                            <XCircle className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
