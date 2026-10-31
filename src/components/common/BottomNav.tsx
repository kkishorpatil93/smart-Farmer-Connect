'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import {
  Home,
  ShoppingBag,
  Plus,
  CalendarDays,
  User,
  Sprout,
  Store,
} from 'lucide-react';

export function BottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { language } = useLanguage();

  const isFarmer = user?.profile?.role === 'farmer';
  const isSeller = user?.profile?.role === 'seller';

  const hubHref = isFarmer
    ? '/farmer/dashboard'
    : isSeller
    ? '/seller/dashboard'
    : '/auth/login';

  const isHubActive =
    pathname.startsWith('/farmer') || pathname.startsWith('/seller');
  const isVisitsActive = pathname.startsWith('/visits');
  const isMarketplaceActive = pathname.startsWith('/marketplace');
  const isHomeActive = pathname === '/';
  const isAddCropActive = pathname === '/farmer/add-crop';

  return (
    <nav
      aria-label="Mobile Navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-2 py-1 safe-area-bottom"
    >
      <div className="max-w-md mx-auto flex items-center justify-around relative">
        {/* 1. Home */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition ${
            isHomeActive
              ? 'text-[#17652B] font-black'
              : 'text-stone-500 hover:text-stone-900 font-medium'
          }`}
        >
          <div className="relative">
            <Home className="w-5 h-5" />
            {isHomeActive && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#17652B] rounded-full" />
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight">
            {language === 'en' ? 'Home' : 'ಮುಖಪುಟ'}
          </span>
        </Link>

        {/* 2. Marketplace */}
        <Link
          href="/marketplace"
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition ${
            isMarketplaceActive && !isAddCropActive
              ? 'text-[#17652B] font-black'
              : 'text-stone-500 hover:text-stone-900 font-medium'
          }`}
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {isMarketplaceActive && !isAddCropActive && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#17652B] rounded-full" />
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight">
            {language === 'en' ? 'Market' : 'ಮಾರುಕಟ್ಟೆ'}
          </span>
        </Link>

        {/* 3. Center Elevated Action Button (Post Crop / Explore) */}
        <Link
          href={isFarmer ? '/farmer/add-crop' : '/farmer/add-crop'}
          className="flex flex-col items-center justify-center -mt-5 group"
          title={language === 'en' ? 'Post New Harvest Lot' : 'ಹೊಸ ಬೆಳೆ ಸೇರಿಸಿ'}
        >
          <div className="w-13 h-13 rounded-full bg-gradient-to-tr from-[#17652B] via-[#2E8B43] to-[#FFBF24] p-0.5 shadow-lg group-hover:scale-105 active:scale-95 transition">
            <div className="w-full h-full rounded-full bg-[#17652B] flex items-center justify-center text-white border-2 border-white shadow-inner">
              <Plus className="w-6 h-6 text-[#FFBF24] stroke-[3]" />
            </div>
          </div>
          <span className="text-[10px] font-black text-[#17652B] mt-0.5 tracking-tight">
            {language === 'en' ? 'Post Crop' : 'ಬೆಳೆ ಸೇರಿಸಿ'}
          </span>
        </Link>

        {/* 4. Visits & Gate Passes */}
        <Link
          href={user ? '/visits' : '/auth/login?redirect=/visits'}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition ${
            isVisitsActive
              ? 'text-[#17652B] font-black'
              : 'text-stone-500 hover:text-stone-900 font-medium'
          }`}
        >
          <div className="relative">
            <CalendarDays className="w-5 h-5" />
            {isVisitsActive && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#17652B] rounded-full" />
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight">
            {language === 'en' ? 'Visits' : 'ಭೇಟಿಗಳು'}
          </span>
        </Link>

        {/* 5. User Hub */}
        <Link
          href={hubHref}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition ${
            isHubActive && !isAddCropActive
              ? 'text-[#17652B] font-black'
              : 'text-stone-500 hover:text-stone-900 font-medium'
          }`}
        >
          <div className="relative">
            {isFarmer ? (
              <Sprout className="w-5 h-5" />
            ) : isSeller ? (
              <Store className="w-5 h-5" />
            ) : (
              <User className="w-5 h-5" />
            )}
            {isHubActive && !isAddCropActive && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#17652B] rounded-full" />
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight">
            {user
              ? isFarmer
                ? language === 'en' ? 'Farmer' : 'ರೈತ'
                : language === 'en' ? 'Trader' : 'ವ್ಯಾಪಾರಿ'
              : language === 'en' ? 'Account' : 'ಖಾತೆ'}
          </span>
        </Link>
      </div>
    </nav>
  );
}
