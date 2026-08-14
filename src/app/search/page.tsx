'use client';

import React, { useState } from 'react';
import { Search, Radio, Sparkles } from 'lucide-react';
import { getStoredEpisodes } from '@/lib/data';
import { EpisodeCard } from '@/components/EpisodeCard';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const episodes = getStoredEpisodes();

  const results = query.trim() === '' ? [] : episodes.filter(ep => {
    const q = query.toLowerCase();
    return (
      ep.title.toLowerCase().includes(q) ||
      ep.description.toLowerCase().includes(q) ||
      ep.tags.some(t => t.toLowerCase().includes(q)) ||
      (ep.transcript_en && ep.transcript_en.toLowerCase().includes(q)) ||
      (ep.transcript_hi && ep.transcript_hi.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      
      <div className="text-center space-y-4 pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-600 dark:text-brand-400 text-xs font-bold uppercase tracking-wider">
          <Search className="w-3.5 h-3.5" /> Instant Episode Search
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
          Find Relationship Answers
        </h1>
        <p className="text-sm text-gray-500 max-w-xl mx-auto">
          Type any topic, keyword, or emotion (e.g., "overthinking", "communication", "Hindi", "boundaries") to search across all Love Talk episodes.
        </p>

        {/* Large Search Bar */}
        <div className="relative max-w-2xl mx-auto pt-2">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
          <input
            type="text"
            autoFocus
            placeholder="Search titles, descriptions, transcripts..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-14 pr-6 py-4 rounded-3xl bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 text-base sm:text-lg focus:outline-none focus:border-brand-500 text-gray-900 dark:text-white shadow-xl transition-all"
          />
        </div>
      </div>

      {/* Suggested Quick Searches */}
      {query === '' && (
        <div className="text-center space-y-3 pt-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Popular Search Topics</p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {['Self-Love', 'Overthinking', 'Communication', 'Hindi Special', 'Marriage', 'Past Baggage', 'Expectations'].map(term => (
              <button
                key={term}
                onClick={() => setQuery(term)}
                className="px-4 py-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-xs font-bold text-gray-700 dark:text-gray-300 hover:border-brand-500 hover:text-brand-500 transition-all shadow-sm"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results Feed */}
      {query.trim() !== '' && (
        <div className="space-y-6 pt-4">
          <div className="flex items-center justify-between text-sm font-semibold text-gray-500">
            <span>Search results for "{query}"</span>
            <span>{results.length} found</span>
          </div>

          {results.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 space-y-2">
              <Radio className="w-10 h-10 text-gray-400 mx-auto" />
              <h3 className="font-bold text-gray-900 dark:text-white">No episodes matched "{query}"</h3>
              <p className="text-xs text-gray-500">Try searching for keywords like "dating", "overthinking", or "self love".</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((ep) => (
                <EpisodeCard key={ep.id} episode={ep} />
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
