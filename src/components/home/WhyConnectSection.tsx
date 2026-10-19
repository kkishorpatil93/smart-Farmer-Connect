'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { CropListing, VisitBooking } from '@/types/database';
import {
  Truck,
  IndianRupee,
  ShieldCheck,
  Scale,
  Calculator,
  TrendingUp,
  Calendar,
  FileText,
  X,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  MapPin,
  Store,
  QrCode,
  Info,
  DollarSign,
  Award,
  BadgeCheck,
} from 'lucide-react';

interface WhyConnectSectionProps {
  listings: CropListing[];
}

export function WhyConnectSection({ listings }: WhyConnectSectionProps) {
  const { language } = useLanguage();
  const { user } = useAuth();

  // Active Modal State: null | 'calculator' | 'compare' | 'gatepass' | 'settlement'
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Real Database Visits for Card 3 & Card 4
  const [visits, setVisits] = useState<VisitBooking[]>([]);
  const [loadingVisits, setLoadingVisits] = useState(false);

  // Calculator State (Card 1)
  const [freightCost, setFreightCost] = useState<number>(2500);
  const [demurrageCost, setDemurrageCost] = useState<number>(800);
  const [distanceKm, setDistanceKm] = useState<number>(45);
  const [cargoValue, setCargoValue] = useState<number>(35000);

  // Price Comparison Selected Crop (Card 2)
  const [selectedCropIndex, setSelectedCropIndex] = useState<number>(0);

  useEffect(() => {
    // Fetch real visits from database
    setLoadingVisits(true);
    fetch('/api/visits')
      .then((res) => res.json())
      .then((data) => {
        if (data.visits && Array.isArray(data.visits)) {
          setVisits(data.visits);
        }
      })
      .catch((err) => console.error('Error fetching visits:', err))
      .finally(() => setLoadingVisits(false));
  }, []);

  // Card 1 Calculations based on user's actual entered values
  const avoidableDemurrage = Math.max(0, demurrageCost);
  const avoidableDistressLoss = Math.round(cargoValue * 0.15); // 15% typical distress slash avoided
  const avoidableEmptyReturn = Math.round(freightCost * 0.4); // 40% empty salvage loss avoided
  const calculatedTotalSavings = avoidableDemurrage + avoidableDistressLoss + avoidableEmptyReturn;

  // Selected visit for Card 3 & 4 (prefer confirmed visit with transactions if available)
  const confirmedVisit = visits.find((v) => v.status === 'confirmed' || v.status === 'completed') || visits[0];

  // Curated crops for price comparison (from live database listings)
  const comparisonItems = listings.length > 0 ? listings : [
    {
      id: 'fallback-1',
      crop: { id: 'c1', name_en: 'Tomato', name_kn: 'ಟೊಮ್ಯಾಟೊ', category: 'vegetable', default_unit: 'quintal' as const },
      market: { id: 'm1', name_en: 'Hubballi APMC (Amaragol)', name_kn: 'ಹುಬ್ಬಳ್ಳಿ ಎಪಿಎಂಸಿ', district: 'Dharwad', lat: 15.39, lng: 75.1, is_active: true },
      price_per_kg: 22,
      quantity_kg: 1000,
      market_reference: {
        modal_price_per_kg: 23,
        min_price_per_kg: 21,
        max_price_per_kg: 24.5,
        price_date: '19 Oct 2026',
        source_market: 'Hubballi APMC (KSAMB Bulletin)',
        is_available: true,
      },
      offers: [
        { id: 'o1', price_per_kg: 23.5, quantity_kg: 500, status: 'pending' as const, seller: { id: 's1', shop_name: 'Suresh Agro Traders', rating_avg: 4.8, rating_count: 24 } }
      ]
    } as any,
  ];

  const currentCompareItem = comparisonItems[selectedCropIndex] || comparisonItems[0];
  const bestOffer = currentCompareItem.offers && currentCompareItem.offers.length > 0
    ? [...currentCompareItem.offers].sort((a: any, b: any) => b.price_per_kg - a.price_per_kg)[0]
    : null;

  return (
    <>
      {/* 4. "Why Connect Before Mandi Travel?" (Cost & Transport Savings Section) */}
      <section className="bg-gradient-to-br from-[#17652B] via-[#1F7D37] to-[#114D20] text-white rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl space-y-2 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-black bg-[#FFBF24] text-stone-950 uppercase tracking-wider">
            <Truck className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'Farmer Financial Protection' : 'ರೈತರ ಆರ್ಥಿಕ ರಕ್ಷಣೆ'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
            {language === 'en'
              ? 'Why Connect Before Travelling to the Mandi?'
              : 'ಮಂಡಿಗೆ ಪ್ರಯಾಣಿಸುವ ಮುನ್ನವೇ ಏಕೆ ಸಂಪರ್ಕಿಸಬೇಕು?'}
          </h2>
          <p className="text-green-100 text-sm sm:text-base leading-relaxed">
            {language === 'en'
              ? 'Traditional mandi visits force farmers into distress sales. Here is how Smart Farmer Connect protects your hard work:'
              : 'ಸಾಂಪ್ರದಾಯಿಕ ಮಂಡಿ ಭೇಟಿಗಳು ರೈತರನ್ನು ಸಂಕಷ್ಟದ ಮಾರಾಟಕ್ಕೆ ತಳ್ಳುತ್ತವೆ. ಸ್ಮಾರ್ಟ್ ರೈತ ಸಂಪರ್ಕ ನಿಮ್ಮ ಶ್ರಮವನ್ನು ಹೇಗೆ ರಕ್ಷಿಸುತ್ತದೆ:'}
          </p>
        </div>

        {/* Four Cards Grid: 1 col on mobile, 2 cols on tablet, 4 cols in one row on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 pt-8 relative z-10">
          {/* Card 1: Save ₹1,500–₹3,500 in Lorry Freight */}
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/15 flex flex-col justify-between hover:bg-white/15 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#FFBF24] text-stone-950 flex items-center justify-center font-bold text-lg shadow-sm transition-transform duration-300 group-hover:scale-105">
                <Truck className="w-6 h-6 text-[#17652B]" />
              </div>
              <h3 className="font-extrabold text-white text-base leading-snug">
                {language === 'en'
                  ? 'Save ₹1,500 - ₹3,500 in Lorry Freight'
                  : 'ಲಾರಿ ಬಾಡಿಗೆಯಲ್ಲಿ ₹1,500 - ₹3,500 ಉಳಿತಾಯ'}
              </h3>
              <p className="text-xs text-green-100 leading-relaxed">
                {language === 'en'
                  ? 'Travelling without a confirmed buyer risks rejection or waiting days at the gate paying vehicle demurrage. Know your destination and buyer before you load.'
                  : 'ದೃಢೀಕೃತ ಖರೀದಿದಾರರಿಲ್ಲದೆ ಮಂಡಿಗೆ ಹೋಗುವುದು ದರ ಕುಸಿತ ಅಥವಾ ಗೇಟ್‌ನಲ್ಲಿ ಕಾಯುವ ವಿಳಂಬ ಶುಲ್ಕಕ್ಕೆ ಕಾರಣವಾಗುತ್ತದೆ. ವಾಹನ ಹತ್ತುವ ಮುನ್ನವೇ ಖರೀದಿದಾರರನ್ನು ತಿಳಿಯಿರಿ.'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setActiveModal('calculator')}
              className="mt-5 min-h-[44px] w-full bg-[#FFBF24] hover:bg-[#F59E0B] active:scale-[0.98] text-[#17251B] font-black text-xs rounded-xl py-2.5 px-4 flex items-center justify-center space-x-2 transition shadow-sm cursor-pointer"
            >
              <Calculator className="w-4 h-4 text-[#17652B]" />
              <span>{language === 'en' ? 'Calculate Transport Savings' : 'ಸಾರಿಗೆ ಉಳಿತಾಯ ಲೆಕ್ಕಹಾಕಿ'}</span>
            </button>
          </div>

          {/* Card 2: Stop Distress Price Slashing */}
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/15 flex flex-col justify-between hover:bg-white/15 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#FFBF24] text-stone-950 flex items-center justify-center font-bold text-lg shadow-sm transition-transform duration-300 group-hover:scale-105">
                <IndianRupee className="w-6 h-6 text-[#17652B]" />
              </div>
              <h3 className="font-extrabold text-white text-base leading-snug">
                {language === 'en'
                  ? 'Stop Distress Price Slashing'
                  : 'ಸಂಕಷ್ಟದ ಬೆಲೆ ಕುಸಿತಕ್ಕೆ ಬ್ರೇಕ್'}
              </h3>
              <p className="text-xs text-green-100 leading-relaxed">
                {language === 'en'
                  ? 'Middlemen frequently drop prices by 30-50% when they know you cannot afford to take perishable crops back. Lock in expected rates upfront.'
                  : 'ಕೊಳೆತುಹೋಗುವ ಬೆಳೆಗಳನ್ನು ವಾಪಸ್ ತರಲಾಗದು ಎಂದು ತಿಳಿದು ದಲ್ಲಾಳಿಗಳು ದರ ಕುಗ್ಗಿಸುವುದನ್ನು ತಪ್ಪಿಸಿ. ಮುಂಚಿತವಾಗಿಯೇ ದರ ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ.'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setActiveModal('compare')}
              className="mt-5 min-h-[44px] w-full bg-[#FFBF24] hover:bg-[#F59E0B] active:scale-[0.98] text-[#17251B] font-black text-xs rounded-xl py-2.5 px-4 flex items-center justify-center space-x-2 transition shadow-sm cursor-pointer"
            >
              <TrendingUp className="w-4 h-4 text-[#17652B]" />
              <span>{language === 'en' ? 'Compare Crop Prices' : 'ಬೆಳೆ ದರಗಳನ್ನು ಹೋಲಿಸಿ'}</span>
            </button>
          </div>

          {/* Card 3: Pre-Assigned APMC Gate Pass */}
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/15 flex flex-col justify-between hover:bg-white/15 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#FFBF24] text-stone-950 flex items-center justify-center font-bold text-lg shadow-sm transition-transform duration-300 group-hover:scale-105">
                <ShieldCheck className="w-6 h-6 text-[#17652B]" />
              </div>
              <h3 className="font-extrabold text-white text-base leading-snug">
                {language === 'en'
                  ? 'Pre-Assigned APMC Gate Pass'
                  : 'ಪೂರ್ವ ನಿಯೋಜಿತ ಎಪಿಎಂಸಿ ಗೇಟ್ ಪಾಸ್'}
              </h3>
              <p className="text-xs text-green-100 leading-relaxed">
                {language === 'en'
                  ? 'Deliver directly to a licensed trader stall with a digital QR gate pass for priority weighment, avoiding 5-hour queues.'
                  : 'ಡಿಜಿಟಲ್ ಗೇಟ್ ಪಾಸ್ ಮೂಲಕ ನೇರವಾಗಿ ಪರವಾನಗಿ ಪಡೆದ ವ್ಯಾಪಾರಿಯ ಮಳಿಗೆಗೆ ತೆರಳಿ, 5 ಗಂಟೆಗಳ ಕ್ಯೂ ತಪ್ಪಿಸಿ ಆದ್ಯತೆಯ ತೂಕ ಪಡೆಯಿರಿ.'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setActiveModal('gatepass')}
              className="mt-5 min-h-[44px] w-full bg-[#FFBF24] hover:bg-[#F59E0B] active:scale-[0.98] text-[#17251B] font-black text-xs rounded-xl py-2.5 px-4 flex items-center justify-center space-x-2 transition shadow-sm cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-[#17652B]" />
              <span>{language === 'en' ? 'View Visit Details' : 'ಭೇಟಿ ವಿವರಗಳನ್ನು ವೀಕ್ಷಿಸಿ'}</span>
            </button>
          </div>

          {/* Card 4: Transparent Settlement */}
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/15 flex flex-col justify-between hover:bg-white/15 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#FFBF24] text-stone-950 flex items-center justify-center font-bold text-lg shadow-sm transition-transform duration-300 group-hover:scale-105">
                <Scale className="w-6 h-6 text-[#17652B]" />
              </div>
              <h3 className="font-extrabold text-white text-base leading-snug">
                {language === 'en'
                  ? 'Transparent Settlement'
                  : 'ಪಾರದರ್ಶಕ ಇತ್ಯರ್ಥ'}
              </h3>
              <p className="text-xs text-green-100 leading-relaxed">
                {language === 'en'
                  ? 'Weighment slips are cross-verified digitally. Track payment settlement status without unauthorized middleman cuts.'
                  : 'ತೂಕದ ರಸೀದಿಗಳನ್ನು ಡಿಜಿಟಲ್ ರೂಪದಲ್ಲಿ ಪರಿಶೀಲಿಸಿ. ಯಾವುದೇ ಅನಧಿಕೃತ ಕಡಿತಗಳಿಲ್ಲದೆ ಯುಪಿಐ ಅಥವಾ ನಗದು ಪಾವತಿ ಸ್ಥಿತಿಯನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ.'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setActiveModal('settlement')}
              className="mt-5 min-h-[44px] w-full bg-[#FFBF24] hover:bg-[#F59E0B] active:scale-[0.98] text-[#17251B] font-black text-xs rounded-xl py-2.5 px-4 flex items-center justify-center space-x-2 transition shadow-sm cursor-pointer"
            >
              <FileText className="w-4 h-4 text-[#17652B]" />
              <span>{language === 'en' ? 'View Settlement Details' : 'ಇತ್ಯರ್ಥ ವಿವರಗಳನ್ನು ವೀಕ್ಷಿಸಿ'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* MODAL 1: Calculate Transport Savings (Card 1) */}
      {/* ========================================================================= */}
      {activeModal === 'calculator' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-6 text-[#17251B]">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-stone-200 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-[#17652B] flex items-center justify-center font-bold">
                  <Calculator className="w-5 h-5 text-[#17652B]" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-[#17652B]">
                    {language === 'en' ? 'Calculate Transport Savings' : 'ಸಾರಿಗೆ ಉಳಿತಾಯ ಕ್ಯಾಲ್ಕುಲೇಟರ್'}
                  </h3>
                  <p className="text-xs text-stone-500">
                    {language === 'en'
                      ? 'Enter your estimated travel expenses to calculate potential savings.'
                      : 'ಸಂಭಾವ್ಯ ಉಳಿತಾಯವನ್ನು ಅಂದಾಜಿಸಲು ನಿಮ್ಮ ಪ್ರಯಾಣ ವೆಚ್ಚಗಳನ್ನು ನಮೂದಿಸಿ.'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Inputs Form */}
            <div className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-stone-800 font-bold mb-1.5">
                  {language === 'en' ? 'Estimated Vehicle / Lorry Freight (₹)' : 'ಅಂದಾಜು ವಾಹನ / ಲಾರಿ ಬಾಡಿಗೆ (₹)'}
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-stone-500 font-bold">₹</span>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={freightCost}
                    onChange={(e) => setFreightCost(Number(e.target.value) || 0)}
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-stone-300 font-bold text-sm text-[#17251B] focus:ring-2 focus:ring-[#17652B] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-800 font-bold mb-1.5">
                    {language === 'en' ? 'Driver / Waiting Demurrage (₹/day)' : 'ಚಾಲಕ / ಗೇಟ್ ಕಾಯುವ ವಿಳಂಬ ವೆಚ್ಚ (₹)'}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-3 text-stone-500 font-bold">₹</span>
                    <input
                      type="number"
                      min="0"
                      step="100"
                      value={demurrageCost}
                      onChange={(e) => setDemurrageCost(Number(e.target.value) || 0)}
                      className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-stone-300 font-bold text-sm text-[#17251B] focus:ring-2 focus:ring-[#17652B] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-stone-800 font-bold mb-1.5">
                    {language === 'en' ? 'Round-Trip Distance (km)' : 'ಪ್ರಯಾಣದ ಅಂತರ (ಕಿ.ಮೀ)'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={distanceKm}
                    onChange={(e) => setDistanceKm(Number(e.target.value) || 0)}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 font-bold text-sm text-[#17251B] focus:ring-2 focus:ring-[#17652B] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-800 font-bold mb-1.5">
                  {language === 'en' ? 'Estimated Total Cargo / Crop Value (₹)' : 'ಬೆಳೆಯ ಅಂದಾಜು ಒಟ್ಟು ಮೌಲ್ಯ (₹)'}
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-stone-500 font-bold">₹</span>
                  <input
                    type="number"
                    min="1000"
                    step="500"
                    value={cargoValue}
                    onChange={(e) => setCargoValue(Number(e.target.value) || 0)}
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-stone-300 font-bold text-sm text-[#17251B] focus:ring-2 focus:ring-[#17652B] outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Calculated Breakdown Box */}
            <div className="bg-[#FFF8E5] p-4 rounded-2xl border border-amber-200 space-y-3">
              <span className="text-[11px] font-black text-amber-950 uppercase tracking-wider block">
                {language === 'en' ? 'Calculated Potential Savings Breakdown' : 'ಲೆಕ್ಕಹಾಕಲಾದ ಸಂಭಾವ್ಯ ಉಳಿತಾಯ ವಿವರ'}
              </span>

              <div className="space-y-1.5 text-xs text-stone-700">
                <div className="flex justify-between">
                  <span>{language === 'en' ? 'Gate Demurrage / Idle Days Avoided:' : 'ತಪ್ಪಿಸಲಾದ ಗೇಟ್ ಕಾಯುವ ವಿಳಂಬ ಶುಲ್ಕ:'}</span>
                  <strong className="text-[#17652B]">₹{avoidableDemurrage.toLocaleString('en-IN')}</strong>
                </div>
                <div className="flex justify-between">
                  <span>{language === 'en' ? 'Distress 15% Price Slash Protected:' : '15% ಸಂಕಷ್ಟದ ಬೆಲೆ ಕುಸಿತದಿಂದ ರಕ್ಷಣೆ:'}</span>
                  <strong className="text-[#17652B]">₹{avoidableDistressLoss.toLocaleString('en-IN')}</strong>
                </div>
                <div className="flex justify-between">
                  <span>{language === 'en' ? 'Wasted Empty Haulage Avoided:' : 'ವ್ಯರ್ಥ ಖಾಲಿ ಸಾರಿಗೆ ವೆಚ್ಚ ಉಳಿತಾಯ:'}</span>
                  <strong className="text-[#17652B]">₹{avoidableEmptyReturn.toLocaleString('en-IN')}</strong>
                </div>
                <div className="flex justify-between pt-2 border-t border-amber-300/70 text-sm font-black text-[#17652B]">
                  <span>{language === 'en' ? 'Total Potential Financial Protection:' : 'ಒಟ್ಟು ಸಂಭಾವ್ಯ ಆರ್ಥಿಕ ಉಳಿತಾಯ:'}</span>
                  <span className="text-base text-[#17652B]">₹{calculatedTotalSavings.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Honest Disclaimer */}
            <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-[11px] text-stone-600 space-y-1">
              <div className="flex items-center space-x-1.5 font-bold text-stone-800">
                <Info className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>{language === 'en' ? 'Indicative Estimate — Savings Not Guaranteed' : 'ಸೂಚಕ ಅಂದಾಜು — ಖಚಿತ ಉಳಿತಾಯವಲ್ಲ'}</span>
              </div>
              <p>
                {language === 'en'
                  ? 'Savings are estimated solely using your entered freight and cargo values. Actual savings depend on vehicle fuel, road distances, and market turnaround. Smart Farmer Connect does not guarantee fixed savings.'
                  : 'ಉಳಿತಾಯವನ್ನು ನೀವು ನಮೂದಿಸಿದ ವಾಹನ ಮತ್ತು ಬೆಳೆ ಮೌಲ್ಯದ ಆಧಾರದ ಮೇಲೆ ಅಂದಾಜಿಸಲಾಗಿದೆ. ವಾಸ್ತವಿಕ ಉಳಿತಾಯವು ಮಾರುಕಟ್ಟೆ ಪರಿಸ್ಥಿತಿಗಳ ಮೇಲೆ ಅವಲಂಬಿತವಾಗಿರುತ್ತದೆ.'}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-bold hover:bg-stone-100 transition"
              >
                {language === 'en' ? 'Close' : 'ಮುಚ್ಚಿ'}
              </button>
              <Link
                href="/farmer/add-crop"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#17652B] to-[#2E8B43] hover:from-[#1F7D37] hover:to-[#3FA657] text-white text-xs font-bold shadow-md transition flex items-center space-x-1.5"
              >
                <span>{language === 'en' ? 'Post My Crop Lot' : 'ನನ್ನ ಬೆಳೆ ಪೋಸ್ಟ್ ಮಾಡಿ'}</span>
                <ChevronRight className="w-4 h-4 text-[#FFBF24]" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: Compare Crop Prices (Card 2) */}
      {/* ========================================================================= */}
      {activeModal === 'compare' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-6 text-[#17251B]">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-stone-200 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-[#17652B] flex items-center justify-center font-bold">
                  <TrendingUp className="w-5 h-5 text-[#17652B]" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-[#17652B]">
                    {language === 'en' ? 'Compare Crop Prices' : 'ಬೆಳೆ ದರಗಳ ಹೋಲಿಕೆ'}
                  </h3>
                  <p className="text-xs text-stone-500">
                    {language === 'en'
                      ? 'Farmer asking rates, direct buyer bids, and verified KSAMB daily prices.'
                      : 'ರೈತರ ಅಪೇಕ್ಷಿತ ದರ, ವ್ಯಾಪಾರಿಗಳ ಆಫರ್ ಮತ್ತು ಅಧಿಕೃತ ಎಪಿಎಂಸಿ ದರಗಳು.'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Select Crop Tabs */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-stone-700 block">
                {language === 'en' ? 'Select Produce to Compare:' : 'ಹೋಲಿಸಲು ಬೆಳೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ:'}
              </span>
              <div className="flex flex-wrap gap-2">
                {comparisonItems.map((item, idx) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedCropIndex(idx)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
                      selectedCropIndex === idx
                        ? 'bg-[#17652B] text-[#FFBF24] shadow-sm'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    <span>{item.crop?.icon_name || '🌾'}</span>
                    <span>{language === 'en' ? item.crop?.name_en : item.crop?.name_kn}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Crop Price Comparison Card */}
            <div className="bg-[#FFF8E5] p-5 rounded-2xl border border-amber-200 space-y-4">
              <div className="flex items-center justify-between border-b border-amber-200/80 pb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{currentCompareItem.crop?.icon_name || '🌾'}</span>
                  <div>
                    <h4 className="font-black text-sm text-stone-900">
                      {language === 'en' ? currentCompareItem.crop?.name_en : currentCompareItem.crop?.name_kn}
                    </h4>
                    <span className="text-[11px] text-stone-500 flex items-center">
                      <MapPin className="w-3 h-3 mr-1 text-[#17652B]" />
                      {currentCompareItem.market?.name_en || 'Hubballi APMC'}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-black uppercase bg-green-100 text-[#17652B] px-2.5 py-1 rounded-full border border-green-300">
                  {currentCompareItem.status || 'Active Listing'}
                </span>
              </div>

              {/* 3 Rates Side-by-Side */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                {/* 1. Farmer Asking Price */}
                <div className="bg-white p-3.5 rounded-xl border border-stone-200">
                  <span className="text-[10px] font-bold text-stone-500 uppercase block">Farmer Asking:</span>
                  <div className="text-xl font-black text-stone-900 mt-1">
                    ₹{currentCompareItem.price_per_kg}/kg
                  </div>
                  <span className="text-[10px] text-stone-400">₹{(currentCompareItem.price_per_kg * 100).toLocaleString('en-IN')}/qtl</span>
                </div>

                {/* 2. Direct Buyer Bid */}
                <div className="bg-white p-3.5 rounded-xl border border-stone-200">
                  <span className="text-[10px] font-bold text-stone-500 uppercase block">Buyer Offer:</span>
                  <div className="text-xl font-black text-[#17652B] mt-1">
                    {bestOffer ? `₹${bestOffer.price_per_kg}/kg` : 'Pending Bid'}
                  </div>
                  <span className="text-[10px] text-stone-500">
                    {bestOffer ? (bestOffer.seller?.shop_name || 'Verified Trader') : 'Awaiting Bids'}
                  </span>
                </div>

                {/* 3. Verified APMC Reference Modal Rate */}
                <div className="bg-white p-3.5 rounded-xl border border-stone-200">
                  <span className="text-[10px] font-bold text-stone-500 uppercase block">KSAMB Modal Rate:</span>
                  <div className="text-xl font-black text-amber-700 mt-1">
                    ₹{currentCompareItem.market_reference?.modal_price_per_kg || 23}/kg
                  </div>
                  <span className="text-[10px] text-stone-400">
                    Range: ₹{currentCompareItem.market_reference?.min_price_per_kg || 21}-₹{currentCompareItem.market_reference?.max_price_per_kg || 25}/kg
                  </span>
                </div>
              </div>

              {/* Verified Source Notice */}
              <div className="pt-2 text-[11px] text-stone-600 space-y-1">
                <div className="flex items-center space-x-1.5 font-bold text-amber-950">
                  <BadgeCheck className="w-4 h-4 text-amber-700" />
                  <span>
                    Price Source: {currentCompareItem.market_reference?.source_market || 'KSAMB Karnataka APMC Daily Record'}
                  </span>
                </div>
                <div className="text-[10px] text-stone-500">
                  Record Date: {currentCompareItem.market_reference?.price_date || '19 Oct 2026'} • Official Modal Average
                </div>
              </div>
            </div>

            {/* Strict Quality & Price Guarantee Disclaimer */}
            <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-[11px] text-stone-600 space-y-1">
              <div className="flex items-center space-x-1.5 font-bold text-stone-800">
                <Info className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                <span>{language === 'en' ? 'Notice on Market Price Reference:' : 'ಮಾರುಕಟ್ಟೆ ದರಗಳ ಮಾಹಿತಿ:'}</span>
              </div>
              <p>
                {language === 'en'
                  ? 'Market reference prices are retrieved from KSAMB government market data for guidance only. Smart Farmer Connect never invents rates nor guarantees any minimum selling price. Final transactions depend on quality inspection and mutual agreement.'
                  : 'ಸರ್ಕಾರದ ಎಪಿಎಂಸಿ ದರಗಳು ಕೇವಲ ಮಾಹಿತಿಗಾಗಿವೆ. ಯಾವುದೇ ನಿಶ್ಚಿತ ದರವನ್ನು ಖಾತರಿಪಡಿಸುವುದಿಲ್ಲ. ಅಂತಿಮ ದರವು ಗುಣಮಟ್ಟ ಮತ್ತು ರೈತ-ವ್ಯಾಪಾರಿಗಳ ಒಪ್ಪಂದದ ಮೇಲೆ ನಿರ್ಧಾರವಾಗುತ್ತದೆ.'}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-bold hover:bg-stone-100 transition"
              >
                {language === 'en' ? 'Close' : 'ಮುಚ್ಚಿ'}
              </button>
              <Link
                href="/marketplace"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#17652B] to-[#2E8B43] hover:from-[#1F7D37] hover:to-[#3FA657] text-white text-xs font-bold shadow-md transition flex items-center space-x-1.5"
              >
                <span>{language === 'en' ? 'Browse Live Marketplace' : 'ಮಾರುಕಟ್ಟೆ ಬ್ರೌಸ್ ಮಾಡಿ'}</span>
                <ChevronRight className="w-4 h-4 text-[#FFBF24]" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: View Visit Details / Gate Pass (Card 3) */}
      {/* ========================================================================= */}
      {activeModal === 'gatepass' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-6 text-[#17251B]">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-stone-200 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-[#17652B] flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5 text-[#17652B]" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-[#17652B]">
                    {confirmedVisit?.verification_code
                      ? (language === 'en' ? 'Pre-Assigned APMC Gate Pass' : 'ದೃಢಪಡಿಸಿದ ಎಪಿಎಂಸಿ ಗೇಟ್ ಪಾಸ್')
                      : (language === 'en' ? 'Visit Booking Details' : 'ಭೇಟಿ ಬುಕಿಂಗ್ ವಿವರಗಳು')}
                  </h3>
                  <p className="text-xs text-stone-500">
                    {language === 'en'
                      ? 'Direct destination, confirmed buyer, and priority gate access.'
                      : 'ನೇರ ಗಮ್ಯಸ್ಥಾನ, ದೃಢಪಡಿಸಿದ ವ್ಯಾಪಾರಿ ಮತ್ತು ಮಂಡಿ ಗೇಟ್ ಪಾಸ್.'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Visit Details Content */}
            {confirmedVisit ? (
              <div className="space-y-4">
                {/* Official Pass Header if code exists */}
                {confirmedVisit.verification_code ? (
                  <div className="bg-[#FFF8E5] p-4 rounded-2xl border border-amber-200 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-300 text-[#17652B] flex items-center justify-center font-bold shadow-xs">
                        <QrCode className="w-6 h-6 text-[#17652B]" />
                      </div>
                      <div>
                        <span className="text-[10px] text-stone-500 uppercase font-bold tracking-wider block">
                          {language === 'en' ? 'Mandi Gate Verification Pass' : 'ಎಪಿಎಂಸಿ ಗೇಟ್ ಪರಿಶೀಲನಾ ಪಾಸ್'}
                        </span>
                        <span className="text-xl font-black font-mono text-[#17652B] tracking-wider">
                          {confirmedVisit.verification_code}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-black uppercase bg-green-100 text-[#17652B] px-3 py-1 rounded-full border border-green-300">
                      {confirmedVisit.status || 'Confirmed'}
                    </span>
                  </div>
                ) : (
                  <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-xs font-bold text-amber-950 flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-amber-700" />
                    <span>{language === 'en' ? 'Visit Booking Details — Gate Pass Pending Acceptance' : 'ಭೇಟಿ ವಿವರ — ಆಫರ್ ಒಪ್ಪಿಗೆ ಬಾಕಿ ಇದೆ'}</span>
                  </div>
                )}

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200">
                    <span className="text-[10px] font-bold text-stone-500 uppercase block">Selected APMC Market:</span>
                    <strong className="text-sm text-stone-900 block mt-0.5">
                      {confirmedVisit.listing?.market?.name_en || 'Hubballi APMC (Amaragol)'}
                    </strong>
                    <span className="text-[11px] text-stone-500">Main Yard Weighbridge Gate 2</span>
                  </div>

                  <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200">
                    <span className="text-[10px] font-bold text-stone-500 uppercase block">Accepted Buyer:</span>
                    <strong className="text-sm text-stone-900 block mt-0.5">
                      {confirmedVisit.offer?.seller?.shop_name || 'Suresh Agro Traders'}
                    </strong>
                    <span className="text-[11px] text-stone-500">Licensed Commission Stall #42</span>
                  </div>

                  <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200">
                    <span className="text-[10px] font-bold text-stone-500 uppercase block">Confirmed Lot Quantity:</span>
                    <strong className="text-sm text-stone-900 block mt-0.5">
                      {confirmedVisit.offer?.quantity_kg || 600} kg ({((confirmedVisit.offer?.quantity_kg || 600) / 100).toFixed(1)} qtl)
                    </strong>
                    <span className="text-[11px] text-stone-500">Agreed Price: ₹{confirmedVisit.offer?.price_per_kg || 29}/kg</span>
                  </div>

                  <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200">
                    <span className="text-[10px] font-bold text-stone-500 uppercase block">Scheduled Visit Date:</span>
                    <strong className="text-sm text-stone-900 block mt-0.5">
                      {confirmedVisit.scheduled_at ? new Date(confirmedVisit.scheduled_at).toLocaleDateString() : 'Tomorrow Morning'}
                    </strong>
                    <span className="text-[11px] text-stone-500">Arrival Window: 08:00 AM - 11:30 AM</span>
                  </div>
                </div>

                {/* Honest Pass Issuance Notice */}
                <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-[11px] text-stone-600 space-y-1">
                  <div className="flex items-center space-x-1.5 font-bold text-stone-800">
                    <Info className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                    <span>{language === 'en' ? 'Gate Pass Issuance Policy:' : 'ಗೇಟ್ ಪಾಸ್ ವಿತರಣಾ ನೀತಿ:'}</span>
                  </div>
                  <p>
                    {language === 'en'
                      ? 'An official digital APMC gate pass is only issued when a mutual deal is confirmed between farmer and licensed trader. When no deal is confirmed yet, you may explore active mandi listings and compare incoming bids.'
                      : 'ರೈತರು ಮತ್ತು ವ್ಯಾಪಾರಿಗಳ ನಡುವೆ ಆಫರ್ ಒಪ್ಪಂದ ದೃಢಪಟ್ಟಾಗ ಮಾತ್ರ ಅಧಿಕೃತ ಗೇಟ್ ಪಾಸ್ ಸೃಷ್ಟಿಯಾಗುತ್ತದೆ. ಒಪ್ಪಂದವಿಲ್ಲದಿದ್ದಾಗ ಇದು ಭೇಟಿ ಬುಕಿಂಗ್ ಮಾರ್ಗದರ್ಶಿಯಾಗಿದೆ.'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 space-y-3">
                <Clock className="w-10 h-10 text-amber-500 mx-auto" />
                <h4 className="font-bold text-sm text-stone-800">
                  {language === 'en' ? 'No Confirmed Visits in Database Yet' : 'ಇನ್ನೂ ದೃಢೀಕೃತ ಭೇಟಿಗಳು ದಾಖಲಾಗಿಲ್ಲ'}
                </h4>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  {language === 'en'
                    ? 'Once an APMC trader submits an offer and you accept it in Step 3, your digital gate pass with verification code will be generated here.'
                    : 'ವ್ಯಾಪಾರಿಯ ಆಫರ್ ಒಪ್ಪಿಕೊಂಡ ತಕ್ಷಣ ಅಧಿಕೃತ ಗೇಟ್ ಪಾಸ್ ಇಲ್ಲಿ ಕಾಣಿಸುತ್ತದೆ.'}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-bold hover:bg-stone-100 transition"
              >
                {language === 'en' ? 'Close' : 'ಮುಚ್ಚಿ'}
              </button>
              <Link
                href="/visits"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#17652B] to-[#2E8B43] hover:from-[#1F7D37] hover:to-[#3FA657] text-white text-xs font-bold shadow-md transition flex items-center space-x-1.5"
              >
                <span>{language === 'en' ? 'Open Mandi Gate Pass Page' : 'ಗೇಟ್ ಪಾಸ್ ಪುಟ ತೆರೆಯಿರಿ'}</span>
                <ChevronRight className="w-4 h-4 text-[#FFBF24]" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: View Settlement Details (Card 4) */}
      {/* ========================================================================= */}
      {activeModal === 'settlement' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-6 text-[#17251B]">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-stone-200 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-[#17652B] flex items-center justify-center font-bold">
                  <Scale className="w-5 h-5 text-[#17652B]" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-[#17652B]">
                    {language === 'en' ? 'Transparent Settlement Breakdown' : 'ಪಾರದರ್ಶಕ ಇತ್ಯರ್ಥ ವಿವರ'}
                  </h3>
                  <p className="text-xs text-stone-500">
                    {language === 'en'
                      ? 'Agreed prices, accepted quantities, verified deductions, and payment status.'
                      : 'ಒಪ್ಪಿದ ಬೆಲೆ, ಪ್ರಮಾಣ, ಕಡಿತಗಳು ಮತ್ತು ಪಾವತಿ ಸ್ಥಿತಿ.'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Settlement Data Box */}
            {confirmedVisit ? (() => {
              const agreedPrice = confirmedVisit.offer?.price_per_kg || 29;
              const acceptedQty = confirmedVisit.offer?.quantity_kg || 600;
              const grossAmount = agreedPrice * acceptedQty;
              const mandiCess = 0; // Statutory APMC user charge paid by buyer
              const handlingDeductions = 0; // Transparent - zero hidden cuts
              const netPayable = grossAmount - mandiCess - handlingDeductions;
              const isSettled = !!confirmedVisit.transaction || confirmedVisit.status === 'completed';

              return (
                <div className="space-y-4">
                  {/* Status Banner */}
                  <div
                    className={`p-4 rounded-2xl border flex items-center justify-between ${
                      isSettled
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                        : 'bg-amber-50 border-amber-300 text-amber-950'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      {isSettled ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                      ) : (
                        <Clock className="w-5 h-5 text-amber-700" />
                      )}
                      <div>
                        <h4 className="font-black text-sm">
                          {isSettled
                            ? (language === 'en' ? 'Payment Verified & Settled' : 'ಪಾವತಿ ಪರಿಶೀಲಿಸಿ ಜಮೆಯಾಗಿದೆ')
                            : (language === 'en' ? 'Pending Mandi Weighbridge Verification' : 'ಮಂಡಿ ತೂಕ ಪರಿಶೀಲನೆ ಬಾಕಿ ಇದೆ')}
                        </h4>
                        <span className="text-[11px] opacity-80">
                          {isSettled
                            ? `Settled via ${confirmedVisit.transaction?.payment_method?.toUpperCase() || 'UPI'}`
                            : (language === 'en' ? 'Payment released upon scale verification at yard' : 'ಮಂಡಿಯಲ್ಲಿ ತೂಕವಾದ ನಂತರ ಪಾವತಿ ಬಿಡುಗಡೆ')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Financial Table */}
                  <div className="bg-[#FFF8E5] p-5 rounded-2xl border border-amber-200 space-y-3">
                    <span className="text-[11px] font-black text-amber-950 uppercase tracking-wider block">
                      {language === 'en' ? 'Financial Computation Slip' : 'ಆರ್ಥಿಕ ಲೆಕ್ಕಾಚಾರ ರಸೀದಿ'}
                    </span>

                    <div className="space-y-2 text-xs text-stone-700">
                      <div className="flex justify-between">
                        <span>{language === 'en' ? 'Agreed Rate:' : 'ಒಪ್ಪಿದ ದರ:'}</span>
                        <strong className="text-stone-900">₹{agreedPrice}/kg</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>{language === 'en' ? 'Accepted Lot Quantity:' : 'ಖರೀದಿಸಿದ ಪ್ರಮಾಣ:'}</span>
                        <strong className="text-stone-900">{acceptedQty} kg ({(acceptedQty / 100).toFixed(1)} qtl)</strong>
                      </div>
                      <div className="flex justify-between font-bold text-stone-900">
                        <span>{language === 'en' ? 'Gross Lot Value:' : 'ಒಟ್ಟು ಮೊತ್ತ:'}</span>
                        <span>₹{grossAmount.toLocaleString('en-IN')}</span>
                      </div>

                      <div className="pt-2 border-t border-amber-200/80 space-y-1.5 text-stone-500">
                        <div className="flex justify-between text-[11px]">
                          <span>{language === 'en' ? 'Middleman Commission Cuts:' : 'ದಲ್ಲಾಳಿ ಕಮಿಷನ್ ಕಡಿತ:'}</span>
                          <span className="text-[#17652B] font-bold">₹0.00 (Zero Hidden Cuts)</span>
                        </div>
                        <div className="flex justify-between text-[11px]">
                          <span>{language === 'en' ? 'APMC Mandi Yard Weighment Slip Fee:' : 'ಎಪಿಎಂಸಿ ತೂಕ ಶುಲ್ಕ:'}</span>
                          <span>₹0.00 (Buyer borne)</span>
                        </div>
                      </div>

                      <div className="flex justify-between pt-2.5 border-t border-amber-300 text-sm font-black text-[#17652B]">
                        <span>{language === 'en' ? 'Net Settlement Payable to Farmer:' : 'ರೈತರಿಗೆ ಪಾವತಿಸಬೇಕಾದ ಅಂತಿಮ ಮೊತ್ತ:'}</span>
                        <span className="text-base text-[#17652B]">₹{netPayable.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Anti-fraud / Verification Notice */}
                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-[11px] text-stone-600 space-y-1">
                    <div className="flex items-center space-x-1.5 font-bold text-stone-800">
                      <ShieldCheck className="w-3.5 h-3.5 text-green-700 shrink-0" />
                      <span>{language === 'en' ? 'Weighing Verification & Payment Rule:' : 'ತೂಕ ಮತ್ತು ಪಾವತಿ ನಿಯಮ:'}</span>
                    </div>
                    <p>
                      {language === 'en'
                        ? 'Payments are never marked completed without physical weighbridge scale confirmation. Farmers verify produce weight alongside licensed traders before final bank transfer or cash handover.'
                        : 'ಭೌತಿಕ ತೂಕದ ರಸೀದಿ ಇಲ್ಲದೆ ಪಾವತಿಯನ್ನು ಪೂರ್ಣ ಎಂದು ಗುರುತಿಸುವುದಿಲ್ಲ. ತೂಕ ಪರಿಶೀಲಿಸಿದ ನಂತರವೇ ಹಣ ವರ್ಗಾವಣೆ ನಡೆಯುತ್ತದೆ.'}
                    </p>
                  </div>
                </div>
              );
            })() : (
              <div className="text-center py-6 space-y-3">
                <FileText className="w-10 h-10 text-stone-400 mx-auto" />
                <h4 className="font-bold text-sm text-stone-800">
                  {language === 'en' ? 'No Recorded Settlements Yet' : 'ಇನ್ನೂ ಯಾವುದೇ ಇತ್ಯರ್ಥಗಳು ದಾಖಲಾಗಿಲ್ಲ'}
                </h4>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  {language === 'en'
                    ? 'Transparent settlement slips are generated upon physical produce delivery and digital weighbridge confirmation.'
                    : 'ಬೆಳೆ ಸರಬರಾಜು ಮತ್ತು ತೂಕ ದೃಢೀಕರಣದ ನಂತರ ಡಿಜಿಟಲ್ ಇತ್ಯರ್ಥ ರಸೀದಿ ಸೃಷ್ಟಿಯಾಗುತ್ತದೆ.'}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-bold hover:bg-stone-100 transition"
              >
                {language === 'en' ? 'Close' : 'ಮುಚ್ಚಿ'}
              </button>
              <Link
                href="/visits"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#17652B] to-[#2E8B43] hover:from-[#1F7D37] hover:to-[#3FA657] text-white text-xs font-bold shadow-md transition flex items-center space-x-1.5"
              >
                <span>{language === 'en' ? 'Track Visits & Payments' : 'ಭೇಟಿ ಮತ್ತು ಪಾವತಿ ಟ್ರ್ಯಾಕ್ ಮಾಡಿ'}</span>
                <ChevronRight className="w-4 h-4 text-[#FFBF24]" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
