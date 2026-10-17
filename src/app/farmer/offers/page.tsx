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
      <div className="min-h-screen bg-[#FFF8E1] flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-8 text-gray-500 font-semibold">
          {language === 'en' ? 'Loading buyer offers...' : 'ಖರೀದಿದಾರರ ಆಫರ್‌ಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...'}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF8E1]">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 space-y-6">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <Link
              href="/farmer/dashboard"
              className="inline-flex items-center space-x-1 text-xs font-bold text-[#1B5E20] hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'Back to Farmer Dashboard' : 'ರೈತರ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಹಿಂತಿರುಗಿ'}</span>
            </Link>
            <h1 className="text-2xl font-extrabold text-gray-900">
              {language === 'en' ? 'Compare Real Buyer Offers' : 'ಖರೀದಿದಾರರ ನೇರ ಆಫರ್‌ಗಳು'}
            </h1>
            <p className="text-xs text-gray-600">
              {language === 'en'
                ? 'Review verified offers from licensed APMC commission traders before travelling to the mandi.'
                : 'ಮಂಡಿಗೆ ಹೋಗುವ ಮುನ್ನ ಅಧಿಕೃತ ಎಪಿಎಂಸಿ ವ್ಯಾಪಾರಿಗಳ ನೈಜ ದರಗಳನ್ನು ಹೋಲಿಸಿ ನೋಡಿ.'}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Link
              href="/visits"
              className="min-h-[44px] px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl shadow flex items-center space-x-2 transition"
            >
              <Calendar className="w-4 h-4 text-amber-300" />
              <span>{language === 'en' ? 'Confirmed Visits' : 'ಖಚಿತ ಭೇಟಿಗಳು'}</span>
            </Link>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1">
          {(['all', 'pending', 'accepted', 'declined'] as const).map((tab) => {
            const count = tab === 'all' ? offers.length : offers.filter((o) => o.status === tab).length;
            const labels = {
              all: language === 'en' ? 'All Offers' : 'ಎಲ್ಲ ಆಫರ್‌ಗಳು',
              pending: language === 'en' ? 'Pending Review' : 'ಬಾಕಿ ಉಳಿದಿರುವ',
              accepted: language === 'en' ? 'Accepted & Confirmed' : 'ಒಪ್ಪಿಕೊಂಡ ಆಫರ್',
              declined: language === 'en' ? 'Declined' : 'ತಿರಸ್ಕರಿಸಿದ',
            };
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer whitespace-nowrap ${
                  activeTab === tab
                    ? 'bg-[#1B5E20] text-white shadow-sm'
                    : 'bg-white text-gray-600 border border-stone-200 hover:bg-stone-50'
                }`}
              >
                <span>{labels[tab]}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    activeTab === tab ? 'bg-green-800 text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Offers List */}
        {filteredOffers.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-stone-200 space-y-3">
            <Clock className="w-10 h-10 text-amber-500 mx-auto" />
            <h3 className="text-base font-bold text-gray-900">
              {language === 'en' ? 'No offers in this category yet' : 'ಯಾವುದೇ ಆಫರ್‌ಗಳು ಲಭ್ಯವಿಲ್ಲ'}
            </h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              {language === 'en'
                ? 'When APMC traders review your crop listings and submit rate bids, they will show up here.'
                : 'ವ್ಯಾಪಾರಿಗಳು ನಿಮ್ಮ ಬೆಳೆಗೆ ಆಫರ್ ನೀಡಿದಾಗ ಇಲ್ಲಿ ಕಾಣಿಸಿಕೊಳ್ಳುತ್ತವೆ.'}
            </p>
            <Link
              href="/farmer/add-crop"
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-white bg-[#1B5E20] px-4 py-2.5 rounded-xl hover:bg-green-900 transition"
            >
              <span>{language === 'en' ? 'Post New Crop Lot' : 'ಹೊಸ ಬೆಳೆ ಪೋಸ್ಟ್ ಮಾಡಿ'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOffers.map((offer) => {
              const isAccepted = offer.status === 'accepted';
              const isDeclined = offer.status === 'declined';
              const listing = offer.listing;
              const expectedPrice = listing?.price_per_kg || 0;
              const priceDiff = Number((offer.price_per_kg - expectedPrice).toFixed(2));
              const totalValue = Number((offer.quantity_kg * offer.price_per_kg).toFixed(2));

              return (
                <div
                  key={offer.id}
                  className={`bg-white rounded-2xl p-5 shadow-sm border transition ${
                    isAccepted
                      ? 'border-green-500 bg-green-50/30'
                      : isDeclined
                      ? 'border-gray-200 opacity-60'
                      : 'border-stone-200 hover:border-green-300'
                  }`}
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    {/* Crop & Trader Details */}
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">
                          {listing?.crop?.icon_name || '🌾'}
                        </span>
                        <div>
                          <h3 className="font-extrabold text-base text-gray-900">
                            {language === 'en' ? listing?.crop?.name_en : listing?.crop?.name_kn}{' '}
                            <span className="text-xs font-normal text-gray-500">
                              ({listing?.entered_quantity} {listing?.entered_unit})
                            </span>
                          </h3>
                          <div className="flex items-center space-x-2 text-xs text-gray-600">
                            <Store className="w-3.5 h-3.5 text-[#1B5E20]" />
                            <span className="font-semibold text-gray-900">
                              {offer.seller?.shop_name || 'APMC Commission Shop'}
                            </span>
                            <span className="text-amber-600 font-bold">
                              ★ {offer.seller?.rating_avg || 4.8}
                            </span>
                            <span>•</span>
                            <span className="text-stone-500">
                              {listing?.market?.name_en || 'APMC Yard'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Financial summary */}
                      <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
                        <div className="bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-200">
                          <span className="text-gray-500 block text-[10px] uppercase font-bold">Offered Rate</span>
                          <span className="text-base font-extrabold text-[#1B5E20]">
                            ₹{offer.price_per_kg}/kg
                          </span>
                        </div>

                        <div className="bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-200">
                          <span className="text-gray-500 block text-[10px] uppercase font-bold">Requested Quantity</span>
                          <span className="text-base font-extrabold text-gray-900">
                            {offer.quantity_kg} kg
                          </span>
                        </div>

                        <div className="bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                          <span className="text-emerald-700 block text-[10px] uppercase font-bold">Total Deal Value</span>
                          <span className="text-base font-extrabold text-emerald-950">
                            ₹{totalValue.toLocaleString('en-IN')}
                          </span>
                        </div>

                        <span
                          className={`font-bold px-2 py-1 rounded text-xs ${
                            priceDiff >= 0
                              ? 'bg-green-100 text-green-900 border border-green-200'
                              : 'bg-amber-100 text-amber-900 border border-amber-200'
                          }`}
                        >
                          {priceDiff >= 0
                            ? `+₹${priceDiff}/kg higher than your expected rate`
                            : `-₹${Math.abs(priceDiff)}/kg vs your expected rate`}
                        </span>
                      </div>

                      {/* Visit date and message */}
                      <div className="flex items-center space-x-3 text-xs text-gray-600 pt-1">
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-3.5 h-3.5 text-gray-500" />
                          <span>
                            Proposed Visit:{' '}
                            <strong>
                              {offer.proposed_visit_at
                                ? new Date(offer.proposed_visit_at).toLocaleDateString()
                                : 'Tomorrow Morning'}
                            </strong>
                          </span>
                        </span>
                        {offer.message && (
                          <span className="italic text-gray-500 bg-stone-50 px-2 py-0.5 rounded">
                            "{offer.message}"
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action buttons & unlocked contact */}
                    <div className="w-full md:w-auto flex flex-col items-start md:items-end justify-center space-y-2 shrink-0">
                      {isAccepted ? (
                        <div className="space-y-2 text-right w-full md:w-auto">
                          <span className="inline-flex items-center text-xs font-bold text-green-800 bg-green-100 px-3 py-1 rounded-full border border-green-300">
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-green-700" />
                            Offer Accepted & Visit Booked
                          </span>

                          <div className="p-2.5 bg-white rounded-xl border border-green-300 shadow-sm flex items-center justify-between space-x-3">
                            <div className="text-left">
                              <span className="text-[10px] text-gray-500 block font-bold">Trader Contact</span>
                              <a
                                href={`tel:${offer.seller?.profile?.phone || '+919845044444'}`}
                                className="text-xs font-extrabold text-[#1B5E20] hover:underline flex items-center space-x-1"
                              >
                                <Phone className="w-3.5 h-3.5 text-green-700" />
                                <span>{offer.seller?.profile?.phone || '+91 98450 44444'}</span>
                              </a>
                            </div>

                            <Link
                              href="/visits"
                              className="px-3 py-1.5 bg-[#1B5E20] hover:bg-green-900 text-white text-[11px] font-bold rounded-lg transition"
                            >
                              View Booking →
                            </Link>
                          </div>
                        </div>
                      ) : isDeclined ? (
                        <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200">
                          Offer Declined
                        </span>
                      ) : (
                        <div className="flex items-center space-x-2 w-full md:w-auto">
                          <button
                            type="button"
                            disabled={actionLoading}
                            onClick={() => handleOfferStatus(offer.id, 'accepted')}
                            className="flex-1 md:flex-initial min-h-[44px] px-4 py-2 bg-[#1B5E20] hover:bg-green-900 text-white text-xs font-bold rounded-xl shadow transition flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50"
                          >
                            <CheckCircle2 className="w-4 h-4 text-amber-300" />
                            <span>{language === 'en' ? 'Accept Offer' : 'ಆಫರ್ ಒಪ್ಪಿ'}</span>
                          </button>

                          <button
                            type="button"
                            disabled={actionLoading}
                            onClick={() => handleOfferStatus(offer.id, 'declined')}
                            className="min-h-[44px] px-3 py-2 bg-stone-100 hover:bg-stone-200 text-gray-700 text-xs font-bold rounded-xl border border-stone-300 transition cursor-pointer disabled:opacity-50 flex items-center space-x-1"
                          >
                            <XCircle className="w-4 h-4 text-red-500" />
                            <span>{language === 'en' ? 'Decline' : 'ತಿರಸ್ಕರಿಸಿ'}</span>
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
