'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import {
  LayoutDashboard,
  Sprout,
  IndianRupee,
  CalendarDays,
  PlusCircle,
  Store,
  ShoppingBag,
  HelpCircle,
  Bell,
} from 'lucide-react';

interface DashboardNavProps {
  role: 'farmer' | 'seller';
  badgeCounts?: {
    offers?: number;
    visits?: number;
    listings?: number;
    notifications?: number;
  };
}

export function DashboardNav({ role, badgeCounts = {} }: DashboardNavProps) {
  const pathname = usePathname();
  const { language } = useLanguage();

  const farmerLinks = [
    {
      href: '/farmer/dashboard',
      labelEn: 'Overview',
      labelKn: 'ಅವಲೋಕನ',
      icon: LayoutDashboard,
      isActive: pathname === '/farmer/dashboard',
    },
    {
      href: '/farmer/dashboard#listings',
      labelEn: 'My Crop Lots',
      labelKn: 'ನನ್ನ ಬೆಳೆಗಳು',
      icon: Sprout,
      count: badgeCounts.listings,
      isActive: false,
    },
    {
      href: '/farmer/offers',
      labelEn: 'Offers Received',
      labelKn: 'ಬಂದಿರುವ ಆಫರ್‌ಗಳು',
      icon: IndianRupee,
      count: badgeCounts.offers,
      isActive: pathname.startsWith('/farmer/offers'),
    },
    {
      href: '/visits',
      labelEn: 'Visits & Gate Passes',
      labelKn: 'ಗೇಟ್ ಪಾಸ್ & ಭೇಟಿ',
      icon: CalendarDays,
      count: badgeCounts.visits,
      isActive: pathname.startsWith('/visits'),
    },
    {
      href: '/farmer/add-crop',
      labelEn: '+ Post Harvest Lot',
      labelKn: '+ ಹೊಸ ಬೆಳೆ ಸೇರಿಸಿ',
      icon: PlusCircle,
      isPrimary: true,
      isActive: pathname.startsWith('/farmer/add-crop'),
    },
  ];

  const sellerLinks = [
    {
      href: '/seller/dashboard',
      labelEn: 'Trader Mandi Feed',
      labelKn: 'ಮಂಡಿ ಫೀಡ್',
      icon: Store,
      isActive: pathname === '/seller/dashboard',
    },
    {
      href: '/marketplace',
      labelEn: 'All Crops Marketplace',
      labelKn: 'ಎಲ್ಲಾ ಬೆಳೆಗಳು',
      icon: ShoppingBag,
      isActive: pathname === '/marketplace',
    },
    {
      href: '/visits',
      labelEn: 'Confirmed Purchases',
      labelKn: 'ಖಚಿತ ವ್ಯವಹಾರ',
      icon: CalendarDays,
      count: badgeCounts.visits,
      isActive: pathname.startsWith('/visits'),
    },
    {
      href: '/notifications',
      labelEn: 'Mandi Alerts',
      labelKn: 'ಸೂಚನೆಗಳು',
      icon: Bell,
      count: badgeCounts.notifications,
      isActive: pathname.startsWith('/notifications'),
    },
    {
      href: '/help',
      labelEn: 'APMC Guide',
      labelKn: 'ಮಂಡಿ ವಿವರ',
      icon: HelpCircle,
      isActive: pathname.startsWith('/help'),
    },
  ];

  const links = role === 'farmer' ? farmerLinks : sellerLinks;

  return (
    <div className="w-full bg-white border-b border-stone-200/90 shadow-sm sticky top-16 sm:top-20 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto py-2.5 no-scrollbar text-xs sm:text-sm">
          {links.map((item) => {
            const Icon = item.icon;
            const isHighlighted = item.isActive;
            const isPrimary = (item as any).isPrimary;

            if (isPrimary) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="shrink-0 flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl font-black bg-gradient-to-r from-[#17652B] to-[#2E8B43] text-[#FFBF24] hover:shadow-md transition active:scale-95"
                >
                  <Icon className="w-4 h-4 text-[#FFBF24]" />
                  <span>{language === 'en' ? item.labelEn : item.labelKn}</span>
                </Link>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`shrink-0 flex items-center space-x-1.5 px-3 py-1.5 rounded-xl font-bold transition ${
                  isHighlighted
                    ? 'bg-[#17652B] text-white shadow-sm'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    isHighlighted ? 'text-[#FFBF24]' : 'text-stone-500'
                  }`}
                />
                <span>{language === 'en' ? item.labelEn : item.labelKn}</span>
                {item.count !== undefined && item.count > 0 && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                      isHighlighted
                        ? 'bg-[#FFBF24] text-stone-950'
                        : 'bg-emerald-100 text-[#17652B]'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
