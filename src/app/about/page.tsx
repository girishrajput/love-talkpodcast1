'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Heart, Sparkles, BookOpen, Send, CheckCircle2, ChevronDown, Mail, Phone, MapPin } from 'lucide-react';
import { HostSection } from '@/components/HostSection';

export default function AboutPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [submitted, setSubmitted] = useState(false);

  const faqs = [
    {
      q: 'When are new episodes of Love Talk Podcast released?',
      a: 'New episodes drop every Friday morning on all major podcast platforms (Spotify, Apple Podcasts, Podtail, YouTube) and here on our website!'
    },
    {
      q: 'Is Love Talk Podcast available in Hindi?',
      a: 'Yes! We record both English and dedicated Hindi Special episodes (plus Hinglish bilingual shows) tailored specifically for Indian youth.'
    },
    {
      q: 'Can I submit a personal relationship question to Tim & Chels?',
      a: 'Absolutely! You can submit questions via our Telegram community (t.me/lovetalkpodcast) or Instagram DM (@lovetalkpodcast). We feature listener questions in our monthly Q&A episodes.'
    },
    {
      q: 'Where can I buy the "Love Talk 1.0" book?',
      a: 'The book is available on Amazon India, major online retailers, and selected bookstores nationwide.'
    }
  ];

  const handleContact = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="space-y-16 pb-20">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-brand-950 via-gray-900 to-gray-950 p-8 sm:p-14 rounded-3xl text-white border border-brand-800/40 text-center space-y-4 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 text-xs font-semibold uppercase tracking-wider">
          <Heart className="w-4 h-4 fill-brand-400" /> About The Show
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
          Welcome to Love Talk Podcast
        </h1>
        <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
          "Welcome to 'Love Talk' Podcast! We're glad that you are here." Hosted by Tim & Chels, bringing honest, warm, and transformative conversations on modern dating and relationship dynamics.
        </p>
      </div>

      {/* Host Section */}
      <HostSection />

      {/* Core Mission Pillars */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Our Core Pillars</h2>
          <p className="text-sm text-gray-500">Why thousands of listeners tune in every Friday</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 bg-white dark:bg-gray-900 rounded-3xl border border-gray-200/80 dark:border-gray-800/80 space-y-3 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center font-bold text-xl">
              01
            </div>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">Radical Honesty & Empathy</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              We talk about real struggles — overthinking, boundary setting, mixed signals — without sugarcoating or preaching.
            </p>
          </div>

          <div className="p-8 bg-white dark:bg-gray-900 rounded-3xl border border-gray-200/80 dark:border-gray-800/80 space-y-3 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold text-xl">
              02
            </div>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">Cultural Resonance</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              Bridging modern psychological principles with the real cultural realities of young adults navigating family, arranged vs love marriages, and career balance.
            </p>
          </div>

          <div className="p-8 bg-white dark:bg-gray-900 rounded-3xl border border-gray-200/80 dark:border-gray-800/80 space-y-3 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center font-bold text-xl">
              03
            </div>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">Actionable Takeaways</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              Every episode leaves you with practical scripts, reflection prompts, and healthy communication habits to apply immediately.
            </p>
          </div>
        </div>
      </section>

      {/* Book Highlight Banner */}
      <section className="bg-gradient-to-r from-amber-950 via-gray-900 to-gray-950 p-8 sm:p-12 rounded-3xl text-white border border-amber-800/40 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-4 max-w-xl">
          <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold rounded-full uppercase tracking-wider">
            Official Book Release
          </span>
          <h2 className="text-3xl font-extrabold">"Love Talk 1.0" by Tim & Chels</h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            Our comprehensive guide to emotional connection, conflict resolution, and self-worth. Packed with original frameworks, stories, and practical exercises.
          </p>
          <a
            href="https://amazon.in"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-gray-950 font-bold text-sm transition-all shadow-lg"
          >
            <BookOpen className="w-4 h-4" /> Get Your Copy on Amazon
          </a>
        </div>

        <div className="relative w-48 h-64 bg-amber-900/50 rounded-2xl border-2 border-amber-500/40 flex items-center justify-center shadow-2xl flex-shrink-0">
          <div className="text-center p-4">
            <BookOpen className="w-12 h-12 text-amber-400 mx-auto mb-2" />
            <h4 className="font-extrabold text-lg text-white">LOVE TALK 1.0</h4>
            <p className="text-xs text-amber-300">Tim & Chels</p>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="max-w-3xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Frequently Asked Questions</h2>
          <p className="text-sm text-gray-500">Everything you need to know about Love Talk Podcast</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800/80 rounded-2xl overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full p-5 text-left font-bold text-gray-900 dark:text-white text-sm sm:text-base flex items-center justify-between gap-4"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${openFaq === i ? 'rotate-180 text-brand-600' : ''}`} />
              </button>

              {openFaq === i && (
                <div className="px-5 pb-5 text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed border-t border-gray-100 dark:border-gray-800 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Contact & Sponsorship Form */}
      <section className="max-w-2xl mx-auto bg-white dark:bg-gray-900 p-8 sm:p-12 rounded-3xl border border-gray-200/80 dark:border-gray-800/80 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">Get in Touch with Tim & Chels</h2>
          <p className="text-xs text-gray-500">For sponsorships, media inquiries, or general questions</p>
        </div>

        {submitted ? (
          <div className="p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-center space-y-2 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-8 h-8 mx-auto" />
            <h4 className="font-bold text-base">Message Received!</h4>
            <p className="text-xs">Thanks for writing in. Tim & Chels will respond to your inquiry shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleContact} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                required
                placeholder="Full Name *"
                className="px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <input
                type="email"
                required
                placeholder="Email Address *"
                className="px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <input
              type="text"
              placeholder="Subject (e.g. Sponsorship / Listener Story)"
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <textarea
              required
              rows={4}
              placeholder="Your message..."
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" /> Send Message
            </button>
          </form>
        )}
      </section>

    </div>
  );
}
