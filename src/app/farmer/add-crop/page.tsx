'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Navbar } from '@/components/common/Navbar';
import { Market, Crop, WeightUnit } from '@/types/database';
import { calculateTotalValue, normalizeToKg, normalizePricePerKg } from '@/lib/utils/units';
import { getMarketReferencePrice, calculatePriceComparison } from '@/lib/services/mandi-price';
import {
  Camera,
  Upload,
  ArrowLeft,
  Trash2,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Info,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

export default function AddCropPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { language } = useLanguage();

  const [markets, setMarkets] = useState<Market[]>([]);
  const [crops, setCrops] = useState<Crop[]>([]);

  // Form states
  const [selectedCropId, setSelectedCropId] = useState('');
  const [enteredQuantity, setEnteredQuantity] = useState<number | ''>(500);
  const [enteredUnit, setEnteredUnit] = useState<WeightUnit>('kg');
  const [enteredPrice, setEnteredPrice] = useState<number | ''>(22);
  const [enteredPriceUnit, setEnteredPriceUnit] = useState<WeightUnit>('kg');
  const [minPrice, setMinPrice] = useState<number | ''>('');
  const [isNegotiable, setIsNegotiable] = useState<boolean>(true);
  const [selectedMarketId, setSelectedMarketId] = useState('');
  const [harvestDate, setHarvestDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('Grade-A fresh red round tomatoes harvested this morning. Firm, clean, and packed in plastic crates.');

  // 1-5 Photos array
  const [photos, setPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
  ]);

  // Farmer Confirmed Quality Grade
  const [selectedGrade, setSelectedGrade] = useState<'Grade A' | 'Grade B' | 'Grade C'>('Grade B');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && (!user || user.profile.role !== 'farmer')) {
      router.push('/auth/login?role=farmer');
      return;
    }

    fetch('/api/master-data')
      .then((res) => res.json())
      .then((data) => {
        if (data.markets) {
          setMarkets(data.markets);
          if (data.markets.length > 0 && !selectedMarketId) {
            setSelectedMarketId(data.markets[0].id); // Hubballi APMC
          }
        }
        if (data.crops) {
          setCrops(data.crops);
          if (data.crops.length > 0 && !selectedCropId) {
            setSelectedCropId(data.crops[0].id); // Tomato
          }
        }
      });
  }, [user, loading]);

  // Live total value calculation
  let calculatedTotal = 0;
  let normalizedPriceKg = 0;
  try {
    if (enteredQuantity && enteredPrice) {
      const kg = normalizeToKg(Number(enteredQuantity), enteredUnit);
      normalizedPriceKg = normalizePricePerKg(Number(enteredPrice), enteredPriceUnit);
      calculatedTotal = calculateTotalValue(kg, normalizedPriceKg);
    }
  } catch (e) {
    calculatedTotal = 0;
  }

  // Live Market Reference lookup
  const selectedCrop = crops.find((c) => c.id === selectedCropId);
  const selectedMarket = markets.find((m) => m.id === selectedMarketId);
  const marketReference = selectedCrop && selectedMarket 
    ? getMarketReferencePrice(selectedCrop.name_en, selectedMarket.name_en) 
    : null;

  const priceComparison = marketReference && normalizedPriceKg > 0
    ? calculatePriceComparison(normalizedPriceKg, marketReference.modal_price_per_kg)
    : null;

  // Multi-photo handler (up to 5)
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = 5 - photos.length;
    if (remainingSlots <= 0) {
      alert(language === 'en' ? 'Maximum 5 photos allowed.' : 'ಗರಿಷ್ಠ 5 ಫೋಟೋಗಳನ್ನು ಮಾತ್ರ ಸೇರಿಸಬಹುದು.');
      return;
    }

    const filesToRead = Array.from(files).slice(0, remainingSlots);
    filesToRead.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setPhotos((prev) => [...prev, reader.result as string].slice(0, 5));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    if (photos.length === 1) {
      alert(language === 'en' ? 'At least 1 photo is required.' : 'ಕನಿಷ್ಠ 1 ಫೋಟೋ ಅಗತ್ಯವಿದೆ.');
      return;
    }
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.farmerProfile?.id) {
      alert('Farmer profile not loaded. Please re-login.');
      return;
    }

    if (!selectedCropId || !enteredQuantity || !enteredPrice || !selectedMarketId) {
      alert('Please fill in all required fields.');
      return;
    }

    if (photos.length === 0) {
      alert(language === 'en' ? 'Please upload at least 1 photo.' : 'ದಯವಿಟ್ಟು ಕನಿಷ್ಠ 1 ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.');
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        farmer_id: user.farmerProfile.id,
        crop_id: selectedCropId,
        market_id: selectedMarketId,
        entered_quantity: Number(enteredQuantity),
        entered_unit: enteredUnit,
        entered_price: Number(enteredPrice),
        entered_price_unit: enteredPriceUnit,
        min_price: minPrice ? Number(minPrice) : undefined,
        is_negotiable: isNegotiable,
        harvest_date: harvestDate,
        description,
        photos,
        farmer_confirmed_grade: selectedGrade,
      };

      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to post crop listing');
      }

      alert(
        language === 'en'
          ? 'Crop lot posted successfully with quality assessment! Matching APMC traders have been notified.'
          : 'ಗುಣಮಟ್ಟದ ಮೌಲ್ಯಮಾಪನದೊಂದಿಗೆ ಬೆಳೆ ಯಶಸ್ವಿಯಾಗಿ ಪೋಸ್ಟ್ ಆಗಿದೆ! ವ್ಯಾಪಾರಿಗಳಿಗೆ ಸಂದೇಶ ಕಳುಹಿಸಲಾಗಿದೆ.'
      );

      router.push('/farmer/dashboard');
    } catch (err: any) {
      alert(err.message || 'Error creating listing');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FCFAF2] text-stone-900">
      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Navigation title */}
        <div className="flex items-center space-x-3">
          <Link
            href="/farmer/dashboard"
            className="p-2.5 bg-white rounded-2xl border border-stone-200 text-stone-700 hover:bg-stone-50 transition shadow-xs"
          >
            <ArrowLeft className="w-5 h-5 text-stone-800" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-[#0E3911]">
              {language === 'en' ? 'Upload Crop & Quality Grading' : 'ಬೆಳೆ ಪೋಸ್ಟ್ & ಗುಣಮಟ್ಟ ಶ್ರೇಣಿ'}
            </h1>
            <p className="text-xs text-stone-500">
              {language === 'en'
                ? 'Upload 1–5 clear photos showing freshness, size, and condition.'
                : 'ಬೆಳೆಯ ತಾಜಾತನ, ಗಾತ್ರ ಮತ್ತು ಸ್ಥಿತಿ ತೋರಿಸುವ 1–5 ಫೋಟೋಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200 space-y-6">
          {/* 1. Crop Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-800">
              {language === 'en' ? 'Select Harvested Crop *' : 'ಕೊಯ್ಲು ಮಾಡಿದ ಬೆಳೆ ಆಯ್ಕೆಮಾಡಿ *'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {crops.map((c) => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => setSelectedCropId(c.id)}
                  className={`p-3 rounded-xl border text-center transition flex flex-col items-center justify-center space-y-1 cursor-pointer ${
                    selectedCropId === c.id
                      ? 'bg-green-50 border-[#1B5E20] ring-2 ring-[#1B5E20] text-green-950 font-bold'
                      : 'bg-stone-50 border-gray-200 text-gray-700 hover:bg-stone-100'
                  }`}
                >
                  <span className="text-2xl">{c.icon_name}</span>
                  <span className="text-xs">{language === 'en' ? c.name_en : c.name_kn}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Photo Upload (1-5 photos with previews) */}
          <div className="space-y-2 border-t pt-4">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-gray-800">
                {language === 'en' ? 'Crop Photos (1 to 5 photos) *' : 'ಬೆಳೆಯ ಫೋಟೋಗಳು (1 ರಿಂದ 5 ಫೋಟೋಗಳು) *'}
              </label>
              <span className="text-[11px] font-semibold text-gray-500">
                {photos.length} / 5 {language === 'en' ? 'photos uploaded' : 'ಫೋಟೋಗಳು'}
              </span>
            </div>

            {/* Photo Preview Strip */}
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 pt-1">
              {photos.map((url, idx) => (
                <div
                  key={idx}
                  className="relative aspect-square rounded-xl overflow-hidden border border-gray-300 shadow-sm bg-stone-100 group"
                >
                  <img src={url} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removePhoto(idx)}
                    className="absolute top-1 right-1 p-1 bg-red-600/90 hover:bg-red-700 text-white rounded-full transition shadow"
                    title="Remove photo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] px-1.5 py-0.2 rounded font-mono">
                    #{idx + 1}
                  </span>
                </div>
              ))}

              {photos.length < 5 && (
                <label className="aspect-square rounded-xl border-2 border-dashed border-green-600/60 bg-green-50/50 hover:bg-green-100/50 flex flex-col items-center justify-center cursor-pointer transition text-center p-2">
                  <Camera className="w-6 h-6 text-[#1B5E20] mb-1" />
                  <span className="text-[10px] font-bold text-[#1B5E20]">
                    {language === 'en' ? '+ Add Photo' : '+ ಫೋಟೋ'}
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <p className="text-[11px] text-gray-500 italic">
              {language === 'en'
                ? 'Camera & gallery supported. Clearly capture visible colour, size uniformity, and condition.'
                : 'ಕ್ಯಾಮೆರಾ ಮತ್ತು ಗ್ಯಾಲರಿ ಬೆಂಬಲಿತವಾಗಿದೆ. ನೈಜ ಬಣ್ಣ ಮತ್ತು ಗುಣಮಟ್ಟ ಸ್ಪಷ್ಟವಾಗಿರಲಿ.'}
            </p>
          </div>

          {/* 3. Expected Price & Quantity */}
          <div className="space-y-4 border-t pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Total Available Quantity */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-800">
                  {language === 'en' ? 'Total Available Quantity *' : 'ಒಟ್ಟು ಲಭ್ಯವಿರುವ ಪ್ರಮಾಣ *'}
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    min="0.1"
                    step="any"
                    required
                    value={enteredQuantity}
                    onChange={(e) => setEnteredQuantity(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="500"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-base font-bold text-gray-900 focus:ring-2 focus:ring-[#1B5E20] outline-none"
                  />
                  <select
                    value={enteredUnit}
                    onChange={(e) => setEnteredUnit(e.target.value as WeightUnit)}
                    className="w-28 px-2 py-3 border border-gray-300 rounded-xl text-xs sm:text-sm font-semibold bg-stone-50 focus:ring-2 focus:ring-[#1B5E20] outline-none"
                  >
                    <option value="kg">kg (ಕೆ.ಜಿ)</option>
                    <option value="quintal">Quintal</option>
                    <option value="tonne">Tonne</option>
                  </select>
                </div>
              </div>

              {/* Farmer's Expected Rate */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-800">
                  {language === 'en' ? "Farmer's Expected Rate *" : 'ನಿರೀಕ್ಷಿತ ದರ *'}
                </label>
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-3.5 text-gray-500 font-bold">₹</span>
                    <input
                      type="number"
                      min="1"
                      step="any"
                      required
                      value={enteredPrice}
                      onChange={(e) => setEnteredPrice(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="22"
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl text-base font-bold text-[#1B5E20] focus:ring-2 focus:ring-[#1B5E20] outline-none"
                    />
                  </div>
                  <select
                    value={enteredPriceUnit}
                    onChange={(e) => setEnteredPriceUnit(e.target.value as WeightUnit)}
                    className="w-28 px-2 py-3 border border-gray-300 rounded-xl text-xs sm:text-sm font-semibold bg-stone-50 focus:ring-2 focus:ring-[#1B5E20] outline-none"
                  >
                    <option value="kg">per kg</option>
                    <option value="quintal">per Quintal</option>
                    <option value="tonne">per Tonne</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Optional Min Price & Negotiable Toggle */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center bg-stone-50 p-3.5 rounded-xl border border-stone-200">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {language === 'en' ? 'Minimum Acceptable Price (Optional)' : 'ಕನಿಷ್ಠ ಒಪ್ಪಿತ ದರ (ಐಚ್ಛಿಕ)'}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-400 font-bold">₹</span>
                  <input
                    type="number"
                    min="1"
                    step="any"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="e.g. 20"
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3 pt-2 sm:pt-4">
                <input
                  type="checkbox"
                  id="negotiable"
                  checked={isNegotiable}
                  onChange={(e) => setIsNegotiable(e.target.checked)}
                  className="w-5 h-5 text-[#1B5E20] rounded focus:ring-green-500 cursor-pointer"
                />
                <label htmlFor="negotiable" className="text-xs font-bold text-gray-800 cursor-pointer">
                  {language === 'en' ? 'Price is negotiable (ಚರ್ಚೆಗೆ ಮುಕ್ತ)' : 'ದರ ಚರ್ಚೆಗೆ ಮುಕ್ತವಾಗಿದೆ'}
                </label>
              </div>
            </div>

            {/* Automatic Total Value Display */}
            <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-3.5 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-emerald-800" />
                <span className="text-xs font-bold text-emerald-950">
                  {language === 'en' ? 'Estimated Total Value:' : 'ಅಂದಾಜು ಒಟ್ಟು ಮೌಲ್ಯ:'}
                </span>
              </div>
              <span className="text-xl font-extrabold text-[#1B5E20]">
                ₹{calculatedTotal.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Price Prediction / Mandi Reference Price Box */}
            <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/60 space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5 font-bold text-xs text-amber-950">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>{language === 'en' ? 'Mandi Reference Price Benchmark:' : 'ಮಂಡಿ ದರ ಹೋಲಿಕೆ:'}</span>
                </div>
                {marketReference?.is_available && (
                  <span className="text-[10px] bg-white font-bold px-2 py-0.5 rounded text-amber-800 border">
                    Verified APMC Record
                  </span>
                )}
              </div>

              {marketReference ? (
                <div className="space-y-1 text-xs">
                  <div className="flex flex-wrap gap-x-4 text-gray-800">
                    <span>
                      Modal Rate: <strong>₹{marketReference.modal_price_per_kg}/kg</strong>
                    </span>
                    <span>
                      Range: ₹{marketReference.min_price_per_kg} - ₹{marketReference.max_price_per_kg}/kg
                    </span>
                    <span className="text-gray-500">
                      Source: {marketReference.source_market} ({marketReference.price_date})
                    </span>
                  </div>
                  {priceComparison && (
                    <div className="font-bold text-xs pt-1 flex items-center space-x-1">
                      <span className={priceComparison.isAboveModal ? 'text-green-800' : 'text-amber-800'}>
                        {priceComparison.summaryText}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-xs text-stone-600 italic">
                  {language === 'en'
                    ? 'Verified reference rate is currently unavailable for this specific crop/market. You may enter your desired price freely.'
                    : 'ಈ ಮಾರುಕಟ್ಟೆ ಮತ್ತು ಬೆಳೆಗೆ ಅಧಿಕೃತ ದರ ಲಭ್ಯವಿಲ್ಲ. ನಿಮ್ಮ ಇಷ್ಟದ ದರವನ್ನು ಮುಕ್ತವಾಗಿ ನಮೂದಿಸಿ.'}
                </p>
              )}
            </div>
          </div>

          {/* 4. Crop Quality Assessment Section */}
          <div className="space-y-3 border-t pt-4">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-gray-800 flex items-center space-x-1">
                <span>{language === 'en' ? 'Preliminary Visual Quality Assessment' : 'ಪೂರ್ವಭಾವಿ ದೃಶ್ಯ ಗುಣಮಟ್ಟ ಮೌಲ್ಯಮಾಪನ'}</span>
              </label>
              <span className="text-[11px] font-bold text-[#1B5E20] bg-green-100 px-2 py-0.5 rounded-full">
                {selectedGrade}
              </span>
            </div>

            {/* Quality Grade Selector */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { grade: 'Grade A', labelEn: 'Grade A (Premium)', labelKn: 'ಶ್ರೇಣಿ ಎ (ಉತ್ತಮ)', desc: 'Uniform, firm, no visible spots' },
                { grade: 'Grade B', labelEn: 'Grade B (Standard)', labelKn: 'ಶ್ರೇಣಿ ಬಿ (ಸಾಮಾನ್ಯ)', desc: 'Market standard, minor skin scars' },
                { grade: 'Grade C', labelEn: 'Grade C (Fair)', labelKn: 'ಶ್ರೇಣಿ ಸಿ (ಮಧ್ಯಮ)', desc: 'Mixed sizes or light blemishes' },
              ].map((g) => (
                <button
                  type="button"
                  key={g.grade}
                  onClick={() => setSelectedGrade(g.grade as any)}
                  className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                    selectedGrade === g.grade
                      ? 'bg-green-50 border-[#1B5E20] ring-2 ring-[#1B5E20]'
                      : 'bg-stone-50 border-gray-200 hover:bg-stone-100'
                  }`}
                >
                  <div className="font-bold text-xs text-gray-900">
                    {language === 'en' ? g.labelEn : g.labelKn}
                  </div>
                  <div className="text-[10px] text-gray-500 mt-1 leading-tight">{g.desc}</div>
                </button>
              ))}
            </div>

            {/* Honest Quality Disclaimer */}
            <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-[11px] text-stone-600 space-y-1">
              <div className="flex items-center space-x-1 font-semibold text-stone-700">
                <Info className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                <span>Notice on Visual Assessment:</span>
              </div>
              <p>
                Visual photo checks cannot determine pesticide residues, moisture content, or official APMC laboratory grading. The farmer confirms this preliminary visual condition before posting.
              </p>
            </div>
          </div>

          {/* 5. Target APMC Market & Harvest Date */}
          <div className="space-y-4 border-t pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  {language === 'en' ? 'Target APMC Mandi *' : 'ಉದ್ದೇಶಿತ ಮಾರುಕಟ್ಟೆ *'}
                </label>
                <select
                  value={selectedMarketId}
                  onChange={(e) => setSelectedMarketId(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm font-medium bg-white focus:ring-2 focus:ring-[#1B5E20] outline-none"
                >
                  {markets.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name_en} ({m.name_kn})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  {language === 'en' ? 'Harvest Date *' : 'ಕೊಯ್ಲು ದಿನಾಂಕ *'}
                </label>
                <input
                  type="date"
                  required
                  value={harvestDate}
                  onChange={(e) => setHarvestDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#1B5E20] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1">
                {language === 'en' ? 'Condition & Quality Description (Max 300 chars)' : 'ಗುಣಮಟ್ಟದ ವಿವರ (ಗರಿಷ್ಠ 300 ಅಕ್ಷರ)'}
              </label>
              <textarea
                maxLength={300}
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe visible colour, freshness, firmness, and packaging..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#1B5E20] outline-none"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full min-h-[52px] bg-[#1B5E20] hover:bg-green-900 active:scale-[0.99] text-white font-bold rounded-xl shadow-md flex items-center justify-center space-x-2 transition cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-5 h-5 text-amber-300" />
            <span>
              {submitting
                ? (language === 'en' ? 'Publishing & Grading...' : 'ಪ್ರಕಟಿಸಲಾಗುತ್ತಿದೆ...')
                : (language === 'en' ? 'Publish Crop & Alert Traders' : 'ಬೆಳೆ ಪ್ರಕಟಿಸಿ, ವ್ಯಾಪಾರಿಗಳಿಗೆ ಮಾಹಿತಿ ನೀಡಿ')}
            </span>
          </button>
        </form>
      </main>
    </div>
  );
}
