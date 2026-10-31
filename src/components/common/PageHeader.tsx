'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { ChevronRight, ArrowLeft } from 'lucide-react';

interface BreadcrumbItem {
  labelEn: string;
  labelKn: string;
  href?: string;
}

interface PageHeaderProps {
  titleEn: string;
  titleKn: string;
  subtitleEn?: string;
  subtitleKn?: string;
  backHref?: string;
  backLabelEn?: string;
  backLabelKn?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  badge?: React.ReactNode;
}

export function PageHeader({
  titleEn,
  titleKn,
  subtitleEn,
  subtitleKn,
  backHref,
  backLabelEn = 'Back',
  backLabelKn = 'ಹಿಂದಕ್ಕೆ',
  breadcrumbs,
  actions,
  badge,
}: PageHeaderProps) {
  const { language } = useLanguage();

  return (
    <div className="bg-white border-b border-stone-200 py-4 sm:py-6 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
        {/* Top bar: Back Link and/or Breadcrumbs */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          {backHref && (
            <Link
              href={backHref}
              className="inline-flex items-center space-x-1.5 text-stone-600 hover:text-[#17652B] font-bold group transition"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition" />
              <span>{language === 'en' ? backLabelEn : backLabelKn}</span>
            </Link>
          )}

          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav aria-label="Breadcrumb" className="flex items-center space-x-1 text-stone-500">
              <Link href="/" className="hover:text-stone-900 transition">
                {language === 'en' ? 'Home' : 'ಮುಖಪುಟ'}
              </Link>
              {breadcrumbs.map((crumb, idx) => (
                <React.Fragment key={idx}>
                  <ChevronRight className="w-3 h-3 text-stone-400" />
                  {crumb.href ? (
                    <Link href={crumb.href} className="hover:text-stone-900 transition font-medium">
                      {language === 'en' ? crumb.labelEn : crumb.labelKn}
                    </Link>
                  ) : (
                    <span className="font-bold text-stone-900">
                      {language === 'en' ? crumb.labelEn : crumb.labelKn}
                    </span>
                  )}
                </React.Fragment>
              ))}
            </nav>
          )}
        </div>

        {/* Bottom row: Title + Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2.5">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#17652B] tracking-tight">
                {language === 'en' ? titleEn : titleKn}
              </h1>
              {badge}
            </div>
            {(subtitleEn || subtitleKn) && (
              <p className="text-xs sm:text-sm text-stone-600 max-w-2xl leading-relaxed">
                {language === 'en' ? subtitleEn : subtitleKn}
              </p>
            )}
          </div>

          {actions && <div className="shrink-0 flex items-center space-x-2">{actions}</div>}
        </div>
      </div>
    </div>
  );
}
