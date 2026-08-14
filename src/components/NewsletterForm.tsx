'use client';

import React, { useState } from 'react';
import { Mail, CheckCircle2, HeartHandshake } from 'lucide-react';
import { subscribeNewsletterApi } from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';

export const NewsletterForm: React.FC = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setStatus('loading');
    const success = await subscribeNewsletterApi(email, name);
    if (success) {
      setStatus('success');
      setEmail('');
      setName('');
    } else {
      setStatus('error');
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-900 via-rose-950 to-gray-950 p-8 sm:p-12 text-white border border-brand-800/50 shadow-2xl">
      {/* Glow effect */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl -z-0 pointer-events-none" />
      
      <div className="relative z-10 max-w-2xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 text-xs font-semibold uppercase tracking-wider">
          <HeartHandshake className="w-4 h-4" /> Weekly Relationship Note
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          {t('newsletterTitle')}
        </h2>

        <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
          {t('newsletterSubtitle')}
        </p>

        {status === 'success' ? (
          <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl flex items-center justify-center gap-3 text-emerald-300 text-sm font-semibold animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            {t('newsletterSuccess')}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              required
              placeholder={t('newsletterPlaceholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-5 py-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-brand-500 to-rose-500 hover:from-brand-600 hover:to-rose-600 font-bold text-sm text-white shadow-lg shadow-brand-600/30 transition-all flex items-center justify-center gap-2 flex-shrink-0"
            >
              <Mail className="w-4 h-4" />
              {status === 'loading' ? 'Joining...' : t('newsletterBtn')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
