'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Navbar } from '@/components/common/Navbar';
import { VisitBooking } from '@/types/database';
import {
  ArrowLeft,
  Calendar,
  Store,
  MapPin,
  Clock,
  ShieldCheck,
  Phone,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  DollarSign,
  CreditCard,
  User,
  Sparkles,
} from 'lucide-react';

export default function VisitsPage() {
  const { user, loading } = useAuth();
  const { language } = useLanguage();
  const router = useRouter();

  const [visits, setVisits] = useState<VisitBooking[]>([]);
  const [fetching, setFetching] = useState(true);
  const [payingVisitId, setPayingVisitId] = useState<string | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'upi' | 'cash' | 'bank_transfer'>('upi');
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login?redirect=/visits');
      return;
    }

    if (user) {
      loadVisits();
    }
  }, [user, loading]);

  const loadVisits = async () => {
    if (!user) return;
    try {
      setFetching(true);
      const isFarmer = user.profile.role === 'farmer';
      const param = isFarmer && user.farmerProfile
        ? `?farmer_id=${user.farmerProfile.id}`
        : user.sellerProfile
        ? `?seller_id=${user.sellerProfile.id}`
        : '';

      const res = await fetch(`/api/visits${param}`);
      const data = await res.json();
      if (data.visits) {
        setVisits(data.visits);
      }
    } catch (e) {
      console.error('Failed to load visits', e);
    } finally {
      setFetching(false);
    }
  };

  const handleConfirmPayment = async (visitId: string) => {
    setProcessingPayment(true);
    try {
      const res = await fetch('/api/visits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visit_id: visitId,
          payment_method: selectedPaymentMethod,
          action: 'confirm_payment',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to verify payment');
      }

      alert(
        language === 'en'
          ? 'Payment verified and deal completed successfully!'
          : 'ಪಾವತಿ ಯಶಸ್ವಿಯಾಗಿ ಪರಿಶೀಲಿಸಲಾಗಿದೆ ಮತ್ತು ವಹಿವಾಟು ಪೂರ್ಣಗೊಂಡಿದೆ!'
      );
      setPayingVisitId(null);
      loadVisits();
    } catch (err: any) {
      alert(err.message || 'Payment update failed');
    } finally {
      setProcessingPayment(false);
    }
  };

  if (loading || fetching) {
    return (
      <div className="min-h-screen bg-[#FFF8E1] flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-8 text-gray-500 font-semibold">
          {language === 'en' ? 'Loading Mandi visit confirmations...' : 'ಮಂಡಿ ಭೇಟಿ ವಿವರಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...'}
        </div>
      </div>
    );
  }

  const isFarmer = user?.profile?.role === 'farmer';
  const dashboardLink = isFarmer ? '/farmer/dashboard' : '/seller/dashboard';

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF8E1]">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 space-y-6">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <Link
              href={dashboardLink}
              className="inline-flex items-center space-x-1 text-xs font-bold text-[#1B5E20] hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>
                {language === 'en'
                  ? isFarmer
                    ? 'Back to Farmer Dashboard'
                    : 'Back to Trader Dashboard'
                  : 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಹಿಂತಿರುಗಿ'}
              </span>
            </Link>
            <h1 className="text-2xl font-extrabold text-gray-900">
              {language === 'en' ? 'Confirmed Mandi Visits & Payments' : 'ದೃಢಪಡಿಸಿದ ಭೇಟಿ ಮತ್ತು ಪಾವತಿ ಸ್ಥಿತಿ'}
            </h1>
            <p className="text-xs text-gray-600">
              {language === 'en'
                ? 'Step 4: Real-time visit tracking, gate verification codes, and verified APMC weighbridge payments.'
                : 'ಹಂತ 4: ನೈಜ-ಸಮಯದ ಭೇಟಿ ಟ್ರ್ಯಾಕಿಂಗ್, ಗೇಟ್ ಪರಿಶೀಲನಾ ಕೋಡ್‌ಗಳು ಮತ್ತು ಪರಿಶೀಲಿಸಿದ ಎಪಿಎಂಸಿ ಪಾವತಿಗಳು.'}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold bg-green-100 text-green-900 px-3 py-1.5 rounded-xl border border-green-300 flex items-center space-x-1">
              <ShieldCheck className="w-4 h-4 text-[#1B5E20]" />
              <span>{visits.length} {language === 'en' ? 'Confirmed Deals' : 'ದೃಢೀಕೃತ ವ್ಯವಹಾರಗಳು'}</span>
            </span>
          </div>
        </div>

        {/* Visits List */}
        {visits.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-stone-200 space-y-3">
            <Calendar className="w-10 h-10 text-amber-500 mx-auto" />
            <h3 className="text-base font-bold text-gray-900">
              {language === 'en' ? 'No Confirmed Visits Yet' : 'ಇನ್ನೂ ಯಾವುದೇ ಭೇಟಿಗಳು ದೃಢಪಟ್ಟಿಲ್ಲ'}
            </h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              {language === 'en'
                ? 'When a farmer accepts a buyer offer in Step 3, an official APMC market visit booking is generated with verification codes.'
                : 'ರೈತರು ಆಫರ್ ಅನ್ನು ಒಪ್ಪಿಕೊಂಡಾಗ, ಅಧಿಕೃತ ಮಂಡಿ ಭೇಟಿ ಬುಕಿಂಗ್ ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಸೃಷ್ಟಿಯಾಗುತ್ತದೆ.'}
            </p>
            <Link
              href={isFarmer ? '/farmer/offers' : '/seller/dashboard'}
              className="inline-flex items-center space-x-1 text-xs font-bold text-white bg-[#1B5E20] px-4 py-2.5 rounded-xl hover:bg-green-900 transition"
            >
              <span>{language === 'en' ? 'Go to Offers' : 'ಆಫರ್‌ಗಳಿಗೆ ಹೋಗಿ'}</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {visits.map((visit) => {
              const offer = visit.offer;
              const listing = visit.listing;
              const hasTransaction = !!visit.transaction || visit.status === 'completed';
              const totalAmount = offer
                ? Number((offer.quantity_kg * offer.price_per_kg).toFixed(2))
                : 0;

              return (
                <div
                  key={visit.id}
                  className="bg-white rounded-2xl p-5 shadow-sm border border-stone-200 space-y-4"
                >
                  {/* Top Bar: Verification Code & Status */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-9 h-9 rounded-xl bg-green-50 border border-green-200 text-[#1B5E20] flex items-center justify-center font-bold">
                        <QrCode className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-500 block uppercase font-bold tracking-wider">
                          Mandi Gate Verification Code
                        </span>
                        <span className="text-base font-extrabold font-mono text-[#1B5E20] tracking-wider">
                          {visit.verification_code}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full flex items-center space-x-1 ${
                          hasTransaction
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            : 'bg-amber-100 text-amber-900 border border-amber-300'
                        }`}
                      >
                        <Clock className="w-3.5 h-3.5 mr-1" />
                        <span>
                          {hasTransaction
                            ? language === 'en'
                              ? 'Deal Completed & Paid'
                              : 'ವಹಿವಾಟು ಪೂರ್ಣಗೊಂಡಿದೆ'
                            : language === 'en'
                            ? 'Confirmed Mandi Visit'
                            : 'ದೃಢಪಡಿಸಿದ ಭೇಟಿ'}
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Main Grid: Crop + Trader + Farmer */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    {/* 1. Crop & Financials */}
                    <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">{listing?.crop?.icon_name || '🌾'}</span>
                        <div>
                          <h4 className="font-extrabold text-sm text-gray-900">
                            {language === 'en' ? listing?.crop?.name_en : listing?.crop?.name_kn}
                          </h4>
                          <span className="text-gray-500 text-[11px]">
                            {listing?.market?.name_en || 'APMC Yard'}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1 pt-1 border-t border-stone-200">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Agreed Rate:</span>
                          <span className="font-extrabold text-[#1B5E20] text-sm">
                            ₹{offer?.price_per_kg}/kg
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Confirmed Quantity:</span>
                          <span className="font-bold text-gray-900">{offer?.quantity_kg} kg</span>
                        </div>
                        <div className="flex justify-between pt-1 border-t border-stone-200 text-sm font-extrabold text-emerald-900">
                          <span>Total Amount:</span>
                          <span>₹{totalAmount.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>

                    {/* 2. Partner Details */}
                    <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-2">
                      <span className="text-[10px] uppercase font-bold text-gray-500 block">
                        {isFarmer ? 'Buyer (APMC Commission Trader)' : 'Farmer (Producer)'}
                      </span>

                      {isFarmer ? (
                        <div className="space-y-1">
                          <div className="flex items-center space-x-1.5 font-bold text-gray-900 text-sm">
                            <Store className="w-4 h-4 text-[#1B5E20]" />
                            <span>{offer?.seller?.shop_name || 'APMC Trader'}</span>
                          </div>
                          <p className="text-gray-600 text-[11px]">
                            Prop: {offer?.seller?.profile?.full_name || 'Suresh Kumar'}
                          </p>
                          <a
                            href={`tel:${offer?.seller?.profile?.phone || '+919845044444'}`}
                            className="inline-flex items-center space-x-1 font-bold text-[#1B5E20] hover:underline pt-1"
                          >
                            <Phone className="w-3.5 h-3.5 text-green-700" />
                            <span>{offer?.seller?.profile?.phone || '+91 98450 44444'}</span>
                          </a>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <div className="flex items-center space-x-1.5 font-bold text-gray-900 text-sm">
                            <User className="w-4 h-4 text-[#1B5E20]" />
                            <span>{listing?.farmer?.profile?.full_name || 'Basavaraj Patil'}</span>
                          </div>
                          <p className="text-gray-600 text-[11px]">
                            Village: {listing?.farmer?.village}, {listing?.farmer?.district}
                          </p>
                          <a
                            href={`tel:${listing?.farmer?.profile?.phone || '+919845011111'}`}
                            className="inline-flex items-center space-x-1 font-bold text-[#1B5E20] hover:underline pt-1"
                          >
                            <Phone className="w-3.5 h-3.5 text-green-700" />
                            <span>{listing?.farmer?.profile?.phone || '+91 98450 11111'}</span>
                          </a>
                        </div>
                      )}
                    </div>

                    {/* 3. Visit Schedule & Yard Location */}
                    <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-2">
                      <span className="text-[10px] uppercase font-bold text-gray-500 block">
                        Schedule & Yard Location
                      </span>
                      <div className="space-y-1.5">
                        <div className="flex items-center space-x-1.5 text-gray-800 font-semibold">
                          <Calendar className="w-4 h-4 text-amber-600" />
                          <span>
                            {visit.scheduled_at
                              ? new Date(visit.scheduled_at).toLocaleDateString()
                              : 'Tomorrow'}
                          </span>
                        </div>
                        <div className="flex items-start space-x-1.5 text-gray-600">
                          <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                          <span>
                            {listing?.market?.name_en || 'Hubballi APMC Main Gate, Amaragol'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Status Tracking Box */}
                  <div
                    className={`p-4 rounded-xl border transition ${
                      hasTransaction
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                        : 'bg-amber-50 border-amber-300 text-amber-950'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          {hasTransaction ? (
                            <ShieldCheck className="w-5 h-5 text-emerald-700" />
                          ) : (
                            <AlertTriangle className="w-5 h-5 text-amber-700" />
                          )}
                          <h4 className="font-extrabold text-sm">
                            {hasTransaction
                              ? language === 'en'
                                ? 'Payment Verified & Settled'
                                : 'ಪಾವತಿ ಪರಿಶೀಲಿಸಲಾಗಿದೆ ಮತ್ತು ಜಮೆಯಾಗಿದೆ'
                              : language === 'en'
                              ? 'Payment Status: Pending Mandi Weighment'
                              : 'ಪಾವತಿ ಸ್ಥಿತಿ: ಮಂಡಿ ತೂಕದ ಪರಿಶೀಲನೆ ಬಾಕಿ ಇದೆ'}
                          </h4>
                        </div>

                        <p className="text-xs leading-relaxed max-w-xl">
                          {hasTransaction
                            ? language === 'en'
                              ? `Settlement of ₹${totalAmount.toLocaleString(
                                  'en-IN'
                                )} confirmed via ${visit.transaction?.payment_method?.toUpperCase() || 'UPI/CASH'}. Mandi weighment verified.`
                              : `₹${totalAmount.toLocaleString('en-IN')} ಮೊತ್ತವನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಪಾವತಿಸಲಾಗಿದೆ.`
                            : language === 'en'
                            ? 'Do not release produce bags before payment confirmation. Official APMC weighbridge receipt must be matched with agreed rate.'
                            : 'ಅಧಿಕೃತ ಮಂಡಿ ತೂಕದ ರಸೀದಿ ಪರಿಶೀಲಿಸುವವರೆಗೆ ಬೆಳೆಯನ್ನು ಬಿಡುಗಡೆ ಮಾಡಬೇಡಿ.'}
                        </p>
                      </div>

                      {/* Payment Action for Pending Deals */}
                      {!hasTransaction && (
                        <div className="w-full sm:w-auto shrink-0">
                          {payingVisitId === visit.id ? (
                            <div className="bg-white p-3 rounded-xl border border-amber-300 shadow-sm space-y-2">
                              <span className="text-[11px] font-bold text-gray-700 block">
                                Select Payment Method:
                              </span>
                              <div className="flex items-center space-x-1">
                                {(['upi', 'cash', 'bank_transfer'] as const).map((method) => (
                                  <button
                                    key={method}
                                    type="button"
                                    onClick={() => setSelectedPaymentMethod(method)}
                                    className={`px-2.5 py-1 text-[11px] font-bold rounded-lg uppercase transition ${
                                      selectedPaymentMethod === method
                                        ? 'bg-[#1B5E20] text-white'
                                        : 'bg-stone-100 text-gray-700 hover:bg-stone-200'
                                    }`}
                                  >
                                    {method}
                                  </button>
                                ))}
                              </div>

                              <div className="flex items-center space-x-2 pt-1">
                                <button
                                  type="button"
                                  disabled={processingPayment}
                                  onClick={() => handleConfirmPayment(visit.id)}
                                  className="flex-1 py-1.5 px-3 bg-[#1B5E20] hover:bg-green-900 text-white text-xs font-bold rounded-lg shadow cursor-pointer disabled:opacity-50"
                                >
                                  {processingPayment ? 'Verifying...' : 'Confirm Receipt'}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setPayingVisitId(null)}
                                  className="py-1.5 px-2 bg-stone-100 text-gray-600 text-xs font-bold rounded-lg hover:bg-stone-200"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setPayingVisitId(visit.id)}
                              className="w-full sm:w-auto min-h-[44px] px-4 py-2 bg-[#1B5E20] hover:bg-green-900 text-white text-xs font-bold rounded-xl shadow transition flex items-center justify-center space-x-1.5 cursor-pointer"
                            >
                              <DollarSign className="w-4 h-4 text-amber-300" />
                              <span>
                                {language === 'en'
                                  ? 'Verify Mandi Payment'
                                  : 'ಪಾವತಿ ಪರಿಶೀಲಿಸಿ'}
                              </span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
