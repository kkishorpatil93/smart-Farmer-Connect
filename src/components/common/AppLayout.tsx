'use client';

import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { BottomNav } from './BottomNav';

interface AppLayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
}

export function AppLayout({ children, showFooter = true }: AppLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[#FFF8E5] text-[#17251B] selection:bg-[#FFBF24]">
      <Navbar />
      <main className="flex-1 pb-20 lg:pb-0">{children}</main>
      {showFooter && <Footer />}
      <BottomNav />
    </div>
  );
}
