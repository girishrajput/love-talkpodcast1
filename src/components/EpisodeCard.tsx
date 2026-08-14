'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Play, Pause, Clock, Calendar, Lock, Crown } from 'lucide-react';
import { Episode } from '@/lib/types';
import { useAudio } from '@/context/AudioContext';
import { useAuth } from '@/context/AuthContext';

interface EpisodeCardProps {
  episode: Episode;
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  return `${mins} min`;
}

export const EpisodeCard: React.FC<EpisodeCardProps> = ({ episode }) => {
  const router = useRouter();
  const { isPremium } = useAuth();
  const { currentEpisode, isPlaying, playEpisode } = useAudio();
  const isCurrent = currentEpisode?.id === episode.id;
  const isCurrentlyPlaying = isCurrent && isPlaying;

  const isLocked = episode.access_type === 'PREMIUM' && !isPremium;

  const handlePlayClick = () => {
    if (isLocked) {
      router.push(`/episodes/${episode.slug}?unlock=true`);
      return;
    }
    playEpisode(episode);
  };

  return (
    <div className="group bg-white dark:bg-gray-900 rounded-3xl p-5 border border-gray-200/80 dark:border-gray-800/80 hover:border-brand-500/50 dark:hover:border-brand-500/50 transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col justify-between">
      <div>
        {/* Artwork Header */}
        <div className="relative aspect-square w-full rounded-2xl overflow-hidden mb-4 bg-gray-100 dark:bg-gray-800">
          <Image
            src={episode.cover_image}
            alt={episode.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          
          {/* Top Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
            <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-white text-xs font-bold rounded-full">
              Ep #{episode.episode_number}
            </span>
            
            <div className="flex gap-1.5">
              {episode.access_type === 'PREMIUM' && (
                <span className="px-2.5 py-1 bg-amber-500 text-black text-[11px] font-extrabold rounded-full flex items-center gap-1 shadow-md">
                  <Lock className="w-3 h-3" /> PREMIUM
                </span>
              )}

              <span className={`px-2.5 py-1 text-[11px] font-bold rounded-full backdrop-blur-md text-white uppercase ${
                episode.language === 'hindi' 
                  ? 'bg-amber-600/80' 
                  : episode.language === 'bilingual'
                  ? 'bg-purple-600/80'
                  : 'bg-rose-600/80'
              }`}>
                {episode.language}
              </span>
            </div>
          </div>

          {/* Play / Lock Overlay */}
          <button
            onClick={handlePlayClick}
            className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
            aria-label={isCurrentlyPlaying ? 'Pause Episode' : 'Play Episode'}
          >
            <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl scale-90 group-hover:scale-100 transition-transform ${
              isLocked ? 'bg-amber-500 text-black' : 'bg-brand-600 text-white'
            }`}>
              {isLocked ? (
                <Lock className="w-6 h-6" />
              ) : isCurrentlyPlaying ? (
                <Pause className="w-6 h-6 fill-white" />
              ) : (
                <Play className="w-6 h-6 fill-white ml-1" />
              )}
            </div>
          </button>
        </div>

        {/* Content Info */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              {new Date(episode.publish_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              {formatDuration(episode.audio_duration)}
            </span>
          </div>

          <Link href={`/episodes/${episode.slug}`}>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-brand-500 transition-colors line-clamp-2 leading-snug">
              {episode.title}
            </h3>
          </Link>

          <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
            {episode.description}
          </p>
        </div>
      </div>

      {/* Footer Tags & Actions */}
      <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {episode.tags.slice(0, 2).map(tag => (
            <span key={tag} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-[11px] rounded-md font-medium">
              {tag}
            </span>
          ))}
        </div>

        <button
          onClick={handlePlayClick}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
            isLocked
              ? 'bg-amber-500/10 text-amber-600 border border-amber-500/30'
              : isCurrent
              ? 'bg-brand-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-brand-600 hover:text-white'
          }`}
        >
          {isLocked ? (
            <>
              <Lock className="w-3.5 h-3.5" /> Unlock
            </>
          ) : isCurrentlyPlaying ? (
            <>
              <Pause className="w-3.5 h-3.5 fill-current" /> Playing
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" /> Listen
            </>
          )}
        </button>
      </div>
    </div>
  );
};
