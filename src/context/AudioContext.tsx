'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Episode } from '@/lib/types';
import { INITIAL_EPISODES } from '@/lib/data';

interface AudioContextType {
  currentEpisode: Episode | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playbackRate: number;
  volume: number;
  isMuted: boolean;
  isTranscriptOpen: boolean;
  playEpisode: (episode: Episode) => void;
  togglePlay: () => void;
  seek: (time: number) => void;
  setPlaybackRate: (rate: number) => void;
  setVolume: (vol: number) => void;
  toggleMute: () => void;
  toggleTranscript: () => void;
  playNext: () => void;
  playPrev: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(INITIAL_EPISODES[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(INITIAL_EPISODES[0].audio_duration);
  const [playbackRate, setPlaybackRateState] = useState<number>(1);
  const [volume, setVolumeState] = useState<number>(0.8);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isTranscriptOpen, setIsTranscriptOpen] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio();
      const audio = audioRef.current;

      audio.volume = volume;

      const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
      const handleLoadedMetadata = () => {
        if (audio.duration && !isNaN(audio.duration)) {
          setDuration(audio.duration);
        }
      };
      const handleEnded = () => {
        setIsPlaying(false);
        playNext();
      };

      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('ended', handleEnded);

      return () => {
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('ended', handleEnded);
        audio.pause();
      };
    }
  }, []);

  const playEpisode = (episode: Episode) => {
    if (!audioRef.current) return;
    if (currentEpisode?.id === episode.id) {
      togglePlay();
      return;
    }

    setCurrentEpisode(episode);
    setDuration(episode.audio_duration);
    setCurrentTime(0);
    audioRef.current.src = episode.audio_url;
    audioRef.current.playbackRate = playbackRate;
    audioRef.current.play().then(() => {
      setIsPlaying(true);
    }).catch(err => {
      console.warn("Audio autoplay blocked or failed:", err);
      setIsPlaying(false);
    });
  };

  const togglePlay = () => {
    if (!audioRef.current || !currentEpisode) return;
    
    if (!audioRef.current.src || audioRef.current.src !== currentEpisode.audio_url) {
      audioRef.current.src = currentEpisode.audio_url;
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => setIsPlaying(false));
    }
  };

  const seek = (time: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const setPlaybackRate = (rate: number) => {
    setPlaybackRateState(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  const setVolume = (vol: number) => {
    setVolumeState(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol;
      setIsMuted(vol === 0);
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.volume = volume || 0.8;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const toggleTranscript = () => setIsTranscriptOpen(prev => !prev);

  const playNext = () => {
    if (!currentEpisode) return;
    const currentIndex = INITIAL_EPISODES.findIndex(e => e.id === currentEpisode.id);
    const nextIndex = (currentIndex + 1) % INITIAL_EPISODES.length;
    playEpisode(INITIAL_EPISODES[nextIndex]);
  };

  const playPrev = () => {
    if (!currentEpisode) return;
    const currentIndex = INITIAL_EPISODES.findIndex(e => e.id === currentEpisode.id);
    const prevIndex = (currentIndex - 1 + INITIAL_EPISODES.length) % INITIAL_EPISODES.length;
    playEpisode(INITIAL_EPISODES[prevIndex]);
  };

  return (
    <AudioContext.Provider
      value={{
        currentEpisode,
        isPlaying,
        currentTime,
        duration,
        playbackRate,
        volume,
        isMuted,
        isTranscriptOpen,
        playEpisode,
        togglePlay,
        seek,
        setPlaybackRate,
        setVolume,
        toggleMute,
        toggleTranscript,
        playNext,
        playPrev,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) throw new Error('useAudio must be used within an AudioProvider');
  return context;
};
