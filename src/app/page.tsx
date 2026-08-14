'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Play, 
  Pause, 
  Sparkles, 
  Radio, 
  Heart, 
  Send, 
  Instagram, 
  Youtube, 
  Music, 
  ArrowRight,
  Headphones,
  CheckCircle2,
  Quote,
  Clock,
  Calendar,
  Globe
} from 'lucide-react';
import { INITIAL_EPISODES } from '@/lib/data';
import { fetchEpisodes } from '@/lib/api';
import { Episode, CategoryTag } from '@/lib/types';
import { useAudio } from '@/context/AudioContext';
import { useLanguage } from '@/context/LanguageContext';
import { EpisodeCard } from '@/components/EpisodeCard';
import { HostSection } from '@/components/HostSection';
import { NewsletterForm } from '@/components/NewsletterForm';

export default function HomePage() {
  const { t, lang } = useLanguage();
  const { currentEpisode, isPlaying, playEpisode } = useAudio();
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [selectedLangFilter, setSelectedLangFilter] = useState<string>('all');
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  React.useEffect(() => {
    async function loadEpisodes() {
      setIsLoading(true);
      const data = await fetchEpisodes();
      setEpisodes(data);
      setIsLoading(false);
    }
    loadEpisodes();
  }, []);

  const latestEpisode = episodes[0] || INITIAL_EPISODES[0];

  const categories: CategoryTag[] = [
    'All',
    'Self-Love',
    'Dating & Relationships',
    'Communication',
    'Emotional Wellness',
    'Marriage & Future',
    'Hindi Special'
  ];

  // Filtering
  const filteredEpisodes = episodes.filter(ep => {
    const matchTag = selectedTag === 'All' || ep.tags.includes(selectedTag);
    const matchLang = selectedLangFilter === 'all' || ep.language === selectedLangFilter;
    return matchTag && matchLang;
  });

  const isLatestPlaying = currentEpisode?.id === latestEpisode?.id && isPlaying;

  return (
    <div className="space-y-16 pb-12">
      
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-brand-950/80 via-gray-900 to-gray-950 p-8 sm:p-14 text-white border border-brand-800/40 shadow-2xl">
        {/* Glow backdrop shapes */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 text-xs font-semibold uppercase tracking-wider">
              <Radio className="w-4 h-4 text-brand-400 animate-pulse" />
              {t('heroTagline')}
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15]">
              {t('heroTitle')}
            </h1>

            <p className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-2xl">
              {t('heroSubtitle')}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => playEpisode(latestEpisode)}
                className="px-7 py-4 rounded-2xl bg-gradient-to-r from-brand-600 to-rose-500 hover:from-brand-500 hover:to-rose-400 font-extrabold text-white text-base shadow-xl shadow-brand-600/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
              >
                {isLatestPlaying ? (
                  <>
                    <Pause className="w-5 h-5 fill-white" /> Pause Episode
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 fill-white" /> {t('btnListenLatest')}
                  </>
                )}
              </button>

              <Link
                href="/episodes"
                className="px-7 py-4 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold text-base border border-white/20 hover:border-white/40 transition-all flex items-center gap-2"
              >
                {t('btnExploreAll')} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Social & Platform badges */}
            <div className="pt-6 border-t border-white/10 flex flex-wrap items-center gap-6 text-xs font-semibold text-gray-300">
              <span className="text-gray-400 uppercase tracking-wider text-[11px]">Stream On:</span>
              <a href="https://open.spotify.com" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors">
                <Music className="w-4 h-4 text-emerald-400" /> Spotify
              </a>
              <a href="https://podcasts.apple.com" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-purple-400 transition-colors">
                <Music className="w-4 h-4 text-purple-400" /> Apple
              </a>
              <a href="https://instagram.com/lovetalkpodcast" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-rose-400 transition-colors">
                <Instagram className="w-4 h-4 text-rose-400" /> Instagram
              </a>
              <a href="https://t.me/lovetalkpodcast" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-sky-400 transition-colors">
                <Send className="w-4 h-4 text-sky-400" /> Telegram
              </a>
            </div>
          </div>

          {/* Hero Right Podcast Artwork Spotlight */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-sm aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 group">
              <Image
                src={latestEpisode.cover_image}
                alt="Latest Episode Cover"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 flex flex-col justify-between">
                <div className="flex justify-between items-center">
                  <span className="px-3 py-1 bg-brand-600 text-white text-xs font-bold rounded-full">
                    {t('latestEpisodeTag')}
                  </span>
                  <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-white text-xs font-semibold rounded-full capitalize">
                    {latestEpisode.language}
                  </span>
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-mono text-brand-300">EPISODE #{latestEpisode.episode_number}</p>
                  <h3 className="text-xl font-bold text-white line-clamp-2">{latestEpisode.title}</h3>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. Filter & Category Bar */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              {t('allEpisodesTitle')}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Explore relationship conversations hosted by Tim & Chels</p>
          </div>

          {/* Language filter pills */}
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-900 p-1.5 rounded-2xl border border-gray-200 dark:border-gray-800 text-xs font-semibold">
            <Globe className="w-4 h-4 text-gray-400 ml-2" />
            <button
              onClick={() => setSelectedLangFilter('all')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                selectedLangFilter === 'all'
                  ? 'bg-brand-600 text-white shadow'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {t('filterAllLang')}
            </button>
            <button
              onClick={() => setSelectedLangFilter('english')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                selectedLangFilter === 'english'
                  ? 'bg-brand-600 text-white shadow'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setSelectedLangFilter('hindi')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                selectedLangFilter === 'hindi'
                  ? 'bg-brand-600 text-white shadow'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              हिंदी Special
            </button>
          </div>
        </div>

        {/* Categories Horizontal Scroll */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedTag(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedTag === cat
                  ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-md'
                  : 'bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Episode Grid */}
        {filteredEpisodes.length === 0 ? (
          <div className="p-12 text-center bg-gray-100 dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 space-y-3">
            <Radio className="w-10 h-10 text-gray-400 mx-auto" />
            <h3 className="font-bold text-gray-900 dark:text-white text-lg">No episodes found</h3>
            <p className="text-xs text-gray-500">Try changing the category or language filter above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEpisodes.map((ep) => (
              <EpisodeCard key={ep.id} episode={ep} />
            ))}
          </div>
        )}
      </section>

      {/* 3. Host Section */}
      <HostSection />

      {/* 4. Listener Testimonials */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-xs font-bold uppercase tracking-wider">
            <Heart className="w-4 h-4 fill-rose-500" /> Community Love
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            What Our Listeners Say
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Real feedback from young adults in India following Love Talk Podcast.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-200/80 dark:border-gray-800/80 space-y-4 shadow-sm">
            <Quote className="w-8 h-8 text-brand-400/40" />
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed italic">
              "Tim and Chels feel like older siblings giving advice over coffee. Their episode on communication saved me from so much overthinking."
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="w-10 h-10 rounded-full bg-brand-600 text-white font-bold flex items-center justify-center text-sm">
                AS
              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-900 dark:text-white">Aakanksha S.</h4>
                <p className="text-xs text-gray-500">Mumbai, India</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-200/80 dark:border-gray-800/80 space-y-4 shadow-sm">
            <Quote className="w-8 h-8 text-brand-400/40" />
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed italic">
              "The Hindi episodes are absolute gold. They address Indian family expectations and dating with such maturity and respect."
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="w-10 h-10 rounded-full bg-amber-600 text-white font-bold flex items-center justify-center text-sm">
                VK
              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-900 dark:text-white">Vikram K.</h4>
                <p className="text-xs text-gray-500">Delhi, India</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-200/80 dark:border-gray-800/80 space-y-4 shadow-sm">
            <Quote className="w-8 h-8 text-brand-400/40" />
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed italic">
              "Love the built-in transcript and audio player! I listen to new episodes every Friday morning while commuting."
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="w-10 h-10 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center text-sm">
                NM
              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-900 dark:text-white">Neha M.</h4>
                <p className="text-xs text-gray-500">Bengaluru, India</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Newsletter Signup */}
      <NewsletterForm />

    </div>
  );
}
