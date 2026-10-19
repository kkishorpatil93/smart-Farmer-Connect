'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import {
  Sprout,
  Store,
  Bell,
  Languages,
  LogOut,
  User,
  CheckCircle2,
  X,
  Menu,
  ShieldCheck,
  CalendarDays,
  PlusCircle,
  Tag,
} from 'lucide-react';
import { NotificationItem } from '@/types/database';

export function Navbar() {
  const { user, logout } = useAuth();
  const { language, toggleLanguage } = useLanguage();
  const router = useRouter();

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (user?.profile?.id) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    if (!user?.profile?.id) return;
    try {
      const res = await fetch(`/api/notifications?userId=${user.profile.id}`);
      const data = await res.json();
      if (data.notifications) {
        setNotifications(data.notifications);
      }
    } catch (e) {
      console.error('Failed to fetch notifications', e);
    }
  };

  const markRead = async () => {
    if (!user?.profile?.id) return;
    try {
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.profile.id }),
      });
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read_at: new Date().toISOString() }))
      );
    } catch (e) {
      console.error('Failed to mark read', e);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read_at).length;

  return (
    <header className="bg-gradient-to-r from-[#0E3911] via-[#1B5E20] to-[#14532D] text-white sticky top-0 z-50 shadow-md border-b border-green-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo & State Mandi Badge */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-2.5 group">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center text-xl shadow-md group-hover:scale-105 transition">
                🌾
              </div>
              <div className="flex flex-col">
                <div className="flex items-center space-x-1.5">
                  <span className="text-base sm:text-xl font-extrabold tracking-tight text-white group-hover:text-amber-300 transition">
                    Smart Farmer Connect
                  </span>
                  <span className="hidden lg:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-stone-950 uppercase tracking-wider">
                    APMC
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-green-200 font-medium tracking-wide">
                  {language === 'en' ? 'Karnataka Mandi Marketplace' : 'ಕರ್ನಾಟಕ ಎಪಿಎಂಸಿ ಮಾರುಕಟ್ಟೆ'}
                </p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 text-sm font-semibold">
            <Link
              href="/"
              className="px-3 py-2 rounded-xl text-green-100 hover:text-white hover:bg-white/10 transition"
            >
              {language === 'en' ? 'Home' : 'ಮುಖಪುಟ'}
            </Link>

            <Link
              href={user?.profile?.role === 'farmer' ? '/farmer/dashboard' : '/auth/login?role=farmer'}
              className="px-3 py-2 rounded-xl text-green-100 hover:text-white hover:bg-white/10 transition flex items-center space-x-1.5"
            >
              <Sprout className="w-4 h-4 text-emerald-400" />
              <span>{language === 'en' ? 'Farmer Hub' : 'ರೈತ ಪುಟ'}</span>
            </Link>

            <Link
              href={user?.profile?.role === 'seller' ? '/seller/dashboard' : '/auth/login?role=seller'}
              className="px-3 py-2 rounded-xl text-green-100 hover:text-white hover:bg-white/10 transition flex items-center space-x-1.5"
            >
              <Store className="w-4 h-4 text-amber-300" />
              <span>{language === 'en' ? 'APMC Mandi Feed' : 'ಮಂಡಿ ಫೀಡ್'}</span>
            </Link>

            <Link
              href={user ? '/visits' : '/auth/login?redirect=/visits'}
              className="px-3 py-2 rounded-xl text-green-100 hover:text-white hover:bg-white/10 transition flex items-center space-x-1.5"
            >
              <CalendarDays className="w-4 h-4 text-teal-300" />
              <span>{language === 'en' ? 'Visits & Payments' : 'ಭೇಟಿ & ಪಾವತಿ'}</span>
            </Link>
          </nav>

          {/* Right Action Icons & User Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Language Toggle Button */}
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-1.5 bg-white/10 hover:bg-white/20 active:bg-white/30 px-3 py-2 rounded-xl border border-white/20 text-xs sm:text-sm font-bold tracking-wide transition cursor-pointer"
              title="Switch Language / ಭಾಷೆ ಬದಲಾಯಿಸಿ"
            >
              <Languages className="w-4 h-4 text-amber-400" />
              <span className="font-semibold">{language === 'en' ? 'ಕನ್ನಡ' : 'English'}</span>
            </button>

            {/* Logged-In Controls */}
            {user ? (
              <div className="flex items-center space-x-2">
                {/* Notifications Bell */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowNotifications(!showNotifications);
                      if (!showNotifications && unreadCount > 0) {
                        markRead();
                      }
                    }}
                    className="relative p-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition cursor-pointer"
                    title="Notifications"
                    aria-label="Alerts"
                  >
                    <Bell className="w-5 h-5 text-amber-300" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-600 text-white font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#1B5E20] animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notifications Dropdown Drawer */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white text-gray-900 rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="bg-[#1B5E20] text-white px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center space-x-2 font-bold text-sm">
                          <Bell className="w-4 h-4 text-amber-300" />
                          <span>{language === 'en' ? 'Verified Mandi Alerts' : 'ಮಂಡಿ ಸೂಚನೆಗಳು'}</span>
                        </div>
                        <button
                          onClick={() => setShowNotifications(false)}
                          className="text-white/80 hover:text-white p-1"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="max-h-80 overflow-y-auto divide-y divide-gray-100 p-2">
                        {notifications.length === 0 ? (
                          <div className="p-6 text-center text-gray-500 text-sm">
                            {language === 'en'
                              ? 'No new notifications yet.'
                              : 'ಯಾವುದೇ ಹೊಸ ಸಂದೇಶಗಳಿಲ್ಲ.'}
                          </div>
                        ) : (
                          notifications.map((n) => (
                            <div
                              key={n.id}
                              className={`p-3 rounded-xl transition ${
                                !n.read_at ? 'bg-green-50 border-l-4 border-green-600' : 'bg-white'
                              }`}
                            >
                              <div className="flex items-start justify-between">
                                <span className="text-xs font-bold text-green-900 flex items-center">
                                  <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-green-600 shrink-0" />
                                  {n.type === 'new_crop_listing'
                                    ? (language === 'en' ? '🌾 Matching Crop Lot' : '🌾 ಹೊಸ ಬೆಳೆ ಲಭ್ಯವಿದೆ')
                                    : n.type === 'offer_accepted'
                                    ? (language === 'en' ? '🤝 Deal Confirmed' : '🤝 ಆಫರ್ ಒಪ್ಪಿಕೊಳ್ಳಲಾಗಿದೆ')
                                    : (language === 'en' ? '💰 New Buyer Offer' : '💰 ಹೊಸ ಆಫರ್ ಬಂದಿದೆ')}
                                </span>
                                <span className="text-[10px] text-gray-400">
                                  {new Date(n.created_at).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </span>
                              </div>
                              <p className="text-xs text-gray-700 mt-1">
                                {n.type === 'new_crop_listing' ? (
                                  <>
                                    <strong>{(n.payload as any)?.crop_name}</strong> -{' '}
                                    {(n.payload as any)?.quantity} {(n.payload as any)?.unit} at ₹
                                    {(n.payload as any)?.expected_price} in{' '}
                                    {(n.payload as any)?.market_name}.
                                  </>
                                ) : n.type === 'offer_accepted' ? (
                                  <>
                                    Deal confirmed! Offer for {(n.payload as any)?.accepted_kg} kg at ₹
                                    {(n.payload as any)?.price_per_kg}/kg accepted.
                                  </>
                                ) : (
                                  <>
                                    <strong>{(n.payload as any)?.shop_name}</strong> offered ₹
                                    {(n.payload as any)?.offered_price_per_kg}/kg for{' '}
                                    {(n.payload as any)?.quantity_kg} kg.
                                  </>
                                )}
                              </p>
                              <div className="pt-1.5">
                                {n.type === 'new_crop_listing' ? (
                                  <Link
                                    href="/seller/dashboard"
                                    onClick={() => setShowNotifications(false)}
                                    className="text-[11px] font-bold text-[#1B5E20] hover:underline inline-flex items-center space-x-1"
                                  >
                                    <span>{language === 'en' ? 'View in Mandi Feed →' : 'ಮಂಡಿ ಫೀಡ್‌ನಲ್ಲಿ ನೋಡಿ →'}</span>
                                  </Link>
                                ) : n.type === 'offer_accepted' ? (
                                  <Link
                                    href="/visits"
                                    onClick={() => setShowNotifications(false)}
                                    className="text-[11px] font-bold text-[#1B5E20] hover:underline inline-flex items-center space-x-1"
                                  >
                                    <span>{language === 'en' ? 'Confirmed Visit & QR →' : 'ಖಚಿತ ಭೇಟಿ & ಕ್ಯೂಆರ್ ನೋಡಿ →'}</span>
                                  </Link>
                                ) : (
                                  <Link
                                    href="/farmer/offers"
                                    onClick={() => setShowNotifications(false)}
                                    className="text-[11px] font-bold text-[#1B5E20] hover:underline inline-flex items-center space-x-1"
                                  >
                                    <span>{language === 'en' ? 'Compare Offers & Accept →' : 'ಆಫರ್‌ಗಳನ್ನು ಹೋಲಿಸಿ →'}</span>
                                  </Link>
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Role Badge and Dashboard link */}
                <Link
                  href={user.profile.role === 'farmer' ? '/farmer/dashboard' : '/seller/dashboard'}
                  className="hidden sm:inline-flex items-center space-x-2 bg-amber-400 hover:bg-amber-300 text-stone-950 px-3.5 py-2 rounded-xl text-xs font-extrabold shadow-sm transition"
                >
                  {user.profile.role === 'farmer' ? (
                    <Sprout className="w-4 h-4 text-green-900" />
                  ) : (
                    <Store className="w-4 h-4 text-stone-900" />
                  )}
                  <span>
                    {user.profile.role === 'farmer'
                      ? (language === 'en' ? 'Farmer Hub' : 'ರೈತ ಪುಟ')
                      : (language === 'en' ? 'Seller Feed' : 'ವ್ಯಾಪಾರಿ ಪುಟ')}
                  </span>
                </Link>

                {/* User Name & Logout */}
                <div className="flex items-center space-x-1">
                  <span className="hidden xl:inline text-xs text-green-100 font-medium px-2 truncate max-w-[120px]">
                    {user.profile.full_name?.split(' ')[0]}
                  </span>
                  <button
                    onClick={() => {
                      logout();
                      router.push('/');
                    }}
                    className="p-2.5 bg-white/10 hover:bg-red-600/80 rounded-xl transition cursor-pointer"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/auth/login"
                  className="bg-amber-400 hover:bg-amber-500 text-stone-950 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-md transition cursor-pointer"
                >
                  {language === 'en' ? 'Sign In / ಲಾಗಿನ್' : 'ಲಾಗಿನ್'}
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-white transition cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Responsive Mobile Drawer Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-green-700/60 space-y-2 animate-in slide-in-from-top-2 duration-150">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-2 px-3 py-2.5 rounded-xl hover:bg-white/10 text-white font-semibold text-sm"
            >
              <span>🏠</span>
              <span>{language === 'en' ? 'Home' : 'ಮುಖಪುಟ'}</span>
            </Link>

            <Link
              href={user?.profile?.role === 'farmer' ? '/farmer/dashboard' : '/auth/login?role=farmer'}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-2 px-3 py-2.5 rounded-xl hover:bg-white/10 text-white font-semibold text-sm"
            >
              <Sprout className="w-4 h-4 text-emerald-400" />
              <span>{language === 'en' ? 'Farmer Hub (Post Crops & Bids)' : 'ರೈತ ಪುಟ (ಬೆಳೆ & ಆಫರ್‌ಗಳು)'}</span>
            </Link>

            <Link
              href={user?.profile?.role === 'seller' ? '/seller/dashboard' : '/auth/login?role=seller'}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-2 px-3 py-2.5 rounded-xl hover:bg-white/10 text-white font-semibold text-sm"
            >
              <Store className="w-4 h-4 text-amber-300" />
              <span>{language === 'en' ? 'APMC Mandi Feed (Trader Feed)' : 'ವ್ಯಾಪಾರಿ ಮಂಡಿ ಫೀಡ್'}</span>
            </Link>

            <Link
              href={user ? '/visits' : '/auth/login?redirect=/visits'}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-2 px-3 py-2.5 rounded-xl hover:bg-white/10 text-white font-semibold text-sm"
            >
              <CalendarDays className="w-4 h-4 text-teal-300" />
              <span>{language === 'en' ? 'Confirmed Visits & Payments' : 'ಖಚಿತ ಭೇಟಿ & ಪಾವತಿಗಳು'}</span>
            </Link>

            {user?.profile?.role === 'farmer' && (
              <Link
                href="/farmer/add-crop"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-2 px-3 py-2.5 rounded-xl bg-amber-400 text-stone-950 font-bold text-sm"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{language === 'en' ? 'Post New Harvest Lot' : 'ಹೊಸ ಬೆಳೆ ಸೇರಿಸಿ'}</span>
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
