'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  Play, 
  Pause, 
  Clock, 
  Calendar, 
  Share2, 
  Heart, 
  MessageSquare, 
  Star, 
  FileText, 
  Globe, 
  Check, 
  Send,
  Radio,
  ArrowLeft,
  Sparkles,
  Loader2
} from 'lucide-react';
import { fetchEpisodeBySlug, fetchEpisodes, postEpisodeComment } from '@/lib/api';
import { Episode, Comment } from '@/lib/types';
import { useAudio } from '@/context/AudioContext';
import { EpisodeCard } from '@/components/EpisodeCard';

export default function EpisodeDetailPage({ params }: { params: { slug: string } }) {
  const [episode, setEpisode] = useState<Episode | null>(null);
  const [relatedEpisodes, setRelatedEpisodes] = useState<Episode[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { currentEpisode, isPlaying, playEpisode } = useAudio();

  const [activeTab, setActiveTab] = useState<'notes' | 'transcript'>('notes');
  const [transcriptLang, setTranscriptLang] = useState<'en' | 'hi'>('en');
  const [copied, setCopied] = useState(false);

  // Comment Form state
  const [commentsList, setCommentsList] = useState<Comment[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');
  const [commenting, setCommenting] = useState(false);

  useEffect(() => {
    async function loadEpisode() {
      setIsLoading(true);
      const data = await fetchEpisodeBySlug(params.slug);
      if (data) {
        setEpisode(data);
        setCommentsList(data.comments || []);

        const allEpisodes = await fetchEpisodes();
        const related = allEpisodes
          .filter(e => e.id !== data.id && e.tags.some((t: string) => data.tags.includes(t)))
          .slice(0, 3);
        setRelatedEpisodes(related);
      }
      setIsLoading(false);
    }
    loadEpisode();
  }, [params.slug]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
        <p className="text-sm font-semibold text-gray-400">Loading episode from MySQL database...</p>
      </div>
    );
  }

  if (!episode) {
    notFound();
  }

  const isCurrent = currentEpisode?.id === episode.id;
  const isCurrentlyPlaying = isCurrent && isPlaying;

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !content || !email) return;

    setCommenting(true);
    const newComm = await postEpisodeComment(params.slug, {
      user_name: name,
      user_email: email,
      content,
      rating
    });

    if (newComm) {
      setCommentsList([newComm, ...commentsList]);
      setName('');
      setEmail('');
      setContent('');
    }
    setCommenting(false);
  };

  return (
    <div className="space-y-12 pb-20">
      
      {/* Back Button */}
      <Link href="/episodes" className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-brand-600 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Episodes
      </Link>

      {/* Episode Header Hero */}
      <div className="bg-gradient-to-br from-brand-950 via-gray-900 to-gray-950 p-8 sm:p-12 rounded-3xl text-white border border-brand-800/40 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Cover Image */}
          <div className="lg:col-span-4 relative aspect-square w-full max-w-sm mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10">
            <Image
              src={episode.cover_image}
              alt={episode.title}
              fill
              className="object-cover"
            />
          </div>

          {/* Details */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
              <span className="px-3 py-1 bg-brand-600 text-white rounded-full">
                EPISODE #{episode.episode_number}
              </span>
              <span className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full capitalize">
                {episode.language}
              </span>
              <span className="flex items-center gap-1 text-gray-300">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(episode.publish_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
              <span className="flex items-center gap-1 text-gray-300">
                <Clock className="w-3.5 h-3.5" />
                {Math.floor(episode.audio_duration / 60)} minutes
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              {episode.title}
            </h1>

            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              {episode.description}
            </p>

            {/* Play & Action Bar */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => playEpisode(episode)}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-600 to-rose-500 hover:from-brand-500 hover:to-rose-400 font-extrabold text-white text-base shadow-xl shadow-brand-600/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
              >
                {isCurrentlyPlaying ? (
                  <>
                    <Pause className="w-6 h-6 fill-white" /> Pause Audio
                  </>
                ) : (
                  <>
                    <Play className="w-6 h-6 fill-white" /> Play Episode Now
                  </>
                )}
              </button>

              <button
                onClick={handleShare}
                className="px-5 py-4 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold text-sm border border-white/20 hover:border-white/40 transition-all flex items-center gap-2"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                {copied ? 'Link Copied!' : 'Share'}
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Main Content Tabs: Show Notes vs Transcript */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200/80 dark:border-gray-800/80 p-6 sm:p-10 shadow-sm space-y-8">
        
        {/* Tabs Bar */}
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-4">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('notes')}
              className={`pb-2 text-sm font-bold border-b-2 transition-all ${
                activeTab === 'notes'
                  ? 'border-brand-600 text-brand-600 dark:text-brand-400'
                  : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Show Notes & Highlights
            </button>
            <button
              onClick={() => setActiveTab('transcript')}
              className={`pb-2 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'transcript'
                  ? 'border-brand-600 text-brand-600 dark:text-brand-400'
                  : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4" /> Full Transcript
            </button>
          </div>

          {activeTab === 'transcript' && (
            <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-full p-1 text-xs">
              <button
                onClick={() => setTranscriptLang('en')}
                className={`px-3 py-1 rounded-full font-bold transition-all ${transcriptLang === 'en' ? 'bg-brand-600 text-white' : 'text-gray-500'}`}
              >
                English
              </button>
              <button
                onClick={() => setTranscriptLang('hi')}
                className={`px-3 py-1 rounded-full font-bold transition-all ${transcriptLang === 'hi' ? 'bg-brand-600 text-white' : 'text-gray-500'}`}
              >
                हिंदी
              </button>
            </div>
          )}
        </div>

        {/* Tab Content */}
        {activeTab === 'notes' ? (
          <div className="space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
            <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">Episode Summary</h3>
            <p>{episode.description}</p>

            <h4 className="text-lg font-bold text-gray-900 dark:text-white pt-4">Key Takeaways from Tim & Chels</h4>
            <ul className="space-y-3 list-disc pl-5">
              <li>Why self-awareness and emotional regulation are the bedrock of any healthy connection.</li>
              <li>How to communicate uncomfortable boundaries without feeling guilty.</li>
              <li>Navigating overthinking when your partner is slow to respond or communicate.</li>
              <li>Practical weekly reflection questions to ask each other.</li>
            </ul>

            <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex flex-wrap gap-2">
              <span className="text-xs font-semibold text-gray-400 mr-2">Tags:</span>
              {episode.tags.map(t => (
                <span key={t} className="px-3 py-1 bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 rounded-full text-xs font-medium">
                  #{t}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-6 bg-gray-50 dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 font-mono text-sm leading-relaxed text-gray-800 dark:text-gray-200">
            {transcriptLang === 'en' ? (
              episode.transcript_en ? (
                <pre className="whitespace-pre-wrap font-sans">{episode.transcript_en}</pre>
              ) : (
                <p className="italic text-gray-400">English transcript pending for this episode.</p>
              )
            ) : (
              episode.transcript_hi ? (
                <pre className="whitespace-pre-wrap font-sans">{episode.transcript_hi}</pre>
              ) : (
                <p className="italic text-gray-400">हिंदी स्क्रिप्ट शीघ्र ही अपलोड की जाएगी।</p>
              )
            )}
          </div>
        )}

      </div>

      {/* Interactive Comments & Ratings Section */}
      <section className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200/80 dark:border-gray-800/80 p-6 sm:p-10 shadow-sm space-y-8">
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-600/10 text-brand-600 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">Listener Reviews & Discussions</h2>
              <p className="text-xs text-gray-500">Share your thoughts on this episode with Tim, Chels & the community</p>
            </div>
          </div>
          <span className="px-3 py-1 bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 text-xs font-bold rounded-full">
            {commentsList.length} Comments
          </span>
        </div>

        {/* Add Comment Form */}
        <form onSubmit={handlePostComment} className="bg-gray-50 dark:bg-gray-950 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-4">
          <h4 className="font-bold text-sm text-gray-900 dark:text-white">Leave a Review or Comment</h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              required
              placeholder="Your Name *"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="px-4 py-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <input
              type="email"
              placeholder="Your Email (Optional)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Star Rating input */}
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
            <span>Rating:</span>
            <div className="flex gap-1 text-amber-400">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="hover:scale-125 transition-transform"
                >
                  <Star className={`w-5 h-5 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
                </button>
              ))}
            </div>
          </div>

          <textarea
            required
            rows={3}
            placeholder="What did you think of Tim & Chels' points in this episode?..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          />

          <button
            type="submit"
            disabled={commenting}
            className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
          >
            <Send className="w-4 h-4" /> {commenting ? 'Posting...' : 'Submit Comment'}
          </button>
        </form>

        {/* Comments Feed */}
        <div className="space-y-4 pt-2">
          {commentsList.map((c) => (
            <div key={c.id} className="p-5 rounded-2xl bg-gray-50/70 dark:bg-gray-950/60 border border-gray-100 dark:border-gray-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-brand-600 text-white font-bold flex items-center justify-center text-xs">
                    {c.user_name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-gray-900 dark:text-white">{c.user_name}</h5>
                    <p className="text-[11px] text-gray-400">
                      {new Date(c.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </div>

                <div className="flex gap-0.5 text-amber-400">
                  {[...Array(c.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed pl-12">
                {c.content}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Related Episodes */}
      {relatedEpisodes.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">Related Episodes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedEpisodes.map((ep) => (
              <EpisodeCard key={ep.id} episode={ep} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
