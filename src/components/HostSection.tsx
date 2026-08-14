'use client';

import React from 'react';
import Image from 'next/image';
import { Heart, Sparkles, BookOpen, Mic, Award } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export const HostSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="py-16 bg-gray-50/50 dark:bg-gray-900/40 rounded-3xl border border-gray-200/60 dark:border-gray-800/60 px-6 sm:px-12 my-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Host Photo */}
        <div className="lg:col-span-5 relative">
          <div className="relative aspect-square w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-gray-800 group">
            <Image
              src="/images/tim_chels.jpg"
              alt="Tim and Chels Hosts"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-6">
              <div className="text-white">
                <p className="text-xs font-semibold text-brand-300 uppercase tracking-wider">Co-Hosts & Content Creators</p>
                <h3 className="text-2xl font-bold">Tim & Chels</h3>
              </div>
            </div>
          </div>
          
          {/* Floating Badge */}
          <div className="absolute -bottom-6 -right-6 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 flex items-center gap-3 hidden sm:flex">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900 dark:text-white">Authors of "Love Talk 1.0"</p>
              <p className="text-[11px] text-gray-500">Available on Amazon & Bookstores</p>
            </div>
          </div>
        </div>

        {/* Story Content */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 text-xs font-bold uppercase tracking-wider">
            <Mic className="w-4 h-4 text-brand-600" /> About The Hosts
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            {t('hostsTitle')}
          </h2>

          <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
            {t('hostsSubtitle')} We started <strong>Love Talk Podcast</strong> to bridge the gap between relationship psychology and everyday real conversations. From dealing with overthinking and family expectations to building financial trust, we bring vulnerable, actionable advice every week.
          </p>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
              <p className="text-2xl font-extrabold text-brand-600 dark:text-brand-400">100K+</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Monthly Listeners</p>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
              <p className="text-2xl font-extrabold text-brand-600 dark:text-brand-400">50+</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Episodes Released</p>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
              <p className="text-2xl font-extrabold text-brand-600 dark:text-brand-400">Bilingual</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">English & Hindi</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
