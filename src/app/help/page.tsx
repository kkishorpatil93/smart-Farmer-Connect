'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Navbar } from '@/components/common/Navbar';
import {
  HelpCircle,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Truck,
  IndianRupee,
  Scale,
  ArrowLeft,
  ChevronDown,
} from 'lucide-react';

export default function HelpPage() {
  const { language } = useLanguage();

  const faqs = [
    {
      qEn: 'Is Smart Farmer Connect free for Karnataka farmers?',
      qKn: 'ಸ್ಮಾರ್ಟ್ ರೈತ ಸಂಪರ್ಕ ಕರ್ನಾಟಕದ ರೈತರಿಗೆ ಉಚಿತವೇ?',
      aEn: 'Yes! 100% free for farmers. There are zero listing fees, zero deduction commissions, and zero hidden charges.',
      aKn: 'ಹೌದು! ರೈತರಿಗೆ ಸಂಪೂರ್ಣವಾಗಿ 100% ಉಚಿತವಾಗಿದೆ. ಯಾವುದೇ ಕಮಿಷನ್ ಅಥವಾ ಶುಲ್ಕ ಇರುವುದಿಲ್ಲ.',
    },
    {
      qEn: 'How does the pre-harvest agreement protect farmers against distress sales?',
      qKn: 'ಪೂರ್ವ-ಕೊಯ್ಲು ಒಪ್ಪಂದವು ರೈತರನ್ನು ಹೇಗೆ ರಕ್ಷಿಸುತ್ತದೆ?',
      aEn: 'Farmers agree on baseline rate, quantity, and delivery date with a licensed APMC trader before loading their tempo. This prevents traders from slashing rates by 30-50% when you arrive tired at 4 AM.',
      aKn: 'ವಾಹನ ಬಾಡಿಗೆ ಮಾಡುವ ಮುನ್ನವೇ ವ್ಯಾಪಾರಿ ಮತ್ತು ಕನಿಷ್ಠ ದರ ಖಚಿತವಾಗುತ್ತದೆ. ಇದರಿಂದ ಮಂಡಿಗೆ ಹೋದ ನಂತರ ದಲ್ಲಾಳಿಗಳು ಬೆಲೆ ಇಳಿಸುವುದನ್ನು ತಡೆಯಬಹುದು.',
    },
    {
      qEn: 'How is the final weighment verified at the APMC yard?',
      qKn: 'ಮಂಡಿಯಲ್ಲಿ ಅಂತಿಮ ತೂಕವನ್ನು ಹೇಗೆ ಪರಿಶೀಲಿಸಲಾಗುತ್ತದೆ?',
      aEn: 'Produce is weighed at the official APMC licensed weighbridge or commission yard. The printed weighbridge slip confirms the final quintals, matching the agreed rate on your digital gate pass.',
      aKn: 'ಅಧಿಕೃತ ಎಪಿಎಂಸಿ ತೂಕದ ಯಂತ್ರದಲ್ಲಿ ತೂಕ ಮಾಡಲಾಗುತ್ತದೆ. ತೂಕದ ಚೀಟಿಯಲ್ಲಿರುವ ನಿಖರ ಪ್ರಮಾಣಕ್ಕೆ ಮೊದಲೇ ಒಪ್ಪಿಕೊಂಡ ದರದಲ್ಲಿ ಹಣ ಪಾವತಿಯಾಗುತ್ತದೆ.',
    },
    {
      qEn: 'What payment methods are supported upon delivery?',
      qKn: 'ಯಾವ ಪಾವತಿ ವಿಧಾನಗಳನ್ನು ಬೆಂಬಲಿಸಲಾಗುತ್ತದೆ?',
      aEn: 'Immediate settlement via Instant UPI (PhonePe, Google Pay, BHIM), direct IMPS/NEFT bank transfer, or cash on the spot at the commission shop.',
      aKn: 'ಯುಪಿಐ (ಫೋನ್‌ಪೇ, ಗೂಗಲ್‌ಪೇ), ಬ್ಯಾಂಕ್ ವರ್ಗಾವಣೆ ಅಥವಾ ಮಳಿಗೆಯಲ್ಲೇ ನಗದು ರೂಪದಲ್ಲಿ ತಕ್ಷಣ ಹಣ ಪಡೆಯಬಹುದು.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF8E5] text-[#17251B]">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header Title */}
        <div className="space-y-1">
          <Link
            href="/"
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#17652B] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{language === 'en' ? 'Back to Home' : 'ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ'}</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-[#17652B]">
            {language === 'en' ? 'Help, Contact & Mandi Directory' : 'ಸಹಾಯ, ಸಂಪರ್ಕ & ಎಪಿಎಂಸಿ ವಿವರ'}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600">
            {language === 'en'
              ? 'Official assistance for Karnataka farmers and registered APMC commission agents.'
              : 'ಕರ್ನಾಟಕದ ರೈತರು ಮತ್ತು ಎಪಿಎಂಸಿ ವ್ಯಾಪಾರಿಗಳ ಅಧಿಕೃತ ಸಹಾಯವಾಣಿ ಮತ್ತು ಮಾಹಿತಿ.'}
          </p>
        </div>

        {/* Contact Hotline & Support Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-green-100 text-[#17652B] flex items-center justify-center font-bold">
              <Phone className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-base text-stone-900">
              {language === 'en' ? 'Toll-Free Kisan Helpline' : 'ರೈತ ಸಹಾಯವಾಣಿ (ಉಚಿತ)'}
            </h3>
            <p className="text-xs text-stone-600">
              {language === 'en' ? 'Available 6 AM - 8 PM daily in Kannada and English.' : 'ದಿನವೂ ಬೆಳಗ್ಗೆ 6 ರಿಂದ ರಾತ್ರಿ 8 ರವರೆಗೆ ಲಭ್ಯ.'}
            </p>
            <div className="pt-1">
              <a href="tel:18004251552" className="text-base font-black text-[#17652B] hover:underline block">
                1800-425-1552
              </a>
              <a href="tel:+918022864280" className="text-xs text-stone-500 hover:underline block mt-0.5">
                +91 80 2286 4280 (Bengaluru)
              </a>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-[#FFBF24] flex items-center justify-center font-bold">
              <Mail className="w-5 h-5 text-amber-800" />
            </div>
            <h3 className="font-extrabold text-base text-stone-900">
              {language === 'en' ? 'Email Support' : 'ಇಮೇಲ್ ಸಹಾಯ'}
            </h3>
            <p className="text-xs text-stone-600">
              {language === 'en' ? 'For technical issues or APMC trader license verification.' : 'ತಾಂತ್ರಿಕ ಅಥವಾ ಎಪಿಎಂಸಿ ಲೈಸೆನ್ಸ್ ಪರಿಶೀಲನೆಗೆ.'}
            </p>
            <div className="pt-1">
              <a href="mailto:support@smartfarmerconnect.in" className="text-xs font-black text-[#17652B] hover:underline block">
                support@smartfarmerconnect.in
              </a>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-base text-stone-900">
              {language === 'en' ? 'APMC Mandi Yard Officers' : 'ಎಪಿಎಂಸಿ ಮಾರುಕಟ್ಟೆ ಅಧಿಕಾರಿಗಳು'}
            </h3>
            <p className="text-xs text-stone-600">
              {language === 'en' ? 'Dedicated dispute redressal officers at Amaragol & Kangrali.' : 'ಹುಬ್ಬಳ್ಳಿ & ಬೆಳಗಾವಿ ಮಂಡಿ ಕಚೇರಿಗಳಲ್ಲಿ ನೇರ ಅಧಿಕಾರಿಗಳು.'}
            </p>
            <div className="pt-1 text-xs font-black text-stone-800">
              {language === 'en' ? 'Yard Gate Assistance 24/7' : 'ಗೇಟ್ ಪರಿಶೀಲನೆ ಸದಾ ಲಭ್ಯ'}
            </div>
          </div>
        </div>

        {/* Covered APMC Yards Directory */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-5">
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-[#17652B]" />
            <h2 className="text-xl font-black text-stone-900">
              {language === 'en' ? 'Karnataka APMC Market Yard Directory' : 'ಕರ್ನಾಟಕ ಎಪಿಎಂಸಿ ಮಂಡಿ ವಿವರ'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-[#FFF8E5] border border-amber-200 space-y-1">
              <h4 className="font-black text-sm text-[#17652B]">Hubballi APMC (Amaragol)</h4>
              <p className="text-stone-600">PB Road, Amaragol, Hubballi, Karnataka 580025</p>
              <p className="text-stone-500 font-medium pt-1">Primary Commodities: Tomato, Onion, Chilli</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FFF8E5] border border-amber-200 space-y-1">
              <h4 className="font-black text-sm text-[#17652B]">Belagavi APMC (Kangrali)</h4>
              <p className="text-stone-600">APMC Yard, Kangrali BK, Belagavi, Karnataka 590010</p>
              <p className="text-stone-500 font-medium pt-1">Primary Commodities: Potato, Onion, Vegetables</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FFF8E5] border border-amber-200 space-y-1">
              <h4 className="font-black text-sm text-[#17652B]">Yeshwanthpur APMC Yard</h4>
              <p className="text-stone-600">Tumkur Road, Yeshwanthpur, Bengaluru 560022</p>
              <p className="text-stone-500 font-medium pt-1">Primary Commodities: Grains, Pulses, Vegetables</p>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-5">
          <div className="flex items-center space-x-2">
            <HelpCircle className="w-5 h-5 text-amber-500" />
            <h2 className="text-xl font-black text-stone-900">
              {language === 'en' ? 'Frequently Asked Questions (FAQ)' : 'ಸಾಮಾನ್ಯ ಪ್ರಶ್ನೆಗಳು (FAQ)'}
            </h2>
          </div>

          <div className="divide-y divide-stone-100">
            {faqs.map((f, i) => (
              <div key={i} className="py-4 space-y-1.5">
                <h3 className="font-extrabold text-sm text-[#17652B]">
                  {language === 'en' ? f.qEn : f.qKn}
                </h3>
                <p className="text-xs text-stone-700 leading-relaxed">
                  {language === 'en' ? f.aEn : f.aKn}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
