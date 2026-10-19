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
  ShieldCheck,
  Star,
  CalendarDays,
  IndianRupee,
  Scale,
  CheckCircle2,
  SlidersHorizontal,
  ChevronRight,
  Eye,
} from 'lucide-react';

export default function SellerDashboard() {
  const { user, loading } = useAuth();
  const { language } = useLanguage();
  const router = useRouter();

  const [listings, setListings] = useState<CropListing[]>([]);
  const [selectedCropFilter, setSelectedCropFilter] = useState<string>('all');
  const [selectedMandiFilter, setSelectedMandiFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'date' | 'price_asc' | 'price_desc' | 'qty_desc'>('date');
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

  const sellerPreferredCrops = user?.sellerProfile?.preferred_crops || [];

  // Filter listings based on user filters & search query
  const filteredListings = listings.filter((l) => {
    // Exclude cancelled/expired
    if (['cancelled', 'expired'].includes(l.status)) return false;

    // Crop filter
    const cropMatches =
      selectedCropFilter === 'all' ||
      l.crop?.name_en.toLowerCase() === selectedCropFilter.toLowerCase();

    // Mandi filter
    const mandiMatches =
      selectedMandiFilter === 'all' ||
      l.market?.name_en?.toLowerCase().includes(selectedMandiFilter.toLowerCase());

    // Search query
    const query = searchQuery.trim().toLowerCase();
    const searchMatches =
      !query ||
      l.crop?.name_en?.toLowerCase().includes(query) ||
      l.crop?.name_kn?.toLowerCase().includes(query) ||
      l.farmer?.profile?.full_name?.toLowerCase().includes(query) ||
      l.farmer?.village?.toLowerCase().includes(query);

    return cropMatches && mandiMatches && searchMatches;
  });

  // Sort listings
  const sortedListings = [...filteredListings].sort((a, b) => {
    if (sortBy === 'price_asc') return a.price_per_kg - b.price_per_kg;
    if (sortBy === 'price_desc') return b.price_per_kg - a.price_per_kg;
    if (sortBy === 'qty_desc') return (b.quantity_remaining_kg || b.quantity_kg) - (a.quantity_remaining_kg || a.quantity_kg);
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  if (loading || fetching) {
    return (
      <div className="min-h-screen bg-[#FCFAF2] flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-stone-500 font-semibold space-y-3">
          <div className="w-10 h-10 border-4 border-[#0E3911] border-t-transparent rounded-full animate-spin" />
          <p>{language === 'en' ? 'Loading Mandi Trader Feed...' : 'ಮಂಡಿ ಫೀಡ್ ಲೋಡ್ ಆಗುತ್ತಿದೆ...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FCFAF2] text-stone-900">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Trader Profile Banner */}
        <section className="bg-gradient-to-r from-white via-white to-[#FBF8EE] rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0E3911] to-[#1B5E20] text-amber-300 flex items-center justify-center text-2xl shadow">
                🏪
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-2xl sm:text-3xl font-black text-[#0E3911]">
                    {user?.sellerProfile?.shop_name || user?.profile?.full_name || 'APMC Commission Shop'}
                  </h1>
                  <span className="inline-flex items-center space-x-1 bg-amber-100 text-stone-900 text-xs font-black px-2.5 py-0.5 rounded-full border border-amber-300">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>{user?.sellerProfile?.rating_avg || '4.8'} Verified APMC</span>
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-stone-600 mt-1">
                  <span className="flex items-center">
                    <Store className="w-3.5 h-3.5 mr-1 text-[#14532D]" />
                    <span>
                      {language === 'en' ? 'Primary Market:' : 'ಮಾರುಕಟ್ಟೆ:'}{' '}
                      <strong className="text-stone-800">Hubballi APMC (Amaragol)</strong>
                    </span>
                  </span>
                  <span>•</span>
                  <span>
                    {language === 'en' ? 'Commission Licence:' : 'ಲೈಸೆನ್ಸ್:'}{' '}
                    <strong className="text-stone-800">APMC-HUB-2024-C92</strong>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Link
              href="/visits"
              className="min-h-[50px] px-5 py-3 rounded-2xl bg-[#0E3911] hover:bg-[#14532D] text-white font-extrabold text-xs sm:text-sm shadow-md flex items-center justify-center space-x-2 transition border border-green-800"
            >
              <CalendarDays className="w-4 h-4 text-amber-300" />
              <span>
                {language === 'en' ? 'Confirmed Deals & Gate Pass' : 'ಖಚಿತ ಡೀಲ್‌ಗಳು & ಗೇಟ್ ಪಾಸ್'}
              </span>
              <ChevronRight className="w-4 h-4 text-amber-300" />
            </Link>
          </div>
        </section>

        {/* Multi-Dimensional Filter Toolbar */}
        <section className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  language === 'en'
                    ? 'Search crop name, village, or farmer name...'
                    : 'ಬೆಳೆ, ಗ್ರಾಮ ಅಥವಾ ರೈತರ ಹೆಸರನ್ನು ಹುಡುಕಿ...'
                }
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-stone-200 bg-[#FCFAF2] text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:bg-white transition"
              />
            </div>

            {/* Mandi Selector */}
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-stone-500 whitespace-nowrap">
                {language === 'en' ? 'Mandi:' : 'ಮಂಡಿ:'}
              </span>
              <select
                value={selectedMandiFilter}
                onChange={(e) => setSelectedMandiFilter(e.target.value)}
                className="py-2.5 px-3 rounded-xl border border-stone-200 bg-[#FCFAF2] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-green-600"
              >
                <option value="all">{language === 'en' ? 'All Mandis' : 'ಎಲ್ಲಾ ಮಂಡಿಗಳು'}</option>
                <option value="Hubballi">Hubballi APMC</option>
                <option value="Belagavi">Belagavi APMC</option>
                <option value="Yeshwanthpur">Yeshwanthpur APMC</option>
              </select>
            </div>

            {/* Sort Selector */}
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-stone-500 whitespace-nowrap">
                {language === 'en' ? 'Sort:' : 'ವಿಂಗಡಣೆ:'}
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="py-2.5 px-3 rounded-xl border border-stone-200 bg-[#FCFAF2] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-green-600"
              >
                <option value="date">{language === 'en' ? 'Latest Harvest' : 'ಹೊಸ ಕೊಯ್ಲು'}</option>
                <option value="price_asc">{language === 'en' ? 'Price: Low to High' : 'ಕಡಿಮೆ ದರ'}</option>
                <option value="price_desc">{language === 'en' ? 'Price: High to Low' : 'ಹೆಚ್ಚಿನ ದರ'}</option>
                <option value="qty_desc">{language === 'en' ? 'Highest Quantity' : 'ಹೆಚ್ಚಿನ ಪ್ರಮಾಣ'}</option>
              </select>
            </div>
          </div>

          {/* Crop Pill Filters */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-bold text-stone-500 mr-1 shrink-0">
              {language === 'en' ? 'Crops:' : 'ಬೆಳೆಗಳು:'}
            </span>
            {['all', 'Tomato', 'Onion', 'Potato', 'Green Chilli', 'Maize'].map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCropFilter(c)}
                className={`min-h-[38px] px-4 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  selectedCropFilter === c
                    ? 'bg-[#0E3911] text-amber-300 shadow-sm'
                    : 'bg-[#FCFAF2] text-stone-700 border border-stone-200 hover:bg-stone-100'
                }`}
              >
                {c === 'all'
                  ? (language === 'en' ? 'All Crops' : 'ಎಲ್ಲಾ ಬೆಳೆಗಳು')
                  : c}
              </button>
            ))}
          </div>
        </section>

        {/* Listings Feed Header */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-[#0E3911] tracking-tight">
                {language === 'en' ? 'Live Pre-Harvest Mandi Feed' : 'ತಾಜಾ ಬೆಳೆಗಳ ವಿವರ'}
              </h2>
              <p className="text-xs text-stone-500">
                {language === 'en'
                  ? 'Submit direct bids on verified crop lots before the farmer dispatches to the APMC yard.'
                  : 'ರೈತರು ಮಂಡಿಗೆ ಹೊರಡುವ ಮುನ್ನವೇ ನೇರ ದರ ಆಫರ್ ನೀಡಿ.'}
              </p>
            </div>

            <span className="text-xs font-bold text-stone-600 bg-stone-100 px-3 py-1 rounded-full border border-stone-200">
              {sortedListings.length} {language === 'en' ? 'Lots Matching' : 'ಬೆಳೆಗಳು ಲಭ್ಯ'}
            </span>
          </div>

          {sortedListings.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-stone-200 space-y-3">
              <Store className="w-12 h-12 text-stone-300 mx-auto" />
              <h3 className="text-lg font-bold text-stone-800">
                {language === 'en' ? 'No matching crop lots found' : 'ಯಾವುದೇ ಬೆಳೆ ಕಂಡುಬಂದಿಲ್ಲ'}
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                {language === 'en'
                  ? 'Try clearing your filters or selecting "All Crops" to view available mandi arrivals.'
                  : 'ಫಿಲ್ಟರ್ ತೆಗೆದು "ಎಲ್ಲಾ ಬೆಳೆಗಳು" ಆಯ್ಕೆ ಮಾಡಿ ಪರಿಶೀಲಿಸಿ.'}
              </p>
              <button
                onClick={() => {
                  setSelectedCropFilter('all');
                  setSelectedMandiFilter('all');
                  setSearchQuery('');
                }}
                className="px-5 py-2.5 rounded-xl bg-[#0E3911] text-white text-xs font-bold hover:bg-[#14532D]"
              >
                {language === 'en' ? 'Reset Filters' : 'ಫಿಲ್ಟರ್ ಮರುಹೊಂದಿಸಿ'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedListings.map((listing) => {
                const primaryImage = listing.images?.[0]?.storage_path;
                const cropName = language === 'en' ? listing.crop?.name_en : listing.crop?.name_kn;
                const marketName = language === 'en' ? listing.market?.name_en : listing.market?.name_kn;
                const isPreferred = sellerPreferredCrops.includes(listing.crop?.name_en || '');
                const grade = listing.quality_assessment?.grade || 'Grade A';
                const offersCount = listing.offers?.length || 0;

                return (
                  <div
                    key={listing.id}
                    className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-xl hover:border-green-600 transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div>
                      {/* Photo Header */}
                      <div className="relative aspect-[16/10] bg-stone-100 overflow-hidden">
                        {primaryImage ? (
                          <img
                            src={primaryImage}
                            alt={cropName}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-amber-50 text-5xl">
                            {listing.crop?.icon_name || '🍅'}
                          </div>
                        )}

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-[#0E3911]/90 text-amber-300 backdrop-blur-sm border border-green-700/50 shadow">
                            <Sparkles className="w-3 h-3 text-amber-300" />
                            <span>{grade}</span>
                          </span>

                          {isPreferred && (
                            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-green-500 text-white shadow">
                              ★ {language === 'en' ? 'Preferred' : 'ಆಸಕ್ತಿಯ ಬೆಳೆ'}
                            </span>
                          )}
                        </div>

                        {/* Mandi Tag */}
                        <div className="absolute bottom-2 left-2 right-2 bg-stone-950/75 backdrop-blur-xs px-2.5 py-1 rounded-xl text-white text-[11px] font-medium flex items-center justify-between">
                          <span className="flex items-center space-x-1 truncate max-w-[200px]">
                            <Store className="w-3 h-3 text-amber-400 shrink-0" />
                            <span className="truncate">{marketName}</span>
                          </span>
                          <span className="text-green-300 font-semibold text-[10px]">
                            {listing.harvest_date}
                          </span>
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-5 space-y-4">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="text-xl font-black text-stone-900 group-hover:text-[#14532D] transition">
                              {cropName}
                            </h3>
                            <div className="flex items-center space-x-1 text-xs text-stone-500 mt-0.5">
                              <MapPin className="w-3.5 h-3.5 text-[#14532D]" />
                              <span>
                                {listing.farmer?.profile?.full_name?.split(' ')[0] || 'Farmer'},{' '}
                                {listing.farmer?.village || 'Karnataka'}
                              </span>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-[10px] text-stone-500 font-bold uppercase">
                              {language === 'en' ? 'Asking Price' : 'ನಿರೀಕ್ಷಿತ ದರ'}
                            </div>
                            <div className="text-lg font-black text-[#0E3911]">
                              ₹{listing.price_per_kg}/kg
                            </div>
                          </div>
                        </div>

                        {/* Quantity & Lot Size */}
                        <div className="grid grid-cols-2 gap-2 bg-[#FCFAF2] p-3 rounded-2xl border border-stone-200/80 text-xs">
                          <div>
                            <span className="text-stone-500 block text-[10px] uppercase font-bold">
                              {language === 'en' ? 'Available Lot' : 'ಲಭ್ಯವಿರುವ ಪ್ರಮಾಣ'}
                            </span>
                            <span className="font-extrabold text-stone-900 text-sm">
                              {listing.quantity_remaining_kg ?? listing.quantity_kg} kg
                            </span>
                          </div>
                          <div>
                            <span className="text-stone-500 block text-[10px] uppercase font-bold">
                              Total Quintals
                            </span>
                            <span className="font-extrabold text-[#14532D] text-sm">
                              {((listing.quantity_remaining_kg ?? listing.quantity_kg) / 100).toFixed(1)} qtl
                            </span>
                          </div>
                        </div>

                        {/* APMC Reference Comparison */}
                        {listing.market_reference && (
                          <div className="flex items-center space-x-1.5 text-[11px] text-stone-700 bg-amber-50/90 px-2.5 py-1.5 rounded-xl border border-amber-200">
                            <TrendingUp className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                            <span>
                              APMC Daily Modal Rate: <strong>₹{listing.market_reference.modal_price_per_kg}/kg</strong>
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="p-5 pt-0 grid grid-cols-2 gap-2">
                      <Link
                        href={`/seller/listings/${listing.id}`}
                        className="min-h-[46px] w-full bg-stone-100 hover:bg-stone-200 text-stone-900 rounded-xl font-bold text-xs flex items-center justify-center space-x-1 transition border border-stone-200"
                      >
                        <Eye className="w-3.5 h-3.5 text-stone-600" />
                        <span>{language === 'en' ? 'View Details' : 'ವಿವರ ನೋಡಿ'}</span>
                      </Link>

                      <Link
                        href={`/seller/listings/${listing.id}`}
                        className="min-h-[46px] w-full bg-[#0E3911] hover:bg-[#14532D] text-white rounded-xl font-bold text-xs flex items-center justify-center space-x-1 transition shadow-sm"
                      >
                        <span>{language === 'en' ? 'Submit Bid' : 'ಆಫರ್ ಸಲ್ಲಿಸಿ'}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
                      </Link>
                    </div>
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
