'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Navbar } from '@/components/common/Navbar';
import { CropListing } from '@/types/database';
import {
  Store,
  MapPin,
  Clock,
  Sparkles,
  Search,
  Filter,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export default function SellerDashboard() {
  const { user, loading } = useAuth();
  const { language } = useLanguage();
  const router = useRouter();

  const [listings, setListings] = useState<CropListing[]>([]);
  const [selectedCropFilter, setSelectedCropFilter] = useState<string>('all');
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && (!user || user.profile.role !== 'seller')) {
      router.push('/auth/login?role=seller');
      return;
    }

    fetchFeed();
  }, [user, loading]);

  const fetchFeed = async () => {
    try {
      const res = await fetch('/api/listings');
      const data = await res.json();
      if (data.listings) {
        setListings(data.listings);
      }
    } catch (e) {
      console.error('Failed to load seller feed', e);
    } finally {
      setFetching(false);
    }
  };

  const sellerSubscribedMarkets = user?.sellerProfile?.subscribedMarkets || [];
  const sellerPreferredCrops = user?.sellerProfile?.preferred_crops || [];

  // Filter listings by seller's markets and active statuses
  const matchingListings = listings.filter((l) => {
    // If seller has specific markets, match them; else show all for demo
    const marketMatches =
      sellerSubscribedMarkets.length === 0 ||
      sellerSubscribedMarkets.includes(l.market_id);

    const cropMatches =
      selectedCropFilter === 'all' ||
      l.crop?.name_en.toLowerCase() === selectedCropFilter.toLowerCase();

    return marketMatches && cropMatches && !['cancelled', 'expired'].includes(l.status);
  });

  if (loading || fetching) {
    return (
      <div className="min-h-screen bg-[#FFF8E1] flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-8 text-gray-500 font-semibold">
          {language === 'en' ? 'Loading Mandi Feed...' : 'ಮಂಡಿ ಫೀಡ್ ಲೋಡ್ ಆಗುತ್ತಿದೆ...'}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF8E1]">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 space-y-6">
        {/* Trader Profile Header */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Store className="w-6 h-6 text-[#1B5E20]" />
              <h2 className="text-xl font-bold text-gray-900">
                {user?.sellerProfile?.shop_name || user?.profile?.full_name}
              </h2>
              <span className="text-xs bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full">
                ★ {user?.sellerProfile?.rating_avg || 4.8}
              </span>
            </div>

            <div className="text-xs text-gray-600 flex flex-wrap gap-x-2">
              <span>
                {language === 'en' ? 'Mandi Market:' : 'ಕಾರ್ಯನಿರ್ವಹಿಸುವ ಮಾರುಕಟ್ಟೆ:'}{' '}
                <strong>Hubballi APMC</strong>
              </span>
              <span>•</span>
              <span>
                {language === 'en' ? 'Preferred Crops:' : 'ಆಸಕ್ತಿಯ ಬೆಳೆಗಳು:'}{' '}
                <strong>{sellerPreferredCrops.join(', ') || 'Tomato, Onion, Potato'}</strong>
              </span>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 px-3 py-2 rounded-xl text-xs font-semibold text-green-900">
            {matchingListings.length} {language === 'en' ? 'active lots in your mandi' : 'ಲಭ್ಯವಿರುವ ಬೆಳೆಗಳು'}
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between overflow-x-auto pb-2 gap-2 scrollbar-none">
          <div className="flex space-x-2">
            {['all', 'Tomato', 'Onion', 'Potato', 'Green Chilli', 'Maize'].map((cropName) => (
              <button
                key={cropName}
                onClick={() => setSelectedCropFilter(cropName)}
                className={`min-h-[38px] px-3.5 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  selectedCropFilter === cropName
                    ? 'bg-[#1B5E20] text-white shadow'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-stone-50'
                }`}
              >
                {cropName === 'all'
                  ? (language === 'en' ? 'All Crops' : 'ಎಲ್ಲಾ ಬೆಳೆಗಳು')
                  : cropName}
              </button>
            ))}
          </div>
        </div>

        {/* Listings Feed */}
        <div className="space-y-4">
          <h3 className="font-extrabold text-lg text-gray-900">
            {language === 'en' ? 'Fresh Pre-Harvest Lots' : 'ರೈತರಿಂದ ಲಭ್ಯವಿರುವ ಬೆಳೆಗಳು'}
          </h3>

          {matchingListings.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-stone-200 space-y-2">
              <Store className="w-10 h-10 text-gray-300 mx-auto" />
              <h4 className="font-bold text-gray-800">
                {language === 'en' ? 'No matching crops in this filter' : 'ಯಾವುದೇ ಬೆಳೆ ಕಂಡುಬಂದಿಲ್ಲ'}
              </h4>
              <p className="text-xs text-gray-500">
                {language === 'en'
                  ? 'Try selecting "All Crops" or check back shortly.'
                  : '"ಎಲ್ಲಾ ಬೆಳೆಗಳು" ಆಯ್ಕೆ ಮಾಡಿ ಪರಿಶೀಲಿಸಿ.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {matchingListings.map((listing) => {
                const isPreferred = listing.crop
                  ? sellerPreferredCrops.includes(listing.crop.name_en)
                  : false;

                return (
                  <div
                    key={listing.id}
                    className="bg-white rounded-2xl p-4 shadow-sm border border-stone-200 hover:border-green-600 transition flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-3">
                      {/* Photo & Crop Title */}
                      <div className="flex items-start space-x-3">
                        <div className="w-16 h-16 rounded-xl bg-amber-50 border border-amber-200 overflow-hidden shrink-0 flex items-center justify-center text-3xl">
                          {listing.images?.[0]?.storage_path ? (
                            <img
                              src={listing.images[0].storage_path}
                              alt="Crop"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            listing.crop?.icon_name || '🌱'
                          )}
                        </div>

                        <div className="space-y-0.5 flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-extrabold text-base text-gray-900">
                              {language === 'en' ? listing.crop?.name_en : listing.crop?.name_kn}
                            </h4>
                            {isPreferred ? (
                              <span className="text-[10px] font-bold bg-green-100 text-[#1B5E20] px-2 py-0.5 rounded-full border border-green-300 flex items-center">
                                <Sparkles className="w-3 h-3 mr-0.5" />
                                {language === 'en' ? 'Your Crop' : 'ನಿಮ್ಮ ಬೆಳೆ'}
                              </span>
                            ) : (
                              <span className="text-[10px] font-semibold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                                {language === 'en' ? 'Other' : 'ಇತರೆ'}
                              </span>
                            )}
                          </div>

                          <div className="text-xs text-gray-500 flex items-center">
                            <MapPin className="w-3.5 h-3.5 mr-1 text-[#1B5E20]" />
                            <span>
                              {listing.farmer?.profile?.full_name?.split(' ')[0] || 'Farmer'},{' '}
                              {listing.farmer?.village || 'Karnataka'}
                            </span>
                          </div>

                          <div className="text-xs text-gray-500 flex items-center">
                            <Clock className="w-3.5 h-3.5 mr-1" />
                            <span>
                              {language === 'en' ? 'Harvest:' : 'ಕೊಯ್ಲು:'} {listing.harvest_date}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Quantity & Price Details */}
                      <div className="grid grid-cols-2 gap-2 bg-stone-50 p-2.5 rounded-xl border border-stone-200 text-center">
                        <div>
                          <div className="text-[11px] text-gray-500 font-semibold">
                            {language === 'en' ? 'Available Qty' : 'ಲಭ್ಯವಿರುವ ಪ್ರಮಾಣ'}
                          </div>
                          <div className="text-sm font-bold text-gray-900">
                            {listing.quantity_remaining_kg} kg
                          </div>
                        </div>
                        <div>
                          <div className="text-[11px] text-gray-500 font-semibold">
                            {language === 'en' ? 'Asking Price' : 'ನಿರೀಕ್ಷಿತ ದರ'}
                          </div>
                          <div className="text-sm font-bold text-[#1B5E20]">
                            ₹{listing.price_per_kg}/kg
                          </div>
                        </div>
                      </div>

                      {listing.description && (
                        <p className="text-xs text-gray-600 line-clamp-2 italic">
                          "{listing.description}"
                        </p>
                      )}
                    </div>

                    {/* Action Button */}
                    <Link
                      href={`/seller/listings/${listing.id}`}
                      className="min-h-[46px] w-full bg-[#1B5E20] hover:bg-green-900 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center space-x-2 shadow transition cursor-pointer"
                    >
                      <span>
                        {language === 'en' ? 'Interested, Submit Offer' : 'ಆಸಕ್ತಿಯಿದೆ, ಆಫರ್ ನೀಡಿ'}
                      </span>
                      <ArrowRight className="w-4 h-4 text-amber-300" />
                    </Link>
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
