'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Navbar } from '@/components/common/Navbar';
import { CropListing, NotificationItem } from '@/types/database';
import {
  Sprout,
  PlusCircle,
  Clock,
  Store,
  MapPin,
  TrendingUp,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  CalendarDays,
  IndianRupee,
  Scale,
  Sparkles,
  Bell,
  ArrowRight,
  ShieldCheck,
  Eye,
} from 'lucide-react';

export default function FarmerDashboard() {
  const { user, loading } = useAuth();
  const { language } = useLanguage();
  const router = useRouter();

  const [listings, setListings] = useState<CropListing[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && (!user || user.profile.role !== 'farmer')) {
      router.push('/auth/login?role=farmer');
      return;
    }

    if (user?.farmerProfile?.id) {
      loadDashboardData();
    }
  }, [user, loading]);

  const loadDashboardData = async () => {
    if (!user?.farmerProfile?.id) return;
    try {
      const [listingsRes, notifRes] = await Promise.all([
        fetch(`/api/listings?farmer_id=${user.farmerProfile.id}`),
        fetch(`/api/notifications?userId=${user.profile.id}`),
      ]);

      const listingsData = await listingsRes.json();
      if (listingsData.listings) {
        setListings(listingsData.listings);
      }

      const notifData = await notifRes.json();
      if (notifData.notifications) {
        setNotifications(notifData.notifications);
      }
    } catch (e) {
      console.error('Failed to load farmer dashboard data', e);
    } finally {
      setFetching(false);
    }
  };

  // Real Database Metrics (Never invented!)
  const totalActiveLots = listings.length;
  const totalOffersCount = listings.reduce((sum, l) => sum + (l.offers?.length || 0), 0);
  const confirmedVisitsCount = listings.filter((l) => l.status === 'visit_confirmed').length;
  const totalAvailableKg = listings.reduce(
    (sum, l) => sum + (l.quantity_remaining_kg ?? l.quantity_kg ?? 0),
    0
  );
  const totalAvailableQuintals = (totalAvailableKg / 100).toFixed(1);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'posted':
        return (
          <span className="inline-flex items-center space-x-1 bg-blue-100 text-blue-900 text-xs font-bold px-3 py-1 rounded-full border border-blue-200">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse mr-1" />
            {language === 'en' ? 'Awaiting Mandi Bids' : 'ಆಫರ್‌ಗಳ ನಿರೀಕ್ಷೆ'}
          </span>
        );
      case 'buyer_interested':
        return (
          <span className="inline-flex items-center space-x-1 bg-amber-100 text-amber-950 text-xs font-extrabold px-3 py-1 rounded-full border border-amber-300 animate-bounce">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 mr-1" />
            {language === 'en' ? 'Offers Received!' : 'ಆಫರ್‌ಗಳು ಬಂದಿವೆ!'}
          </span>
        );
      case 'visit_confirmed':
        return (
          <span className="inline-flex items-center space-x-1 bg-emerald-100 text-emerald-900 text-xs font-bold px-3 py-1 rounded-full border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mr-1" />
            {language === 'en' ? 'Visit Confirmed' : 'ಭೇಟಿ ಖಚಿತಗೊಂಡಿದೆ'}
          </span>
        );
      case 'partially_sold':
        return (
          <span className="inline-flex items-center space-x-1 bg-purple-100 text-purple-900 text-xs font-bold px-3 py-1 rounded-full border border-purple-200">
            {language === 'en' ? 'Partially Sold' : 'ಭಾಗಶಃ ಮಾರಾಟವಾಗಿದೆ'}
          </span>
        );
      case 'sold':
        return (
          <span className="inline-flex items-center space-x-1 bg-stone-200 text-stone-800 text-xs font-bold px-3 py-1 rounded-full">
            {language === 'en' ? 'Sold & Settled' : 'ಮಾರಾಟ ಪೂರ್ಣ'}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 bg-gray-100 text-gray-800 text-xs font-bold px-3 py-1 rounded-full">
            {status}
          </span>
        );
    }
  };

  if (loading || fetching) {
    return (
      <div className="min-h-screen bg-[#FCFAF2] flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-stone-500 font-semibold space-y-3">
          <div className="w-10 h-10 border-4 border-[#0E3911] border-t-transparent rounded-full animate-spin" />
          <p>{language === 'en' ? 'Loading Farmer Hub...' : 'ರೈತರ ಮಾಹಿತಿ ಲೋಡ್ ಆಗುತ್ತಿದೆ...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FCFAF2] text-stone-900">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Profile Card & Prominent Upload Action */}
        <section className="bg-gradient-to-r from-white via-white to-[#FBF8EE] rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0E3911] to-[#1B5E20] text-amber-300 flex items-center justify-center text-2xl shadow">
                🌾
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-[#0E3911]">
                  {user?.profile?.full_name}
                </h1>
                <div className="flex items-center space-x-2 text-xs font-medium text-stone-600 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-[#14532D]" />
                  <span>
                    {user?.farmerProfile?.village || 'Village'},{' '}
                    {user?.farmerProfile?.taluk || 'Taluk'},{' '}
                    {user?.farmerProfile?.district || 'Karnataka'}
                  </span>
                  <span className="text-stone-300">•</span>
                  <span className="text-[#14532D] font-bold">
                    {user?.profile?.phone}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Link
              href="/farmer/offers"
              className="min-h-[52px] px-5 py-3 rounded-2xl bg-amber-100 hover:bg-amber-200 text-stone-950 font-bold text-sm border border-amber-300 flex items-center justify-center space-x-2 transition"
            >
              <IndianRupee className="w-5 h-5 text-amber-800" />
              <span>
                {language === 'en' ? 'Review Offers' : 'ಆಫರ್‌ಗಳನ್ನು ಪರಿಶೀಲಿಸಿ'} ({totalOffersCount})
              </span>
            </Link>

            <Link
              href="/farmer/add-crop"
              className="min-h-[52px] px-6 py-3 rounded-2xl bg-gradient-to-r from-[#0E3911] to-[#1B5E20] hover:from-[#14532D] hover:to-[#2E7D32] text-white font-extrabold text-sm shadow-md hover:shadow-lg flex items-center justify-center space-x-2.5 transition border border-green-800"
            >
              <PlusCircle className="w-5 h-5 text-amber-300" />
              <span>
                {language === 'en' ? 'Upload New Crop Lot' : 'ಹೊಸ ಬೆಳೆ ಸೇರಿಸಿ'}
              </span>
            </Link>
          </div>
        </section>

        {/* 4-Metric Real Statistics Bar */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* 1. Total Active Crop Listings */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs">
            <div className="flex items-center justify-between text-stone-500 text-xs font-bold uppercase tracking-wider">
              <span>{language === 'en' ? 'Active Listings' : 'ಸಕ್ರಿಯ ಬೆಳೆಗಳು'}</span>
              <Sprout className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-3xl font-black text-[#0E3911] mt-2">
              {totalActiveLots}
            </div>
            <div className="text-[11px] text-stone-500 mt-1">
              {language === 'en' ? 'Currently live for traders' : 'ವ್ಯಾಪಾರಿಗಳಿಗೆ ಲಭ್ಯವಿವೆ'}
            </div>
          </div>

          {/* 2. Offers Received */}
          <Link
            href="/farmer/offers"
            className="group bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs hover:border-amber-500 hover:shadow-md transition block"
          >
            <div className="flex items-center justify-between text-stone-500 text-xs font-bold uppercase tracking-wider group-hover:text-amber-800 transition">
              <span>{language === 'en' ? 'Offers Received' : 'ಬಂದಿರುವ ಆಫರ್‌ಗಳು'}</span>
              <IndianRupee className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-3xl font-black text-amber-600 mt-2">
              {totalOffersCount}
            </div>
            <div className="text-[11px] text-amber-700 font-bold mt-1 group-hover:underline flex items-center space-x-1">
              <span>{language === 'en' ? 'Compare & Accept →' : 'ಹೋಲಿಸಿ ಒಪ್ಪಿಕೊಳ್ಳಿ →'}</span>
            </div>
          </Link>

          {/* 3. Confirmed Seller Visits */}
          <Link
            href="/visits"
            className="group bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs hover:border-emerald-500 hover:shadow-md transition block"
          >
            <div className="flex items-center justify-between text-stone-500 text-xs font-bold uppercase tracking-wider group-hover:text-emerald-800 transition">
              <span>{language === 'en' ? 'Confirmed Visits' : 'ಖಚಿತ ಭೇಟಿಗಳು'}</span>
              <CalendarDays className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-3xl font-black text-[#14532D] mt-2">
              {confirmedVisitsCount}
            </div>
            <div className="text-[11px] text-emerald-700 font-bold mt-1 group-hover:underline flex items-center space-x-1">
              <span>{language === 'en' ? 'Mandi Gate QR Pass →' : 'ಗೇಟ್ ಪಾಸ್ ಕ್ಯೂಆರ್ ನೋಡಿ →'}</span>
            </div>
          </Link>

          {/* 4. Quantity Available for Sale */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs">
            <div className="flex items-center justify-between text-stone-500 text-xs font-bold uppercase tracking-wider">
              <span>{language === 'en' ? 'Available for Sale' : 'ಮಾರಾಟಕ್ಕೆ ಲಭ್ಯವಿರುವ ಪ್ರಮಾಣ'}</span>
              <Scale className="w-4 h-4 text-teal-600" />
            </div>
            <div className="text-3xl font-black text-teal-800 mt-2">
              {totalAvailableQuintals} <span className="text-sm font-semibold text-stone-500">qtl</span>
            </div>
            <div className="text-[11px] text-stone-500 mt-1">
              {totalAvailableKg.toLocaleString('en-IN')} kg total crop weight
            </div>
          </div>
        </section>

        {/* Crop Lots Grid Section */}
        <section className="space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-2xl font-black text-[#0E3911] tracking-tight">
                {language === 'en' ? 'My Crop Lots for Sale' : 'ನನ್ನ ಮಾರಾಟದ ಬೆಳೆಗಳು'}
              </h2>
              <p className="text-xs text-stone-500">
                {language === 'en'
                  ? 'Manage your pre-harvest postings, inspect trader bids, and track confirmed arrivals.'
                  : 'ನಿಮ್ಮ ಬೆಳೆಗಳು, ಬಂದಿರುವ ಆಫರ್‌ಗಳು ಮತ್ತು ಮಂಡಿ ಭೇಟಿಯನ್ನು ನಿರ್ವಹಿಸಿ.'}
              </p>
            </div>

            <span className="text-xs font-bold text-stone-600 bg-stone-100 px-3 py-1 rounded-full border border-stone-200">
              {listings.length} {language === 'en' ? 'Active Postings' : 'ಬೆಳೆಗಳು'}
            </span>
          </div>

          {listings.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-stone-200 space-y-4">
              <div className="w-16 h-16 rounded-full bg-green-50 text-[#0E3911] flex items-center justify-center mx-auto text-3xl">
                🌾
              </div>
              <h3 className="text-xl font-bold text-stone-900">
                {language === 'en' ? 'No crops posted yet' : 'ಇನ್ನೂ ಯಾವುದೇ ಬೆಳೆ ಸೇರಿಸಿಲ್ಲ'}
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
                {language === 'en'
                  ? 'Post your harvested or near-harvest crop lot now. Registered APMC traders in Hubballi and Belagavi will send direct price bids.'
                  : 'ನಿಮ್ಮ ಬೆಳೆಯ ವಿವರಗಳನ್ನು ಪೋಸ್ಟ್ ಮಾಡಿ. ಹುಬ್ಬಳ್ಳಿ ಮತ್ತು ಬೆಳಗಾವಿ ಎಪಿಎಂಸಿ ವ್ಯಾಪಾರಿಗಳಿಂದ ನೇರ ಆಫರ್ ಪಡೆಯಿರಿ.'}
              </p>
              <Link
                href="/farmer/add-crop"
                className="inline-flex items-center space-x-2 bg-[#0E3911] hover:bg-[#14532D] text-white px-6 py-3 rounded-2xl font-bold text-sm shadow transition"
              >
                <PlusCircle className="w-5 h-5 text-amber-300" />
                <span>{language === 'en' ? 'Post My First Crop Lot' : 'ಮೊದಲ ಬೆಳೆ ಸೇರಿಸಿ'}</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {listings.map((l) => {
                const primaryImage = l.images?.[0]?.storage_path;
                const cropName = language === 'en' ? l.crop?.name_en : l.crop?.name_kn;
                const marketName = language === 'en' ? l.market?.name_en : l.market?.name_kn;
                const offersCount = l.offers?.length || 0;
                const grade = l.quality_assessment?.grade || 'Grade A';

                return (
                  <div
                    key={l.id}
                    className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm hover:shadow-md hover:border-green-600 transition flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-4">
                      {/* Header with Photo & Title */}
                      <div className="flex items-start space-x-4">
                        <div className="w-20 h-20 rounded-2xl bg-stone-100 overflow-hidden shrink-0 border border-stone-200">
                          {primaryImage ? (
                            <img
                              src={primaryImage}
                              alt={cropName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-4xl bg-amber-50">
                              {l.crop?.icon_name || '🌱'}
                            </div>
                          )}
                        </div>

                        <div className="space-y-1 flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-black text-lg text-stone-900">
                              {cropName}
                            </h3>
                            {getStatusBadge(l.status)}
                          </div>

                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-stone-600">
                            <span className="flex items-center">
                              <Store className="w-3.5 h-3.5 mr-1 text-[#14532D]" />
                              {marketName}
                            </span>
                            <span>•</span>
                            <span className="flex items-center">
                              <Clock className="w-3.5 h-3.5 mr-1 text-amber-600" />
                              {language === 'en' ? 'Harvest:' : 'ಕೊಯ್ಲು:'} {l.harvest_date}
                            </span>
                          </div>

                          <div className="pt-0.5">
                            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-green-100 text-[#0E3911] border border-green-300">
                              <Sparkles className="w-3 h-3 text-[#14532D]" />
                              <span>{grade}</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Quantity & Rate Breakdown */}
                      <div className="grid grid-cols-2 gap-3 bg-[#FCFAF2] p-3 rounded-2xl border border-stone-200/80 text-xs">
                        <div>
                          <div className="text-stone-500 font-bold uppercase text-[10px]">
                            {language === 'en' ? 'Available Quantity' : 'ಲಭ್ಯವಿರುವ ಪ್ರಮಾಣ'}
                          </div>
                          <div className="font-black text-stone-900 text-sm mt-0.5">
                            {l.quantity_remaining_kg ?? l.quantity_kg} kg{' '}
                            <span className="text-[11px] font-medium text-stone-500">
                              ({l.entered_quantity} {l.entered_unit})
                            </span>
                          </div>
                        </div>

                        <div>
                          <div className="text-stone-500 font-bold uppercase text-[10px]">
                            {language === 'en' ? 'Expected Farmer Rate' : 'ನಿರೀಕ್ಷಿತ ದರ'}
                          </div>
                          <div className="font-black text-[#0E3911] text-sm mt-0.5">
                            ₹{l.price_per_kg}/kg{' '}
                            <span className="text-[11px] font-medium text-stone-500">
                              (₹{l.entered_price}/{l.entered_price_unit})
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="pt-2 border-t border-stone-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
                      <Link
                        href={`/farmer/listings/${l.id}`}
                        className="min-h-[44px] px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-900 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 transition border border-stone-200"
                      >
                        <Eye className="w-3.5 h-3.5 text-stone-600" />
                        <span>{language === 'en' ? 'Crop Details & Quality' : 'ಬೆಳೆ ವಿವರ'}</span>
                      </Link>

                      <Link
                        href="/farmer/offers"
                        className="min-h-[44px] px-4 py-2 bg-[#0E3911] hover:bg-[#14532D] text-white rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition shadow-sm"
                      >
                        <IndianRupee className="w-3.5 h-3.5 text-amber-300" />
                        <span>
                          {language === 'en' ? 'Compare Offers' : 'ಆಫರ್ ಹೋಲಿಸಿ'} ({offersCount})
                        </span>
                        <ChevronRight className="w-4 h-4 text-amber-300" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Notifications and Activity Feed */}
        {notifications.length > 0 && (
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-4">
            <div className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-amber-500" />
              <h2 className="text-xl font-extrabold text-stone-900">
                {language === 'en' ? 'Recent Mandi Notifications' : 'ಇತ್ತೀಚಿನ ಸೂಚನೆಗಳು'}
              </h2>
            </div>

            <div className="divide-y divide-stone-100">
              {notifications.slice(0, 5).map((n) => (
                <div key={n.id} className="py-3 flex items-start justify-between gap-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 text-[#0E3911] flex items-center justify-center text-sm shrink-0 mt-0.5">
                      ✓
                    </div>
                    <div>
                      <div className="text-xs font-bold text-stone-900">
                        {n.type === 'new_crop_listing'
                          ? (language === 'en' ? 'Matching Crop Lot' : 'ಹೊಸ ಬೆಳೆ ಲಭ್ಯ')
                          : n.type === 'offer_accepted'
                          ? (language === 'en' ? 'Deal Confirmed by Farmer' : 'ಆಫರ್ ಒಪ್ಪಿಕೊಳ್ಳಲಾಗಿದೆ')
                          : (language === 'en' ? 'Direct Buyer Offer Received' : 'ಹೊಸ ಆಫರ್ ಬಂದಿದೆ')}
                      </div>
                      <p className="text-xs text-stone-600 mt-0.5">
                        {n.type === 'offer_accepted'
                          ? `Offer confirmed for ${(n.payload as any)?.accepted_kg} kg. Phone number unlocked.`
                          : `Offer from ${(n.payload as any)?.shop_name || 'APMC Trader'} at ₹${(n.payload as any)?.offered_price_per_kg || (n.payload as any)?.price_per_kg || 22}/kg.`}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] text-stone-400 shrink-0">
                    {new Date(n.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
