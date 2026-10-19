'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Navbar } from '@/components/common/Navbar';
import { NotificationItem } from '@/types/database';
import {
  Bell,
  CheckCircle2,
  Calendar,
  Store,
  Sprout,
  ArrowRight,
  Clock,
  ArrowLeft,
  CheckCheck,
} from 'lucide-react';

export default function NotificationsPage() {
  const { user, loading } = useAuth();
  const { language } = useLanguage();
  const router = useRouter();

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'offers' | 'listings'>('all');
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login?redirect=/notifications');
      return;
    }

    if (user?.profile?.id) {
      loadNotifications();
    }
  }, [user, loading]);

  const loadNotifications = async () => {
    if (!user?.profile?.id) return;
    try {
      setFetching(true);
      const res = await fetch(`/api/notifications?userId=${user.profile.id}`);
      const data = await res.json();
      if (data.notifications) {
        setNotifications(data.notifications);
      }
    } catch (e) {
      console.error('Failed to load notifications', e);
    } finally {
      setFetching(false);
    }
  };

  const markAllRead = async () => {
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
      console.error('Failed to mark all as read', e);
    }
  };

  const filteredNotifs = notifications.filter((n) => {
    if (activeTab === 'unread') return !n.read_at;
    if (activeTab === 'offers') return n.type === 'new_offer' || n.type === 'offer_accepted';
    if (activeTab === 'listings') return n.type === 'new_crop_listing';
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read_at).length;

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF8E5] text-[#17251B]">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <Link
              href="/"
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#17652B] hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{language === 'en' ? 'Back to Home' : 'ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ'}</span>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-black text-[#17652B]">
              {language === 'en' ? 'Notification Centre' : 'ಸೂಚನಾ ಕೇಂದ್ರ'}
            </h1>
            <p className="text-xs sm:text-sm text-stone-600">
              {language === 'en'
                ? 'Real-time alerts for incoming bids, matching crop lots, and confirmed APMC visits.'
                : 'ಆಫರ್‌ಗಳು, ಬೆಳೆಗಳ ಮಾಹಿತಿ ಮತ್ತು ಭೇಟಿ ದೃಢೀಕರಣದ ನೈಜ ಸಂದೇಶಗಳು.'}
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="px-4 py-2 bg-white hover:bg-stone-50 text-[#17652B] text-xs font-black rounded-xl border border-stone-200 shadow-xs flex items-center space-x-1.5 cursor-pointer"
            >
              <CheckCheck className="w-4 h-4 text-[#17652B]" />
              <span>{language === 'en' ? 'Mark All as Read' : 'ಎಲ್ಲವನ್ನೂ ಓದಿದಂತೆ ಗುರುತಿಸಿ'}</span>
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'all', en: 'All Alerts', kn: 'ಎಲ್ಲಾ ಸೂಚನೆಗಳು' },
            { id: 'unread', en: `Unread (${unreadCount})`, kn: `ಓದದಿರುವವು (${unreadCount})` },
            { id: 'offers', en: 'Buyer Bids & Deals', kn: 'ಆಫರ್‌ಗಳು & ವ್ಯವಹಾರ' },
            { id: 'listings', en: 'Crop Lot Alerts', kn: 'ಬೆಳೆಗಳ ಮಾಹಿತಿ' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`min-h-[40px] px-4 py-2 rounded-2xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#17652B] text-[#FFBF24] shadow-sm'
                  : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              {language === 'en' ? tab.en : tab.kn}
            </button>
          ))}
        </div>

        {/* Notification List */}
        {fetching ? (
          <div className="p-10 text-center text-stone-500 bg-white rounded-3xl border border-stone-200">
            <div className="w-8 h-8 border-4 border-[#17652B] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-sm font-semibold">{language === 'en' ? 'Loading notifications...' : 'ಲೋಡ್ ಆಗುತ್ತಿದೆ...'}</p>
          </div>
        ) : filteredNotifs.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-stone-200 space-y-3">
            <Bell className="w-12 h-12 text-stone-300 mx-auto" />
            <h3 className="text-lg font-bold text-stone-800">
              {language === 'en' ? 'No notifications in this tab' : 'ಯಾವುದೇ ಸಂದೇಶಗಳಿಲ್ಲ'}
            </h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              {language === 'en'
                ? 'You will receive instant alerts when traders bid or when new matching crops are posted.'
                : 'ಹೊಸ ಆಫರ್‌ಗಳು ಅಥವಾ ಬೆಳೆಗಳು ಲಭ್ಯವಾದಾಗ ಇಲ್ಲಿ ಕಾಣಿಸುತ್ತವೆ.'}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl divide-y divide-stone-100 border border-stone-200 shadow-sm overflow-hidden">
            {filteredNotifs.map((n) => (
              <div
                key={n.id}
                className={`p-5 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  !n.read_at ? 'bg-green-50/60' : 'bg-white'
                }`}
              >
                <div className="flex items-start space-x-3.5">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 text-sm font-bold shadow-xs ${
                      !n.read_at ? 'bg-[#17652B] text-[#FFBF24]' : 'bg-stone-100 text-stone-700'
                    }`}
                  >
                    {n.type === 'new_crop_listing' ? '🌾' : n.type === 'offer_accepted' ? '🤝' : '💰'}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-black text-sm text-stone-900">
                        {n.type === 'new_crop_listing'
                          ? (language === 'en' ? 'Matching Pre-Harvest Crop Lot' : 'ಹೊಸ ಬೆಳೆ ಲಭ್ಯವಿದೆ')
                          : n.type === 'offer_accepted'
                          ? (language === 'en' ? 'Direct Deal Confirmed by Farmer' : 'ಆಫರ್ ಒಪ್ಪಿಕೊಳ್ಳಲಾಗಿದೆ')
                          : (language === 'en' ? 'Direct Buyer Offer Received' : 'ಹೊಸ ಆಫರ್ ಬಂದಿದೆ')}
                      </h4>
                      {!n.read_at && (
                        <span className="w-2 h-2 rounded-full bg-[#17652B]" />
                      )}
                    </div>

                    <p className="text-xs text-stone-700">
                      {n.type === 'new_crop_listing' ? (
                        <>
                          <strong>{(n.payload as any)?.crop_name}</strong> -{' '}
                          {(n.payload as any)?.quantity} {(n.payload as any)?.unit} at ₹
                          {(n.payload as any)?.expected_price}/kg in{' '}
                          {(n.payload as any)?.market_name}.
                        </>
                      ) : n.type === 'offer_accepted' ? (
                        <>
                          Deal confirmed! Your offer for {(n.payload as any)?.accepted_kg} kg at ₹
                          {(n.payload as any)?.price_per_kg}/kg accepted. Phone unlocked.
                        </>
                      ) : (
                        <>
                          <strong>{(n.payload as any)?.shop_name}</strong> offered ₹
                          {(n.payload as any)?.offered_price_per_kg}/kg for{' '}
                          {(n.payload as any)?.quantity_kg} kg.
                        </>
                      )}
                    </p>

                    <div className="text-[11px] text-stone-400">
                      {new Date(n.created_at).toLocaleString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                </div>

                <div className="w-full sm:w-auto flex justify-end">
                  {n.type === 'new_crop_listing' ? (
                    <Link
                      href="/seller/dashboard"
                      className="px-4 py-2 bg-[#17652B] hover:bg-[#1F7D37] text-white text-xs font-bold rounded-xl transition flex items-center space-x-1"
                    >
                      <span>{language === 'en' ? 'View Feed' : 'ಫೀಡ್ ನೋಡಿ'}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#FFBF24]" />
                    </Link>
                  ) : n.type === 'offer_accepted' ? (
                    <Link
                      href="/visits"
                      className="px-4 py-2 bg-[#17652B] hover:bg-[#1F7D37] text-white text-xs font-bold rounded-xl transition flex items-center space-x-1"
                    >
                      <span>{language === 'en' ? 'Gate Pass & QR' : 'ಗೇಟ್ ಪಾಸ್'}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#FFBF24]" />
                    </Link>
                  ) : (
                    <Link
                      href="/farmer/offers"
                      className="px-4 py-2 bg-[#17652B] hover:bg-[#1F7D37] text-white text-xs font-bold rounded-xl transition flex items-center space-x-1"
                    >
                      <span>{language === 'en' ? 'Compare Offers' : 'ಆಫರ್ ಹೋಲಿಸಿ'}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#FFBF24]" />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
