'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Navbar } from '@/components/common/Navbar';
import { CropListing } from '@/types/database';
import {
  Sprout,
  PlusCircle,
  Clock,
  Store,
  MapPin,
  TrendingUp,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';

export default function FarmerDashboard() {
  const { user, loading } = useAuth();
  const { language } = useLanguage();
  const router = useRouter();

  const [listings, setListings] = useState<CropListing[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && (!user || user.profile.role !== 'farmer')) {
      router.push('/auth/login?role=farmer');
      return;
    }

    if (user?.farmerProfile?.id) {
      fetchListings();
    }
  }, [user, loading]);

  const fetchListings = async () => {
    if (!user?.farmerProfile?.id) return;
    try {
      const res = await fetch(`/api/listings?farmer_id=${user.farmerProfile.id}`);
      const data = await res.json();
      if (data.listings) {
        setListings(data.listings);
      }
    } catch (e) {
      console.error('Failed to load listings', e);
    } finally {
      setFetching(false);
    }
  };

  const totalOffersCount = listings.reduce((sum, l) => sum + (l.offers?.length || 0), 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'posted':
        return (
          <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-blue-200">
            {language === 'en' ? 'Posted • Awaiting Offers' : 'ಪೋಸ್ಟ್ ಆಗಿದೆ • ಆಫರ್‌ಗಳ ನಿರೀಕ್ಷೆ'}
          </span>
        );
      case 'buyer_interested':
        return (
          <span className="bg-amber-100 text-amber-900 text-xs font-bold px-2.5 py-0.5 rounded-full border border-amber-300 animate-pulse">
            {language === 'en' ? 'Offers Received!' : 'ಆಫರ್‌ಗಳು ಬಂದಿವೆ!'}
          </span>
        );
      case 'visit_confirmed':
        return (
          <span className="bg-green-100 text-green-900 text-xs font-bold px-2.5 py-0.5 rounded-full border border-green-300">
            {language === 'en' ? 'Visit Confirmed' : 'ಭೇಟಿ ಖಚಿತಗೊಂಡಿದೆ'}
          </span>
        );
      case 'partially_sold':
        return (
          <span className="bg-purple-100 text-purple-900 text-xs font-bold px-2.5 py-0.5 rounded-full border border-purple-200">
            {language === 'en' ? 'Partially Sold' : 'ಭಾಗಶಃ ಮಾರಾಟವಾಗಿದೆ'}
          </span>
        );
      case 'sold':
        return (
          <span className="bg-stone-200 text-stone-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
            {language === 'en' ? 'Sold' : 'ಮಾರಾಟ ಪೂರ್ಣ'}
          </span>
        );
      default:
        return (
          <span className="bg-gray-100 text-gray-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
            {status}
          </span>
        );
    }
  };

  if (loading || fetching) {
    return (
      <div className="min-h-screen bg-[#FFF8E1] flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-8 text-gray-500 font-semibold">
          {language === 'en' ? 'Loading Farmer Hub...' : 'ಲೋಡ್ ಆಗುತ್ತಿದೆ...'}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF8E1]">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 space-y-6">
        {/* Welcome & Profile Card */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-xl">🌾</span>
              <h2 className="text-xl font-bold text-gray-900">
                {user?.profile?.full_name}
              </h2>
            </div>
            <div className="flex items-center space-x-2 text-xs text-gray-600">
              <MapPin className="w-3.5 h-3.5 text-[#1B5E20]" />
              <span>
                {user?.farmerProfile?.village}, {user?.farmerProfile?.taluk} Taluk,{' '}
                {user?.farmerProfile?.district} District
              </span>
            </div>
          </div>

          <Link
            href="/farmer/add-crop"
            className="w-full sm:w-auto min-h-[48px] bg-[#1B5E20] hover:bg-green-900 text-white font-bold px-5 py-2.5 rounded-xl shadow-md flex items-center justify-center space-x-2 transition cursor-pointer"
          >
            <PlusCircle className="w-5 h-5 text-amber-300" />
            <span>
              {language === 'en' ? 'Post New Crop Lot' : 'ಹೊಸ ಬೆಳೆ ಸೇರಿಸಿ'}
            </span>
          </Link>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm text-center">
            <div className="text-xs text-gray-500 font-semibold">
              {language === 'en' ? 'My Active Lots' : 'ನನ್ನ ಸಕ್ರಿಯ ಬೆಳೆಗಳು'}
            </div>
            <div className="text-2xl font-extrabold text-[#1B5E20] mt-1">
              {listings.length}
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm text-center">
            <div className="text-xs text-gray-500 font-semibold">
              {language === 'en' ? 'Bids / Offers' : 'ಬಂದಿರುವ ಆಫರ್‌ಗಳು'}
            </div>
            <div className="text-2xl font-extrabold text-amber-600 mt-1">
              {totalOffersCount}
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1 bg-white p-4 rounded-xl border border-stone-200 shadow-sm text-center">
            <div className="text-xs text-gray-500 font-semibold">
              {language === 'en' ? 'Connected Mandis' : 'ಸಂಪರ್ಕಿತ ಎಪಿಎಂಸಿ'}
            </div>
            <div className="text-sm font-bold text-gray-800 mt-2">
              Hubballi & Belagavi
            </div>
          </div>
        </div>

        {/* Listings Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-lg text-gray-900 flex items-center space-x-2">
              <span>{language === 'en' ? 'My Crop Listings' : 'ನನ್ನ ಬೆಳೆಗಳ ವಿವರ'}</span>
            </h3>
            <span className="text-xs text-gray-500">
              {listings.length} {language === 'en' ? 'lots' : 'ಬೆಳೆಗಳು'}
            </span>
          </div>

          {listings.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-stone-200 space-y-3">
              <Sprout className="w-12 h-12 text-gray-300 mx-auto" />
              <h4 className="font-bold text-gray-800">
                {language === 'en' ? 'No crops posted yet' : 'ಇನ್ನೂ ಯಾವುದೇ ಬೆಳೆ ಸೇರಿಸಿಲ್ಲ'}
              </h4>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                {language === 'en'
                  ? 'Post your harvested crop now so matching APMC traders can make offers before you travel.'
                  : 'ನಿಮ್ಮ ಕೊಯ್ಲು ಮಾಡಿದ ಬೆಳೆಯ ವಿವರಗಳನ್ನು ಪೋಸ್ಟ್ ಮಾಡಿ, ವ್ಯಾಪಾರಿಗಳಿಂದ ದರ ಆಫರ್ ಪಡೆಯಿರಿ.'}
              </p>
              <Link
                href="/farmer/add-crop"
                className="inline-flex items-center space-x-2 bg-[#1B5E20] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow hover:bg-green-900"
              >
                <PlusCircle className="w-4 h-4 text-amber-300" />
                <span>{language === 'en' ? 'Post First Crop' : 'ಮೊದಲ ಬೆಳೆ ಸೇರಿಸಿ'}</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {listings.map((l) => (
                <Link
                  key={l.id}
                  href={`/farmer/listings/${l.id}`}
                  className="block bg-white rounded-2xl p-4 shadow-sm border border-stone-200 hover:border-green-600 transition"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-14 h-14 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-center text-3xl shrink-0">
                        {l.crop?.icon_name || '🌱'}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-bold text-base text-gray-900">
                            {language === 'en' ? l.crop?.name_en : l.crop?.name_kn}
                          </h4>
                          {getStatusBadge(l.status)}
                        </div>
                        <div className="text-xs text-gray-600 flex flex-wrap gap-x-3 gap-y-1">
                          <span className="font-semibold text-gray-800">
                            {l.entered_quantity} {l.entered_unit}
                          </span>
                          <span>•</span>
                          <span className="font-bold text-[#1B5E20]">
                            ₹{l.entered_price} / {l.entered_price_unit}
                          </span>
                          <span>•</span>
                          <span className="flex items-center text-stone-600">
                            <Store className="w-3.5 h-3.5 mr-1" />
                            {language === 'en' ? l.market?.name_en : l.market?.name_kn}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end space-x-3 pt-2 sm:pt-0 border-t sm:border-0 border-gray-100">
                      <div className="text-right">
                        <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                          {l.offers?.length || 0} {language === 'en' ? 'Offers' : 'ಆಫರ್‌ಗಳು'}
                        </span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
