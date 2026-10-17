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
  Store,
  Camera,
  BellRing,
  CheckCircle2,
  CalendarDays,
  MapPin,
  TrendingUp,
  ShieldCheck,
  Languages,
  PhoneCall,
  Clock,
  Sparkles,
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth();
  const { language, toggleLanguage } = useLanguage();

  const [showOfferDetails, setShowOfferDetails] = useState(false);
  const [liveListing, setLiveListing] = useState<CropListing | null>(null);

  useEffect(() => {
    fetch('/api/listings')
      .then((res) => res.json())
      .then((data) => {
        if (data.listings && data.listings.length > 0) {
          setLiveListing(data.listings[0]);
        }
      })
      .catch((err) => console.error('Error fetching live listing:', err));
  }, []);

  const t = {
    en: {
      tagline: 'Karnataka APMC Pre-Harvest Marketplace',
      heroTitle: 'Know your buyer BEFORE travelling to the mandi',
      heroSub:
        'Tell APMC traders about your freshly harvested crops. Get firm price offers, confirm visits, and save transport costs.',
      imFarmer: "I'm a Farmer",
      farmerSub: 'Post crops & get offers',
      imSeller: "I'm an APMC Seller",
      sellerSub: 'Find fresh farm lots',
      liveTicker: "Today's Mandi Trends:",
      howTitle: 'How It Works in 4 Simple Steps',
      step1Title: '1. Take Photo & Post',
      step1Desc: 'Upload 1-3 photos, enter quantity & expected price from your farm.',
      step1Action: 'Post Crop Lot →',
      step2Title: '2. Traders Get Alerted',
      step2Desc: 'Registered buyers in your target APMC market receive instant alerts.',
      step2Action: 'Trader Dashboard →',
      step3Title: '3. Compare Real Offers',
      step3Desc: 'Receive bids, compare prices side-by-side, and choose the best offer.',
      step3Action: 'Compare Offers →',
      step4Title: '4. Confirmed Visit & Pay',
      step4Desc: 'Unlock trader phone number, verify QR pass at the mandi, and receive payment.',
      step4Action: 'Visits & Payments →',
      sampleCardHeader: 'Live Crop Lot from Database',
      sampleBadge: 'Real Active Lot • Database Synced',
      viewOffersBtn: 'View Matching Offers',
      hideOffersBtn: 'Hide Offers',
      installAppTitle: 'Install Smart Farmer on your phone',
      installAppDesc: 'Works smoothly even with low internet network in rural villages.',
      installBtn: 'Install App (PWA)',
      demoModeNotice: 'Demo Mode Active • Karnataka APMC Pilot',
    },
    kn: {
      tagline: 'ಕರ್ನಾಟಕ ಎಪಿಎಂಸಿ ಪೂರ್ವ-ಕೊಯ್ಲು ಮಾರುಕಟ್ಟೆ',
      heroTitle: 'ಮಾರುಕಟ್ಟೆಗೆ ಹೋಗುವ ಮುನ್ನವೇ ಖರೀದಿದಾರರನ್ನು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ',
      heroSub:
        'ನಿಮ್ಮ ಬೆಳೆಯ ವಿವರಗಳನ್ನು ಎಪಿಎಂಸಿ ವ್ಯಾಪಾರಿಗಳಿಗೆ ಮೊದಲೇ ತಿಳಿಸಿ. ಖಚಿತ ಬೆಲೆಯ ಆಫರ್ ಪಡೆದು ಸಾರಿಗೆ ವೆಚ್ಚ ಉಳಿಸಿ.',
      imFarmer: 'ನಾನು ರೈತ',
      farmerSub: 'ಬೆಳೆ ಪೋಸ್ಟ್ ಮಾಡಿ, ಆಫರ್ ಪಡೆಯಿರಿ',
      imSeller: 'ನಾನು ಎಪಿಎಂಸಿ ವ್ಯಾಪಾರಿ',
      sellerSub: 'ತಾಜಾ ಬೆಳೆಗಳನ್ನು ಖರೀದಿಸಿ',
      liveTicker: 'ಇಂದಿನ ಮಂಡಿ ದರಗಳು:',
      howTitle: 'ಕೇವಲ 4 ಸುಲಭ ಹಂತಗಳಲ್ಲಿ ಕಾರ್ಯನಿರ್ವಹಣೆ',
      step1Title: '1. ಫೋಟೋ ತೆಗೆದು ಪೋಸ್ಟ್ ಮಾಡಿ',
      step1Desc: 'ಹೊಲದಲ್ಲೇ 1-3 ಫೋಟೋ ತೆಗೆದು, ಪ್ರಮಾಣ ಮತ್ತು ನಿರೀಕ್ಷಿತ ಬೆಲೆ ನಮೂದಿಸಿ.',
      step1Action: 'ಬೆಳೆ ಪೋಸ್ಟ್ ಮಾಡಿ →',
      step2Title: '2. ವ್ಯಾಪಾರಿಗಳಿಗೆ ತಕ್ಷಣ ಮಾಹಿತಿ',
      step2Desc: 'ನಿಮ್ಮ ಮಾರುಕಟ್ಟೆಯ ನೊಂದಾಯಿತ ವ್ಯಾಪಾರಿಗಳಿಗೆ ಕೂಡಲೇ ಸಂದೇಶ ತಲುಪುತ್ತದೆ.',
      step2Action: 'ವ್ಯಾಪಾರಿ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ →',
      step3Title: '3. ಆಫರ್‌ಗಳನ್ನು ಹೋಲಿಸಿ',
      step3Desc: 'ಬಂದಿರುವ ಬೆಲೆಗಳನ್ನು ಹೋಲಿಸಿ, ನಿಮಗೆ ಇಷ್ಟವಾದ ವ್ಯಾಪಾರಿಯನ್ನು ಆಯ್ಕೆ ಮಾಡಿ.',
      step3Action: 'ಆಫರ್‌ಗಳನ್ನು ಹೋಲಿಸಿ →',
      step4Title: '4. ಭೇಟಿ ಖಚಿತ & ಹಣ ಪಾವತಿ',
      step4Desc: 'ವ್ಯಾಪಾರಿಯ ಫೋನ್ ನಂಬರ್ ಪಡೆದು, ಮಂಡಿಯಲ್ಲಿ ತೂಕ ಮಾಡಿ ಹಣ ಪಡೆಯಿರಿ.',
      step4Action: 'ಭೇಟಿ & ಪಾವತಿ →',
      sampleCardHeader: 'ಡೇಟಾಬೇಸ್‌ನಲ್ಲಿರುವ ನೇರ ಬೆಳೆ',
      sampleBadge: 'ನೈಜ ಸಕ್ರಿಯ ಬೆಳೆ • ಡೇಟಾಬೇಸ್ ಸಿಂಕ್ ಆಗಿದೆ',
      viewOffersBtn: 'ಬಂದಿರುವ ಆಫರ್ ನೋಡಿ',
      hideOffersBtn: 'ಆಫರ್ ಮರೆಮಾಡಿ',
      installAppTitle: 'ನಿಮ್ಮ ಮೊಬೈಲ್‌ನಲ್ಲಿ ಆ್ಯಪ್ ಇನ್‌ಸ್ಟಾಲ್ ಮಾಡಿ',
      installAppDesc: 'ಹಳ್ಳಿಗಳಲ್ಲಿ ಕಡಿಮೆ ಇಂಟರ್ನೆಟ್ ಇರುವಾಗಲೂ ವೇಗವಾಗಿ ಕೆಲಸ ಮಾಡುತ್ತದೆ.',
      installBtn: 'ಆ್ಯಪ್ ಡೌನ್‌ಲೋಡ್ (PWA)',
      demoModeNotice: 'ಡೆಮೊ ಮೋಡ್ ಸಕ್ರಿಯವಾಗಿದೆ • ಕರ್ನಾಟಕ ಎಪಿಎಂಸಿ ಪ್ರಾಯೋಗಿಕ',
    },
  }[language];

  const handleFarmerClick = () => {
    if (user?.profile?.role === 'farmer') {
      router.push('/farmer/dashboard');
    } else {
      router.push('/auth/login?role=farmer');
    }
  };

  const handleSellerClick = () => {
    if (user?.profile?.role === 'seller') {
      router.push('/seller/dashboard');
    } else {
      router.push('/auth/login?role=seller');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF8E1]">
      <Navbar />

      {/* Mandi Rates Live Ticker */}
      <section className="bg-amber-100 border-b border-amber-300 px-4 py-2 text-xs md:text-sm text-amber-950 font-medium">
        <div className="max-w-4xl mx-auto flex items-center space-x-2 overflow-x-auto whitespace-nowrap scrollbar-none">
          <TrendingUp className="w-4 h-4 text-[#1B5E20] shrink-0" />
          <span className="font-bold text-[#1B5E20] shrink-0">{t.liveTicker}</span>
          <span className="inline-block bg-white px-2 py-0.5 rounded shadow-sm">
            🍅 Hubballi Tomato: ₹2,100 - ₹2,300/qtl
          </span>
          <span className="inline-block bg-white px-2 py-0.5 rounded shadow-sm">
            🧅 Belagavi Onion: ₹2,600 - ₹2,900/qtl
          </span>
          <span className="inline-block bg-white px-2 py-0.5 rounded shadow-sm">
            🥔 Yeshwanthpur Potato: ₹1,800 - ₹2,050/qtl
          </span>
        </div>
      </section>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 space-y-6">
        {/* Hero Section with Indian Farmer Photo */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Left Content Column */}
            <div className="md:col-span-7 space-y-4 text-center md:text-left">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-900 border border-green-200">
                <Sparkles className="w-3.5 h-3.5 mr-1 text-[#1B5E20]" />
                {t.tagline}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1B5E20] tracking-tight leading-snug">
                {t.heroTitle}
              </h2>
              <p className="text-gray-700 text-base leading-relaxed">
                {t.heroSub}
              </p>

              {/* Primary Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleFarmerClick}
                  className="min-h-[56px] w-full bg-[#1B5E20] hover:bg-green-900 active:scale-[0.99] text-white rounded-xl font-bold text-base p-3.5 shadow-md flex items-center justify-center space-x-3 transition cursor-pointer"
                >
                  <Sprout className="w-6 h-6 text-amber-300 shrink-0" />
                  <div className="text-left">
                    <div className="leading-tight">{t.imFarmer}</div>
                    <div className="text-xs font-normal text-green-200">{t.farmerSub}</div>
                  </div>
                </button>

                <button
                  onClick={handleSellerClick}
                  className="min-h-[56px] w-full bg-amber-500 hover:bg-amber-600 active:scale-[0.99] text-stone-900 rounded-xl font-bold text-base p-3.5 shadow-md flex items-center justify-center space-x-3 transition cursor-pointer"
                >
                  <Store className="w-6 h-6 text-stone-950 shrink-0" />
                  <div className="text-left">
                    <div className="leading-tight">{t.imSeller}</div>
                    <div className="text-xs font-normal text-stone-800">{t.sellerSub}</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Right Column: Hero Farmer Photo */}
            <div className="md:col-span-5 flex justify-center">
              <div className="relative w-full max-w-sm aspect-[4/3] sm:aspect-square md:aspect-[4/5] rounded-2xl overflow-hidden border-2 border-amber-300/80 shadow-lg bg-amber-50">
                <img
                  src="/hero-farmer.jpg"
                  alt="Indian farmer using Smart Farmer Connect to connect with APMC sellers"
                  className="w-full h-full object-cover object-center transform hover:scale-105 transition duration-500"
                />
                <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-xl text-white text-[11px] font-semibold flex items-center justify-between">
                  <span className="flex items-center space-x-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-green-400" />
                    <span>Karnataka APMC Network</span>
                  </span>
                  <span className="text-amber-300 font-bold">100% Direct</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Interactive Card (Real Database Synced) */}
        {liveListing && (
          <section className="bg-white rounded-2xl p-5 shadow-sm border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-gray-900 flex items-center text-lg">
                <span className="mr-2">🔍</span> {t.sampleCardHeader}
              </h3>
              <span className="bg-green-100 text-[#1B5E20] text-xs font-bold px-2.5 py-1 rounded-full border border-green-300">
                {t.sampleBadge}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Crop Photo Representation */}
              <div className="bg-amber-50 rounded-xl p-4 flex flex-col items-center justify-center border border-amber-200 text-center overflow-hidden">
                {liveListing.images?.[0]?.storage_path ? (
                  <img
                    src={liveListing.images[0].storage_path}
                    alt="Crop"
                    className="w-full h-32 object-cover rounded-lg shadow-sm"
                  />
                ) : (
                  <span className="text-6xl mb-2">{liveListing.crop?.icon_name || '🍅'}</span>
                )}
                <span className="text-xs font-semibold text-stone-700 bg-white px-2 py-0.5 rounded shadow-sm border mt-2">
                  Database record • ID: {liveListing.id.substring(0, 10)}...
                </span>
              </div>

              {/* Details */}
              <div className="md:col-span-2 space-y-2">
                <h4 className="text-xl font-bold text-gray-900">
                  {language === 'en' ? liveListing.crop?.name_en : liveListing.crop?.name_kn}
                </h4>
                <div className="text-sm text-gray-600 flex flex-wrap gap-x-4 gap-y-1">
                  <span className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1 text-[#1B5E20]" />
                    {liveListing.farmer?.profile?.full_name?.split(' ')[0] || 'Farmer'},{' '}
                    {liveListing.farmer?.village || 'Karnataka'}
                  </span>
                  <span className="flex items-center text-amber-800 font-medium">
                    <Store className="w-4 h-4 mr-1" />
                    {language === 'en' ? liveListing.market?.name_en : liveListing.market?.name_kn}
                  </span>
                  <span className="flex items-center text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    Harvest: {liveListing.harvest_date}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 bg-stone-50 p-3 rounded-lg border border-stone-200">
                  <div>
                    <div className="text-xs text-gray-500">Quantity (ಪ್ರಮಾಣ):</div>
                    <div className="font-bold text-gray-900">
                      {liveListing.entered_quantity} {liveListing.entered_unit} ({liveListing.quantity_kg} kg)
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Farmer Expected Rate:</div>
                    <div className="font-bold text-[#1B5E20]">
                      ₹{liveListing.price_per_kg}/kg (₹{liveListing.entered_price}/{liveListing.entered_price_unit})
                    </div>
                  </div>
                </div>

                {/* Quality Grade & APMC Benchmark */}
                <div className="flex flex-wrap gap-2 pt-1 text-xs">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-green-100 text-[#1B5E20] font-bold border border-green-300">
                    <Sparkles className="w-3.5 h-3.5 mr-1" />
                    {liveListing.quality_assessment?.grade || 'Grade B'} — Preliminary assessment
                  </span>

                  {liveListing.market_reference && (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-amber-100 text-amber-950 font-medium border border-amber-300">
                      <TrendingUp className="w-3.5 h-3.5 mr-1 text-[#1B5E20]" />
                      APMC Reference: ₹{liveListing.market_reference.modal_price_per_kg}/kg
                    </span>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-2">
                  <span className="font-extrabold text-base text-stone-800">
                    Total Value: ₹{(liveListing.quantity_kg * liveListing.price_per_kg).toLocaleString('en-IN')}
                  </span>
                  
                  <div className="flex space-x-2">
                    <Link
                      href={user?.profile?.role === 'seller' ? `/seller/listings/${liveListing.id}` : `/farmer/listings/${liveListing.id}`}
                      className="min-h-[44px] px-3.5 py-2 bg-[#1B5E20] hover:bg-green-900 text-white rounded-lg text-xs font-bold transition flex items-center justify-center cursor-pointer shadow-sm"
                    >
                      View Crop Details
                    </Link>

                    <button
                      onClick={() => setShowOfferDetails(!showOfferDetails)}
                      className="min-h-[44px] px-3.5 py-2 bg-green-50 text-[#1B5E20] hover:bg-green-100 rounded-lg text-xs font-bold border border-green-300 transition cursor-pointer"
                    >
                      {showOfferDetails ? 'Hide Offers' : 'Compare Buyer Offers'} ({liveListing.offers?.length || 0})
                    </button>
                  </div>
                </div>

                {/* Collapsible Real Offers */}
                {showOfferDetails && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-xl space-y-2 text-sm">
                    <div className="font-bold text-[#1B5E20] text-xs uppercase tracking-wider">
                      {language === 'en' ? 'Live Mandi Offers on this Lot:' : 'ಬಂದಿರುವ ಆಫರ್‌ಗಳು:'}
                    </div>

                    {(!liveListing.offers || liveListing.offers.length === 0) ? (
                      <p className="text-xs text-gray-600 italic">
                        {language === 'en'
                          ? 'No offers yet. Login as Seller to submit a real bid on this lot!'
                          : 'ಯಾವುದೇ ಆಫರ್ ಬಂದಿಲ್ಲ. ವ್ಯಾಪಾರಿಯಾಗಿ ಲಾಗಿನ್ ಆಗಿ ಆಫರ್ ನೀಡಿ!'}
                      </p>
                    ) : (
                      liveListing.offers.map((offer) => (
                        <div
                          key={offer.id}
                          className="bg-white p-2.5 rounded-lg border border-green-200 shadow-sm flex items-start justify-between"
                        >
                          <div className="flex items-start space-x-2">
                            <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                            <div className="text-xs text-gray-800">
                              <strong>{offer.seller?.shop_name || 'APMC Trader'}</strong> offered{' '}
                              <span className="text-[#1B5E20] font-bold">₹{offer.price_per_kg}/kg</span> for{' '}
                              <strong>{offer.quantity_kg} kg</strong>.
                            </div>
                          </div>
                          <span className="text-[10px] font-bold uppercase bg-stone-100 px-2 py-0.5 rounded">
                            {offer.status}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* 4-Step How It Works */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200 space-y-5">
          <div className="text-center space-y-1">
            <h3 className="text-xl font-bold text-gray-900">{t.howTitle}</h3>
            <p className="text-xs text-gray-500">
              {language === 'en'
                ? 'Click any step below to launch the workflow or view live data.'
                : 'ನೇರವಾಗಿ ಕಾರ್ಯವಿಧಾನವನ್ನು ತೆರೆಯಲು ಕೆಳಗಿನ ಯಾವುದೇ ಹಂತದ ಮೇಲೆ ಕ್ಲಿಕ್ ಮಾಡಿ.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {/* Step 1: Take Photo & Post */}
            <Link
              href={user?.profile?.role === 'farmer' ? '/farmer/add-crop' : '/auth/login?role=farmer&redirect=/farmer/add-crop'}
              className="group block p-4 rounded-xl bg-stone-50 border border-stone-200 hover:border-[#1B5E20] hover:bg-emerald-50/40 hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer text-center space-y-2.5"
            >
              <div className="w-12 h-12 mx-auto rounded-full bg-green-100 group-hover:bg-[#1B5E20] group-hover:text-amber-300 text-[#1B5E20] flex items-center justify-center font-bold transition">
                <Camera className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-gray-900 group-hover:text-[#1B5E20] transition">{t.step1Title}</h4>
              <p className="text-xs text-gray-600 leading-relaxed">{t.step1Desc}</p>
              <div className="pt-1">
                <span className="inline-flex items-center text-[11px] font-bold text-[#1B5E20] group-hover:underline">
                  {t.step1Action}
                </span>
              </div>
            </Link>

            {/* Step 2: Traders Get Alerted */}
            <Link
              href={user?.profile?.role === 'seller' ? '/seller/dashboard' : '/auth/login?role=seller&redirect=/seller/dashboard'}
              className="group block p-4 rounded-xl bg-stone-50 border border-stone-200 hover:border-amber-500 hover:bg-amber-50/40 hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer text-center space-y-2.5"
            >
              <div className="w-12 h-12 mx-auto rounded-full bg-amber-100 group-hover:bg-amber-500 group-hover:text-white text-amber-700 flex items-center justify-center font-bold transition">
                <BellRing className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-gray-900 group-hover:text-amber-800 transition">{t.step2Title}</h4>
              <p className="text-xs text-gray-600 leading-relaxed">{t.step2Desc}</p>
              <div className="pt-1">
                <span className="inline-flex items-center text-[11px] font-bold text-amber-800 group-hover:underline">
                  {t.step2Action}
                </span>
              </div>
            </Link>

            {/* Step 3: Compare Real Offers */}
            <Link
              href={user?.profile?.role === 'farmer' ? '/farmer/offers' : '/auth/login?role=farmer&redirect=/farmer/offers'}
              className="group block p-4 rounded-xl bg-stone-50 border border-stone-200 hover:border-blue-600 hover:bg-blue-50/40 hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer text-center space-y-2.5"
            >
              <div className="w-12 h-12 mx-auto rounded-full bg-blue-100 group-hover:bg-blue-600 group-hover:text-white text-blue-700 flex items-center justify-center font-bold transition">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-gray-900 group-hover:text-blue-800 transition">{t.step3Title}</h4>
              <p className="text-xs text-gray-600 leading-relaxed">{t.step3Desc}</p>
              <div className="pt-1">
                <span className="inline-flex items-center text-[11px] font-bold text-blue-800 group-hover:underline">
                  {t.step3Action}
                </span>
              </div>
            </Link>

            {/* Step 4: Confirmed Visit & Pay */}
            <Link
              href={user ? '/visits' : '/auth/login?redirect=/visits'}
              className="group block p-4 rounded-xl bg-stone-50 border border-stone-200 hover:border-emerald-700 hover:bg-emerald-50/40 hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer text-center space-y-2.5"
            >
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 group-hover:bg-emerald-700 group-hover:text-white text-emerald-800 flex items-center justify-center font-bold transition">
                <CalendarDays className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-gray-900 group-hover:text-emerald-900 transition">{t.step4Title}</h4>
              <p className="text-xs text-gray-600 leading-relaxed">{t.step4Desc}</p>
              <div className="pt-1">
                <span className="inline-flex items-center text-[11px] font-bold text-emerald-800 group-hover:underline">
                  {t.step4Action}
                </span>
              </div>
            </Link>
          </div>
        </section>

        {/* PWA Install Banner */}
        <section className="bg-gradient-to-r from-emerald-800 to-green-900 text-white rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-bold text-lg">{t.installAppTitle}</h4>
            <p className="text-xs text-green-200">{t.installAppDesc}</p>
          </div>
          <button
            onClick={() =>
              alert(
                language === 'en'
                  ? 'PWA Service Worker install prompt active for mobile devices.'
                  : 'PWA ಆಫ್‌ಲೈನ್ ಸೇವೆ ಸಕ್ರಿಯವಾಗಿದೆ.'
              )
            }
            className="min-h-[48px] px-6 py-2.5 bg-amber-400 hover:bg-amber-500 text-stone-900 font-bold rounded-xl shadow transition shrink-0 cursor-pointer"
          >
            {t.installBtn}
          </button>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 text-xs py-6 px-4 text-center space-y-2 mt-8">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 border-b border-stone-800 pb-4">
          <div className="flex items-center space-x-2 text-stone-300 font-semibold">
            <ShieldCheck className="w-4 h-4 text-green-500" />
            <span>Smart Farmer Connect • Karnataka APMC</span>
          </div>
          <div className="text-amber-400 font-medium">{t.demoModeNotice}</div>
        </div>
        <p className="pt-2 text-stone-500">
          Built with Next.js App Router, Tailwind CSS, TypeScript, and Supabase PostgreSQL.
        </p>
      </footer>
    </div>
  );
}
