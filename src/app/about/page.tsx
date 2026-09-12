'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Heart, 
  Sparkles, 
  BookOpen, 
  Send, 
  CheckCircle2, 
  ChevronDown, 
  Globe, 
  Activity, 
  Award, 
  Radio, 
  PenTool, 
  Users, 
  Share2, 
  Youtube, 
  Instagram, 
  Linkedin, 
  Twitter, 
  MessageCircle, 
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { HostSection } from '@/components/HostSection';

export default function AboutPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [submitted, setSubmitted] = useState(false);

  const faqs = [
    {
      q: 'Who is Kota RJ Pawan?',
      a: 'Kota RJ Pawan is a Passionate Indian International Relationship Psychologist, Podcaster, Author, and Founder of TrueLove18Club International. He has been helping individuals and couples build healthier, fulfilling relationships since 2021.'
    },
    {
      q: 'Where can I listen to Love Talk Podcast?',
      a: 'Love Talk Podcast is broadcasted across 40+ platforms worldwide, including Spotify, Apple Podcasts, YouTube, Amazon Music, and our official website www.lovetalkpodcast.in.'
    },
    {
      q: 'What is the Notify Health Podcast?',
      a: 'Notify Health Podcast is hosted by Kota RJ Pawan, focusing on mental health, Alzheimer\'s disease awareness, preventive healthcare, healthy lifestyle, and public health education.'
    },
    {
      q: 'Where can I find books written by Kota RJ Pawan?',
      a: 'His books "Understanding Deceptive Traits – Top 5 in Relationship" and "Beyond Desire", along with several love-behaviour eBooks, are available on Amazon Kindle.'
    },
    {
      q: 'What is TrueLove18Club International?',
      a: 'TrueLove18Club International (www.truelove18club.com) is a global relationship and emotional wellness initiative founded by Kota RJ Pawan to improve emotional literacy and human connection.'
    }
  ];

  const handleContact = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="space-y-16 pb-20 max-w-6xl mx-auto px-4 sm:px-6">
      
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-brand-950 via-gray-900 to-gray-950 p-8 sm:p-14 rounded-3xl text-white border border-brand-800/40 text-center space-y-6 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-brand-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 text-xs font-bold uppercase tracking-wider">
          <Heart className="w-4 h-4 fill-brand-400" /> International Relationship Psychologist & Podcaster
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white">
          KOTA RJ PAWAN
        </h1>

        <p className="text-brand-300 text-base sm:text-xl font-semibold max-w-3xl mx-auto leading-relaxed">
          Founder of TrueLove18Club International & Host of Love Talk Podcast
        </p>

        <p className="text-gray-300 text-sm sm:text-base max-w-3xl mx-auto leading-relaxed">
          Passionate Indian International Relationship Psychologist, podcaster, author, and digital educator. Helping individuals and couples build healthier, more fulfilling relationships since 2021 across 40+ platforms worldwide.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <a
            href="https://www.lovetalkpodcast.in"
            target="_blank"
            rel="noreferrer"
            className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs sm:text-sm transition-all shadow-lg flex items-center gap-2"
          >
            <Globe className="w-4 h-4" /> Official Website (lovetalkpodcast.in)
          </a>
          <a
            href="https://www.truelove18club.com"
            target="_blank"
            rel="noreferrer"
            className="px-6 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 font-bold text-xs sm:text-sm transition-all flex items-center gap-2"
          >
            <ExternalLink className="w-4 h-4 text-brand-400" /> TrueLove18Club (truelove18club.com)
          </a>
        </div>
      </div>

      {/* Host Bio Card & Statistics */}
      <section className="bg-white dark:bg-gray-900 rounded-3xl p-8 sm:p-12 border border-gray-200/80 dark:border-gray-800/80 shadow-sm space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Avatar / Portrait Display */}
          <div className="lg:col-span-4 relative">
            <div className="relative aspect-square w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-brand-500/20 group">
              <Image
                src="/images/tim_chels.jpg"
                alt="Kota RJ Pawan"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
                <div className="text-white">
                  <span className="text-xs font-bold text-brand-400 uppercase tracking-wider">Relationship Psychologist</span>
                  <h3 className="text-2xl font-extrabold">Kota RJ Pawan</h3>
                  <p className="text-xs text-gray-300">Kota, Rajasthan, India</p>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Biography Text */}
          <div className="lg:col-span-8 space-y-5 text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-bold uppercase tracking-wider">
              <Award className="w-4 h-4" /> Biography & Legacy
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
              Empowering Millions Through Relationship Psychology & Science
            </h2>

            <p>
              With a deep understanding of relationship psychology and human connection, <strong>Kota RJ Pawan</strong> has been guiding individuals and couples towards building healthier, more fulfilling relationships since 2021.
            </p>

            <p>
              Through the <strong>Love Talk Podcast</strong>, he brings expert insights, real-life stories, and actionable advice to millions of listeners across 40+ global audio and video platforms, as well as the official website <Link href="/" className="text-brand-600 underline font-bold">www.lovetalkpodcast.in</Link>.
            </p>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              <div className="p-4 bg-gray-50 dark:bg-gray-800/60 rounded-2xl border border-gray-200/60 dark:border-gray-800">
                <p className="text-2xl font-extrabold text-brand-600 dark:text-brand-400">2021</p>
                <p className="text-xs text-gray-500 font-medium">Helping Since</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800/60 rounded-2xl border border-gray-200/60 dark:border-gray-800">
                <p className="text-2xl font-extrabold text-brand-600 dark:text-brand-400">40+</p>
                <p className="text-xs text-gray-500 font-medium">Global Platforms</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800/60 rounded-2xl border border-gray-200/60 dark:border-gray-800">
                <p className="text-2xl font-extrabold text-brand-600 dark:text-brand-400">2+</p>
                <p className="text-xs text-gray-500 font-medium">Podcasts Hosted</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800/60 rounded-2xl border border-gray-200/60 dark:border-gray-800">
                <p className="text-2xl font-extrabold text-brand-600 dark:text-brand-400">Global</p>
                <p className="text-xs text-gray-500 font-medium">TrueLove18Club</p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Podcast Focus & Notify Health Podcast Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Love Talk Podcast Focus */}
        <div className="p-8 bg-white dark:bg-gray-900 rounded-3xl border border-gray-200/80 dark:border-gray-800/80 shadow-sm space-y-5">
          <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-600 flex items-center justify-center font-bold text-xl">
            <Radio className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">Main Show</span>
            <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">Love Talk Podcast</h3>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            Every episode of Love Talk Podcast is designed to help listeners build healthier, happier, and more meaningful relationships through:
          </p>
          <ul className="space-y-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span><strong>Relationship Psychology</strong> & Human Connection science</span>
            </li>
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span><strong>Emotional Wellness</strong> & psychology-based education</span>
            </li>
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span><strong>Real-life Relationship Stories</strong> & actionable frameworks</span>
            </li>
          </ul>
        </div>

        {/* Notify Health Podcast */}
        <div className="p-8 bg-white dark:bg-gray-900 rounded-3xl border border-gray-200/80 dark:border-gray-800/80 shadow-sm space-y-5">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-500 flex items-center justify-center font-bold text-xl">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-sky-500 uppercase tracking-wider">🩺 Health Initiative</span>
            <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">Notify Health Podcast</h3>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            Hosted by Kota RJ Pawan, <strong>Notify Health Podcast</strong> focuses on critical public health and wellness topics to raise awareness:
          </p>
          <ul className="space-y-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-sky-500 flex-shrink-0" />
              <span>Mental Health & Emotional Resilience</span>
            </li>
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-sky-500 flex-shrink-0" />
              <span>Alzheimer's Disease Awareness & Brain Health</span>
            </li>
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-sky-500 flex-shrink-0" />
              <span>Preventive Healthcare, Lifestyle & Public Health Education</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Founder & Initiatives Section */}
      <section className="bg-gradient-to-r from-rose-950 via-gray-900 to-gray-950 p-8 sm:p-12 rounded-3xl text-white border border-rose-800/40 space-y-6 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <span className="px-3 py-1 bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold rounded-full uppercase tracking-wider">
              🌍 Global Founder Initiative
            </span>
            <h2 className="text-3xl font-extrabold">TrueLove18Club International</h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              <strong>Kota RJ Pawan</strong> is the Founder of <strong>TrueLove18Club International</strong> (luxurious wellness subsidiary in India), a global relationship and emotional wellness initiative committed to improving emotional literacy and meaningful human connections worldwide.
            </p>
          </div>

          <a
            href="https://www.truelove18club.com"
            target="_blank"
            rel="noreferrer"
            className="px-6 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm transition-all shadow-lg flex-shrink-0 flex items-center gap-2"
          >
            <span>Visit www.truelove18club.com</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* Books & Published Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Author Section */}
        <div className="p-8 bg-white dark:bg-gray-900 rounded-3xl border border-gray-200/80 dark:border-gray-800/80 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">📚 Published Author</span>
              <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">Books & eBooks</h3>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            Kota RJ Pawan is the author of renowned relationship psychology books available on <strong>Amazon Kindle</strong>:
          </p>

          <div className="space-y-3 pt-1">
            <div className="p-4 bg-gray-50 dark:bg-gray-800/60 rounded-2xl border border-gray-200/60 dark:border-gray-800">
              <h4 className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white">"Understanding Deceptive Traits – Top 5 in Relationship"</h4>
              <p className="text-[11px] text-gray-500">Comprehensive psychological breakdown of relationship red flags and deceptive traits.</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800/60 rounded-2xl border border-gray-200/60 dark:border-gray-800">
              <h4 className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white">"Beyond Desire"</h4>
              <p className="text-[11px] text-gray-500">Exploring emotional intimacy, passion, and lasting relationship connection.</p>
            </div>
          </div>
        </div>

        {/* Writer & Articles Section */}
        <div className="p-8 bg-white dark:bg-gray-900 rounded-3xl border border-gray-200/80 dark:border-gray-800/80 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center font-bold">
              <PenTool className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-purple-500 uppercase tracking-wider">✍️ Contributing Writer</span>
              <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">Digital Publications</h3>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            He has contributed impactful articles on emotional intelligence, leadership, psychology, and youth development for leading platforms including:
          </p>

          <ul className="space-y-2.5 text-xs sm:text-sm text-gray-700 dark:text-gray-300 pt-1">
            <li className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-200/60 dark:border-gray-800">
              <Globe className="w-4 h-4 text-purple-500" />
              <span><strong className="text-gray-900 dark:text-white">Cosmopolitan.in</strong> — Relationship dynamics & youth psychology</span>
            </li>
            <li className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-200/60 dark:border-gray-800">
              <Globe className="w-4 h-4 text-purple-500" />
              <span><strong className="text-gray-900 dark:text-white">YouthKiAwaaz.com</strong> — Emotional literacy & youth leadership</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Digital Presence & Communities */}
      <section className="bg-gray-50 dark:bg-gray-900/50 p-8 sm:p-12 rounded-3xl border border-gray-200/80 dark:border-gray-800/80 space-y-6 text-center">
        <div className="space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">📱 Multi-Platform Reach</span>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Digital Presence & Communities</h2>
          <p className="text-xs sm:text-sm text-gray-500">
            Kota RJ Pawan actively shares educational and motivational content across global networks:
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <a href="https://www.lovetalkpodcast.in" target="_blank" rel="noreferrer" className="px-4 py-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-900 dark:text-white hover:border-brand-500 flex items-center gap-2 shadow-sm">
            <Globe className="w-4 h-4 text-brand-600" /> Website (lovetalkpodcast.in)
          </a>
          <a href="https://youtube.com" target="_blank" rel="noreferrer" className="px-4 py-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-900 dark:text-white hover:border-red-500 flex items-center gap-2 shadow-sm">
            <Youtube className="w-4 h-4 text-red-600" /> YouTube
          </a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer" className="px-4 py-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-900 dark:text-white hover:border-pink-500 flex items-center gap-2 shadow-sm">
            <Instagram className="w-4 h-4 text-pink-500" /> Instagram
          </a>
          <a href="https://facebook.com" target="_blank" rel="noreferrer" className="px-4 py-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-900 dark:text-white hover:border-blue-600 flex items-center gap-2 shadow-sm">
            <Share2 className="w-4 h-4 text-blue-600" /> Facebook
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="px-4 py-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-900 dark:text-white hover:border-sky-600 flex items-center gap-2 shadow-sm">
            <Linkedin className="w-4 h-4 text-sky-600" /> LinkedIn
          </a>
          <a href="https://x.com" target="_blank" rel="noreferrer" className="px-4 py-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-900 dark:text-white hover:border-gray-900 flex items-center gap-2 shadow-sm">
            <Twitter className="w-4 h-4 text-gray-900 dark:text-white" /> X (Twitter)
          </a>
          <a href="https://t.me/lovetalkpodcast" target="_blank" rel="noreferrer" className="px-4 py-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-900 dark:text-white hover:border-sky-500 flex items-center gap-2 shadow-sm">
            <Send className="w-4 h-4 text-sky-400" /> Telegram & WhatsApp
          </a>
          <span className="px-4 py-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-900 dark:text-white flex items-center gap-2 shadow-sm">
            <Users className="w-4 h-4 text-brand-500" /> Arattai Communities
          </span>
        </div>
      </section>

      {/* Mission Statement Banner */}
      <section className="bg-brand-600 text-white p-8 sm:p-12 rounded-3xl space-y-4 text-center shadow-xl">
        <span className="px-3 py-1 bg-white/20 text-white text-xs font-bold rounded-full uppercase tracking-wider inline-block">
          🎯 Core Mission
        </span>
        <h2 className="text-2xl sm:text-4xl font-extrabold max-w-3xl mx-auto leading-tight">
          "Making relationship psychology and emotional wellness education accessible to everyone."
        </h2>
        <p className="text-brand-100 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Helping individuals strengthen relationships, improve communication, and lead emotionally healthier lives through science-based psychological content.
        </p>
        <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs font-mono text-brand-200">
          <span>#KotaRJPawan</span> • <span>#TrueLove18Club</span> • <span>#LoveTalkPodcast</span> • <span>#EmotionalWellness</span> • <span>#psychology</span>
        </div>
      </section>

      {/* Host Section Component */}
      <HostSection />

      {/* FAQ Accordion */}
      <section className="max-w-3xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Frequently Asked Questions</h2>
          <p className="text-sm text-gray-500">Everything you need to know about Kota RJ Pawan & Love Talk Podcast</p>
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

      {/* Contact & Inquiry Form */}
      <section className="max-w-2xl mx-auto bg-white dark:bg-gray-900 p-8 sm:p-12 rounded-3xl border border-gray-200/80 dark:border-gray-800/80 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">Get in Touch with Kota RJ Pawan</h2>
          <p className="text-xs text-gray-500">For sponsorships, guest bookings, media inquiries, or general questions</p>
        </div>

        {submitted ? (
          <div className="p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-center space-y-2 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-8 h-8 mx-auto" />
            <h4 className="font-bold text-base">Message Received!</h4>
            <p className="text-xs">Thanks for writing in. Kota RJ Pawan's team will respond to your inquiry shortly.</p>
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
              placeholder="Subject (e.g. Sponsorship / Media Interview / Guest Inquiry)"
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
