'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Scale, 
  ArrowLeft, 
  Lock, 
  FileText, 
  CheckCircle2, 
  Mail, 
  Globe, 
  ChevronRight,
  ShieldCheck,
  Building,
  Radio,
  Share2,
  AlertTriangle,
  CreditCard,
  UserCheck,
  HelpCircle,
  Sparkles,
  Ban,
  Gavel,
  BookOpen
} from 'lucide-react';

const tocItems = [
  { id: 'term-1', title: '1. About LoveTalk Podcast' },
  { id: 'term-2', title: '2. Acceptance of Terms' },
  { id: 'term-3', title: '3. Website Content' },
  { id: 'term-4', title: '4. Psychology & Emotional-Wellness Disclaimer' },
  { id: 'term-5', title: '5. Personal Experiences & Opinions' },
  { id: 'term-6', title: '6. Guest & User-Generated Content' },
  { id: 'term-7', title: '7. Guest Participation' },
  { id: 'term-8', title: '8. Intellectual Property' },
  { id: 'term-9', title: '9. Podcast Platforms & Third-Party Services' },
  { id: 'term-10', title: '10. Third-Party Links' },
  { id: 'term-11', title: '11. Premium Content & Paid Services' },
  { id: 'term-12', title: '12. Subscription & Membership' },
  { id: 'term-13', title: '13. Advertising & Sponsorship' },
  { id: 'term-14', title: '14. Accuracy of Information' },
  { id: 'term-15', title: '15. Prohibited Uses' },
  { id: 'term-16', title: '16. Privacy' },
  { id: 'term-17', title: '17. Cookies & Analytics' },
  { id: 'term-18', title: '18. Children & Age Requirements' },
  { id: 'term-19', title: '19. Website Availability' },
  { id: 'term-20', title: '20. Limitation of Liability' },
  { id: 'term-21', title: '21. No Guarantee of Personal Results' },
  { id: 'term-22', title: '22. Indemnification' },
  { id: 'term-23', title: '23. Changes to These Terms' },
  { id: 'term-24', title: '24. Membership Guidelines, Refund & Termination' },
  { id: 'term-25', title: '25. Governing Law & Jurisdiction' },
  { id: 'term-26', title: '26. Severability' },
  { id: 'term-27', title: '27. Entire Agreement' },
  { id: 'term-28', title: '28. Contact Us' },
];

export default function TermsOfServicePage() {
  const [activeSection, setActiveSection] = useState('term-1');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150;
      for (const item of tocItems) {
        const element = document.getElementById(item.id);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(item.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -100;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      
      {/* Navigation & Header */}
      <div className="space-y-4 border-b border-gray-200 dark:border-gray-800 pb-8">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Scale className="w-3.5 h-3.5" /> Official Terms & Conditions
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Terms & Conditions
            </h1>
            <p className="text-sm font-bold text-brand-600 dark:text-brand-400 mt-1">
              LoveTalk Podcast by Kota RJ Pawan
            </p>
          </div>

          <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800/80 px-4 py-2 rounded-xl font-mono border border-gray-200 dark:border-gray-700">
            Last Updated: <span className="font-bold text-gray-900 dark:text-white">22 August 2026</span>
          </div>
        </div>
      </div>

      {/* Main Grid: TOC Sidebar + Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        
        {/* Sticky Table of Contents (Desktop) */}
        <aside className="lg:col-span-1 hidden lg:block">
          <div className="sticky top-28 max-h-[calc(100vh-140px)] overflow-y-auto space-y-3 bg-gray-50/80 dark:bg-gray-900/50 p-4 rounded-2xl border border-gray-200/80 dark:border-gray-800/80 backdrop-blur-sm custom-scrollbar">
            <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2 sticky top-0 bg-gray-50/90 dark:bg-gray-900/90 py-1 z-10 backdrop-blur-sm">
              <FileText className="w-4 h-4 text-brand-600" /> Terms Index (28 Sections)
            </h3>

            <nav className="space-y-0.5">
              {tocItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all flex items-center justify-between ${
                    activeSection === item.id
                      ? 'bg-brand-600 text-white font-bold shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200/60 dark:hover:bg-gray-800'
                  }`}
                >
                  <span className="truncate">{item.title}</span>
                  {activeSection === item.id && <ChevronRight className="w-3 h-3 flex-shrink-0" />}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Legal Document Content */}
        <main className="lg:col-span-3 space-y-10 text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
          
          {/* Preamble Intro */}
          <div className="bg-brand-500/5 dark:bg-brand-950/20 border border-brand-500/20 p-6 rounded-2xl text-xs sm:text-sm space-y-3">
            <p className="font-bold text-gray-900 dark:text-white">
              Welcome to LoveTalk Podcast by Kota RJ Pawan (“LoveTalk Podcast”, “we”, “us”, or “our”). These Terms & Conditions (“Terms”) govern your access to and use of the LoveTalk Podcast website, digital content, podcast episodes, articles, newsletters, community features, premium services, and other related services available through <a href="http://www.lovetalkpodcast.in" target="_blank" rel="noreferrer" className="text-brand-600 underline font-mono">http://www.lovetalkpodcast.in</a> (“Website”).
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              By accessing, browsing, subscribing to, or using our Website or services, you acknowledge that you have read, understood, and agreed to these Terms.
            </p>
            <p className="text-xs font-semibold text-rose-600 dark:text-rose-400">
              If you do not agree with these Terms, please do not use the Website or our services.
            </p>
          </div>

          {/* Mobile TOC Quick Navigation */}
          <div className="lg:hidden bg-gray-50 dark:bg-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-2">
            <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">Quick Section Jump</h4>
            <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto p-1">
              {tocItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-[11px] font-semibold text-gray-700 dark:text-gray-300 hover:border-brand-500"
                >
                  {item.title}
                </button>
              ))}
            </div>
          </div>

          {/* 1. About LoveTalk Podcast */}
          <section id="term-1" className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
              <Building className="w-5 h-5 text-brand-600" /> 1. About LoveTalk Podcast
            </h2>
            <p>
              LoveTalk Podcast is a relationship and emotional-wellness focused media platform hosted by Kota RJ Pawan.
            </p>
            <p>
              The podcast aims to provide practical, educational, experience-based and psychology-informed discussions concerning relationships, communication, emotional wellness, human connection, personal development and related subjects.
            </p>
            <p className="font-semibold text-gray-900 dark:text-white">
              LoveTalk Podcast is a media and educational flagship platform of <strong>Truelove18club international luxurious wellness private limited india</strong>.
            </p>
            <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold">
              It is not a substitute for professional medical, psychiatric, psychological, legal, financial or other specialist advice.
            </p>
          </section>

          {/* 2. Acceptance of Terms */}
          <section id="term-2" className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-800">
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-brand-600" /> 2. Acceptance of Terms
            </h2>
            <p>By using the Website, you confirm that:</p>
            <ul className="space-y-1.5 list-disc pl-5 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
              <li>You are legally capable of entering into these Terms under applicable law.</li>
              <li>You will use the Website only for lawful purposes.</li>
              <li>You will not misuse, disrupt, attack, copy, exploit or interfere with the Website.</li>
              <li>Information you provide to us is accurate to the best of your knowledge.</li>
              <li>You will respect the intellectual-property and privacy rights of LoveTalk Podcast and other individuals.</li>
            </ul>
            <p className="text-xs text-gray-500">
              If you are using the Website on behalf of an organisation, you represent that you have authority to accept these Terms on its behalf.
            </p>
          </section>

          {/* 3. Website Content */}
          <section id="term-3" className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-800">
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-brand-600" /> 3. Website Content
            </h2>
            <p>The Website may contain:</p>
            <ul className="space-y-1.5 list-disc pl-5 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
              <li>Podcast episodes</li>
              <li>Video and audio content</li>
              <li>Articles and blogs</li>
              <li>Relationship and emotional-wellness educational content</li>
              <li>Interviews</li>
              <li>Opinions and personal experiences</li>
              <li>Educational resources</li>
              <li>Newsletters</li>
              <li>Community information</li>
              <li>Premium content</li>
              <li>Promotional materials</li>
              <li>Links to third-party websites and platforms</li>
            </ul>
            <p className="text-xs text-gray-500">
              Content is provided for general informational and educational purposes. Although we aim to provide useful and responsible information, we do not guarantee that every statement, opinion, interpretation or recommendation will be complete, current, universally applicable or suitable for every individual.
            </p>
          </section>

          {/* 4. Psychology and Emotional-Wellness Disclaimer */}
          <section id="term-4" className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-800">
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="w-5 h-5 text-amber-600" /> 4. Psychology and Emotional-Wellness Disclaimer
            </h2>
            <div className="p-5 bg-amber-500/10 border border-amber-500/30 rounded-2xl space-y-3 text-xs sm:text-sm text-amber-900 dark:text-amber-200">
              <p>LoveTalk Podcast may discuss psychology, relationships, emotional wellness and human behaviour.</p>
              <p className="font-bold">
                However, the content available on the Website should not be considered a diagnosis, treatment plan, psychotherapy session, psychiatric consultation or emergency mental-health service.
              </p>
              <p>
                Listening to a podcast episode or reading an article does not create a psychologist-client, therapist-client, doctor-patient or other professional-client relationship.
              </p>
              <p className="font-bold text-rose-700 dark:text-rose-400">
                If you are experiencing a serious mental-health, medical or personal crisis, seek appropriate qualified professional assistance immediately.
              </p>
            </div>
          </section>

          {/* 5. Personal Experiences and Opinions */}
          <section id="term-5" className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-800">
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-600" /> 5. Personal Experiences and Opinions
            </h2>
            <p>
              Some LoveTalk Podcast episodes may contain personal stories, opinions, experiences, interpretations or perspectives expressed by the host, guests or contributors. Such statements belong to the person expressing them and should not automatically be interpreted as the official position of LoveTalk Podcast.
            </p>
            <p className="text-xs text-gray-500">
              Individual experiences can differ significantly, and listeners should use their own judgement when applying information to their personal circumstances.
            </p>
          </section>

          {/* 6. Guest and User-Generated Content */}
          <section id="term-6" className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-800">
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
              <Share2 className="w-5 h-5 text-brand-600" /> 6. Guest and User-Generated Content
            </h2>
            <p>
              The Website or podcast may allow guests, listeners, experts, creators or other users to submit or provide questions, comments, stories, audio, video, photographs, testimonials, feedback, suggestions, social-media content, or other materials.
            </p>
            <p className="font-semibold text-gray-900 dark:text-white">You remain responsible for material you submit.</p>
            <p>By submitting content, you confirm that:</p>
            <ol className="space-y-1.5 list-decimal pl-5 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
              <li>You have the necessary rights and permissions to submit it.</li>
              <li>The content does not knowingly violate another person's copyright, privacy, trademark or other rights.</li>
              <li>The content is not unlawful, defamatory, threatening, abusive or fraudulent.</li>
              <li>The content does not intentionally contain harmful malware or malicious code.</li>
              <li>You have obtained appropriate consent from identifiable individuals where required.</li>
            </ol>
            <p className="text-xs text-gray-500">
              Where applicable, you grant LoveTalk Podcast a non-exclusive, worldwide, royalty-free licence to use, reproduce, edit, publish, distribute and display submitted content for legitimate podcast, editorial, promotional and marketing purposes, subject to applicable law and our Privacy Policy.
            </p>
          </section>

          {/* 7. Guest Participation */}
          <section id="term-7" className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-800">
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
              <Radio className="w-5 h-5 text-brand-600" /> 7. Guest Participation
            </h2>
            <p>
              Guests appearing on LoveTalk Podcast may express their own views and experiences. Participation in an episode does not necessarily mean that LoveTalk Podcast endorses every statement made by a guest.
            </p>
            <p className="text-xs text-gray-500">
              Guests are responsible for ensuring that information they provide does not knowingly violate the rights of another person or organisation. LoveTalk Podcast reserves the right to edit, shorten, remove or decline content where reasonably necessary for editorial, legal, technical, safety or quality reasons.
            </p>
          </section>

          {/* 8. Intellectual Property */}
          <section id="term-8" className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-800">
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-brand-600" /> 8. Intellectual Property
            </h2>
            <p>
              Unless otherwise stated, the Website and its original content are owned by or licensed to LoveTalk Podcast and/or its applicable rights holders. This may include:
            </p>
            <ul className="space-y-1.5 list-disc pl-5 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
              <li>Podcast name and branding</li>
              <li>Logos</li>
              <li>Website design</li>
              <li>Original articles</li>
              <li>Original graphics</li>
              <li>Video productions</li>
              <li>Audio productions</li>
              <li>Podcast recordings</li>
              <li>Written materials</li>
              <li>Original photographs</li>
              <li>Marketing materials</li>
              <li>Taglines and brand elements</li>
            </ul>
            <p className="text-xs font-semibold text-gray-900 dark:text-white">
              All rights are reserved to the extent permitted by applicable law.
            </p>
            <p className="text-xs text-gray-500">
              You may access and share publicly available LoveTalk Podcast content through normal platform features for personal, non-commercial purposes. You must not reproduce, sell, redistribute, modify, republish, commercially exploit or create unauthorised derivative works from our content without appropriate written permission.
            </p>
          </section>

          {/* 9. Podcast Platforms and Third-Party Services */}
          <section id="term-9" className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-800">
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-brand-600" /> 9. Podcast Platforms and Third-Party Services
            </h2>
            <p>
              LoveTalk Podcast may be available through third-party platforms such as YouTube, Spotify, Apple Podcasts, Amazon Music and other podcast or social-media services.
            </p>
            <p className="text-xs text-gray-500">
              Those platforms have their own Terms of Service, Privacy Policies, Subscription Policies, Advertising Policies, and Content Policies. Your use of those platforms is governed by their respective terms. LoveTalk Podcast does not control third-party platforms and cannot guarantee their continued availability, functionality, pricing or policies.
            </p>
          </section>

          {/* 10. Third-Party Links */}
          <section id="term-10" className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-800">
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-brand-600" /> 10. Third-Party Links
            </h2>
            <p>
              The Website may contain links to third-party websites, applications, products or services provided for convenience or informational purposes. We do not necessarily endorse or control third-party websites and are not responsible for their content, privacy practices, security, availability, products, services, or policies.
            </p>
          </section>

          {/* 11. Premium Content and Paid Services */}
          <section id="term-11" className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-800">
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-brand-600" /> 11. Premium Content and Paid Services
            </h2>
            <p>
              LoveTalk Podcast may offer premium memberships, subscriptions, digital products, exclusive content, events or other paid services. Where payment is required, applicable pricing, taxes, billing terms and service details will be presented before purchase.
            </p>
            <p className="text-xs text-gray-500">
              Unless otherwise expressly stated at the time of purchase, payment for digital services or subscriptions may be non-refundable to the extent permitted by applicable law. Where mandatory consumer-protection or refund rights apply, those rights will not be excluded by these Terms.
            </p>
          </section>

          {/* 12. Subscription and Membership */}
          <section id="term-12" className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-800">
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-brand-600" /> 12. Subscription and Membership
            </h2>
            <p>If subscription services are offered, you are responsible for:</p>
            <ul className="space-y-1.5 list-disc pl-5 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
              <li>Providing accurate registration information.</li>
              <li>Maintaining the security of your account credentials.</li>
              <li>Reviewing applicable subscription pricing.</li>
              <li>Cancelling subscriptions where applicable.</li>
              <li>Ensuring that your payment method remains valid.</li>
            </ul>
            <p className="text-xs text-gray-500">
              We reserve the right to suspend or terminate accounts or subscriptions where there is misuse, fraud, violation of these Terms, or other legitimate reasons permitted by law.
            </p>
          </section>

          {/* 13. Advertising and Sponsorship */}
          <section id="term-13" className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-800">
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
              <Share2 className="w-5 h-5 text-brand-600" /> 13. Advertising and Sponsorship
            </h2>
            <p>
              LoveTalk Podcast may display advertisements or participate in sponsorship, brand partnerships, affiliate arrangements or promotional campaigns. Sponsored or promotional content may be identified where required by applicable law or platform policies. The presence of an advertisement or sponsor does not necessarily constitute an endorsement of every product or service offered by that advertiser.
            </p>
          </section>

          {/* 14. Accuracy of Information */}
          <section id="term-14" className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-800">
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-brand-600" /> 14. Accuracy of Information
            </h2>
            <p>We make reasonable efforts to provide useful and accurate information. However, we do not guarantee that:</p>
            <ul className="space-y-1.5 list-disc pl-5 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
              <li>Every piece of content is error-free.</li>
              <li>Information will always remain current.</li>
              <li>Every external link will work.</li>
              <li>The Website will always be available.</li>
              <li>Content will be suitable for every individual.</li>
              <li>Results described by a guest or contributor will be achieved by every listener.</li>
            </ul>
            <p className="text-xs font-semibold text-gray-500">
              You should independently evaluate information before relying upon it for important personal decisions.
            </p>
          </section>

          {/* 15. Prohibited Uses */}
          <section id="section-15" className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-800">
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2 text-rose-600 dark:text-rose-400">
              <Ban className="w-5 h-5 text-rose-600" /> 15. Prohibited Uses
            </h2>
            <p>You agree not to use the Website to:</p>
            <ul className="space-y-1.5 list-disc pl-5 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
              <li>Break applicable laws or regulations.</li>
              <li>Harass, threaten or abuse another person.</li>
              <li>Impersonate another individual or organisation.</li>
              <li>Upload malicious software.</li>
              <li>Attempt unauthorised access to our systems.</li>
              <li>Scrape or systematically copy Website content without permission.</li>
              <li>Infringe intellectual-property rights.</li>
              <li>Distribute spam or fraudulent material.</li>
              <li>Misrepresent your relationship with LoveTalk Podcast.</li>
              <li>Interfere with Website security or functionality.</li>
              <li>Use our content for unlawful or misleading commercial purposes.</li>
            </ul>
            <p className="text-xs text-gray-500">
              We may restrict or terminate access where reasonably necessary to protect the Website, users, contributors or our legal rights.
            </p>
          </section>

          {/* 16. Privacy */}
          <section id="term-16" className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-800">
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-brand-600" /> 16. Privacy
            </h2>
            <p>
              Your use of the Website may involve the collection and processing of personal information. Our handling of personal information is governed by our <Link href="/privacy-policy" className="text-brand-600 underline font-bold">Privacy Policy</Link>, which should be read together with these Terms. By using the Website, you acknowledge that you have reviewed the applicable privacy information.
            </p>
          </section>

          {/* 17. Cookies and Analytics */}
          <section id="term-17" className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-800">
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-brand-600" /> 17. Cookies and Analytics
            </h2>
            <p>
              The Website may use cookies, analytics tools and similar technologies to improve functionality, understand Website usage, measure performance and support marketing or communication activities. Your browser or device may provide options for managing certain cookies. Third-party services used on the Website may also operate according to their own privacy and cookie policies.
            </p>
          </section>

          {/* 18. Children and Age Requirements */}
          <section id="term-18" className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-800">
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-brand-600" /> 18. Children and Age Requirements
            </h2>
            <p>
              LoveTalk Podcast content addresses relationships and emotional wellness and is primarily intended for a general audience. Certain services, communities, events or paid products may have specific age requirements. You must not provide false age or identity information to gain access to age-restricted services. Where applicable, parental or guardian consent may be required for minors.
            </p>
          </section>

          {/* 19. Website Availability */}
          <section id="term-19" className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-800">
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-brand-600" /> 19. Website Availability
            </h2>
            <p>
              We aim to keep the Website accessible and functional, but we do not guarantee uninterrupted availability. The Website may occasionally be unavailable because of maintenance, technical problems, hosting issues, cybersecurity incidents, internet or network failures, third-party service interruptions, or events beyond our reasonable control.
            </p>
            <p className="text-xs text-gray-500">
              We reserve the right to modify, suspend or discontinue any part of the Website or services.
            </p>
          </section>

          {/* 20. Limitation of Liability */}
          <section id="term-20" className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-800">
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
              <Scale className="w-5 h-5 text-brand-600" /> 20. Limitation of Liability
            </h2>
            <p>
              To the maximum extent permitted by applicable law, LoveTalk Podcast, its host, contributors, guests, team members, affiliates and service providers shall not be responsible for indirect, incidental, consequential or special losses arising from your use of the Website or reliance on its content. This includes, where legally permitted, losses relating to business interruption, loss of data, loss of profits, loss of opportunities, personal decisions based solely on podcast content, or third-party websites.
            </p>
            <p className="text-xs text-gray-500">
              Nothing in these Terms is intended to exclude liability that cannot legally be excluded under applicable law.
            </p>
          </section>

          {/* 21. No Guarantee of Personal Results */}
          <section id="term-21" className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-800">
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-600" /> 21. No Guarantee of Personal Results
            </h2>
            <p>
              LoveTalk Podcast does not guarantee that listening to our episodes, reading our articles, attending an event, following a recommendation or participating in a programme will produce a particular emotional, relationship, professional or personal outcome. Every person's circumstances are different.
            </p>
          </section>

          {/* 22. Indemnification */}
          <section id="term-22" className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-800">
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-brand-600" /> 22. Indemnification
            </h2>
            <p>
              To the extent permitted by applicable law, you agree to defend and indemnify LoveTalk Podcast and its applicable team members, affiliates, contributors and service providers against claims, losses, liabilities or expenses arising from:
            </p>
            <ul className="space-y-1.5 list-disc pl-5 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
              <li>Your unlawful use of the Website.</li>
              <li>Your violation of these Terms.</li>
              <li>Your infringement of another person's rights.</li>
              <li>Content you submit to us.</li>
              <li>Fraudulent or abusive activity associated with your use of the Website.</li>
            </ul>
          </section>

          {/* 23. Changes to These Terms */}
          <section id="term-23" className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-800">
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-brand-600" /> 23. Changes to These Terms
            </h2>
            <p>
              We may update these Terms from time to time. When material changes are made, we may update the “Last Updated” date (22 August 2026) and, where appropriate, provide additional notice. Your continued use of the Website after updated Terms become effective constitutes acceptance of the revised Terms.
            </p>
          </section>

          {/* 24. Membership Guidelines, Refund & Termination */}
          <section id="term-24" className="space-y-6 pt-6 border-t border-gray-100 dark:border-gray-800">
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2 text-brand-600">
              <CreditCard className="w-5 h-5 text-brand-600" /> 24. Membership Guidelines, Refund & Termination
            </h2>

            <div className="space-y-4 bg-gray-50 dark:bg-gray-900 p-5 sm:p-6 rounded-2xl border border-gray-200 dark:border-gray-800 text-xs sm:text-sm">
              <div className="space-y-2">
                <h3 className="font-bold text-gray-900 dark:text-white text-base">24.1 Membership Terms</h3>
                <p>
                  LoveTalk Podcast may offer free, paid, premium, annual or other membership plans from time to time. Each membership is granted solely to the individual who successfully registers or purchases the membership and is subject to these Terms & Conditions.
                </p>
                <p className="font-semibold text-rose-600 dark:text-rose-400">
                  Memberships are personal, non-transferable and non-refundable, except where a refund is expressly required under applicable law.
                </p>
                <p>A membership, subscription, access pass or associated benefit may NOT be:</p>
                <ul className="space-y-1 list-disc pl-5 text-xs text-gray-600 dark:text-gray-300">
                  <li>Sold, assigned, transferred, gifted or otherwise provided to another person.</li>
                  <li>Shared or used through another person's account.</li>
                  <li>Resold or commercially exploited without prior written permission from LoveTalk Podcast.</li>
                  <li>Transferred to another membership plan, person or account.</li>
                </ul>
              </div>

              <div className="space-y-2 pt-3 border-t border-gray-200 dark:border-gray-800">
                <h3 className="font-bold text-gray-900 dark:text-white text-base">24.2 No Refund Policy</h3>
                <p className="font-semibold">
                  All membership fees paid to LoveTalk Podcast are non-refundable and non-transferable, unless a refund is specifically required under applicable law or expressly approved by LoveTalk Podcast in writing.
                </p>
                <p>Once a membership has been purchased or activated, the member shall not be entitled to claim a refund merely because they:</p>
                <ul className="space-y-1 list-disc pl-5 text-xs text-gray-600 dark:text-gray-300">
                  <li>Change their mind.</li>
                  <li>Do not use the membership or its benefits.</li>
                  <li>Do not attend an optional activity, event or programme.</li>
                  <li>Fail to access available content.</li>
                  <li>Experience a change in personal circumstances.</li>
                  <li>Decide not to continue using the Website or membership services.</li>
                </ul>
              </div>

              <div className="space-y-2 pt-3 border-t border-gray-200 dark:border-gray-800">
                <h3 className="font-bold text-gray-900 dark:text-white text-base">24.3 Suspension or Termination</h3>
                <p>LoveTalk Podcast reserves the right to suspend, restrict or terminate a membership, account or access to specific services if:</p>
                <ul className="space-y-1 list-disc pl-5 text-xs text-gray-600 dark:text-gray-300">
                  <li>The member materially violates these Terms & Conditions.</li>
                  <li>The member provides false, misleading or fraudulent information.</li>
                  <li>The member engages in abusive, threatening, unlawful or inappropriate behaviour.</li>
                  <li>The member attempts to misuse, share, sell or transfer membership access.</li>
                  <li>The member's activity creates a security, legal, operational or reputational risk.</li>
                  <li>The member engages in fraudulent payment or transaction activity.</li>
                </ul>
              </div>

              <div className="space-y-2 pt-3 border-t border-gray-200 dark:border-gray-800">
                <h3 className="font-bold text-gray-900 dark:text-white text-base">24.4 Effect of Termination</h3>
                <p>
                  Upon termination or expiry of a membership, the member's right to access membership-only content, benefits, communities, events, discounts or associated services may immediately cease. Termination or expiry of a membership does not create any automatic right to a refund, credit, compensation or transfer of unused membership benefits.
                </p>
              </div>

              <div className="space-y-2 pt-3 border-t border-gray-200 dark:border-gray-800">
                <h3 className="font-bold text-gray-900 dark:text-white text-base">24.5 Survival of Terms</h3>
                <p className="text-xs text-gray-500">
                  Termination or expiry of membership shall not affect provisions that, by their nature, are intended to continue after termination, including provisions relating to intellectual property, disclaimers, limitation of liability, indemnification, and dispute resolution.
                </p>
              </div>
            </div>
          </section>

          {/* 25. Governing Law and Jurisdiction */}
          <section id="term-25" className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-800">
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
              <Gavel className="w-5 h-5 text-brand-600" /> 25. Governing Law and Jurisdiction
            </h2>
            <p>
              These Terms shall be interpreted in accordance with the applicable laws of <strong>India</strong>. Subject to mandatory legal rights and applicable consumer-protection laws, disputes relating to these Terms or the Website shall be subject to the jurisdiction of the appropriate courts in <strong>India</strong>.
            </p>
          </section>

          {/* 26. Severability */}
          <section id="term-26" className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-800">
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
              <Scale className="w-5 h-5 text-brand-600" /> 26. Severability
            </h2>
            <p>
              If any provision of these Terms is determined to be invalid, unlawful or unenforceable, that provision shall be interpreted or limited to the minimum extent necessary, and the remaining provisions shall continue in effect.
            </p>
          </section>

          {/* 27. Entire Agreement */}
          <section id="term-27" className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-800">
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-brand-600" /> 27. Entire Agreement
            </h2>
            <p>
              These Terms, together with the <Link href="/privacy-policy" className="text-brand-600 underline font-bold">Privacy Policy</Link> and any additional terms expressly applicable to particular services, constitute the agreement governing your use of the Website.
            </p>
          </section>

          {/* 28. Contact Us */}
          <section id="term-28" className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-800">
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
              <Mail className="w-5 h-5 text-brand-600" /> 28. Contact Us
            </h2>
            <p>
              For questions regarding these Terms & Conditions, content, copyright, collaborations or Website-related matters, please contact LoveTalk Podcast through the official contact details published on the Website.
            </p>

            <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-3">
              <div className="font-extrabold text-base text-gray-900 dark:text-white">
                LoveTalk Podcast by Kota RJ Pawan
              </div>
              <div className="text-xs text-gray-500">
                Relationship & Emotional Wellness Podcast | Subsidiary of Truelove18club international luxurious wellness private limited india
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-brand-600 dark:text-brand-400">
                <Globe className="w-4 h-4 text-brand-600" />
                <span>Website: </span>
                <a href="http://www.lovetalkpodcast.in" target="_blank" rel="noreferrer" className="underline font-bold">
                  http://www.lovetalkpodcast.in
                </a>
              </div>
              <div className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                Host: Kota RJ Pawan
              </div>
            </div>
          </section>

          {/* Important Legal Notice Box */}
          <div className="p-6 bg-brand-500/10 border border-brand-500/30 rounded-2xl text-xs space-y-2 text-gray-900 dark:text-gray-100">
            <h4 className="font-bold flex items-center gap-1.5 uppercase tracking-wider text-brand-600 dark:text-brand-400">
              <ShieldCheck className="w-4 h-4" /> Important Legal Notice
            </h4>
            <p className="leading-relaxed text-gray-600 dark:text-gray-300">
              LoveTalk Podcast is an educational and media platform. Podcast episodes, interviews, articles and other materials are intended for general informational purposes and should not be treated as a substitute for personalised professional advice.
            </p>
            <p className="font-bold text-brand-600 dark:text-brand-400">
              By continuing to use this Website, you acknowledge and agree to these Terms & Conditions.
            </p>
          </div>

        </main>
      </div>

    </div>
  );
}
