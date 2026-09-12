'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, Send, Instagram, Youtube, Music, Radio, ShieldCheck, Mail } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-gray-300 border-t border-gray-800 pt-16 pb-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Col 1: Brand */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white">
                <Radio className="w-5 h-5" />
              </div>
              <span className="font-bold text-xl text-white">Love Talk Podcast</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              "Welcome to 'Love Talk' Podcast! We're glad that you are here." Hosted by Tim & Chels. Discussing relationships, mental health, and emotional growth every Friday.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com/lovetalkpodcast"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-gray-800 hover:bg-brand-600 text-gray-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://t.me/lovetalkpodcast"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-gray-800 hover:bg-sky-500 text-gray-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Telegram"
              >
                <Send className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-gray-800 hover:bg-red-600 text-gray-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Listen Platforms */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider">Listen On Platforms</h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>
                <a href="https://open.spotify.com" target="_blank" rel="noreferrer" className="hover:text-brand-400 transition-colors flex items-center gap-2">
                  <Music className="w-4 h-4 text-emerald-500" /> Spotify Podcasts
                </a>
              </li>
              <li>
                <a href="https://podcasts.apple.com" target="_blank" rel="noreferrer" className="hover:text-brand-400 transition-colors flex items-center gap-2">
                  <Music className="w-4 h-4 text-purple-400" /> Apple Podcasts
                </a>
              </li>
              <li>
                <a href="https://podtail.com" target="_blank" rel="noreferrer" className="hover:text-brand-400 transition-colors flex items-center gap-2">
                  <Radio className="w-4 h-4 text-amber-400" /> Podtail & ListenNotes
                </a>
              </li>
              <li>
                <a href="https://t.me/lovetalkpodcast" target="_blank" rel="noreferrer" className="hover:text-brand-400 transition-colors flex items-center gap-2">
                  <Send className="w-4 h-4 text-sky-400" /> Telegram Channel
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Links */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li><Link href="/" className="hover:text-brand-400 transition-colors">{t('navHome')}</Link></li>
              <li><Link href="/episodes" className="hover:text-brand-400 transition-colors">{t('navEpisodes')}</Link></li>
              <li><Link href="/search" className="hover:text-brand-400 transition-colors">{t('navSearch')}</Link></li>
              <li><Link href="/about" className="hover:text-brand-400 transition-colors">{t('navAbout')}</Link></li>
              <li><Link href="/admin" className="hover:text-brand-400 transition-colors">{t('navAdmin')}</Link></li>
            </ul>
          </div>

          {/* Col 4: Community Badge */}
          <div className="space-y-4 bg-gray-800/40 p-6 rounded-2xl border border-gray-800">
            <div className="flex items-center gap-2 text-brand-400 font-semibold text-sm">
              <Heart className="w-4 h-4 fill-brand-400" /> Made for Indian Youth
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Serving listeners across India and globally with compassionate, real-world relationship guidance in both English and Hindi.
            </p>
            <div className="pt-2 text-xs text-gray-500 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Dynamic baas architecture enabled
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} Love Talk Podcast by Tim & Chels. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="hover:text-brand-400 transition-colors">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:text-brand-400 transition-colors">Terms of Service</Link>
            <Link href="/sitemap" className="hover:text-brand-400 transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
