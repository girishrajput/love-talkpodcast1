'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  FileText, 
  X, 
  Zap,
  Lock,
  Crown
} from 'lucide-react';
import { useAudio } from '@/context/AudioContext';
import { useAuth } from '@/context/AuthContext';

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export const AudioPlayer: React.FC = () => {
  const {
    currentEpisode,
    isPlaying,
    currentTime,
    duration,
    playbackRate,
    volume,
    isMuted,
    isTranscriptOpen,
    togglePlay,
    seek,
    setPlaybackRate,
    setVolume,
    toggleMute,
    toggleTranscript,
    playNext,
    playPrev,
  } = useAudio();

  const { isPremium } = useAuth();
  const [activeTranscriptLang, setActiveTranscriptLang] = useState<'en' | 'hi'>('en');
  const [showUnlockModal, setShowUnlockModal] = useState(false);

  // Check 60s preview limit for free users listening to PREMIUM episodes
  useEffect(() => {
    if (
      currentEpisode &&
      currentEpisode.access_type === 'PREMIUM' &&
      !isPremium &&
      isPlaying
    ) {
      const previewLimit = currentEpisode.preview_duration || 60;
      if (currentTime >= previewLimit) {
        togglePlay(); // Pause playback
        setShowUnlockModal(true);
      }
    }
  }, [currentTime, currentEpisode, isPremium, isPlaying]);

  if (!currentEpisode) return null;

  const rates = [0.8, 1.0, 1.25, 1.5, 2.0];
  const nextRateIndex = (rates.indexOf(playbackRate) + 1) % rates.length;
  const isLocked = currentEpisode.access_type === 'PREMIUM' && !isPremium;

  return (
    <>
      {/* Unlock Premium Modal */}
      {showUnlockModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl max-w-md w-full p-8 text-center space-y-6 shadow-2xl animate-in zoom-in">
            <div className="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto border border-amber-500/30">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="font-extrabold text-2xl text-gray-900 dark:text-white">🔒 Premium Audio Locked</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                You reached the 60-second preview limit for <strong>"{currentEpisode.title}"</strong>. Join Love Talk Premium starting at ₹99/year to unlock full audio, ad-free listening & dual transcripts.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Link
                href="/membership"
                onClick={() => setShowUnlockModal(false)}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-brand-600 to-rose-500 hover:from-brand-500 text-white font-extrabold text-sm shadow-lg shadow-brand-600/30"
              >
                Unlock Premium Now
              </Link>
              
              <button
                onClick={() => setShowUnlockModal(false)}
                className="w-full py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-bold text-xs"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transcript Drawer Modal */}
      {isTranscriptOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-end sm:items-center p-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gray-50 dark:bg-gray-950">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-600/10 text-brand-600 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-base line-clamp-1">
                    {currentEpisode.title}
                  </h3>
                  <p className="text-xs text-gray-500">Episode #{currentEpisode.episode_number} Transcript</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center bg-gray-200 dark:bg-gray-800 rounded-full p-0.5 text-xs">
                  <button
                    onClick={() => setActiveTranscriptLang('en')}
                    className={`px-3 py-1 rounded-full font-medium transition-all ${activeTranscriptLang === 'en' ? 'bg-brand-600 text-white shadow' : 'text-gray-600 dark:text-gray-400'}`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => setActiveTranscriptLang('hi')}
                    className={`px-3 py-1 rounded-full font-medium transition-all ${activeTranscriptLang === 'hi' ? 'bg-brand-600 text-white shadow' : 'text-gray-600 dark:text-gray-400'}`}
                  >
                    हिंदी
                  </button>
                </div>

                <button onClick={toggleTranscript} className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-white rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto flex-1 text-sm text-gray-700 dark:text-gray-300 space-y-4 leading-relaxed font-sans">
              {activeTranscriptLang === 'en' ? (
                currentEpisode.transcript_en ? (
                  <pre className="whitespace-pre-wrap font-sans">{currentEpisode.transcript_en}</pre>
                ) : (
                  <p className="italic text-gray-400">English transcript coming soon for this episode.</p>
                )
              ) : (
                currentEpisode.transcript_hi ? (
                  <pre className="whitespace-pre-wrap font-sans">{currentEpisode.transcript_hi}</pre>
                ) : (
                  <p className="italic text-gray-400">हिंदी स्क्रिप्ट जल्द उपलब्ध होगी।</p>
                )
              )}
            </div>
          </div>
        </div>
      )}

      {/* Persistent Floating Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl border-t border-gray-200/80 dark:border-gray-800/80 shadow-2xl px-4 py-3 sm:px-6 transition-all">
        
        {/* Progress Bar (Full Width Top) */}
        <div className="max-w-7xl mx-auto mb-2">
          <div className="group relative w-full h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full cursor-pointer overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-600 to-rose-400 rounded-full transition-all"
              style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
            />
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={(e) => seek(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-gray-400 mt-1">
            <span>{formatTime(currentTime)}</span>
            {isLocked && (
              <span className="text-amber-500 font-bold">Preview Mode (60s)</span>
            )}
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls Layout */}
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Left: Episode Info */}
          <div className="flex items-center gap-3 min-w-0 max-w-[280px] sm:max-w-xs">
            <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-800 flex-shrink-0 shadow-md">
              <Image
                src={currentEpisode.cover_image}
                alt={currentEpisode.title}
                fill
                className="object-cover"
              />
              {isPlaying && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-0.5">
                  <span className="w-1 h-4 bg-white animate-wave-bar-1 rounded-full" />
                  <span className="w-1 h-5 bg-white animate-wave-bar-2 rounded-full" />
                  <span className="w-1 h-3 bg-white animate-wave-bar-3 rounded-full" />
                </div>
              )}
            </div>

            <div className="min-w-0">
              <Link href={`/episodes/${currentEpisode.slug}`} className="font-bold text-sm text-gray-900 dark:text-white hover:text-brand-500 line-clamp-1">
                {currentEpisode.title}
              </Link>
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                {isLocked ? (
                  <span className="text-amber-500 font-bold flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Premium
                  </span>
                ) : (
                  <span>Ep #{currentEpisode.episode_number}</span>
                )}
                <span>•</span>
                <span className="capitalize">{currentEpisode.language}</span>
              </div>
            </div>
          </div>

          {/* Center: Play / Pause Controls */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button onClick={playPrev} className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
              <SkipBack className="w-5 h-5" />
            </button>

            <button
              onClick={() => {
                if (isLocked && currentTime >= 60) {
                  setShowUnlockModal(true);
                } else {
                  togglePlay();
                }
              }}
              className="w-12 h-12 rounded-full bg-gradient-to-tr from-brand-600 to-rose-500 text-white flex items-center justify-center shadow-lg shadow-brand-500/30 hover:scale-105 active:scale-95 transition-all"
            >
              {isPlaying ? <Pause className="w-6 h-6 fill-white" /> : <Play className="w-6 h-6 fill-white ml-0.5" />}
            </button>

            <button onClick={playNext} className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
              <SkipForward className="w-5 h-5" />
            </button>
          </div>

          {/* Right: Rate, Volume, Transcript */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => setPlaybackRate(rates[nextRateIndex])}
              className="px-2.5 py-1 bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg text-xs font-semibold text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-800 flex items-center gap-1"
            >
              <Zap className="w-3 h-3 text-amber-500" />
              {playbackRate}x
            </button>

            <button
              onClick={toggleTranscript}
              className={`p-2 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                isTranscriptOpen
                  ? 'bg-brand-600 text-white border-brand-600'
                  : 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span className="hidden lg:inline">Transcript</span>
            </button>

            <div className="flex items-center gap-2">
              <button onClick={toggleMute} className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                {isMuted || volume === 0 ? <VolumeX className="w-5 h-5 text-rose-500" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-16 h-1 accent-brand-600 bg-gray-200 dark:bg-gray-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>

        </div>
      </div>
    </>
  );
};
