'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import {
  Sprout,
  Store,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  HelpCircle,
  ShoppingBag,
  CalendarDays,
  ExternalLink,
  Heart,
} from 'lucide-react';

export function Footer() {
  const { language } = useLanguage();
  const { user } = useAuth();

  return (
    <footer className="bg-stone-900 text-white pt-12 pb-24 lg:pb-12 border-t border-stone-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-stone-800">
          {/* Col 1: Brand & Mandi Mission */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2.5 group">
              <div className="w-10 h-10 rounded-2xl bg-[#FFBF24] text-stone-950 flex items-center justify-center text-xl shadow-md group-hover:scale-105 transition">
                🌾
              </div>
              <div>
                <span className="text-lg font-black tracking-tight text-white group-hover:text-[#FFBF24] transition">
                  Smart Farmer Connect
                </span>
                <p className="text-[11px] text-green-300 font-semibold">
                  {language === 'en' ? 'Karnataka APMC Marketplace' : 'ಕರ್ನಾಟಕ ಎಪಿಎಂಸಿ ಮಾರುಕಟ್ಟೆ'}
                </p>
              </div>
            </Link>

            <p className="text-stone-300 text-xs leading-relaxed">
              {language === 'en'
                ? 'Empowering Karnataka farmers to connect with licensed APMC traders before harvesting or hiring lorry freight. Stop distress selling and secure guaranteed mandi buyers.'
                : 'ಕೊಯ್ಲಿಗೂ ಮುನ್ನವೇ ಪರವಾನಗಿ ಪಡೆದ ಎಪಿಎಂಸಿ ವ್ಯಾಪಾರಿಗಳೊಂದಿಗೆ ರೈತರನ್ನು ಸಂಪರ್ಕಿಸುವ ವೇದಿಕೆ. ಸಾರಿಗೆ ವೆಚ್ಚ ಉಳಿಸಿ, ನ್ಯಾಯಯುತ ಬೆಲೆ ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ.'}
            </p>

            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-[11px] font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-[#FFBF24]" />
              <span>{language === 'en' ? '100% Free for Karnataka Farmers' : 'ರೈತರಿಗೆ 100% ಉಚಿತ ಸೇವೆ'}</span>
            </div>
          </div>

          {/* Col 2: Marketplace Quick Links */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-[#FFBF24] uppercase tracking-wider text-xs flex items-center space-x-1.5">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'Marketplace Navigation' : 'ಮಾರುಕಟ್ಟೆ ಪುಟಗಳು'}</span>
            </h4>
            <ul className="space-y-2 text-stone-300 text-xs">
              <li>
                <Link href="/marketplace" className="hover:text-white transition flex items-center space-x-1">
                  <span>•</span>
                  <span>{language === 'en' ? 'Browse All Crop Lots' : 'ಎಲ್ಲಾ ಬೆಳೆಗಳನ್ನು ನೋಡಿ'}</span>
                </Link>
              </li>
              <li>
                <Link
                  href={user?.profile?.role === 'farmer' ? '/farmer/dashboard' : '/auth/login?role=farmer'}
                  className="hover:text-white transition flex items-center space-x-1"
                >
                  <span>•</span>
                  <span>{language === 'en' ? 'Farmer Hub & Listings' : 'ರೈತ ಪುಟ ಮತ್ತು ಬೆಳೆಗಳು'}</span>
                </Link>
              </li>
              <li>
                <Link
                  href={user?.profile?.role === 'seller' ? '/seller/dashboard' : '/auth/login?role=seller'}
                  className="hover:text-white transition flex items-center space-x-1"
                >
                  <span>•</span>
                  <span>{language === 'en' ? 'Trader APMC Feed' : 'ವ್ಯಾಪಾರಿ ಮಂಡಿ ಫೀಡ್'}</span>
                </Link>
              </li>
              <li>
                <Link href={user ? '/visits' : '/auth/login?redirect=/visits'} className="hover:text-white transition flex items-center space-x-1">
                  <span>•</span>
                  <span>{language === 'en' ? 'Gate Passes & Confirmed Visits' : 'ಗೇಟ್ ಪಾಸ್ & ಭೇಟಿಗಳು'}</span>
                </Link>
              </li>
              <li>
                <Link href="/farmer/add-crop" className="hover:text-white transition flex items-center space-x-1">
                  <span>•</span>
                  <span>{language === 'en' ? 'Post New Harvest Lot' : 'ಹೊಸ ಬೆಳೆ ಸೇರಿಸಿ'}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Covered APMC Yards */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-[#FFBF24] uppercase tracking-wider text-xs flex items-center space-x-1.5">
              <Store className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'Covered APMC Mandis' : 'ಸಂಪರ್ಕಿತ ಎಪಿಎಂಸಿ ಮಾರುಕಟ್ಟೆಗಳು'}</span>
            </h4>
            <ul className="space-y-2 text-stone-300 text-xs">
              <li className="flex items-center space-x-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Hubballi APMC Yard, Amaragol</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Belagavi APMC Yard, Kangrali</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Yeshwanthpur APMC, Bengaluru</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Davanagere APMC Yard</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Ballari APMC Market</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Helpline & Contact */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-[#FFBF24] uppercase tracking-wider text-xs flex items-center space-x-1.5">
              <Phone className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'Farmer Helpline & Support' : 'ಸಹಾಯ ಮತ್ತು ಸಂಪರ್ಕ'}</span>
            </h4>
            <div className="space-y-2 text-stone-300 text-xs">
              <div className="bg-stone-800/80 p-3 rounded-2xl border border-stone-700/80 space-y-1">
                <p className="text-[11px] text-stone-400">Toll-Free Mandi Support:</p>
                <p className="font-extrabold text-[#FFBF24] text-sm tracking-wide">
                  1800-425-1552
                </p>
                <p className="text-[11px] text-stone-400 pt-1">Direct Landline:</p>
                <p className="font-semibold text-white text-xs">+91 80 2286 4280</p>
              </div>

              <div className="flex items-center space-x-1.5 pt-1">
                <Mail className="w-3.5 h-3.5 text-[#FFBF24] shrink-0" />
                <span className="text-stone-300 text-[11px]">support@smartfarmerconnect.in</span>
              </div>

              <div className="pt-2">
                <Link
                  href="/help"
                  className="inline-flex items-center space-x-1.5 text-[#FFBF24] hover:text-amber-300 font-bold text-xs"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>{language === 'en' ? 'FAQs & Dispute Resolution →' : 'ಪ್ರಶ್ನೋತ್ತರಗಳು & ನೆರವು →'}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-stone-400 text-xs">
          <div className="flex items-center space-x-1">
            <span>© 2026 Smart Farmer Connect.</span>
            <span className="hidden sm:inline">Made with care for Karnataka Annadatas.</span>
          </div>
          <div className="flex items-center space-x-4 text-[11px]">
            <span className="text-stone-500">KSAMB Mandi Rates Verified</span>
            <span>•</span>
            <Link href="/help" className="hover:text-white transition">
              {language === 'en' ? 'Terms & Safety' : 'ನಿಯಮಗಳು'}
            </Link>
            <span>•</span>
            <Link href="/help" className="hover:text-white transition">
              {language === 'en' ? 'APMC Mandi Directory' : 'ಎಪಿಎಂಸಿ ವಿವರ'}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
