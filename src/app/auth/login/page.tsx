'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Navbar } from '@/components/common/Navbar';
import { Sprout, Store, ShieldCheck, KeyRound, Phone, ArrowRight, UserCheck } from 'lucide-react';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = searchParams.get('role') || 'farmer';

  const { login, quickLogin } = useAuth();
  const { language } = useLanguage();

  const [role, setRole] = useState<'farmer' | 'seller'>(initialRole === 'seller' ? 'seller' : 'farmer');
  const [phone, setPhone] = useState(role === 'farmer' ? '+919845011111' : '+919845044444');
  const [otp, setOtp] = useState('123456');
  const [submitting, setSubmitting] = useState(false);

  const handleRoleChange = (newRole: 'farmer' | 'seller') => {
    setRole(newRole);
    setPhone(newRole === 'farmer' ? '+919845011111' : '+919845044444');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const success = await login(phone, otp);
    setSubmitting(false);

    if (success) {
      if (role === 'farmer') {
        router.push('/farmer/dashboard');
      } else {
        router.push('/seller/dashboard');
      }
    }
  };

  const handleQuickLogin = async (targetRole: 'farmer' | 'seller') => {
    setSubmitting(true);
    const success = await quickLogin(targetRole);
    setSubmitting(false);
    if (success) {
      if (targetRole === 'farmer') {
        router.push('/farmer/dashboard');
      } else {
        router.push('/seller/dashboard');
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF8E1]">
      <Navbar />

      <main className="flex-1 max-w-md w-full mx-auto px-4 py-8 space-y-6">
        {/* Role Selector Tabs */}
        <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-stone-200 flex">
          <button
            type="button"
            onClick={() => handleRoleChange('farmer')}
            className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 transition cursor-pointer ${
              role === 'farmer'
                ? 'bg-[#1B5E20] text-white shadow'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Sprout className="w-4 h-4 text-amber-300" />
            <span>{language === 'en' ? "I'm a Farmer" : 'ನಾನು ರೈತ'}</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleChange('seller')}
            className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 transition cursor-pointer ${
              role === 'seller'
                ? 'bg-[#1B5E20] text-white shadow'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Store className="w-4 h-4 text-amber-300" />
            <span>{language === 'en' ? 'APMC Seller' : 'ಎಪಿಎಂಸಿ ವ್ಯಾಪಾರಿ'}</span>
          </button>
        </div>

        {/* Login Form Box */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200 space-y-5">
          <div className="text-center space-y-1">
            <h2 className="text-xl font-extrabold text-[#1B5E20]">
              {role === 'farmer'
                ? (language === 'en' ? 'Farmer OTP Login' : 'ರೈತರ ಮೊಬೈಲ್ ಲಾಗಿನ್')
                : (language === 'en' ? 'APMC Trader Login' : 'ವ್ಯಾಪಾರಿಗಳ ಲಾಗಿನ್')}
            </h2>
            <p className="text-xs text-gray-500">
              {language === 'en'
                ? 'Enter your mobile number to receive or enter your OTP.'
                : 'ನಿಮ್ಮ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ಮತ್ತು ಒಟಿಪಿ ನಮೂದಿಸಿ.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                {language === 'en' ? 'Mobile Phone Number' : 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ'}
              </label>
              <div className="relative">
                <Phone className="w-5 h-5 absolute left-3 top-3.5 text-gray-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  placeholder="+91 98450 11111"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl font-mono text-base focus:ring-2 focus:ring-[#1B5E20] focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-gray-700">
                  {language === 'en' ? 'OTP Verification Code' : 'ಒಟಿಪಿ ಪರಿಶೀಲನಾ ಕೋಡ್'}
                </label>
                <span className="text-[11px] font-semibold text-[#1B5E20] bg-green-50 px-2 py-0.5 rounded border border-green-200">
                  Dev OTP: 123456
                </span>
              </div>
              <div className="relative">
                <KeyRound className="w-5 h-5 absolute left-3 top-3.5 text-gray-400" />
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  placeholder="123456"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl font-mono tracking-widest text-base focus:ring-2 focus:ring-[#1B5E20] focus:border-transparent outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full min-h-[50px] bg-[#1B5E20] hover:bg-green-900 active:scale-[0.99] text-white font-bold rounded-xl shadow transition flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              <span>{submitting ? 'Verifying...' : (language === 'en' ? 'Login with OTP' : 'ಲಾಗಿನ್ ಮಾಡಿ')}</span>
              <ArrowRight className="w-5 h-5 text-amber-300" />
            </button>
          </form>

          {/* Quick Demo Switcher Section */}
          <div className="pt-3 border-t border-gray-100 space-y-2">
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider text-center">
              {language === 'en' ? '⚡ One-Click Test Accounts' : '⚡ ತ್ವರಿತ ಡೆಮೊ ಖಾತೆಗಳು'}
            </div>

            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('farmer')}
                className="w-full p-2.5 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-200 text-left flex items-center justify-between text-xs font-medium text-emerald-950 transition"
              >
                <div className="flex items-center space-x-2">
                  <UserCheck className="w-4 h-4 text-emerald-700" />
                  <span>
                    <strong>Basavaraj Patil</strong> (Farmer • Belagavi)
                  </span>
                </div>
                <span className="text-[10px] bg-white px-2 py-0.5 rounded shadow-sm font-bold text-emerald-800">
                  Login →
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('seller')}
                className="w-full p-2.5 bg-amber-50 hover:bg-amber-100 rounded-xl border border-amber-200 text-left flex items-center justify-between text-xs font-medium text-amber-950 transition"
              >
                <div className="flex items-center space-x-2">
                  <Store className="w-4 h-4 text-amber-700" />
                  <span>
                    <strong>Suresh Agro Traders</strong> (Seller • Hubballi)
                  </span>
                </div>
                <span className="text-[10px] bg-white px-2 py-0.5 rounded shadow-sm font-bold text-amber-800">
                  Login →
                </span>
              </button>
            </div>
          </div>

          {/* Register Prompt */}
          <div className="text-center pt-2 text-xs text-gray-600">
            {language === 'en' ? "Don't have an account yet?" : 'ಇನ್ನೂ ನೋಂದಣಿ ಮಾಡಿಲ್ಲವೇ?'}{' '}
            <Link
              href={`/auth/register?role=${role}`}
              className="font-bold text-[#1B5E20] hover:underline"
            >
              {language === 'en' ? 'Register here' : 'ಇಲ್ಲಿ ನೋಂದಣಿ ಮಾಡಿ'}
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FFF8E1] flex items-center justify-center p-8 text-gray-500 font-semibold">Loading...</div>}>
      <LoginFormContent />
    </Suspense>
  );
}
