'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Navbar } from '@/components/common/Navbar';
import { CropListing } from '@/types/database';
import {
  Sprout,
  Store,
  MapPin,
  Clock,
  Sparkles,
  Search,
  Filter,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  IndianRupee,
  Scale,
  ShoppingBag,
  Eye,
} from 'lucide-react';

export default function MarketplacePage() {
  const { user } = useAuth();
  const { language } = useLanguage();

  const [listings, setListings] = useState<CropListing[]>([]);
  const [selectedCropFilter, setSelectedCropFilter] = useState<string>('all');
  const [selectedMandiFilter, setSelectedMandiFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'date' | 'price_asc' | 'price_desc' | 'qty_desc'>('date');
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetch('/api/listings')
      .then((res) => res.json())
      .then((data) => {
        if (data.listings && Array.isArray(data.listings)) {
          setListings(data.listings);
        }
      })
      .catch((err) => console.error('Failed to load marketplace listings', err))
      .finally(() => setFetching(false));
  }, []);

  const filteredListings = listings.filter((l) => {
    if (['cancelled', 'expired'].includes(l.status)) return false;

    const cropMatches =
      selectedCropFilter === 'all' ||
      l.crop?.name_en.toLowerCase() === selectedCropFilter.toLowerCase();

    const mandiMatches =
      selectedMandiFilter === 'all' ||
      l.market?.name_en?.toLowerCase().includes(selectedMandiFilter.toLowerCase());

    const query = searchQuery.trim().toLowerCase();
    const searchMatches =
      !query ||
      l.crop?.name_en?.toLowerCase().includes(query) ||
      l.crop?.name_kn?.toLowerCase().includes(query) ||
      l.farmer?.profile?.full_name?.toLowerCase().includes(query) ||
      l.farmer?.village?.toLowerCase().includes(query);

    return cropMatches && mandiMatches && searchMatches;
  });

  const sortedListings = [...filteredListings].sort((a, b) => {
    if (sortBy === 'price_asc') return a.price_per_kg - b.price_per_kg;
    if (sortBy === 'price_desc') return b.price_per_kg - a.price_per_kg;
    if (sortBy === 'qty_desc')
      return (b.quantity_remaining_kg || b.quantity_kg) - (a.quantity_remaining_kg || a.quantity_kg);
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF8E5] text-[#17251B]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header Title */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-black bg-green-100 text-[#17652B] border border-green-300">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'Karnataka APMC Marketplace' : 'ಕರ್ನಾಟಕ ಎಪಿಎಂಸಿ ಮಾರುಕಟ್ಟೆ'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#17652B]">
              {language === 'en' ? 'Fresh Pre-Harvest Crop Lots' : 'ರೈತರ ತಾಜಾ ಬೆಳೆಗಳ ವಿವರ'}
            </h1>
            <p className="text-xs sm:text-sm text-stone-600">
              {language === 'en'
                ? 'Discover authentic pre-harvest listings from Karnataka farmers. Connect and bid before mandi arrival.'
                : 'ಕರ್ನಾಟಕದ ರೈತರಿಂದ ನೇರ ಬೆಳೆಗಳ ವಿವರ. ಮಂಡಿ ತಲುಪುವ ಮುನ್ನವೇ ನೇರ ವ್ಯವಹಾರ ಮಾಡಿ.'}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Link
              href="/farmer/add-crop"
              className="min-h-[46px] px-5 py-2.5 rounded-2xl bg-[#17652B] hover:bg-[#1F7D37] text-white text-xs font-black shadow-md flex items-center space-x-2 transition border border-[#17652B]"
            >
              <Sprout className="w-4 h-4 text-[#FFBF24]" />
              <span>{language === 'en' ? 'Post My Crop Lot' : 'ಹೊಸ ಬೆಳೆ ಸೇರಿಸಿ'}</span>
            </Link>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-sm space-y-4">
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
                    ? 'Search by crop name, farmer name, or village...'
                    : 'ಬೆಳೆ, ರೈತ ಅಥವಾ ಗ್ರಾಮದ ಹೆಸರು ಹುಡುಕಿ...'
                }
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-stone-200 bg-[#FFF8E5]/50 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#17652B] focus:bg-white transition"
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
                className="py-2.5 px-3 rounded-xl border border-stone-200 bg-[#FFF8E5]/50 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#17652B]"
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
                className="py-2.5 px-3 rounded-xl border border-stone-200 bg-[#FFF8E5]/50 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#17652B]"
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
                    ? 'bg-[#17652B] text-[#FFBF24] shadow-sm'
                    : 'bg-[#FFF8E5]/60 text-stone-700 border border-stone-200 hover:bg-stone-100'
                }`}
              >
                {c === 'all' ? (language === 'en' ? 'All Crops' : 'ಎಲ್ಲಾ ಬೆಳೆಗಳು') : c}
              </button>
            ))}
          </div>
        </div>

        {/* Listings Feed */}
        {fetching ? (
          <div className="p-12 text-center text-stone-500 bg-white rounded-3xl border border-stone-200">
            <div className="w-8 h-8 border-4 border-[#17652B] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm font-semibold">{language === 'en' ? 'Loading marketplace lots...' : 'ಬೆಳೆಗಳ ವಿವರ ಲೋಡ್ ಆಗುತ್ತಿದೆ...'}</p>
          </div>
        ) : sortedListings.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-stone-200 space-y-3">
            <Store className="w-12 h-12 text-stone-300 mx-auto" />
            <h3 className="text-lg font-bold text-stone-800">
              {language === 'en' ? 'No matching crop lots found' : 'ಯಾವುದೇ ಬೆಳೆ ಕಂಡುಬಂದಿಲ್ಲ'}
            </h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              {language === 'en'
                ? 'Try resetting your search query or filters to view available lots.'
                : 'ಫಿಲ್ಟರ್ ತೆಗೆದು ಎಲ್ಲಾ ಬೆಳೆಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedListings.map((listing) => {
              const primaryImage = listing.images?.[0]?.storage_path;
              const cropName = language === 'en' ? listing.crop?.name_en : listing.crop?.name_kn;
              const marketName = language === 'en' ? listing.market?.name_en : listing.market?.name_kn;
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
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-[#17652B]/90 text-[#FFBF24] backdrop-blur-sm border border-green-700/50 shadow">
                          <Sparkles className="w-3 h-3 text-[#FFBF24]" />
                          <span>{grade}</span>
                        </span>

                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/95 text-stone-900 backdrop-blur-sm shadow border border-stone-200">
                          <IndianRupee className="w-3 h-3 text-emerald-700" />
                          <span>{offersCount} {language === 'en' ? 'Bids' : 'ಆಫರ್‌ಗಳು'}</span>
                        </span>
                      </div>

                      {/* Bottom Mandi Tag */}
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
                          <h3 className="text-xl font-black text-stone-900 group-hover:text-[#17652B] transition">
                            {cropName}
                          </h3>
                          <div className="flex items-center space-x-1 text-xs text-stone-500 mt-0.5">
                            <MapPin className="w-3.5 h-3.5 text-[#17652B]" />
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
                          <div className="text-lg font-black text-[#17652B]">
                            ₹{listing.price_per_kg}/kg
                          </div>
                        </div>
                      </div>

                      {/* Quantity & Lot Size */}
                      <div className="grid grid-cols-2 gap-2 bg-[#FFF8E5] p-3 rounded-2xl border border-stone-200 text-xs">
                        <div>
                          <span className="text-stone-500 block text-[10px] uppercase font-bold">
                            {language === 'en' ? 'Available Lot' : 'ಲಭ್ಯವಿರುವ ಪ್ರಮಾಣ'}
                          </span>
                          <span className="font-black text-stone-900 text-sm">
                            {listing.quantity_remaining_kg ?? listing.quantity_kg} kg
                          </span>
                        </div>
                        <div>
                          <span className="text-stone-500 block text-[10px] uppercase font-bold">
                            Total Quintals
                          </span>
                          <span className="font-black text-[#17652B] text-sm">
                            {((listing.quantity_remaining_kg ?? listing.quantity_kg) / 100).toFixed(1)} qtl
                          </span>
                        </div>
                      </div>

                      {/* APMC Benchmark Note */}
                      {listing.market_reference && (
                        <div className="flex items-center space-x-1.5 text-[11px] text-stone-700 bg-amber-50 px-2.5 py-1.5 rounded-xl border border-amber-200">
                          <TrendingUp className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                          <span>
                            APMC Benchmark: <strong>₹{listing.market_reference.modal_price_per_kg}/kg</strong>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-5 pt-0 grid grid-cols-2 gap-2">
                    <Link
                      href={user?.profile?.role === 'seller' ? `/seller/listings/${listing.id}` : `/farmer/listings/${listing.id}`}
                      className="min-h-[46px] w-full bg-stone-100 hover:bg-stone-200 text-stone-900 rounded-xl font-bold text-xs flex items-center justify-center space-x-1 transition border border-stone-200"
                    >
                      <Eye className="w-3.5 h-3.5 text-stone-600" />
                      <span>{language === 'en' ? 'View Details' : 'ವಿವರ ನೋಡಿ'}</span>
                    </Link>

                    <Link
                      href={user?.profile?.role === 'seller' ? `/seller/listings/${listing.id}` : '/auth/login?role=seller'}
                      className="min-h-[46px] w-full bg-[#17652B] hover:bg-[#1F7D37] text-white rounded-xl font-bold text-xs flex items-center justify-center space-x-1 transition shadow-sm"
                    >
                      <span>{language === 'en' ? 'Submit Bid' : 'ಆಫರ್ ಸಲ್ಲಿಸಿ'}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#FFBF24]" />
                    </Link>
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
