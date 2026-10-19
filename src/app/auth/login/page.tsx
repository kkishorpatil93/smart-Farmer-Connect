'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Navbar } from '@/components/common/Navbar';
import { Sprout, Store, ShieldCheck, KeyRound, Phone, ArrowRight, UserCheck, AlertCircle } from 'lucide-react';

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
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleRoleChange = (newRole: 'farmer' | 'seller') => {
    setRole(newRole);
    setPhone(newRole === 'farmer' ? '+919845011111' : '+919845044444');
    setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSubmitting(true);
    try {
      const success = await login(phone, otp);
      if (success) {
        const redirectUrl = searchParams.get('redirect');
        if (redirectUrl) {
          router.push(redirectUrl);
        } else if (role === 'farmer') {
          router.push('/farmer/dashboard');
        } else {
          router.push('/seller/dashboard');
        }
      } else {
        setErrorMsg(
          language === 'en'
            ? 'Invalid phone number or OTP. Try demo number or quick login below.'
            : 'ತಪ್ಪಾದ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ಅಥವಾ ಒಟಿಪಿ. ದಯವಿಟ್ಟು ಪರಿಶೀಲಿಸಿ.'
        );
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickLogin = async (targetRole: 'farmer' | 'seller') => {
    setSubmitting(true);
    setErrorMsg(null);
    const success = await quickLogin(targetRole);
    setSubmitting(false);
    if (success) {
      const redirectUrl = searchParams.get('redirect');
      if (redirectUrl) {
        router.push(redirectUrl);
      } else if (targetRole === 'farmer') {
        router.push('/farmer/dashboard');
      } else {
        router.push('/seller/dashboard');
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF8E5] text-[#17251B]">
      <Navbar />

      <main className="flex-1 max-w-md w-full mx-auto px-4 py-10 space-y-6">
        {/* Role Selector Tabs */}
        <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-stone-200 flex">
          <button
            type="button"
            onClick={() => handleRoleChange('farmer')}
            className={`flex-1 py-3 px-4 rounded-xl font-black text-sm flex items-center justify-center space-x-2 transition cursor-pointer ${
              role === 'farmer'
                ? 'bg-[#17652B] text-white shadow'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Sprout className="w-4 h-4 text-[#FFBF24]" />
            <span>{language === 'en' ? "I'm a Farmer" : 'ನಾನು ರೈತ'}</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleChange('seller')}
            className={`flex-1 py-3 px-4 rounded-xl font-black text-sm flex items-center justify-center space-x-2 transition cursor-pointer ${
              role === 'seller'
                ? 'bg-[#17652B] text-white shadow'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Store className="w-4 h-4 text-[#FFBF24]" />
            <span>{language === 'en' ? 'APMC Seller' : 'ಎಪಿಎಂಸಿ ವ್ಯಾಪಾರಿ'}</span>
          </button>
        </div>

        {/* Login Form Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200 space-y-6">
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-black text-[#17652B]">
              {role === 'farmer'
                ? (language === 'en' ? 'Farmer Mobile Login' : 'ರೈತರ ಮೊಬೈಲ್ ಲಾಗಿನ್')
                : (language === 'en' ? 'APMC Trader Login' : 'ವ್ಯಾಪಾರಿಗಳ ಲಾಗಿನ್')}
            </h1>
            <p className="text-xs text-stone-500">
              {language === 'en'
                ? 'Enter your registered mobile number and OTP to continue.'
                : 'ನಿಮ್ಮ ನೊಂದಾಯಿತ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ಮತ್ತು ಒಟಿಪಿ ನಮೂದಿಸಿ.'}
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-black text-stone-800 uppercase tracking-wider mb-1.5">
                {language === 'en' ? 'Mobile Phone Number' : 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ'}
              </label>
              <div className="relative">
                <Phone className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+919845011111"
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-stone-200 bg-[#FFF8E5]/50 text-sm font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#17652B] focus:bg-white"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-black text-stone-800 uppercase tracking-wider">
                  {language === 'en' ? '6-Digit OTP Code' : '6-ಅಂಕಿಯ ಒಟಿಪಿ'}
                </label>
                <span className="text-[11px] text-[#17652B] font-bold">
                  {language === 'en' ? 'Test OTP: 123456' : 'ಪರೀಕ್ಷಾ ಒಟಿಪಿ: 123456'}
                </span>
              </div>
              <div className="relative">
                <KeyRound className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-stone-200 bg-[#FFF8E5]/50 text-sm font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#17652B] focus:bg-white tracking-widest font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full min-h-[50px] bg-gradient-to-r from-[#17652B] to-[#2E8B43] hover:from-[#1F7D37] hover:to-[#3FA657] text-white font-black text-sm rounded-2xl shadow-md transition flex items-center justify-center space-x-2 cursor-pointer border border-[#17652B] disabled:opacity-50"
            >
              <span>
                {submitting
                  ? (language === 'en' ? 'Verifying...' : 'ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ...')
                  : (language === 'en' ? 'Login with OTP' : 'ಲಾಗಿನ್ ಮಾಡಿ')}
              </span>
              <ArrowRight className="w-4 h-4 text-[#FFBF24]" />
            </button>
          </form>

          {/* 1-Click Quick Login for Reviewers */}
          <div className="pt-2 border-t border-stone-100 space-y-2.5">
            <div className="text-[11px] text-stone-500 font-bold uppercase tracking-wider text-center">
              {language === 'en' ? 'Instant Quick Demo Access' : 'ತ್ವರಿತ ಡೆಮೊ ಪ್ರವೇಶ'}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('farmer')}
                className="py-2.5 px-3 rounded-xl bg-green-50 hover:bg-green-100 text-[#17652B] text-xs font-black border border-green-200 transition flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <Sprout className="w-3.5 h-3.5" />
                <span>Demo Farmer</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('seller')}
                className="py-2.5 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-stone-900 text-xs font-black border border-amber-200 transition flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <Store className="w-3.5 h-3.5 text-[#17652B]" />
                <span>Demo Trader</span>
              </button>
            </div>
          </div>

          <div className="text-center pt-2 text-xs text-stone-600">
            {language === 'en' ? "Don't have an account yet?" : 'ಖಾತೆ ಇಲ್ಲವೇ?'}{' '}
            <Link
              href={`/auth/register?role=${role}`}
              className="font-black text-[#17652B] hover:underline"
            >
              {language === 'en' ? 'Register Now' : 'ಇಲ್ಲಿ ನೋಂದಣಿ ಮಾಡಿ'}
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FFF8E5] flex items-center justify-center text-stone-500 font-bold">
          Loading login form...
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}
