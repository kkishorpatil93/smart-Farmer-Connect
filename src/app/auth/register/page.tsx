'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Navbar } from '@/components/common/Navbar';
import { Market, Crop } from '@/types/database';
import { Sprout, Store, ArrowRight, ShieldCheck } from 'lucide-react';

export default function RegisterPage() {
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
    <div className="min-h-screen flex flex-col bg-[#FFF8E1]">
      <Navbar />

      <main className="flex-1 max-w-lg w-full mx-auto px-4 py-8 space-y-6">
        {/* Role Selector Tabs */}
        <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-stone-200 flex">
          <button
            type="button"
            onClick={() => setRole('farmer')}
            className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 transition ${
              role === 'farmer'
                ? 'bg-[#1B5E20] text-white shadow'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Sprout className="w-4 h-4 text-amber-300" />
            <span>{language === 'en' ? 'Farmer Registration' : 'ರೈತರ ನೋಂದಣಿ'}</span>
          </button>

          <button
            type="button"
            onClick={() => setRole('seller')}
            className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 transition ${
              role === 'seller'
                ? 'bg-[#1B5E20] text-white shadow'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Store className="w-4 h-4 text-amber-300" />
            <span>{language === 'en' ? 'APMC Seller' : 'ವ್ಯಾಪಾರಿ ನೋಂದಣಿ'}</span>
          </button>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200 space-y-5">
          <div className="text-center space-y-1">
            <h2 className="text-xl font-extrabold text-[#1B5E20]">
              {role === 'farmer'
                ? (language === 'en' ? 'Create Farmer Account' : 'ಹೊಸ ರೈತರ ನೋಂದಣಿ')
                : (language === 'en' ? 'Register APMC Commission Shop' : 'ಎಪಿಎಂಸಿ ಮಳಿಗೆ ನೋಂದಣಿ')}
            </h2>
            <p className="text-xs text-gray-500">
              {language === 'en'
                ? 'Join thousands of farmers & traders across Karnataka.'
                : 'ಕರ್ನಾಟಕದ ಸಾವಿರಾರು ರೈತರು ಮತ್ತು ವ್ಯಾಪಾರಿಗಳ ನೆಟ್‌ವರ್ಕ್‌ಗೆ ಸೇರಿ.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                {language === 'en' ? 'Full Name *' : 'ಪೂರ್ಣ ಹೆಸರು *'}
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={role === 'farmer' ? 'Basavaraj Patil' : 'Suresh Kumar'}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-base focus:ring-2 focus:ring-[#1B5E20] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                {language === 'en' ? 'Mobile Number *' : 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ *'}
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98450 12345"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl font-mono text-base focus:ring-2 focus:ring-[#1B5E20] outline-none"
              />
            </div>

            {/* Farmer Specific Fields */}
            {role === 'farmer' && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      {language === 'en' ? 'Village *' : 'ಗ್ರಾಮ *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={village}
                      onChange={(e) => setVillage(e.target.value)}
                      placeholder="e.g. Konnur"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl text-base focus:ring-2 focus:ring-[#1B5E20] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      {language === 'en' ? 'Taluk *' : 'ತಾಲೂಕು *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={taluk}
                      onChange={(e) => setTaluk(e.target.value)}
                      placeholder="e.g. Gokak"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl text-base focus:ring-2 focus:ring-[#1B5E20] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {language === 'en' ? 'District *' : 'ಜಿಲ್ಲೆ *'}
                  </label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-base bg-white focus:ring-2 focus:ring-[#1B5E20] outline-none"
                  >
                    <option value="Belagavi">Belagavi (ಬೆಳಗಾವಿ)</option>
                    <option value="Dharwad">Dharwad (ಧಾರವಾಡ)</option>
                    <option value="Mysuru">Mysuru (ಮೈಸೂರು)</option>
                    <option value="Bengaluru Urban">Bengaluru (ಬೆಂಗಳೂರು)</option>
                    <option value="Gadag">Gadag (ಗದಗ)</option>
                    <option value="Davanagere">Davanagere (ದಾವಣಗೆರೆ)</option>
                    <option value="Shivamogga">Shivamogga (ಶಿವಮೊಗ್ಗ)</option>
                    <option value="Kalaburagi">Kalaburagi (ಕಲಬುರಗಿ)</option>
                  </select>
                </div>
              </>
            )}

            {/* Seller Specific Fields */}
            {role === 'seller' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {language === 'en' ? 'Shop / Firm Name *' : 'ಅಂಗಡಿ / ಸಂಸ್ಥೆಯ ಹೆಸರು *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    placeholder="e.g. Suresh Agro Traders"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-base focus:ring-2 focus:ring-[#1B5E20] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {language === 'en' ? 'APMC License Number (Optional)' : 'ಎಪಿಎಂಸಿ ಪರವಾನಗಿ ಸಂಖ್ಯೆ'}
                  </label>
                  <input
                    type="text"
                    value={licenseNo}
                    onChange={(e) => setLicenseNo(e.target.value)}
                    placeholder="e.g. APMC-HUB-2024-88"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-base focus:ring-2 focus:ring-[#1B5E20] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {language === 'en' ? 'Subscribed APMC Markets *' : 'ಕಾರ್ಯನಿರ್ವಹಿಸುವ ಮಾರುಕಟ್ಟೆಗಳು *'}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-44 overflow-y-auto p-2 border border-gray-200 rounded-xl">
                    {markets.map((m) => (
                      <label
                        key={m.id}
                        className={`flex items-center space-x-2 p-2 rounded-lg text-xs font-medium cursor-pointer border transition ${
                          selectedMarkets.includes(m.id)
                            ? 'bg-green-50 border-green-400 text-green-950 font-bold'
                            : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedMarkets.includes(m.id)}
                          onChange={() => handleMarketToggle(m.id)}
                          className="rounded text-[#1B5E20] focus:ring-green-500"
                        />
                        <span>{language === 'en' ? m.name_en : m.name_kn}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {language === 'en' ? 'Preferred Crops' : 'ಆಸಕ್ತಿಯ ಬೆಳೆಗಳು'}
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {crops.map((c) => (
                      <button
                        type="button"
                        key={c.id}
                        onClick={() => handleCropToggle(c.name_en)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
                          selectedCrops.includes(c.name_en)
                            ? 'bg-[#1B5E20] text-white border-[#1B5E20]'
                            : 'bg-stone-50 text-gray-700 border-gray-300 hover:bg-stone-100'
                        }`}
                      >
                        {c.icon_name} {language === 'en' ? c.name_en : c.name_kn}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full min-h-[50px] bg-[#1B5E20] hover:bg-green-900 active:scale-[0.99] text-white font-bold rounded-xl shadow transition flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              <span>{submitting ? 'Registering...' : (language === 'en' ? 'Complete Registration' : 'ನೋಂದಣಿ ಪೂರ್ಣಗೊಳಿಸಿ')}</span>
              <ArrowRight className="w-5 h-5 text-amber-300" />
            </button>
          </form>

          <div className="text-center pt-2 text-xs text-gray-600">
            {language === 'en' ? 'Already have an account?' : 'ಈಗಾಗಲೇ ಖಾತೆ ಹೊಂದಿದ್ದೀರಾ?'}{' '}
            <Link href="/auth/login" className="font-bold text-[#1B5E20] hover:underline">
              {language === 'en' ? 'Login here' : 'ಇಲ್ಲಿ ಲಾಗಿನ್ ಆಗಿ'}
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
