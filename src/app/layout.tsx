import type { Metadata, Viewport } from 'next';
import { Inter, Noto_Sans_Kannada } from 'next/font/google';
import { Providers } from '@/components/common/Providers';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const notoKannada = Noto_Sans_Kannada({
  subsets: ['kannada'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-noto-kannada',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Smart Farmer Connect | ಸ್ಮಾರ್ಟ್ ರೈತ ಸಂಪರ್ಕ',
  description:
    'Connect Karnataka farmers directly with APMC mandi traders before travelling. Post crops, compare offers, and guarantee buyers.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Smart Farmer',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#1B5E20',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${notoKannada.variable}`}>
      <body className="font-sans antialiased bg-[#FFF8E1] min-h-screen flex flex-col selection:bg-amber-300">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
