'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Navbar } from '@/components/common/Navbar';
import { Market, Crop } from '@/types/database';
import { Sprout, Store, ArrowRight, ShieldCheck, MapPin, Phone, User, FileText, CheckCircle2 } from 'lucide-react';

function RegisterFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = searchParams.get('role') || 'farmer';

  const { register } = useAuth();
  const { language } = useLanguage();

  const [role, setRole] = useState<'farmer' | 'seller'>(initialRole === 'seller' ? 'seller' : 'farmer');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('+91');
  const [village, setVillage] = useState('');
  const [taluk, setTaluk] = useState('');
  const [district, setDistrict] = useState('Belagavi');
  const [shopName, setShopName] = useState('');
  const [licenseNo, setLicenseNo] = useState('');
  const [selectedMarkets, setSelectedMarkets] = useState<string[]>([]);
  const [selectedCrops, setSelectedCrops] = useState<string[]>([]);

  const [markets, setMarkets] = useState<Market[]>([]);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch('/api/master-data')
      .then((res) => res.json())
      .then((data) => {
        if (data.markets) setMarkets(data.markets);
        if (data.crops) setCrops(data.crops);
        if (data.markets?.length > 0 && selectedMarkets.length === 0) {
          setSelectedMarkets([data.markets[0].id]);
        }
      });
  }, []);

  const handleMarketToggle = (id: string) => {
    if (selectedMarkets.includes(id)) {
      if (selectedMarkets.length > 1) {
        setSelectedMarkets(selectedMarkets.filter((m) => m !== id));
      }
    } else {
      setSelectedMarkets([...selectedMarkets, id]);
    }
  };

  const handleCropToggle = (name: string) => {
    if (selectedCrops.includes(name)) {
      setSelectedCrops(selectedCrops.filter((c) => c !== name));
    } else {
      setSelectedCrops([...selectedCrops, name]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      role,
      full_name: fullName,
      phone,
      language,
      village,
      taluk,
      district,
      shop_name: shopName,
      license_no: licenseNo,
      preferred_crops: selectedCrops,
      subscribedMarkets: selectedMarkets,
    };

    const success = await register(payload);
    setSubmitting(false);

    if (success) {
      if (role === 'farmer') {
        router.push('/farmer/dashboard');
      } else {
        router.push('/seller/dashboard');
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF8E5] text-[#17251B]">
      <Navbar />

      <main className="flex-1 max-w-xl w-full mx-auto px-4 py-10 space-y-6">
        {/* Role Selector Tabs */}
        <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-stone-200 flex">
          <button
            type="button"
            onClick={() => setRole('farmer')}
            className={`flex-1 py-3 px-4 rounded-xl font-black text-sm flex items-center justify-center space-x-2 transition cursor-pointer ${
              role === 'farmer'
                ? 'bg-[#17652B] text-white shadow'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Sprout className="w-4 h-4 text-[#FFBF24]" />
            <span>{language === 'en' ? 'Farmer Registration' : 'ರೈತರ ನೋಂದಣಿ'}</span>
          </button>

          <button
            type="button"
            onClick={() => setRole('seller')}
            className={`flex-1 py-3 px-4 rounded-xl font-black text-sm flex items-center justify-center space-x-2 transition cursor-pointer ${
              role === 'seller'
                ? 'bg-[#17652B] text-white shadow'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Store className="w-4 h-4 text-[#FFBF24]" />
            <span>{language === 'en' ? 'APMC Seller' : 'ವ್ಯಾಪಾರಿ ನೋಂದಣಿ'}</span>
          </button>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200 space-y-6">
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-black text-[#17652B]">
              {role === 'farmer'
                ? (language === 'en' ? 'Create Farmer Account' : 'ಹೊಸ ರೈತರ ನೋಂದಣಿ')
                : (language === 'en' ? 'Register APMC Commission Shop' : 'ಎಪಿಎಂಸಿ ಮಳಿಗೆ ನೋಂದಣಿ')}
            </h1>
            <p className="text-xs text-stone-500">
              {language === 'en'
                ? 'Join verified farmers and APMC traders across Karnataka.'
                : 'ಕರ್ನಾಟಕದ ನೊಂದಾಯಿತ ರೈತರು ಮತ್ತು ವ್ಯಾಪಾರಿಗಳ ನೆಟ್‌ವರ್ಕ್‌ಗೆ ಸೇರಿ.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-black text-stone-800 uppercase tracking-wider mb-1">
                {language === 'en' ? 'Full Name' : 'ಪೂರ್ಣ ಹೆಸರು'} *
              </label>
              <div className="relative">
                <User className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={role === 'farmer' ? 'Basavaraj Patil' : 'Suresh Traders'}
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-stone-200 bg-[#FFF8E5]/40 text-sm font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#17652B] focus:bg-white"
                />
              </div>
            </div>

            {/* Mobile Phone */}
            <div>
              <label className="block text-xs font-black text-stone-800 uppercase tracking-wider mb-1">
                {language === 'en' ? 'Mobile Phone Number' : 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ'} *
              </label>
              <div className="relative">
                <Phone className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+919845012345"
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-stone-200 bg-[#FFF8E5]/40 text-sm font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#17652B] focus:bg-white"
                />
              </div>
            </div>

            {/* Role-Specific Fields */}
            {role === 'farmer' ? (
              <div className="space-y-4 pt-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-black text-stone-800 uppercase tracking-wider mb-1">
                      {language === 'en' ? 'Village / ಹಳ್ಳಿ' : 'ಹಳ್ಳಿ'} *
                    </label>
                    <input
                      type="text"
                      value={village}
                      onChange={(e) => setVillage(e.target.value)}
                      placeholder="e.g. Sutagatti"
                      required
                      className="w-full px-4 py-3 rounded-2xl border border-stone-200 bg-[#FFF8E5]/40 text-sm font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#17652B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-stone-800 uppercase tracking-wider mb-1">
                      {language === 'en' ? 'Taluk / ತಾಲೂಕು' : 'ತಾಲೂಕು'} *
                    </label>
                    <input
                      type="text"
                      value={taluk}
                      onChange={(e) => setTaluk(e.target.value)}
                      placeholder="e.g. Bailhongal"
                      required
                      className="w-full px-4 py-3 rounded-2xl border border-stone-200 bg-[#FFF8E5]/40 text-sm font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#17652B]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-stone-800 uppercase tracking-wider mb-1">
                    {language === 'en' ? 'District' : 'ಜಿಲ್ಲೆ'} *
                  </label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-stone-200 bg-[#FFF8E5]/40 text-sm font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#17652B]"
                  >
                    <option value="Belagavi">Belagavi (ಬೆಳಗಾವಿ)</option>
                    <option value="Dharwad">Dharwad / Hubballi (ಧಾರವಾಡ)</option>
                    <option value="Haveri">Haveri (ಹಾವೇರಿ)</option>
                    <option value="Gadag">Gadag (ಗದಗ)</option>
                    <option value="Bagalkot">Bagalkot (ಬಾಗಲಕೋಟೆ)</option>
                    <option value="Davanagere">Davanagere (ದಾವಣಗೆರೆ)</option>
                  </select>
                </div>
              </div>
            ) : (
              <div className="space-y-4 pt-1">
                <div>
                  <label className="block text-xs font-black text-stone-800 uppercase tracking-wider mb-1">
                    {language === 'en' ? 'APMC Stall / Shop Name' : 'ಮಳಿಗೆ ಹೆಸರು'} *
                  </label>
                  <input
                    type="text"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    placeholder="e.g. Mahaveer & Co. Commission Agency"
                    required
                    className="w-full px-4 py-3 rounded-2xl border border-stone-200 bg-[#FFF8E5]/40 text-sm font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#17652B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-stone-800 uppercase tracking-wider mb-1">
                    {language === 'en' ? 'APMC Trader License Number' : 'ಎಪಿಎಂಸಿ ಲೈಸೆನ್ಸ್ ಸಂಖ್ಯೆ'} *
                  </label>
                  <input
                    type="text"
                    value={licenseNo}
                    onChange={(e) => setLicenseNo(e.target.value)}
                    placeholder="e.g. APMC-HUB-2024-C92"
                    required
                    className="w-full px-4 py-3 rounded-2xl border border-stone-200 bg-[#FFF8E5]/40 text-sm font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#17652B]"
                  />
                </div>

                {/* Subscribed Markets */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-black text-stone-800 uppercase tracking-wider">
                    {language === 'en' ? 'Operating APMC Mandis' : 'ಕಾರ್ಯನಿರ್ವಹಿಸುವ ಮಾರುಕಟ್ಟೆಗಳು'}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {markets.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => handleMarketToggle(m.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                          selectedMarkets.includes(m.id)
                            ? 'bg-[#17652B] text-white shadow'
                            : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                        }`}
                      >
                        {m.name_en}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preferred Crops */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-black text-stone-800 uppercase tracking-wider">
                    {language === 'en' ? 'Procurement Interests (Preferred Crops)' : 'ಆಸಕ್ತಿಯ ಬೆಳೆಗಳು'}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {crops.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => handleCropToggle(c.name_en)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                          selectedCrops.includes(c.name_en)
                            ? 'bg-[#FFBF24] text-stone-950 shadow'
                            : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                        }`}
                      >
                        {c.name_en}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full min-h-[50px] bg-gradient-to-r from-[#17652B] to-[#2E8B43] hover:from-[#1F7D37] hover:to-[#3FA657] text-white font-black text-sm rounded-2xl shadow-md transition flex items-center justify-center space-x-2 cursor-pointer border border-[#17652B] disabled:opacity-50 mt-4"
            >
              <span>
                {submitting
                  ? (language === 'en' ? 'Creating Account...' : 'ಖಾತೆ ಸೃಷ್ಟಿಸಲಾಗುತ್ತಿದೆ...')
                  : (language === 'en' ? 'Complete Free Registration' : 'ನೋಂದಣಿ ಪೂರ್ಣಗೊಳಿಸಿ')}
              </span>
              <ArrowRight className="w-4 h-4 text-[#FFBF24]" />
            </button>
          </form>

          <div className="text-center pt-2 text-xs text-stone-600">
            {language === 'en' ? 'Already registered?' : 'ಈಗಾಗಲೇ ಖಾತೆ ಹೊಂದಿದ್ದೀರಾ?'}{' '}
            <Link
              href={`/auth/login?role=${role}`}
              className="font-black text-[#17652B] hover:underline"
            >
              {language === 'en' ? 'Sign In Here' : 'ಇಲ್ಲಿ ಲಾಗಿನ್ ಮಾಡಿ'}
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FFF8E5] flex items-center justify-center text-stone-500 font-bold">
          Loading registration form...
        </div>
      }
    >
      <RegisterFormContent />
    </Suspense>
  );
}
