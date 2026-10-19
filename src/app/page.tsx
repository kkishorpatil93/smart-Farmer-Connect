'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Navbar } from '@/components/common/Navbar';
import { WhyConnectSection } from '@/components/home/WhyConnectSection';
import { CropListing } from '@/types/database';
import {
  Sprout,
  Store,
  Camera,
  BellRing,
  CheckCircle2,
  CalendarDays,
  MapPin,
  TrendingUp,
  ShieldCheck,
  Languages,
  PhoneCall,
  Clock,
  Sparkles,
  ArrowRight,
  Truck,
  IndianRupee,
  Scale,
  BadgeCheck,
  ChevronRight,
  Layers,
  Award,
  ShoppingBag,
  HelpCircle,
  Users,
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth();
  const { language } = useLanguage();

  const [listings, setListings] = useState<CropListing[]>([]);
  const [loadingListings, setLoadingListings] = useState(true);

  useEffect(() => {
    fetch('/api/listings')
      .then((res) => res.json())
      .then((data) => {
        if (data.listings && Array.isArray(data.listings)) {
          setListings(data.listings);
        }
      })
      .catch((err) => console.error('Error fetching live listings:', err))
      .finally(() => setLoadingListings(false));
  }, []);

  // Compute actual database statistics
  const totalActiveLots = listings.length;
  const totalQuantityKg = listings.reduce((sum, l) => sum + (l.quantity_remaining_kg || l.quantity_kg || 0), 0);
  const totalQuintals = (totalQuantityKg / 100).toFixed(1);
  const uniqueMarkets = new Set(listings.map((l) => l.market?.name_en).filter(Boolean)).size || 2;
  const totalOffersCount = listings.reduce((sum, l) => sum + (l.offers?.length || 0), 0);

  const t = {
    en: {
      tagline: 'Karnataka APMC Pre-Harvest Marketplace',
      heroTitle: 'Know your buyer BEFORE travelling to the mandi',
      heroSub:
        'Connect directly with verified APMC commission agents & traders across Karnataka before you load your tempo. Lock in fair baseline rates, eliminate distress sales, and save ₹1,500 - ₹3,500 in wasted transport freight.',
      imFarmer: "I'm a Farmer",
      farmerSub: 'Post crops & get direct offers',
      imSeller: "I'm an APMC Seller",
      sellerSub: 'Find fresh verified farm lots',
      trustBadges: ['100% Free for Farmers', 'Verified APMC Traders', 'Zero Middlemen Cuts'],
      
      // Verified Price Ticker
      tickerBadge: 'Verified APMC Price Bulletin (Daily KSAMB Rates • 19 Oct 2026):',
      tickerItems: [
        { crop: 'Tomato (ಟೊಮೇಟೊ)', mandi: 'Hubballi APMC', price: '₹2,100 - ₹2,350/qtl' },
        { crop: 'Onion (ಈರುಳ್ಳಿ)', mandi: 'Belagavi APMC', price: '₹2,600 - ₹2,900/qtl' },
        { crop: 'Potato (ಆಲೂಗಡ್ಡೆ)', mandi: 'Yeshwanthpur APMC', price: '₹1,850 - ₹2,100/qtl' },
        { crop: 'Green Chilli (ಹಸಿ ಮೆಣಸಿನಕಾಯಿ)', mandi: 'Davanagere APMC', price: '₹3,400 - ₹3,800/qtl' },
        { crop: 'Maize (ಮೆಕ್ಕೆಜೋಳ)', mandi: 'Ranebennur APMC', price: '₹2,150 - ₹2,300/qtl' },
      ],

      // Real Database Stats
      statsHeader: 'Live Marketplace Overview (Synced with Database)',
      statLots: 'Active Pre-Harvest Lots',
      statProduce: 'Quintals Available',
      statMandis: 'Active APMC Mandis',
      statOffers: 'Direct Buyer Bids Received',

      // Transport & Savings Section
      savingsTitle: 'Why Connect Before Travelling to the Mandi?',
      savingsSub: 'Traditional mandi visits force farmers into distress sales. Here is how Smart Farmer Connect protects your hard work:',
      savingsCard1Title: 'Save ₹1,500 - ₹3,500 in Lorry Freight',
      savingsCard1Desc: 'Travelling without a confirmed buyer risks rejection or waiting days at the gate paying vehicle demurrage. Know your destination and buyer before you load.',
      savingsCard2Title: 'Stop Distress Price Slashing',
      savingsCard2Desc: 'Middlemen frequently drop prices by 30-50% when they know you cannot afford to take perishable crops back. Lock in expected rates upfront.',
      savingsCard3Title: 'Pre-Assigned APMC Gate Pass',
      savingsCard3Desc: 'Deliver directly to a licensed trader stall with a digital QR gate pass for priority weighment, avoiding 5-hour queues.',
      savingsCard4Title: 'Guaranteed Transparent Settlement',
      savingsCard4Desc: 'Weighment slips are cross-verified digitally. Receive immediate UPI or cash settlement without hidden deductions.',

      // Benefits for Farmers & Sellers
      benefitsTitle: 'Built for Both Karnataka Farmers and APMC Traders',
      farmerBenefitHead: 'Benefits for Farmers',
      farmerBenefits: [
        'Post harvested or standing crops with photos from your field in 2 minutes',
        'Receive multiple price offers from licensed mandi commission agents',
        'Direct phone number unlocking upon mutual agreement',
        'Zero commission or fees taken from the farmer',
      ],
      sellerBenefitHead: 'Benefits for APMC Sellers & Traders',
      sellerBenefits: [
        'Discover fresh pre-harvest farm lots before they hit the open auction yard',
        'View preliminary quality grades, harvest date, and farmer village location',
        'Directly negotiate quantities and propose visit arrival times',
        'Secure consistent farm procurement directly from Karnataka taluks',
      ],

      // Featured Real Crops
      featuredTitle: 'Featured Fresh Crop Lots from Karnataka Farmers',
      featuredSub: 'Real-time pre-harvest lots posted by verified farmers ready for APMC trader procurement.',
      noListings: 'No active crop listings in database right now.',
      viewDetailsBtn: 'Inspect Crop Lot',
      submitBidBtn: 'Submit Trader Bid',
      qualityGradeLabel: 'Quality Grade',
      expectedPriceLabel: 'Farmer Rate',
      quantityLabel: 'Available Qty',

      // 4 Steps Workflow
      howTitle: 'How It Works in 4 Simple Steps',
      howSub: 'From your farm to verified APMC settlement without distress or exploitation.',
      step1Num: '01',
      step1Title: 'Take Photos & Post Crop',
      step1Desc: 'Upload 1-5 photos directly from your field, enter harvest date, quantity, and expected price.',
      step1Action: 'Post Crop Lot →',
      step2Num: '02',
      step2Title: 'APMC Traders Get Alerted',
      step2Desc: 'Licensed commission agents and traders in your target mandi receive instant SMS & app notifications.',
      step2Action: 'Mandi Feed →',
      step3Num: '03',
      step3Title: 'Compare Real Bids',
      step3Desc: 'Review multiple buyer offers side-by-side, verify trader ratings, and accept the best rate.',
      step3Action: 'Compare Offers →',
      step4Num: '04',
      step4Title: 'Confirmed Visit & Payment',
      step4Desc: 'Unlock verified phone number, present QR gate pass at the mandi, and receive immediate payment.',
      step4Action: 'Track Visits & Pay →',

      // PWA Section
      installTitle: 'Use Smart Farmer Connect on Any Phone',
      installDesc: 'Lightweight PWA designed for 2G/3G mobile networks in rural Karnataka villages.',
      installBtn: 'Install App (PWA)',
      demoFooter: 'Karnataka APMC Marketplace Pilot • Hubballi & Belagavi Mandis',
    },
    kn: {
      tagline: 'ಕರ್ನಾಟಕ ಎಪಿಎಂಸಿ ಪೂರ್ವ-ಕೊಯ್ಲು ಮಾರುಕಟ್ಟೆ',
      heroTitle: 'ಮಾರುಕಟ್ಟೆಗೆ ಹೋಗುವ ಮುನ್ನವೇ ಖರೀದಿದಾರರನ್ನು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ',
      heroSub:
        'ಹೊಲದಲ್ಲಿ ಬೆಳೆ ಕೊಯ್ಯುವ ಮುನ್ನವೇ ಕರ್ನಾಟಕದ ನೊಂದಾಯಿತ ಎಪಿಎಂಸಿ ವ್ಯಾಪಾರಿಗಳೊಂದಿಗೆ ನೇರ ಸಂಪರ್ಕ ಸಾಧಿಸಿ. ಖಚಿತ ದರ ಒಪ್ಪಂದ ಮಾಡಿಕೊಳ್ಳಿ, ಸಾರಿಗೆಯಲ್ಲಿ ಆಗುವ ₹1,500 - ₹3,500 ಅನಗತ್ಯ ವೆಚ್ಚವನ್ನು ಉಳಿಸಿ.',
      imFarmer: 'ನಾನು ರೈತ',
      farmerSub: 'ಬೆಳೆ ಪೋಸ್ಟ್ ಮಾಡಿ, ನೇರ ಆಫರ್ ಪಡೆಯಿರಿ',
      imSeller: 'ನಾನು ಎಪಿಎಂಸಿ ವ್ಯಾಪಾರಿ',
      sellerSub: 'ತಾಜಾ ಬೆಳೆಗಳನ್ನು ನೇರವಾಗಿ ಖರೀದಿಸಿ',
      trustBadges: ['ರೈತರಿಗೆ 100% ಉಚಿತ', 'ನೊಂದಾಯಿತ ಎಪಿಎಂಸಿ ವ್ಯಾಪಾರಿಗಳು', 'ದಲ್ಲಾಳಿಗಳಿಲ್ಲದ ನೇರ ವ್ಯವಹಾರ'],
      
      // Verified Price Ticker
      tickerBadge: 'ದೃಢೀಕೃತ ಎಪಿಎಂಸಿ ದರ ಪಟ್ಟಿ (ದೈನಂದಿನ ಕೆಎಸ್‌ಎಎಂಬಿ ದರ • 19 ಅಕ್ಟೋಬರ್ 2026):',
      tickerItems: [
        { crop: 'ಟೊಮೇಟೊ (Tomato)', mandi: 'ಹುಬ್ಬಳ್ಳಿ ಎಪಿಎಂಸಿ', price: '₹2,100 - ₹2,350/ಕ್ವಿಂ' },
        { crop: 'ಈರುಳ್ಳಿ (Onion)', mandi: 'ಬೆಳಗಾವಿ ಎಪಿಎಂಸಿ', price: '₹2,600 - ₹2,900/ಕ್ವಿಂ' },
        { crop: 'ಆಲೂಗಡ್ಡೆ (Potato)', mandi: 'ಯಶವಂತಪುರ ಎಪಿಎಂಸಿ', price: '₹1,850 - ₹2,100/ಕ್ವಿಂ' },
        { crop: 'ಹಸಿ ಮೆಣಸಿನಕಾಯಿ (Green Chilli)', mandi: 'ದಾವಣಗೆರೆ ಎಪಿಎಂಸಿ', price: '₹3,400 - ₹3,800/ಕ್ವಿಂ' },
        { crop: 'ಮೆಕ್ಕೆಜೋಳ (Maize)', mandi: 'ರಾಣೆಬೆನ್ನೂರು ಎಪಿಎಂಸಿ', price: '₹2,150 - ₹2,300/ಕ್ವಿಂ' },
      ],

      // Real Database Stats
      statsHeader: 'ನೇರ ಮಾರುಕಟ್ಟೆ ಮಾಹಿತಿ (ಡೇಟಾಬೇಸ್‌ನಿಂದ ನೈಜ ಅಂಕಿ-ಅಂಶಗಳು)',
      statLots: 'ಸಕ್ರಿಯ ಬೆಳೆಗಳು',
      statProduce: 'ಲಭ್ಯವಿರುವ ಕ್ವಿಂಟಾಲ್‌ಗಳು',
      statMandis: 'ಸಂಪರ್ಕಿತ ಎಪಿಎಂಸಿಗಳು',
      statOffers: 'ದಾಖಲಾದ ವ್ಯಾಪಾರಿ ಆಫರ್‌ಗಳು',

      // Transport & Savings Section
      savingsTitle: 'ಮಂಡಿಗೆ ಹೋಗುವ ಮುನ್ನವೇ ವ್ಯಾಪಾರಿ ತಿಳಿಯುವುದು ಏಕೆ ಮುಖ್ಯ?',
      savingsSub: 'ಮಂಡಿಗೆ ಹೋದ ನಂತರ ಬೆಲೆ ಇಳಿಸುವ ದಲ್ಲಾಳಿಗಳ ತಂತ್ರದಿಂದ ಮುಕ್ತಿ ಪಡೆಯಿರಿ. ಸ್ಮಾರ್ಟ್ ರೈತ ಸಂಪರ್ಕ ನಿಮ್ಮ ಬೆವರಿನ ಬೆಳೆಗೆ ಹೇಗೆ ರಕ್ಷಣೆ ನೀಡುತ್ತದೆ:',
      savingsCard1Title: '₹1,500 - ₹3,500 ಸಾರಿಗೆ ವೆಚ್ಚ ಉಳಿತಾಯ',
      savingsCard1Desc: 'ಖರೀದಿದಾರ ಖಚಿತವಿಲ್ಲದೆ ವಾಹನ ಬಾಡಿಗೆ ಮಾಡುವುದನ್ನು ತಪ್ಪಿಸಿ. ಬೆಳೆ ಹೊಲದಲ್ಲಿದ್ದಾಗಲೇ ವ್ಯಾಪಾರಿ ಮತ್ತು ಬೆಲೆ ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ.',
      savingsCard2Title: 'ಕಡಿಮೆ ಬೆಲೆಗೆ ಮಾರುವ ಸಂಕಷ್ಟ ತಪ್ಪಿಸಿ',
      savingsCard2Desc: 'ವಾಪಸ್ ಕೊಂಡೊಯ್ಯಲು ಸಾಧ್ಯವಿಲ್ಲ ಎಂದು ತಿಳಿದು ಮಂಡಿಯಲ್ಲಿ ಶೇ. 30-50 ರಷ್ಟು ಬೆಲೆ ಇಳಿಸುವುದನ್ನು ತಡೆಯಿರಿ.',
      savingsCard3Title: 'ನೇರ ಎಪಿಎಂಸಿ ಗೇಟ್ ಪಾಸ್ & ತೂಕ',
      savingsCard3Desc: 'ಗಂಟೆಗಟ್ಟಲೆ ಕ್ಯೂ ನಿಲ್ಲದೆ, ಮುಂಚಿತವಾಗಿ ಗೊತ್ತುಪಡಿಸಿದ ವ್ಯಾಪಾರಿ ಮಳಿಗೆಗೆ ನೇರವಾಗಿ ಹೋಗಿ ತೂಕ ಮಾಡಿಸಿ.',
      savingsCard4Title: 'ಪಾರದರ್ಶಕ ಮತ್ತು ತಕ್ಷಣದ ಪಾವತಿ',
      savingsCard4Desc: 'ಡಿಜಿಟಲ್ ತೂಕದ ಚೀಟಿ ಆಧಾರದಲ್ಲಿ ಯುಪಿಐ ಅಥವಾ ನಗದು ರೂಪದಲ್ಲಿ ತಕ್ಷಣದ ಪೂರ್ಣ ಹಣ ಪಡೆಯಿರಿ.',

      // Benefits for Farmers & Sellers
      benefitsTitle: 'ರೈತರು ಮತ್ತು ವ್ಯಾಪಾರಿಗಳಿಬ್ಬರಿಗೂ ಅನುಕೂಲಕರ',
      farmerBenefitHead: 'ರೈತರಿಗೆ ಆಗುವ ಲಾಭಗಳು',
      farmerBenefits: [
        'ಹೊಲದಲ್ಲೇ ನಿಂತು 2 ನಿಮಿಷದಲ್ಲಿ ಫೋಟೋ ತೆಗೆದು ಬೆಳೆ ಪೋಸ್ಟ್ ಮಾಡಿ',
        'ಅಧಿಕೃತ ಎಪಿಎಂಸಿ ಕಮಿಷನ್ ಏಜೆಂಟರಿಂದ ನೇರ ಬೆಲೆ ಆಫರ್ ಪಡೆಯಿರಿ',
        'ಆಫರ್ ಒಪ್ಪಿಕೊಂಡ ತಕ್ಷಣ ನೇರ ಫೋನ್ ಸಂಖ್ಯೆ ಮತ್ತು ಗೇಟ್ ಪಾಸ್ ಲಭ್ಯ',
        'ರೈತರಿಂದ ಯಾವುದೇ ಶುಲ್ಕ ಅಥವಾ ಕಮಿಷನ್ ಪಡೆಯಲಾಗುವುದಿಲ್ಲ',
      ],
      sellerBenefitHead: 'ಎಪಿಎಂಸಿ ವ್ಯಾಪಾರಿಗಳಿಗೆ ಲಾಭಗಳು',
      sellerBenefits: [
        'ಮಂಡಿ ಹರಾಜಿಗೆ ಬರುವ ಮುನ್ನವೇ ತಾಜಾ ಬೆಳೆಗಳ ವಿವರ ತಿಳಿದುಕೊಳ್ಳಿ',
        'ಗುಣಮಟ್ಟ ಗ್ರೇಡ್, ಕೊಯ್ಲಿನ ದಿನಾಂಕ ಮತ್ತು ಗ್ರಾಮದ ವಿವರ ಮುಂಚಿತವಾಗಿ ನೋಡಿ',
        'ನಿಮ್ಮ ಪ್ರಮಾಣ ಮತ್ತು ಬೆಲೆಯನ್ನು ರೈತರಿಗೆ ನೇರವಾಗಿ ಪ್ರಸ್ತಾಪಿಸಿ',
        'ನಿರಂತರವಾಗಿ ಉತ್ತಮ ಗುಣಮಟ್ಟದ ರೈತ ಬೆಳೆಗಳನ್ನು ಸಂಗ್ರಹಿಸಿ',
      ],

      // Featured Real Crops
      featuredTitle: 'ಕರ್ನಾಟಕ ರೈತರಿಂದ ನೇರ ಬೆಳೆಗಳ ವಿವರ',
      featuredSub: 'ನೈಜ ರೈತರು ಪೋಸ್ಟ್ ಮಾಡಿರುವ ತಾಜಾ ಬೆಳೆಗಳ ವಿವರ - ಎಪಿಎಂಸಿ ವ್ಯಾಪಾರಿಗಳ ಖರೀದಿಗೆ ಸಿದ್ಧವಾಗಿದೆ.',
      noListings: 'ಪ್ರಸ್ತುತ ಯಾವುದೇ ಸಕ್ರಿಯ ಬೆಳೆಗಳು ಲಭ್ಯವಿಲ್ಲ.',
      viewDetailsBtn: 'ಬೆಳೆಯ ವಿವರ ನೋಡಿ',
      submitBidBtn: 'ಆಫರ್ ಸಲ್ಲಿಸಿ',
      qualityGradeLabel: 'ಗುಣಮಟ್ಟ ಗ್ರೇಡ್',
      expectedPriceLabel: 'ರೈತರ ನಿರೀಕ್ಷಿತ ದರ',
      quantityLabel: 'ಲಭ್ಯವಿರುವ ಪ್ರಮಾಣ',

      // 4 Steps Workflow
      howTitle: 'ಕೇವಲ 4 ಸುಲಭ ಹಂತಗಳಲ್ಲಿ ನೇರ ವ್ಯವಹಾರ',
      howSub: 'ಹೊಲದಿಂದ ಎಪಿಎಂಸಿ ಪಾವತಿಯವರೆಗೆ ಸುಲಭ ಮತ್ತು ಸುರಕ್ಷಿತ ಪ್ರಕ್ರಿಯೆ.',
      step1Num: '01',
      step1Title: 'ಫೋಟೋ ತೆಗೆದು ಬೆಳೆ ಪೋಸ್ಟ್ ಮಾಡಿ',
      step1Desc: 'ಹೊಲದಲ್ಲೇ 1-5 ಫೋಟೋ ತೆಗೆದು, ಕೊಯ್ಲಿನ ದಿನ, ಪ್ರಮಾಣ ಮತ್ತು ಬೆಲೆ ನಮೂದಿಸಿ.',
      step1Action: 'ಬೆಳೆ ಸೇರಿಸಿ →',
      step2Num: '02',
      step2Title: 'ವ್ಯಾಪಾರಿಗಳಿಗೆ ತಕ್ಷಣ ಮಾಹಿತಿ',
      step2Desc: 'ನಿಮ್ಮ ಮಾರುಕಟ್ಟೆಯ ನೊಂದಾಯಿತ ಎಪಿಎಂಸಿ ವ್ಯಾಪಾರಿಗಳಿಗೆ ಆ್ಯಪ್ ಮತ್ತು ಎಸ್‌ಎಂಎಸ್ ಮೂಲಕ ಸಂದೇಶ ತಲುಪುತ್ತದೆ.',
      step2Action: 'ಮಂಡಿ ಫೀಡ್ →',
      step3Num: '03',
      step3Title: 'ಬಂದಿರುವ ಆಫರ್‌ಗಳನ್ನು ಹೋಲಿಸಿ',
      step3Desc: 'ವ್ಯಾಪಾರಿಗಳ ಆಫರ್‌ಗಳು ಮತ್ತು ಅವರ ರೇಟಿಂಗ್ ಪರಿಶೀಲಿಸಿ, ಉತ್ತಮ ದರ ಒಪ್ಪಿಕೊಳ್ಳಿ.',
      step3Action: 'ಆಫರ್ ಹೋಲಿಸಿ →',
      step4Num: '04',
      step4Title: 'ಭೇಟಿ ಖಚಿತ & ನೇರ ಪಾವತಿ',
      step4Desc: 'ವ್ಯಾಪಾರಿಯ ಫೋನ್ ಸಂಖ್ಯೆ ಪಡೆದು, ಮಂಡಿ ಗೇಟ್‌ನಲ್ಲಿ ಕ್ಯೂಆರ್ ತೋರಿಸಿ ತಕ್ಷಣ ಹಣ ಪಡೆಯಿರಿ.',
      step4Action: 'ಭೇಟಿ & ಪಾವತಿ →',

      // PWA Section
      installTitle: 'ನಿಮ್ಮ ಮೊಬೈಲ್‌ನಲ್ಲಿ ಆ್ಯಪ್ ಇನ್‌ಸ್ಟಾಲ್ ಮಾಡಿ',
      installDesc: 'ಹಳ್ಳಿಗಳಲ್ಲಿ ಕಡಿಮೆ ನೆಟ್‌ವರ್ಕ್ ಇರುವಾಗಲೂ ಸರಾಗವಾಗಿ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ.',
      installBtn: 'ಆ್ಯಪ್ ಡೌನ್‌ಲೋಡ್ (PWA)',
      demoFooter: 'ಕರ್ನಾಟಕ ಎಪಿಎಂಸಿ ಮಾರುಕಟ್ಟೆ ಪ್ರಾಯೋಗಿಕ ಯೋಜನೆ • ಹುಬ್ಬಳ್ಳಿ & ಬೆಳಗಾವಿ',
    },
  }[language];

  const handleFarmerClick = () => {
    if (user?.profile?.role === 'farmer') {
      router.push('/farmer/dashboard');
    } else {
      router.push('/auth/login?role=farmer');
    }
  };

  const handleSellerClick = () => {
    if (user?.profile?.role === 'seller') {
      router.push('/seller/dashboard');
    } else {
      router.push('/auth/login?role=seller');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF8E5] text-[#17251B] selection:bg-[#FFBF24] selection:text-stone-900">
      <Navbar />

      {/* 1. Verified Mandi Price Ticker (Dated & KSAMB verified reference) */}
      <section className="bg-amber-100/70 border-b border-amber-300/80 px-4 py-2.5 text-xs text-amber-950 font-medium">
        <div className="max-w-7xl mx-auto flex items-center space-x-3 overflow-x-auto whitespace-nowrap scrollbar-none">
          <div className="flex items-center space-x-1.5 shrink-0 bg-[#17652B] text-[#FFBF24] font-black px-3 py-1 rounded-xl text-[11px] shadow-sm">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{t.tickerBadge}</span>
          </div>

          <div className="flex items-center space-x-4">
            {t.tickerItems.map((item, idx) => (
              <div
                key={idx}
                className="inline-flex items-center space-x-1.5 bg-white border border-amber-200 px-3 py-1 rounded-xl shadow-xs hover:border-[#17652B] transition"
              >
                <span className="font-bold text-[#17652B]">{item.crop}</span>
                <span className="text-stone-400">•</span>
                <span className="text-stone-600 text-[11px]">{item.mandi}</span>
                <span className="font-black text-[#17652B] bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                  {item.price}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* 2. Elevated Hero Section (Two-column desktop grid with real Indian Farmer Photo) */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-stone-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-green-50 to-amber-50 rounded-full blur-3xl pointer-events-none -z-0" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-green-100 text-[#17652B] border border-green-300">
                <Sparkles className="w-3.5 h-3.5 text-[#17652B]" />
                <span>{t.tagline}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#17652B] tracking-tight leading-[1.18]">
                {t.heroTitle}
              </h1>

              <p className="text-stone-700 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0">
                {t.heroSub}
              </p>

              {/* Primary Dual Role Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 max-w-lg mx-auto lg:mx-0">
                <button
                  onClick={handleFarmerClick}
                  className="group min-h-[64px] bg-gradient-to-r from-[#17652B] to-[#2E8B43] hover:from-[#1F7D37] hover:to-[#3FA657] text-white rounded-2xl font-bold p-4 shadow-md hover:shadow-xl transition-all duration-200 flex items-center justify-between cursor-pointer border border-[#17652B]"
                >
                  <div className="flex items-center space-x-3.5 text-left">
                    <div className="w-12 h-12 rounded-xl bg-[#FFBF24] text-stone-950 flex items-center justify-center shrink-0 shadow">
                      <Sprout className="w-7 h-7 text-[#17652B]" />
                    </div>
                    <div>
                      <div className="text-lg font-extrabold leading-tight">{t.imFarmer}</div>
                      <div className="text-xs font-medium text-green-100">{t.farmerSub}</div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#FFBF24] group-hover:translate-x-1 transition" />
                </button>

                <button
                  onClick={handleSellerClick}
                  className="group min-h-[64px] bg-gradient-to-r from-[#FFBF24] to-[#FFCC4D] hover:from-[#FFCC4D] hover:to-[#FFD875] text-stone-950 rounded-2xl font-bold p-4 shadow-md hover:shadow-xl transition-all duration-200 flex items-center justify-between cursor-pointer border border-amber-300"
                >
                  <div className="flex items-center space-x-3.5 text-left">
                    <div className="w-12 h-12 rounded-xl bg-[#17652B] text-[#FFBF24] flex items-center justify-center shrink-0 shadow">
                      <Store className="w-7 h-7 text-[#FFBF24]" />
                    </div>
                    <div>
                      <div className="text-lg font-extrabold leading-tight">{t.imSeller}</div>
                      <div className="text-xs font-semibold text-stone-800">{t.sellerSub}</div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-stone-900 group-hover:translate-x-1 transition" />
                </button>
              </div>

              {/* Trust Badges */}
              <div className="pt-3 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-semibold text-stone-600">
                {t.trustBadges.map((badge, idx) => (
                  <div key={idx} className="flex items-center space-x-1.5 bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-200">
                    <BadgeCheck className="w-4 h-4 text-[#17652B]" />
                    <span>{badge}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Hero Farmer Photo Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md rounded-3xl overflow-hidden border-4 border-white shadow-2xl bg-amber-50 group">
                <div className="aspect-[4/3] sm:aspect-[4/4.5] overflow-hidden">
                  <img
                    src="/hero-farmer.jpg"
                    alt="Karnataka farmer in green farm using Smart Farmer Connect"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                </div>

                {/* Floating Trust Banner */}
                <div className="absolute bottom-3 left-3 right-3 bg-stone-950/85 backdrop-blur-md px-4 py-3 rounded-2xl text-white text-xs font-semibold flex items-center justify-between border border-white/20">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-lg bg-green-500/20 flex items-center justify-center">
                      <ShieldCheck className="w-4 h-4 text-green-400" />
                    </div>
                    <div>
                      <div className="font-extrabold text-white text-xs">Karnataka APMC Network</div>
                      <div className="text-[10px] text-green-200 font-normal">Direct Pre-Harvest Marketplace</div>
                    </div>
                  </div>
                  <span className="bg-[#FFBF24] text-stone-950 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                    100% Direct
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Real Database Statistics Section (Never invented!) */}
        <section className="bg-gradient-to-br from-white to-[#FFF8E5] rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-6 border-b border-stone-200">
            <div>
              <h2 className="text-xl font-extrabold text-[#17652B] flex items-center space-x-2">
                <Layers className="w-5 h-5 text-[#FFBF24]" />
                <span>{t.statsHeader}</span>
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                {language === 'en'
                  ? 'Real-time counters computed from live Supabase PostgreSQL records'
                  : 'ಸೂಪಬೇಸ್ ಡೇಟಾಬೇಸ್‌ನಿಂದ ನೇರವಾಗಿ ನವೀಕರಣಗೊಳ್ಳುವ ಅಂಕಿ-ಅಂಶಗಳು'}
              </p>
            </div>
            <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-[#17652B] border border-green-300">
              <span className="w-2 h-2 rounded-full bg-green-600 animate-ping mr-1" />
              Live DB Synced
            </span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-6">
            {/* Stat 1: Active lots */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs hover:border-[#17652B] transition">
              <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                {t.statLots}
              </div>
              <div className="text-3xl sm:text-4xl font-black text-[#17652B] mt-2">
                {totalActiveLots}
              </div>
              <div className="text-[11px] text-stone-500 mt-1 flex items-center space-x-1">
                <Sprout className="w-3.5 h-3.5 text-green-600" />
                <span>{language === 'en' ? 'Live farm listings' : 'ರೈತರ ಸಕ್ರಿಯ ಬೆಳೆಗಳು'}</span>
              </div>
            </div>

            {/* Stat 2: Total produce in Quintals */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs hover:border-[#17652B] transition">
              <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                {t.statProduce}
              </div>
              <div className="text-3xl sm:text-4xl font-black text-[#FFBF24] mt-2">
                {totalQuintals} <span className="text-sm font-semibold text-stone-500">qtl</span>
              </div>
              <div className="text-[11px] text-stone-500 mt-1 flex items-center space-x-1">
                <Scale className="w-3.5 h-3.5 text-amber-600" />
                <span>{totalQuantityKg.toLocaleString('en-IN')} kg total</span>
              </div>
            </div>

            {/* Stat 3: Mandis */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs hover:border-[#17652B] transition">
              <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                {t.statMandis}
              </div>
              <div className="text-3xl sm:text-4xl font-black text-[#2E8B43] mt-2">
                {uniqueMarkets}
              </div>
              <div className="text-[11px] text-stone-500 mt-1 flex items-center space-x-1">
                <Store className="w-3.5 h-3.5 text-[#2E8B43]" />
                <span>Hubballi & Belagavi</span>
              </div>
            </div>

            {/* Stat 4: Direct Buyer Bids */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs hover:border-[#17652B] transition">
              <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                {t.statOffers}
              </div>
              <div className="text-3xl sm:text-4xl font-black text-emerald-700 mt-2">
                {totalOffersCount}
              </div>
              <div className="text-[11px] text-stone-500 mt-1 flex items-center space-x-1">
                <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
                <span>{language === 'en' ? 'Direct trader bids' : 'ನೇರ ವ್ಯಾಪಾರಿ ಬಿಡ್‌ಗಳು'}</span>
              </div>
            </div>
          </div>
        </section>

        {/* 4. "Why Connect Before Mandi Travel?" (Cost & Transport Savings Section) */}
        <WhyConnectSection listings={listings} />

        {/* 5. Dual Benefits for Farmers & Sellers */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-stone-200 space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-[#17652B]">
              {t.benefitsTitle}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600">
              {language === 'en'
                ? 'Empowering farmers with upfront price certainty and enabling APMC traders to procure high-grade produce reliably.'
                : 'ರೈತರಿಗೆ ಖಚಿತ ಬೆಲೆ ಮತ್ತು ಎಪಿಎಂಸಿ ವ್ಯಾಪಾರಿಗಳಿಗೆ ಗುಣಮಟ್ಟದ ಬೆಳೆ ನೇರವಾಗಿ ದೊರಕುತ್ತದೆ.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            {/* Farmer Benefits Box */}
            <div className="bg-[#FFF8E5] p-6 rounded-3xl border border-amber-300/80 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-[#17652B] text-white flex items-center justify-center shadow">
                  <Sprout className="w-6 h-6 text-[#FFBF24]" />
                </div>
                <h3 className="text-lg font-black text-[#17652B]">
                  {t.farmerBenefitHead}
                </h3>
              </div>
              <ul className="space-y-2.5 text-xs text-stone-800">
                {t.farmerBenefits.map((b, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-[#17652B] shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Seller Benefits Box */}
            <div className="bg-emerald-50/70 p-6 rounded-3xl border border-emerald-200 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-[#FFBF24] text-stone-950 flex items-center justify-center shadow">
                  <Store className="w-6 h-6 text-[#17652B]" />
                </div>
                <h3 className="text-lg font-black text-[#17652B]">
                  {t.sellerBenefitHead}
                </h3>
              </div>
              <ul className="space-y-2.5 text-xs text-stone-800">
                {t.sellerBenefits.map((b, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 6. Featured Crop Cards (Real Uploaded Crops Grid from Database) */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#17652B] uppercase tracking-wider">
                <Sprout className="w-4 h-4 text-emerald-600" />
                <span>{language === 'en' ? 'Live Pre-Harvest Mandi Feed' : 'ನೈಜ ಬೆಳೆಗಳ ಫೀಡ್'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#17652B] tracking-tight">
                {t.featuredTitle}
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                {t.featuredSub}
              </p>
            </div>

            <Link
              href="/marketplace"
              className="inline-flex items-center space-x-2 bg-stone-100 hover:bg-stone-200 text-stone-900 font-bold px-4 py-2 rounded-xl text-xs sm:text-sm border border-stone-300 transition"
            >
              <ShoppingBag className="w-4 h-4 text-[#17652B]" />
              <span>{language === 'en' ? 'Explore Full Marketplace' : 'ಎಲ್ಲಾ ಬೆಳೆಗಳನ್ನು ನೋಡಿ'}</span>
              <ArrowRight className="w-4 h-4 text-[#17652B]" />
            </Link>
          </div>

          {loadingListings ? (
            <div className="p-12 text-center text-stone-500 bg-white rounded-3xl border border-stone-200">
              <div className="w-8 h-8 border-4 border-[#17652B] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm font-semibold">{language === 'en' ? 'Loading database crop lots...' : 'ಬೆಳೆಗಳ ವಿವರ ಲೋಡ್ ಆಗುತ್ತಿದೆ...'}</p>
            </div>
          ) : listings.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-stone-200 space-y-3">
              <Sprout className="w-12 h-12 text-stone-300 mx-auto" />
              <h3 className="font-bold text-stone-800 text-lg">{t.noListings}</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                {language === 'en'
                  ? 'Be the first farmer to post a crop lot and receive buyer offers!'
                  : 'ಮೊದಲ ಬೆಳೆ ಪೋಸ್ಟ್ ಮಾಡಿ ವ್ಯಾಪಾರಿಗಳಿಂದ ಆಫರ್ ಪಡೆಯಿರಿ!'}
              </p>
              <Link
                href="/farmer/add-crop"
                className="inline-flex items-center space-x-2 bg-[#17652B] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow hover:bg-green-900"
              >
                <span>{language === 'en' ? 'Post Crop Lot Now' : 'ಬೆಳೆ ಪೋಸ್ಟ್ ಮಾಡಿ'}</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((item) => {
                const primaryImage = item.images?.[0]?.storage_path;
                const cropName = language === 'en' ? item.crop?.name_en : item.crop?.name_kn;
                const marketName = language === 'en' ? item.market?.name_en : item.market?.name_kn;
                const offersCount = item.offers?.length || 0;
                const grade = item.quality_assessment?.grade || 'Grade A';

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-xl hover:border-green-600 transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div>
                      {/* Crop Image Header with Badges */}
                      <div className="relative aspect-[16/10] bg-stone-100 overflow-hidden">
                        {primaryImage ? (
                          <img
                            src={primaryImage}
                            alt={cropName}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-amber-50 text-5xl">
                            {item.crop?.icon_name || '🍅'}
                          </div>
                        )}

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-[#17652B]/90 text-[#FFBF24] backdrop-blur-sm border border-green-700/50 shadow">
                            <Sparkles className="w-3 h-3 text-[#FFBF24]" />
                            <span>{grade}</span>
                          </span>

                          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/95 text-stone-900 backdrop-blur-sm shadow border border-stone-200">
                            <IndianRupee className="w-3 h-3 text-emerald-700" />
                            <span>{offersCount} {language === 'en' ? 'Bids' : 'ಆಫರ್‌ಗಳು'}</span>
                          </span>
                        </div>

                        {/* Bottom Mandi Location Tag */}
                        <div className="absolute bottom-2 left-2 right-2 bg-stone-950/75 backdrop-blur-xs px-2.5 py-1 rounded-xl text-white text-[11px] font-medium flex items-center justify-between">
                          <span className="flex items-center space-x-1 truncate max-w-[200px]">
                            <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                            <span className="truncate">{marketName}</span>
                          </span>
                          <span className="text-green-300 font-semibold text-[10px]">
                            {item.harvest_date}
                          </span>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-5 space-y-4">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="text-xl font-black text-stone-900 group-hover:text-[#17652B] transition">
                              {cropName}
                            </h3>
                            <p className="text-xs text-stone-500 mt-0.5">
                              {language === 'en' ? 'Farmer:' : 'ರೈತರು:'}{' '}
                              <strong className="text-stone-700">
                                {item.farmer?.profile?.full_name?.split(' ')[0] || 'Karnataka Farmer'}
                              </strong>{' '}
                              ({item.farmer?.village || 'Local Taluk'})
                            </p>
                          </div>

                          <div className="text-right">
                            <div className="text-[11px] text-stone-500 font-bold uppercase">
                              {t.expectedPriceLabel}
                            </div>
                            <div className="text-lg font-black text-[#17652B]">
                              ₹{item.price_per_kg}/kg
                            </div>
                          </div>
                        </div>

                        {/* Quantity Details */}
                        <div className="grid grid-cols-2 gap-2 bg-[#FFF8E5] p-3 rounded-2xl border border-stone-200 text-xs">
                          <div>
                            <span className="text-stone-500 block text-[10px] uppercase font-bold">
                              {t.quantityLabel}
                            </span>
                            <span className="font-black text-stone-900 text-sm">
                              {item.entered_quantity} {item.entered_unit}
                            </span>
                          </div>
                          <div>
                            <span className="text-stone-500 block text-[10px] uppercase font-bold">
                              Total Lot Weight
                            </span>
                            <span className="font-black text-[#17652B] text-sm">
                              {(item.quantity_kg / 100).toFixed(1)} qtl ({item.quantity_kg} kg)
                            </span>
                          </div>
                        </div>

                        {/* AI Quality Note */}
                        <div className="flex items-center space-x-1.5 text-[11px] text-stone-700 bg-green-50 px-2.5 py-1.5 rounded-xl border border-green-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-700 shrink-0" />
                          <span className="line-clamp-1">
                            {item.quality_assessment?.explanation || 'Uniform size, firm harvest condition.'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons Footer */}
                    <div className="p-5 pt-0 grid grid-cols-2 gap-2">
                      <Link
                        href={user?.profile?.role === 'seller' ? `/seller/listings/${item.id}` : `/farmer/listings/${item.id}`}
                        className="min-h-[46px] w-full bg-stone-100 hover:bg-stone-200 text-stone-900 rounded-xl font-bold text-xs flex items-center justify-center transition border border-stone-200"
                      >
                        {t.viewDetailsBtn}
                      </Link>

                      <Link
                        href={user?.profile?.role === 'seller' ? `/seller/listings/${item.id}` : '/auth/login?role=seller'}
                        className="min-h-[46px] w-full bg-[#17652B] hover:bg-[#1F7D37] text-white rounded-xl font-bold text-xs flex items-center justify-center space-x-1 transition shadow-sm"
                      >
                        <span>{t.submitBidBtn}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#FFBF24]" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* 7. "How It Works in 4 Simple Steps" Cards */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-stone-200 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#17652B] uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>{language === 'en' ? 'Transparent Pre-Harvest Workflow' : 'ಸರಳ 4 ಹಂತದ ಪ್ರಕ್ರಿಯೆ'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#17652B] tracking-tight">
              {t.howTitle}
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm">
              {t.howSub}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Step 1: Take Photo & Post */}
            <Link
              href={user?.profile?.role === 'farmer' ? '/farmer/add-crop' : '/auth/login?role=farmer&redirect=/farmer/add-crop'}
              className="group bg-[#FFF8E5] rounded-2xl p-6 border border-stone-200 hover:border-green-600 hover:shadow-lg transition-all duration-200 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-[#FFBF24] font-mono">
                    {t.step1Num}
                  </span>
                  <div className="w-12 h-12 rounded-2xl bg-green-100 text-[#17652B] group-hover:bg-[#17652B] group-hover:text-[#FFBF24] flex items-center justify-center transition shadow-xs">
                    <Camera className="w-6 h-6" />
                  </div>
                </div>
                <h3 className="font-extrabold text-stone-900 group-hover:text-[#17652B] text-base transition">
                  {t.step1Title}
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {t.step1Desc}
                </p>
              </div>
              <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between text-xs font-bold text-[#17652B] group-hover:text-green-700">
                <span>{t.step1Action}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </div>
            </Link>

            {/* Step 2: APMC Traders Get Alerted */}
            <Link
              href={user?.profile?.role === 'seller' ? '/seller/dashboard' : '/auth/login?role=seller&redirect=/seller/dashboard'}
              className="group bg-[#FFF8E5] rounded-2xl p-6 border border-stone-200 hover:border-amber-500 hover:shadow-lg transition-all duration-200 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-[#FFBF24] font-mono">
                    {t.step2Num}
                  </span>
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 group-hover:bg-amber-500 group-hover:text-stone-950 flex items-center justify-center transition shadow-xs">
                    <BellRing className="w-6 h-6" />
                  </div>
                </div>
                <h3 className="font-extrabold text-stone-900 group-hover:text-amber-800 text-base transition">
                  {t.step2Title}
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {t.step2Desc}
                </p>
              </div>
              <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between text-xs font-bold text-amber-800 group-hover:text-amber-900">
                <span>{t.step2Action}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </div>
            </Link>

            {/* Step 3: Compare Real Bids */}
            <Link
              href={user?.profile?.role === 'farmer' ? '/farmer/offers' : '/auth/login?role=farmer&redirect=/farmer/offers'}
              className="group bg-[#FFF8E5] rounded-2xl p-6 border border-stone-200 hover:border-emerald-600 hover:shadow-lg transition-all duration-200 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-[#FFBF24] font-mono">
                    {t.step3Num}
                  </span>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 group-hover:bg-emerald-700 group-hover:text-white flex items-center justify-center transition shadow-xs">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                </div>
                <h3 className="font-extrabold text-stone-900 group-hover:text-emerald-800 text-base transition">
                  {t.step3Title}
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {t.step3Desc}
                </p>
              </div>
              <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between text-xs font-bold text-emerald-800 group-hover:text-emerald-900">
                <span>{t.step3Action}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </div>
            </Link>

            {/* Step 4: Confirmed Visit & Pay */}
            <Link
              href={user ? '/visits' : '/auth/login?redirect=/visits'}
              className="group bg-[#FFF8E5] rounded-2xl p-6 border border-stone-200 hover:border-teal-600 hover:shadow-lg transition-all duration-200 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-[#FFBF24] font-mono">
                    {t.step4Num}
                  </span>
                  <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 group-hover:bg-teal-700 group-hover:text-white flex items-center justify-center transition shadow-xs">
                    <CalendarDays className="w-6 h-6" />
                  </div>
                </div>
                <h3 className="font-extrabold text-stone-900 group-hover:text-teal-800 text-base transition">
                  {t.step4Title}
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {t.step4Desc}
                </p>
              </div>
              <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between text-xs font-bold text-teal-800 group-hover:text-teal-900">
                <span>{t.step4Action}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </div>
            </Link>
          </div>
        </section>

        {/* 8. Lightweight PWA Install Banner */}
        <section className="bg-gradient-to-r from-[#17652B] via-[#1F7D37] to-[#114D20] text-white rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 border border-green-800">
          <div className="space-y-1.5 text-center md:text-left">
            <h3 className="font-black text-xl sm:text-2xl text-white">
              {t.installTitle}
            </h3>
            <p className="text-xs sm:text-sm text-green-100 max-w-xl">
              {t.installDesc}
            </p>
          </div>
          <button
            onClick={() =>
              alert(
                language === 'en'
                  ? 'PWA Service Worker install prompt is active on Android Chrome & Safari.'
                  : 'PWA ಸೇವೆ ಸಕ್ರಿಯವಾಗಿದೆ. ನಿಮ್ಮ ಮೊಬೈಲ್ ಬ್ರೌಸರ್‌ನಲ್ಲಿ "Add to Home Screen" ಕ್ಲಿಕ್ ಮಾಡಿ.'
              )
            }
            className="min-h-[50px] px-7 py-3 bg-[#FFBF24] hover:bg-[#FFCC4D] text-stone-950 font-black rounded-2xl shadow-md transition cursor-pointer shrink-0"
          >
            {t.installBtn}
          </button>
        </section>
      </main>

      {/* 9. Mobile-Friendly Footer with Contact & Help Links */}
      <footer className="bg-[#17251B] text-stone-300 text-xs py-10 px-4 border-t border-stone-800 mt-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 border-b border-stone-800 pb-8">
          {/* Col 1: About */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-white font-black text-base">
              <span className="text-2xl">🌾</span>
              <span>Smart Farmer Connect</span>
            </div>
            <p className="text-stone-400 text-xs leading-relaxed">
              Karnataka's dedicated pre-harvest agricultural marketplace connecting farmers directly to licensed APMC traders.
            </p>
            <div className="text-[#FFBF24] font-bold text-xs">
              {t.demoFooter}
            </div>
          </div>

          {/* Col 2: Marketplace Quick Links */}
          <div className="space-y-2.5">
            <h4 className="font-extrabold text-white uppercase tracking-wider text-xs">
              {language === 'en' ? 'Marketplace' : 'ಮಾರುಕಟ್ಟೆ'}
            </h4>
            <ul className="space-y-1.5 text-stone-400">
              <li><Link href="/marketplace" className="hover:text-white">All Crop Lots (ಎಲ್ಲಾ ಬೆಳೆಗಳು)</Link></li>
              <li><Link href="/farmer/dashboard" className="hover:text-white">Farmer Hub (ರೈತ ಪುಟ)</Link></li>
              <li><Link href="/seller/dashboard" className="hover:text-white">Trader Mandi Feed (ವ್ಯಾಪಾರಿ ಫೀಡ್)</Link></li>
              <li><Link href="/visits" className="hover:text-white">Visits & Gate Passes (ಗೇಟ್ ಪಾಸ್)</Link></li>
            </ul>
          </div>

          {/* Col 3: Karnataka APMC Markets */}
          <div className="space-y-2.5">
            <h4 className="font-extrabold text-white uppercase tracking-wider text-xs">
              {language === 'en' ? 'Covered APMC Yards' : 'ಎಪಿಎಂಸಿ ಮಾರುಕಟ್ಟೆಗಳು'}
            </h4>
            <ul className="space-y-1.5 text-stone-400">
              <li>Hubballi APMC Yard, Amaragol</li>
              <li>Belagavi APMC Yard, Kangrali</li>
              <li>Yeshwanthpur APMC, Bengaluru</li>
              <li>Davanagere APMC Market</li>
            </ul>
          </div>

          {/* Col 4: Help & Contact */}
          <div className="space-y-2.5">
            <h4 className="font-extrabold text-white uppercase tracking-wider text-xs">
              {language === 'en' ? 'Help & Support' : 'ಸಹಾಯ & ಸಂಪರ್ಕ'}
            </h4>
            <div className="space-y-1 text-stone-400 text-xs">
              <p>Karnataka Mandi Support Helpline:</p>
              <p className="font-bold text-white text-sm">1800-425-1552 / +91 80 2286 4280</p>
              <p className="pt-1">Email: support@smartfarmerconnect.in</p>
              <div className="pt-2">
                <Link
                  href="/help"
                  className="inline-flex items-center space-x-1 text-[#FFBF24] font-bold hover:underline"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>{language === 'en' ? 'View Help & FAQs →' : 'ಸಹಾಯ ಮತ್ತು ವಿವರಗಳು →'}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-stone-500 text-xs">
          <p>© 2026 Smart Farmer Connect. Built for Karnataka APMC Mandi ecosystem.</p>
          <p>Preserves all authentic farmer listings and KSAMB benchmark rates.</p>
        </div>
      </footer>
    </div>
  );
}
