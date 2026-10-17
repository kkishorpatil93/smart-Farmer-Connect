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
  ExternalLink,
} from 'lucide-react';
import { NotificationItem } from '@/types/database';

export function Navbar() {
  const { user, logout } = useAuth();
  const { language, toggleLanguage } = useLanguage();
  const router = useRouter();

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

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
    <header className="bg-[#1B5E20] text-white px-4 py-3 shadow-md sticky top-0 z-50">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl" role="img" aria-label="Sprout">
            🌾
          </span>
          <div>
            <h1 className="text-base sm:text-lg font-bold leading-tight tracking-wide">
              Smart Farmer Connect
            </h1>
            <p className="text-[11px] text-green-200">ಸ್ಮಾರ್ಟ್ ರೈತ ಸಂಪರ್ಕ</p>
          </div>
        </Link>

        {/* Right Action Icons */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="flex items-center space-x-1 bg-white/10 hover:bg-white/20 active:bg-white/30 px-2.5 py-1.5 rounded-full border border-white/30 text-xs sm:text-sm font-semibold transition"
            title="Switch Language / ಭಾಷೆ ಬದಲಾಯಿಸಿ"
          >
            <Languages className="w-4 h-4 text-amber-400" />
            <span>{language === 'en' ? 'ಕನ್ನಡ' : 'English'}</span>
          </button>

          {/* User Logged In Actions */}
          {user ? (
            <>
              {/* Notifications Bell */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    if (!showNotifications && unreadCount > 0) {
                      markRead();
                    }
                  }}
                  className="relative p-2 bg-white/10 hover:bg-white/20 rounded-full transition cursor-pointer"
                  title="Notifications"
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
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white text-gray-900 rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50">
                    <div className="bg-[#1B5E20] text-white px-4 py-3 flex items-center justify-between">
                      <div className="flex items-center space-x-1.5 font-bold text-sm">
                        <Bell className="w-4 h-4 text-amber-300" />
                        <span>{language === 'en' ? 'In-App Alerts' : 'ಸೂಚನೆಗಳು'}</span>
                      </div>
                      <button
                        onClick={() => setShowNotifications(false)}
                        className="text-white/80 hover:text-white"
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
                                <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-green-600" />
                                {n.type === 'new_crop_listing'
                                  ? (language === 'en' ? '🌾 Matching Crop Posted' : '🌾 ಹೊಸ ಬೆಳೆ ಲಭ್ಯವಿದೆ')
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
                                  Deal confirmed! Your offer for {(n.payload as any)?.accepted_kg} kg at ₹
                                  {(n.payload as any)?.price_per_kg}/kg was accepted by the farmer.
                                </>
                              ) : (
                                <>
                                  <strong>{(n.payload as any)?.shop_name}</strong> offered ₹
                                  {(n.payload as any)?.offered_price_per_kg}/kg for{' '}
                                  {(n.payload as any)?.quantity_kg} kg.
                                </>
                              )}
                            </p>
                            <div className="pt-1">
                              {n.type === 'new_crop_listing' ? (
                                <Link
                                  href="/seller/dashboard"
                                  onClick={() => setShowNotifications(false)}
                                  className="text-[11px] font-bold text-[#1B5E20] hover:underline inline-flex items-center space-x-1"
                                >
                                  <span>View in Mandi Feed →</span>
                                </Link>
                              ) : n.type === 'offer_accepted' ? (
                                <Link
                                  href="/visits"
                                  onClick={() => setShowNotifications(false)}
                                  className="text-[11px] font-bold text-[#1B5E20] hover:underline inline-flex items-center space-x-1"
                                >
                                  <span>View Confirmed Visit & Pay →</span>
                                </Link>
                              ) : (
                                <Link
                                  href="/farmer/offers"
                                  onClick={() => setShowNotifications(false)}
                                  className="text-[11px] font-bold text-[#1B5E20] hover:underline inline-flex items-center space-x-1"
                                >
                                  <span>Compare Offers & Accept →</span>
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

              {/* Portal Direct Link */}
              <Link
                href={user.profile.role === 'farmer' ? '/farmer/dashboard' : '/seller/dashboard'}
                className="hidden sm:flex items-center space-x-1.5 bg-amber-400 hover:bg-amber-300 text-stone-900 px-3 py-1.5 rounded-full text-xs font-bold transition"
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

              {/* Logout */}
              <button
                onClick={() => {
                  logout();
                  router.push('/');
                }}
                className="p-1.5 bg-white/10 hover:bg-red-600/80 rounded-full transition"
                title="Logout"
              >
                <LogOut className="w-4 h-4 text-white" />
              </button>
            </>
          ) : (
            <Link
              href="/auth/login"
              className="bg-amber-400 hover:bg-amber-500 text-stone-900 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold shadow-sm transition"
            >
              {language === 'en' ? 'Login' : 'ಲಾಗಿನ್'}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
